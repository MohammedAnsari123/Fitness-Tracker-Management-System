const Ticket = require('../models/Ticket');

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
const createTicket = async (req, res) => {
    const { subject, description } = req.body;
    try {
        const ticket = await Ticket.create({
            user: req.user._id,
            subject,
            description
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get current user's tickets
// @route   GET /api/support/my
// @access  Private
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/support
// @access  Private/Admin
const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket status (Admin)
// @route   PUT /api/support/:id
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.status = status || ticket.status;
        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    getAllTickets,
    updateTicketStatus
};
