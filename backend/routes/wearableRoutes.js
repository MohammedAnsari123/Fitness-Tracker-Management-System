const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

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

router.get('/sync', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.connectedDevices || user.connectedDevices.length === 0) {
            return res.status(400).json({ message: 'No devices connected' });
        }

        const mockData = {
            steps: Math.floor(Math.random() * (12000 - 3000 + 1)) + 3000,
            calories: Math.floor(Math.random() * (800 - 200 + 1)) + 200,
            distance: (Math.random() * (8 - 2) + 2).toFixed(2),
            heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            sleep: (Math.random() * (9 - 5) + 5).toFixed(1),
            syncedAt: new Date()
        };

        res.json({
            message: 'Sync complete!',
            data: mockData,
            source: user.connectedDevices[0]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
