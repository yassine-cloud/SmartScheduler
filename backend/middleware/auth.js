const jwt = require('../utils/jwt');
require('dotenv').config();

  const authenticateToken = (req, res, next) => {
    // routes that require authentication
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verifyToken(token);
        req.user = decoded;        
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// these functions came after the authenticateToken function

const roleMiddleware = (requiredRole) => {
  // routes that are considered for a specific role
    return (req, res, next) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      next();
    };
  };

const hisOwnData = (req, res, next) => {
  // considered for data that can't be changed or viewed, just for the owner (one and just one)
  const { userId } = req.params;
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }
  next();
};

const privilegeOrHisOwnData = (req, res, next) => {
  // considered for data that can be changed or viewed by the owner or an admin
  const { userId } = req.params;
  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }
};


module.exports = {roleMiddleware, authenticateToken, hisOwnData, privilegeOrHisOwnData};
