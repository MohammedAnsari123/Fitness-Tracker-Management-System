const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc    Connect a wearable device (Mock)
// @route   POST /api/wearables/connect
// @access  Private
router.post('/connect', protect, async (req, res) => {
    const { provider } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user.connectedDevices.includes(provider)) {
            user.connectedDevices.push(provider);
            await user.save();
        }
        res.json({ message: `${provider} connected successfully!`, connectedDevices: user.connectedDevices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Disconnect a wearable device
// @route   POST /api/wearables/disconnect
// @access  Private
router.post('/disconnect', protect, async (req, res) => {
    const { provider } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.connectedDevices = user.connectedDevices.filter(d => d !== provider);
        await user.save();
        res.json({ message: `${provider} disconnected.`, connectedDevices: user.connectedDevices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Sync data from connected devices (Mock)
// @route   GET /api/wearables/sync
// @access  Private
router.get('/sync', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.connectedDevices || user.connectedDevices.length === 0) {
            return res.status(400).json({ message: 'No devices connected' });
        }

        // Generate Random Mock Data
        const mockData = {
            steps: Math.floor(Math.random() * (12000 - 3000 + 1)) + 3000,
            calories: Math.floor(Math.random() * (800 - 200 + 1)) + 200,
            distance: (Math.random() * (8 - 2) + 2).toFixed(2), // km
            heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            sleep: (Math.random() * (9 - 5) + 5).toFixed(1), // hours
            syncedAt: new Date()
        };

        // In a real app, we would save this to the DB here (e.g., create a daily log).
        // For this mock, we just return it to the frontend to "Visualize".

        res.json({
            message: 'Sync complete!',
            data: mockData,
            source: user.connectedDevices[0] // Just attribute to the first device
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
