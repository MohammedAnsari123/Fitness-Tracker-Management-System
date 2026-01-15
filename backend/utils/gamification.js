const User = require('../models/User');

const updateStreak = async (user) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLog = user.gamification.streak.lastLogDate ? new Date(user.gamification.streak.lastLogDate) : null;
    if (lastLog) lastLog.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastLog) {
        user.gamification.streak.current = 1;
        user.gamification.streak.longest = 1;
    } else if (today.getTime() === lastLog.getTime()) {
        return;
    } else if (today.getTime() - lastLog.getTime() === oneDay) {
        user.gamification.streak.current += 1;
        if (user.gamification.streak.current > user.gamification.streak.longest) {
            user.gamification.streak.longest = user.gamification.streak.current;
        }
    } else {
        user.gamification.streak.current = 1;
    }

    user.gamification.streak.lastLogDate = new Date();
    await user.save();
};

const checkBadges = async (user, totalWorkouts, totalVolume) => {
    const badges = [
        { name: 'First Step', description: 'Completed your first workout', condition: () => totalWorkouts >= 1, icon: '🥇' },
        { name: 'Consistent', description: 'Completed 10 workouts', condition: () => totalWorkouts >= 10, icon: '🔥' },
        { name: 'Dedicated', description: 'Completed 50 workouts', condition: () => totalWorkouts >= 50, icon: '🏆' },
        { name: 'Heavy Lifter', description: 'Lifted 10,000kg total volume', condition: () => totalVolume >= 10000, icon: '💪' }
    ];

    let newBadges = [];

    for (const badge of badges) {
        if (badge.condition() && !user.gamification.badges.find(b => b.name === badge.name)) {
            user.gamification.badges.push({
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                earnedDate: new Date()
            });
            newBadges.push(badge.name);
        }
    }

    if (newBadges.length > 0) {
        await user.save();
    }

    return newBadges;
};

module.exports = { updateStreak, checkBadges };
