const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, searchUsers } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/search', protect, searchUsers);
router.get('/:otherId', protect, getMessages);

module.exports = router;
