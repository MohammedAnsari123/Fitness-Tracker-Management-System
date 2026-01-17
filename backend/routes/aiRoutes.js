const express = require('express');
const router = express.Router();
const { generateWorkoutPlan, saveGeneratedPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateWorkoutPlan);
router.post('/save', protect, saveGeneratedPlan);

module.exports = router;
