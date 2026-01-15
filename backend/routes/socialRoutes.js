const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getActivityFeed, getAllUsers, getLeaderboard } = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.get('/feed', protect, getActivityFeed);
router.get('/users', protect, getAllUsers);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
