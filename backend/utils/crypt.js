const bcrypt = require('bcrypt');

// configures the bcrypt hashing function
const saltRounds = 10;


// Function to hash a password
const hashPassword = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

// Function to compare a password with a hash
const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword,
};