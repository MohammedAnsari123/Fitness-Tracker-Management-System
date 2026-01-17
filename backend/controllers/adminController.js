const User = require('../models/User');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');
const Water = require('../models/Water');
const Sleep = require('../models/Sleep');
const WeightLog = require('../models/WeightLog');
const Plan = require('../models/Plan');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserFullData = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const workouts = await Workout.find({ user: req.params.id });
        const diets = await Diet.find({ user: req.params.id });
        const water = await Water.find({ user: req.params.id }).sort({ date: -1 });
        const sleep = await Sleep.find({ user: req.params.id }).sort({ date: -1 });
        const weights = await WeightLog.find({ user: req.params.id }).sort({ date: -1 });
        const plans = await Plan.find({ user: req.params.id }).sort({ createdAt: -1 });

        res.status(200).json({
            user,
            workouts,
            diets,
            water,
            sleep,
            weights,
            plans
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await Workout.deleteMany({ user: req.params.id });
        await Diet.deleteMany({ user: req.params.id });
        await Water.deleteMany({ user: req.params.id });
        await Sleep.deleteMany({ user: req.params.id });
        await WeightLog.deleteMany({ user: req.params.id });

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWorkouts = await Workout.countDocuments();
        const totalChallenges = await require('../models/Challenge').countDocuments();

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

        const dietCount = await Diet.countDocuments();
        const waterCount = await Water.countDocuments();
        const sleepCount = await Sleep.countDocuments();
        const weightCount = await WeightLog.countDocuments();

        const activityStats = [
            { name: 'Workouts', value: totalWorkouts },
            { name: 'Diet Logs', value: dietCount },
            { name: 'Water Logs', value: waterCount },
            { name: 'Sleep Logs', value: sleepCount },
            { name: 'Weight Logs', value: weightCount }
        ];

        const userGrowth = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });

            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const count = await User.countDocuments({
                createdAt: { $lte: end }
            });

            userGrowth.push({ name: monthName, users: count });
        }

        res.json({
            totalUsers,
            newUsersThisMonth,
            totalWorkouts,
            totalChallenges,
            activityStats,
            userGrowth
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignPlan = async (req, res) => {
    try {
        const { type, title, content } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const plan = await Plan.create({
            user: req.params.id,
            admin: req.admin._id,
            type,
            title,
            content
        });

        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        await plan.deleteOne();
        res.json({ message: 'Plan removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserSubscription = async (req, res) => {
    try {
        const { plan, status, endDate } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.subscription = {
            plan: plan || user.subscription.plan,
            status: status || user.subscription.status,
            endDate: endDate || user.subscription.endDate,
            startDate: user.subscription.startDate,
            autoRenew: user.subscription.autoRenew,
            upgradeRequested: false
        };

        if (endDate) {
            user.subscription.endDate = new Date(endDate);
        }

        const updatedUser = await user.save();

        const Notification = require('../models/Notification');
        await Notification.create({
            user: user._id,
            type: 'info',
            message: `Your subscription has been updated to ${updatedUser.subscription.plan} (${updatedUser.subscription.status}).`
        });

        res.json(updatedUser.subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`,
            isBlocked: user.isBlocked
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTrainers = async (req, res) => {
    try {
        const trainers = await require('../models/Trainer').find({}).select('-password');
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveTrainer = async (req, res) => {
    try {
        const trainer = await require('../models/Trainer').findById(req.params.id);
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

        trainer.isApproved = true;
        await trainer.save();

        res.json({ message: 'Trainer approved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleSuspendTrainer = async (req, res) => {
    try {
        const trainer = await require('../models/Trainer').findById(req.params.id);
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

        trainer.isSuspended = !trainer.isSuspended;
        await trainer.save();

        res.json({
            message: `Trainer ${trainer.isSuspended ? 'suspended' : 'unsuspended'}`,
            isSuspended: trainer.isSuspended
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserFullData,
    deleteUser,
    getSystemStats,
    assignPlan,
    deletePlan,
    updateUserSubscription,
    toggleBlockUser,
    getAllTrainers,
    approveTrainer,
    toggleSuspendTrainer
};
