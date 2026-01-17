const User = require('../models/User');
const Program = require('../models/Program');

const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.age = req.body.age || user.age;
        user.gender = req.body.gender || user.gender;
        user.height = req.body.height || user.height;
        user.weight = req.body.weight || user.weight;

        // Update health data (ensure array format if sent as string)
        if (req.body.healthConditions) {
            user.healthConditions = Array.isArray(req.body.healthConditions)
                ? req.body.healthConditions
                : req.body.healthConditions.split(',').map(item => item.trim());
        }
        if (req.body.injuries) {
            user.injuries = Array.isArray(req.body.injuries)
                ? req.body.injuries
                : req.body.injuries.split(',').map(item => item.trim());
        }

        if (req.body.password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: req.body.token,
            healthConditions: updatedUser.healthConditions,
            injuries: updatedUser.injuries,
            subscription: updatedUser.subscription
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateGoals = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.goals = { ...user.goals, ...req.body };
        const updatedUser = await user.save();
        res.json(updatedUser.goals);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getGoals = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.goals);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getMyPlans = async (req, res) => {
    try {
        const plans = await Program.find({ client: req.user._id }).populate('trainer', 'name').sort({ createdAt: -1 });
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateProfile,
    updateGoals,
    getGoals,
    getMyPlans
};
