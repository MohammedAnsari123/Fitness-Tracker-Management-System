const express = require('express');
const router = express.Router();
const {
    createSession,
    getTrainerSessions,
    getUserSessions,
    updateSession,
    deleteSession
} = require('../controllers/sessionController');

const { protect, trainerOnly } = require('../middleware/authMiddleware');

// Trainer Routes (protected and restricted to trainers)
router.post('/', protect, trainerOnly, createSession);
router.get('/', protect, trainerOnly, getTrainerSessions);
router.put('/:id', protect, trainerOnly, updateSession);
router.delete('/:id', protect, trainerOnly, deleteSession);

// User Routes
router.get('/my', protect, getUserSessions);

module.exports = router;
