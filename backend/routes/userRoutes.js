const userController = require('../controllers/userController');
var express = require('express');
var router = express.Router();
const { authenticateToken, roleMiddleware, privilegeOrHisOwnData } = require('../middleware/auth');

router.get('/', authenticateToken, roleMiddleware('admin'), userController.getAllUsers);
router.get('/:userId', authenticateToken, privilegeOrHisOwnData, userController.getUserById);
router.put('/:userId', authenticateToken, privilegeOrHisOwnData, userController.updateUser);
router.post('/', authenticateToken, roleMiddleware('admin'), userController.addUser);
router.patch('/:userId/role', authenticateToken, roleMiddleware('admin'), userController.updateRole);
router.patch('/:userId/status', authenticateToken, roleMiddleware('admin'), userController.updateStatus);
router.delete('/:userId', authenticateToken, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;
