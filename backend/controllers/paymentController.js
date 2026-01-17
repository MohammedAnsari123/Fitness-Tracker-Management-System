const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email')
            .sort({ date: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user payments
// @route   GET /api/payments/my
// @access  Private
const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort({ date: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Log a new payment (Admin)
// @route   POST /api/payments
// @access  Private/Admin
const createPayment = async (req, res) => {
    const { userId, amount, method, status, transactionId, notes, date } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const payment = await Payment.create({
            user: userId,
            amount,
            method,
            status,
            transactionId,
            notes,
            date: date || Date.now()
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllPayments,
    getUserPayments,
    createPayment
};
