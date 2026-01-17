const Payment = require('../models/Payment');
const User = require('../models/User');
const Payout = require('../models/Payout');

const getFinanceStats = async (req, res) => {
    try {
        const trainerId = req.trainer._id;

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

        const payments = await Payment.find({
            user: { $in: clientIds },
            status: 'Completed'
        }).populate('user', 'name email').sort({ date: -1 });

        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
        const commissionRate = 0.7;
        const totalEarnings = totalRevenue * commissionRate;

        const payouts = await Payout.find({ trainer: trainerId });
        const totalWithdrawn = payouts
            .filter(p => p.status === 'Processed')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const pendingPayout = totalEarnings - totalWithdrawn;

        const activeSubscribers = await User.countDocuments({
            trainer: trainerId,
            'subscription.plan': { $ne: 'Free' }
        });

        res.json({
            totalEarnings: Math.round(totalEarnings * 100) / 100,
            pendingPayout: Math.round(pendingPayout * 100) / 100,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            activeSubscribers,
            recentTransactions: payments.slice(0, 10),
            payoutHistory: payouts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const requestPayout = async (req, res) => {
    try {
        const { amount, method } = req.body;

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
