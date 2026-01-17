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

router.post('/', protect, trainerOnly, createSession);
router.get('/', protect, trainerOnly, getTrainerSessions);
router.put('/:id', protect, trainerOnly, updateSession);
router.delete('/:id', protect, trainerOnly, deleteSession);
router.get('/my', protect, getUserSessions);

module.exports = router;
