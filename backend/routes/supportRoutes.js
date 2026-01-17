const express = require('express');
const router = express.Router();
const {
    createTicket,
    getMyTickets,
    getAllTickets,
    updateTicketStatus
} = require('../controllers/supportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);
router.get('/my', protect, getMyTickets);
router.get('/', protect, adminOnly, getAllTickets);
router.put('/:id', protect, adminOnly, updateTicketStatus);

module.exports = router;
