const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, sendNotification } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markRead);
router.put('/read-all', protect, markAllRead);
router.post('/send', protect, adminOnly, sendNotification);

module.exports = router;
