const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (req, res) => {
    const { notification, userId, EventId, type, status } = req.body;

    try {
        const newNotification = new Notification({
            notification,
            userId,
            EventId,
            type,
            status
        });
        const savedNotification = await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully', savedNotification });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create notification', error: error.message || error });
    }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notifications', error });
    }
};

// Get a specific notification by ID
exports.getNotificationById = async (req, res) => {
    const id = req.params.id;
    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notification', error });
    }
};

// Update a notification by ID
exports.updateNotification = async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    try {
        const notification = await Notification.findByIdAndUpdate(id, updateData, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification updated successfully', notification });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error });
    }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
    const id = req.params.id;
    try {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully', notification });   
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete notification', error });
    }
};
