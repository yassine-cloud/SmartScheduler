const projectMemberController = require('../controllers/projectMemberController');
const express = require('express');
const router = express.Router();
const { authenticateToken, roleMiddleware, privilegeOrHisOwnData } = require('../middleware/auth');

// this a route between the users and projects 
// does not need routes

router.post('/', authenticateToken, projectMemberController.addProjectMember);
router.put('/:projectMemberId', authenticateToken, projectMemberController.updateProjectMember);
router.delete('/:projectMemberId', authenticateToken, projectMemberController.deleteProjectMember);

module.exports = router;