const User = require('../models/users');
const { generateToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/crypt');
require('dotenv').config();
const fs = require('fs');


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
  
      if (!comparePassword(password, user.passwordHash)) {
        return res.status(401).json({ message: 'E-mail or Password is incorrect.' });
      }
  
      if(user.status === 'inactive' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Your account is inactive.\nYou have to contact the Admin to resolve the problem.' });
      }
  
      const token = generateToken({ userId: user.id, role: user.role });
      // set the image as an url for the user side
      if(user.image )  user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
      res.status(200).json({ token , user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  register : async (req, res) => {
    const { firstName, lastName, contact, email, password, image } = req.body;
  
    if(!firstName || !lastName || !contact || !email || !password ) {
      if(req.file && req.file.path)  fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    if(password.length < 8) {
        if(req.file && req.file.path)  fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
  
    if(await User.findByEmail(email)) {
      if(req.file && req.file.path)  fs.unlinkSync(req.file.path);
      return res.status(409).json({ message: 'E-mail already exists.' });
    }
  
    try {
      const user = await User.create({ firstName, lastName, contact, email, passwordHash: password, image });
      const token = generateToken({ userId: user.id, role: user.role });
      // set the image as an url for the user side
      if(user.image )  user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
      res.status(201).json({token, user});
    } catch (err) {
      // delete the image if the user creation failed
      if(req.file && req.file.path)  fs.unlinkSync(req.file.path);
      res.status(500).json({ message: err.message });
    }
  },

  getAllUsers : async (req, res) => {
    try {
      const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
      // set the image as an url for the user side
      users.forEach(user => {
        if(user.image)  user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
      });
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
    const { firstName, lastName, contact, email, password, role, status } = req.body;
  
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
      if(email)
        user.email = email;
      if(password)
        user.passwordHash = password;
      // these fields can be updated by the admin only
      if(role && req.user.role == 'admin')
        user.role = role;
      if(status && req.user.role == 'admin')
        user.status = status;
  
      await user.save();
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
  }


  


}