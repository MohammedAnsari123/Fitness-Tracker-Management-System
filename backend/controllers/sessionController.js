const Session = require('../models/Session');
const User = require('../models/User');

const createSession = async (req, res) => {
    try {
        const { user: userId, title, startTime, endTime, type, meetingLink, notes } = req.body;

        if (!userId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Please provide user, start time, and end time' });
        }

        const session = await Session.create({
            trainer: req.trainer._id,
            user: userId,
            title: title || 'Training Session',
            startTime,
            endTime,
            type,
            meetingLink,
            notes
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTrainerSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ trainer: req.trainer._id })
            .populate('user', 'name email image')
            .sort({ startTime: 1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .populate('trainer', 'name specialization')
            .sort({ startTime: 1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.trainer.toString() !== req.trainer._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedSession = await Session.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.trainer.toString() !== req.trainer._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await session.deleteOne();
        res.json({ message: 'Session removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createSession,
    getTrainerSessions,
    getUserSessions,
    updateSession,
    deleteSession
};
