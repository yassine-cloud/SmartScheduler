const projectMemberController = require('../controllers/projectMemberController');
const express = require('express');
const router = express.Router();
const { authenticateToken, roleMiddleware, privilegeOrHisOwnData } = require('../middleware/auth');

// this a route between the users and projects 
// does not need routes

// module.exports = router;