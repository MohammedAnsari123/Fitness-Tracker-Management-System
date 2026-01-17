const cron = require('node-cron');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Workout = require('../models/Workout');
const Water = require('../models/Water');

const initScheduler = () => {
    // Run every day at 8:00 PM
    cron.schedule('0 20 * * *', async () => {
        console.log('Running daily goal reminder check...');
        try {
            const users = await User.find({ role: 'user' });

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            for (const user of users) {
                // Check Workout
                const workout = await Workout.findOne({
                    user: user._id,
                    date: { $gte: today, $lt: tomorrow }
                });

                if (!workout) {
                    await Notification.create({
                        user: user._id,
                        type: 'info',
                        message: "Don't forget to log your workout for today! Consistency is key."
                    });
                }

                // Check Water
                const water = await Water.findOne({
                    user: user._id,
                    date: { $gte: today, $lt: tomorrow }
                });

                if (!water) {
                    // Only send water reminder if they haven't logged it, 
                    // maybe alternate messages or just check if TOTAL amount is low?
                    // For now, simpler is better: if no log at all.
                    await Notification.create({
                        user: user._id,
                        type: 'info',
                        message: "Stay hydrated! You haven't logged any water intake today."
                    });
                }
            }
        } catch (error) {
            console.error('Error in daily scheduler:', error);
        }
    });

    console.log('Daily Goal Reminder Scheduler Initialized (Runs at 8:00 PM)');
};

module.exports = initScheduler;
