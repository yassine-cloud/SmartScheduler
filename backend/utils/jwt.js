const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for signing tokens 
const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;

// Function to generate a token
const generateToken = (payload) => {
    token = 'token '+ jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
    return token;
};

// Function to verify a token
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};
