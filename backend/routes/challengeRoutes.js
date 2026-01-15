const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createChallenge,
    getChallenges,
    joinChallenge,
    getMyChallenges,
    updateProgress
} = require('../controllers/challengeController');

router.get('/', protect, getChallenges);
router.post('/join', protect, joinChallenge);
router.get('/my', protect, getMyChallenges);
router.put('/:id/progress', protect, updateProgress);

router.post('/', protect, createChallenge);

module.exports = router;
