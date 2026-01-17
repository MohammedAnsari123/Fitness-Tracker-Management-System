const express = require('express');
const router = express.Router();
const { getFinanceStats, requestPayout } = require('../controllers/financeController');
const { protect, trainerOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, trainerOnly, getFinanceStats);
router.post('/payout', protect, trainerOnly, requestPayout);

module.exports = router;
