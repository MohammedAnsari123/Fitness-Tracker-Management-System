const express = require('express');
const router = express.Router();
const { addReview, getTrainerReviews } = require('../controllers/reviewController');
const { protect, trainerOnly } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.get('/my-reviews', protect, trainerOnly, getTrainerReviews);

module.exports = router;
