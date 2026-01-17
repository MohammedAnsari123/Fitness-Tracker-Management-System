const express = require('express');
const router = express.Router();
const { addReview, getTrainerReviews } = require('../controllers/reviewController');
const { protect, trainerOnly } = require('../middleware/authMiddleware');

// User route to add review
router.post('/', protect, addReview);

// Trainer route to view their reviews
router.get('/my-reviews', protect, trainerOnly, getTrainerReviews);

module.exports = router;
