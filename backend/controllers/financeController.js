const Payment = require('../models/Payment');
const User = require('../models/User');
const Payout = require('../models/Payout');

// @desc    Get Trainer Earnings Stats
// @route   GET /api/finance/stats
// @access  Private (Trainer)
const getFinanceStats = async (req, res) => {
    try {
        const trainerId = req.trainer._id;

        // 1. Get all clients assigned to this trainer
        const clients = await User.find({ trainer: trainerId }).select('_id');
        const clientIds = clients.map(c => c._id);

        if (clientIds.length === 0) {
            return res.json({
                totalEarnings: 0,
                pendingPayout: 0,
                activeSubscribers: 0,
                recentTransactions: []
            });
        }

        // 2. Find all payments made by these clients
        // Assuming 'Completed' is the status for successful payments
        const payments = await Payment.find({
            user: { $in: clientIds },
            status: 'Completed'
        }).populate('user', 'name email').sort({ date: -1 });

        // 3. Calculate Total Earnings (Assuming 70% rev share for trainer)
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
        const commissionRate = 0.7; // 70% to trainer
        const totalEarnings = totalRevenue * commissionRate;

        // 4. Calculate Payouts
        const payouts = await Payout.find({ trainer: trainerId });
        const totalWithdrawn = payouts
            .filter(p => p.status === 'Processed')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const pendingPayout = totalEarnings - totalWithdrawn; // Simplified logic

        // 5. Active Subscribers Count (Clients with active non-free plan)
        // This is an estimation. Better if checking User.subscription.status
        const activeSubscribers = await User.countDocuments({
            trainer: trainerId,
            'subscription.plan': { $ne: 'Free' }
        });

        res.json({
            totalEarnings: Math.round(totalEarnings * 100) / 100,
            pendingPayout: Math.round(pendingPayout * 100) / 100,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            activeSubscribers,
            recentTransactions: payments.slice(0, 10), // Last 10
            payoutHistory: payouts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request a Payout
// @route   POST /api/finance/payout
// @access  Private (Trainer)
const requestPayout = async (req, res) => {
    try {
        const { amount, method } = req.body;

        // Basic validation logic... 
        // Real-world would check against actual available balance calculated above.

        const payout = await Payout.create({
            trainer: req.trainer._id,
            amount: Number(amount),
            method: method || 'Bank Transfer'
        });

        res.status(201).json(payout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getFinanceStats,
    requestPayout
};
