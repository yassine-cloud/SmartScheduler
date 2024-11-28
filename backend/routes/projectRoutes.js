const projectController = require('../controllers/projectController');
const express = require('express');
const router = express.Router();
const { authenticateToken, roleMiddleware, privilegeOrHisOwnData } = require('../middleware/auth');


router.get('/', authenticateToken, roleMiddleware('admin'), projectController.getAllProjects);
router.get('/:projectId', authenticateToken, projectController.getProjectById);
router.get('/user/:userId', authenticateToken, privilegeOrHisOwnData, projectController.getAllProjectsByUser);
router.post('/', authenticateToken, projectController.addProject);
router.put('/:projectId', authenticateToken, projectController.updateProject);
router.delete('/:projectId', authenticateToken, projectController.deleteProject);

module.exports = router;