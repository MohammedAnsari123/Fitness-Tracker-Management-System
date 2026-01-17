const Ticket = require('../models/Ticket');

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

const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
