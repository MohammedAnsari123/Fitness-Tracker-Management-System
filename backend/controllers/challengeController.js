const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');

const createChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.create(req.body);
        res.status(201).json(challenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().sort('-createdAt');
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const joinChallenge = async (req, res) => {
    try {
        const { challengeId } = req.body;

        const exists = await UserChallenge.findOne({ user: req.user._id, challenge: challengeId });
        if (exists) {
            return res.status(400).json({ message: 'Already joined this challenge' });
        }

        const userChallenge = await UserChallenge.create({
            user: req.user._id,
            challenge: challengeId
        });
        res.status(201).json(userChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMyChallenges = async (req, res) => {
    try {
        const myChallenges = await UserChallenge.find({ user: req.user._id })
            .populate('challenge')
            .sort('-startDate');
        res.json(myChallenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;

        const updated = await UserChallenge.findByIdAndUpdate(
            id,
            { progress, lastCheckIn: Date.now() },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createChallenge,
    getChallenges,
    joinChallenge,
    getMyChallenges,
    updateProgress
};
