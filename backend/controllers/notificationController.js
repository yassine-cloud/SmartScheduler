const Notification = require('../models/notifications');
const User = require('../models/users');
const Project = require('../models/projects');
const sendMail = require('../services/emailSender');





module.exports = {

    // get all notifications User 
    getAllNotifications: async (req, res) => {
        try {
            // get the id from the JWT
            const notifications = await Notification.findAllByUserId(req.user.id);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // add notification
    addNotification: async (req, res) => {
        try {
            const { userId, projectId, message } = req.body;
            if (!userId || !projectId || !message) {
                return res.status(400).json({ message: 'User ID, Project ID and message are required.' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const notification = await Notification.create({ userId, projectId, message });
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // delete notification
    deleteNotification: async (req, res) => {
        try {
            const { notificationId } = req.params;
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found.' });
            }
            await notification.destroy();
            res.status(200).json({ message: 'Notification deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // notification viewed
    notificationViewed: async (req, res) => {
        try {
            const { notificationId } = req.params;
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found.' });
            }
            notification.isRead = true;
            await notification.save();
            res.status(200).json({ message: 'Notification viewed.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // send notification
    sendNotification: async (req, res) => {
        try {
            const { userId, projectId, message } = req.body;
            const user = await User.findById(userId || req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found.' });
            }
            const notification = await Notification.create({ userId: user.id, projectId, message });
            await sendMail(user.email, 'New Notification', message);
            console.log('Notification sent to user:', user.email, " ", message);
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}