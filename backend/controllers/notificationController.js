const Notification = require('../models/Notification');

const sanitizeLimit = (limit) => {
    const parsed = Number.parseInt(limit, 10);
    if (Number.isNaN(parsed) || parsed <= 0) return 20;
    return Math.min(parsed, 100);
};

exports.getMyNotifications = async(req, res) => {
    try {
        const limit = sanitizeLimit(req.query.limit);
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'name email role')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUnreadCount = async(req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false
        });

        res.json({ success: true, data: { unreadCount } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markNotificationRead = async(req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markAllNotificationsRead = async(req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, isRead: false }, { $set: { isRead: true } });

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createNotification = async({ recipient, sender = null, type = 'system', title, message, link = null, metadata = {} }) => {
    if (!recipient || !title || !message) {
        return null;
    }

    return Notification.create({
        recipient,
        sender,
        type,
        title,
        message,
        link,
        metadata
    });
};