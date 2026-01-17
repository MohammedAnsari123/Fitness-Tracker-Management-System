const express = require('express');
const router = express.Router();
const {
    updateProfile,
    updateGoals,
    getGoals,
    getMyPlans,
    getProfile,
    requestUpgrade
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/goals', protect, getGoals);
router.put('/goals', protect, updateGoals);
router.get('/plans', protect, getMyPlans);
router.post('/request-upgrade', protect, requestUpgrade);

module.exports = router;
