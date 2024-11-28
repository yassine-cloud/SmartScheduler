const notificationController = require('../controllers/notificationController');
const express = require('express');
const router = express.Router();
const { authenticateToken, roleMiddleware, privilegeOrHisOwnData } = require('../middleware/auth');


// will return just the notifications of the user
router.get('/', authenticateToken, notificationController.getAllNotifications);
router.get('/read', authenticateToken, notificationController.getReadNotifications);
router.get('/unread', authenticateToken, notificationController.getUnreadNotifications);
router.put('/read', authenticateToken, notificationController.markAllNotificationsReaded);
router.put('/unread', authenticateToken, notificationController.markAllNotificationsUnreaded);
router.put('/:notificationId/read', authenticateToken, notificationController.markNotificationReaded);
router.put('/:notificationId/unread', authenticateToken, notificationController.markNotificationUnreaded);
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);


module.exports = router;