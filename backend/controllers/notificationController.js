const Notification = require('../models/Notification');
const User = require('../models/User');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.user.toString() === req.user._id.toString()) {
            notification.read = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send manual notification (Admin)
// @route   POST /api/notifications/send
// @access  Private/Admin
const sendNotification = async (req, res) => {
    const { userId, type, message } = req.body;

    // type: 'info', 'success', 'warning', 'error'

    try {
        if (userId === 'ALL') {
            const users = await User.find({ role: 'user' });
            const notifications = users.map(user => ({
                user: user._id,
                type: type || 'info',
                message
            }));
            await Notification.insertMany(notifications);
            res.json({ message: `Notification sent to ${users.length} users` });
        } else {
            // Validate user
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const notification = await Notification.create({
                user: userId,
                type: type || 'info',
                message
            });
            res.status(201).json(notification);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    markRead,
    markAllRead,
    sendNotification
};
