const User = require('../models/users');
const ProjectMembers = require('../models/projectMembers');
const { generateToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/crypt');
require('dotenv').config();
const fs = require('fs');
const verificationTokenController = require('./verificationTokenController');

// In-memory object to store login attempts and lockout data
const loginAttempts = {};
const lockoutTime = 5 * 60 * 1000; // 5 minutes in milliseconds

// find all users for a project
async function findAllByProjectId(projectId) {
  // Find all project memberships for the given project
  const memberships = await ProjectMembers.findAll({
      where: { projectId },
      attributes: ['userId'], // Only fetch the userId column
  });

  // Extract the user IDs
  const userIds = memberships.map((membership) => membership.userId);

  // Return users that match the extracted IDs
  return User.findAll({
      where: { id: userIds },
  });
}

module.exports = {

 login : async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail and Password are required.' });
    }
  
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'E-mail or Password is incorrect.' });
      }
  
      // Check if the user is locked out
      if (loginAttempts[email]?.lockoutTime && new Date() < new Date(loginAttempts[email].lockoutTime)) {
        const lockoutTimeRemaining = new Date(loginAttempts[email].lockoutTime) - new Date();
        const minutesRemaining = Math.floor(lockoutTimeRemaining / 60000); // Convert ms to minutes
        const secondsRemaining = Math.floor((lockoutTimeRemaining % 60000) / 1000); // Convert ms to seconds

        return res.status(409).json({
          message: `Your account is locked. Please try again in ${minutesRemaining} minute(s) and ${secondsRemaining} second(s).`
        });
      }

      if (!comparePassword(password, user.passwordHash)) {
        // Initialize the user login attempt data if not already set
        if (!loginAttempts[email]) {
          loginAttempts[email] = { failedAttempts: 0, lockoutTime: null };
        }

        // Increment the failed attempts
        loginAttempts[email].failedAttempts += 1;

        // Lock the account if failed attempts exceed 5
        if (loginAttempts[email].failedAttempts >= 5) {
          loginAttempts[email].lockoutTime = new Date(Date.now() + lockoutTime); // Lockout for 5 minutes
          return res.status(408).json({ message: 'Too many failed attempts. Your account is locked.' });
        }
        return res.status(401).json({ message: 'E-mail or Password is incorrect.' });
      }

      // Reset failed attempts and lockout time on successful login
      loginAttempts[email] = { failedAttempts: 0, lockoutTime: null };
  
      if(user.status === 'inactive' ) {
        return res.status(403).json({ message: 'Your account is inactive.\nYou have to contact the Admin to resolve the problem.' });
      }

      if(user.is_verified === false) {
        return res.status(402).json({ message: 'Your email is not verified yet.\nPlease check your email to verify it.' });
      }
  
      const token = generateToken({ id: user.id, role: user.role });
      
      if(user.image )  user.image = `${req.protocol}://${req.get('host')}/${process.env.CONTAINNER}/${user.image}`;
      res.status(200).json({ token , user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  register : async (req, res) => {
    const { firstName, lastName, contact, email, password, image } = req.body;
  
    if(!firstName || !lastName || !contact || !email || !password ) {
      if(req.file?.path)  fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    if(password.length < 8) {
        if(req.file?.path)  fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
  
    if(await User.findByEmail(email)) {
      if(req.file?.path)  fs.unlinkSync(req.file.path);
      return res.status(409).json({ message: 'E-mail already exists.' });
    }
    let user;
    try {
      user = await User.create({ firstName, lastName, contact, email, passwordHash: password, image });
      // const token = generateToken({ userId: user.id, role: user.role });
      // // set the image as an url for the user side
      // if(user.image )  user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
      // res.status(201).json({token, user});
    } catch (err) {
      // delete the image if the user creation failed
      if(req.file?.path)  fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: err.message });
    }
    try {
      if (user) {
        await verificationTokenController.createVerificationNewUser(user.id, user.email);
        res.status(201).json({ message: 'User created successfully. Please verify your email.' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  uploadImage : async (req, res) => {
    const { userId } = req.params;
    const { image } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        if(req.file?.path)  fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'User not found.' });
      }
      // delete the old image if exists
      if(user.image)  fs.unlinkSync(`${process.env.CONTAINNER}/${user.image}`);
      user.image = image;
      await user.save();
      user.image = `${req.protocol}://${req.get('host')}/${process.env.CONTAINNER}/${user.image}`;
      res.status(200).json({ message : 'Image uploaded successfully.' , user});
    }
    catch (err) {
      if(req.file?.path)  fs.unlinkSync(req.file.path);
      res.status(500).json({ message: err.message });
    }

  },

  getAllUsers : async (req, res) => {
    try {
      let users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
      // set the image as an url for the user side
      users.forEach(user => {
        if(user.image)  user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
      });
      users = users.filter(user => user.is_verified === true);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getUserById : async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      // set the image as an url for the user side
      if(user.image) user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // this function assigned for admin to add new user
addUser : async (req, res) => {

    const { firstName, lastName, contact, email, password, role, status } = req.body;
  
    if(!firstName || !lastName || !contact || !email || !password || !role || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    if(password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
  
    try {
      const user = await User.create({ firstName, lastName, contact, email, passwordHash: password, role, status });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  /**
   * it can update one or more fields of the user
   */
  updateUser : async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, contact, password, role, status } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    if(password && password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Update user fields if provided
      if(firstName)
        user.firstName = firstName;
      if(lastName)
        user.lastName = lastName;
      if(contact)
        user.contact = contact;
      // email is unique can't be updated
      if(password)
        user.passwordHash = password;
      // these fields can be updated by the admin only
      if(role && req.user.role == 'admin')
        user.role = role;
      if(status && req.user.role == 'admin')
        user.status = status;
  
      await user.save();
      user.image = `${req.protocol}://${req.get('host')}/${process.env.CONTAINNER}/${user.image}`;
      res.status(200).json({ message : 'User updated successfully.' , user});
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  updateRole : async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.role = role;
      await user.save();
      res.status(200).json({message : 'User role updated successfully.' , user});
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  updateStatus : async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.status = status;
      await user.save();
      res.status(200).json({ message : 'User status updated successfully.' ,user});
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  deleteUser : async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      fs.unlinkSync(`${process.env.CONTAINNER}/${user.image}`);
      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully.' });
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // get Users by projectId
  getUsersByProjectId : async (req, res) => {
    const { projectId } = req.params;
  
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }
  
    try {
      const users = await findAllByProjectId(projectId);
      res.status(200).json(users);
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  


}