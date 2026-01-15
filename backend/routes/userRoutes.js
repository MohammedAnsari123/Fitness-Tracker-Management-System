const express = require('express');
const router = express.Router();
const {
    updateProfile,
    updateGoals,
    getGoals,
    getMyPlans
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.get('/goals', protect, getGoals);
router.put('/goals', protect, updateGoals);
router.get('/plans', protect, getMyPlans);

module.exports = router;
