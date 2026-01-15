const User = require('../models/User');
const Workout = require('../models/Workout');

const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.social.following.includes(req.params.id)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        currentUser.social.following.push(req.params.id);
        userToFollow.social.followers.push(req.user._id);

        await currentUser.save();
        await userToFollow.save();

        res.json({ message: `You are now following ${userToFollow.name}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        currentUser.social.following = currentUser.social.following.filter(
            (id) => id.toString() !== req.params.id
        );
        userToUnfollow.social.followers = userToUnfollow.social.followers.filter(
            (id) => id.toString() !== req.user._id.toString()
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: `You have unfollowed ${userToUnfollow.name}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActivityFeed = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const followingIds = currentUser.social.following;

        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 7);

        const feed = await Workout.find({
            user: { $in: followingIds },
            date: { $gte: dateLimit }
        })
            .populate('user', 'name')
            .sort({ date: -1 })
            .limit(20);

        res.json(feed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('name email _id age goal');

        const usersWithStatus = users.map(user => ({
            ...user.toObject(),
            isFollowing: currentUser.social.following.some(id => id.toString() === user._id.toString())
        }));

        res.json(usersWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .select('name gamification')
            .sort({ 'gamification.points': -1 })
            .limit(10);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getActivityFeed,
    getAllUsers,
    getLeaderboard
};
