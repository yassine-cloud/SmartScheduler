const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const { authenticateToken, roleMiddleware, privilegeOrHisOwnData } = require('../middleware/auth');

router.get('/', authenticateToken, roleMiddleware('admin'), userController.getAllUsers);
router.get('/:userId', authenticateToken, privilegeOrHisOwnData, userController.getUserById);
router.put('/:userId', authenticateToken, privilegeOrHisOwnData, userController.updateUser);
router.post('/', authenticateToken, roleMiddleware('admin'), userController.addUser);
router.put('/:userId/role', authenticateToken, roleMiddleware('admin'), userController.updateRole);
router.put('/:userId/status', authenticateToken, roleMiddleware('admin'), userController.updateStatus);
router.delete('/:userId', authenticateToken, roleMiddleware('admin'), userController.deleteUser);

router.get('/project/:projectId', authenticateToken, privilegeOrHisOwnData, userController.getUsersByProjectId);

module.exports = router;
