const Workout = require('../models/Workout');
const Diet = require('../models/Diet');
const Water = require('../models/Water');
const Sleep = require('../models/Sleep');
const WeightLog = require('../models/WeightLog');
const CustomExercise = require('../models/CustomExercise');

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const getDashboardStats = async (req, res) => {
    const { start, end } = getTodayRange();
    const userId = req.user._id;

    try {
        const workouts = await Workout.find({ user: userId, date: { $gte: start, $lte: end } });
        const diets = await Diet.find({ user: userId, date: { $gte: start, $lte: end } });
        const water = await Water.find({ user: userId, date: { $gte: start, $lte: end } });
        const sleep = await Sleep.findOne({ user: userId, date: { $gte: start, $lte: end } });

        const totalCaloriesStart = diets.reduce((acc, curr) => acc + curr.meals.reduce((mAcc, mCurr) => mAcc + mCurr.calories, 0), 0);
        const totalWater = water.reduce((acc, curr) => acc + curr.amount, 0);
        const totalWorkouts = workouts.length;

        const user = await require('../models/User').findById(userId);

        res.json({
            caloriesRun: 0,
            caloriesIntake: totalCaloriesStart,
            waterIntake: totalWater,
            sleepDuration: sleep ? sleep.duration : 0,
            workoutCount: totalWorkouts,
            workouts,
            gamification: user.gamification
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { updateStreak, checkBadges } = require('../utils/gamification');

const addWorkout = async (req, res) => {
    try {
        const workout = await Workout.create({ user: req.user._id, ...req.body });

        const user = await require('../models/User').findById(req.user._id);

        await updateStreak(user);

        const totalWorkouts = await Workout.countDocuments({ user: req.user._id });
        const volumeAgg = await Workout.aggregate([
            { $match: { user: req.user._id } },
            { $unwind: '$exercises' },
            { $group: { _id: null, totalVolume: { $sum: { $multiply: ['$exercises.sets', '$exercises.reps', '$exercises.weight'] } } } }
        ]);
        const totalVolume = volumeAgg.length > 0 ? volumeAgg[0].totalVolume : 0;

        const newBadges = await checkBadges(user, totalWorkouts, totalVolume);

        res.status(201).json({ workout, newBadges });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
};

const addDiet = async (req, res) => {
    try {
        const diet = await Diet.create({ user: req.user._id, ...req.body });
        res.status(201).json(diet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDiet = async (req, res) => {
    const diet = await Diet.find({ user: req.user._id }).sort({ date: -1 });
    res.json(diet);
};

const addWater = async (req, res) => {
    try {
        const water = await Water.create({ user: req.user._id, amount: req.body.amount });
        res.status(201).json(water);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getWater = async (req, res) => {
    const water = await Water.find({ user: req.user._id }).sort({ date: -1 });
    res.json(water);
};

const logSleep = async (req, res) => {
    try {
        const sleep = await Sleep.create({ user: req.user._id, ...req.body });
        res.status(201).json(sleep);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSleep = async (req, res) => {
    const sleep = await Sleep.find({ user: req.user._id }).sort({ date: -1 });
    res.json(sleep);
};

const logWeight = async (req, res) => {
    try {
        const weightLog = await WeightLog.create({ user: req.user._id, weight: req.body.weight });
        const user = await require('../models/User').findById(req.user._id);
        if (user) {
            user.weight = req.body.weight;
            await user.save();
        }
        res.status(201).json(weightLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getWeightHistory = async (req, res) => {
    const weights = await WeightLog.find({ user: req.user._id }).sort({ date: 1 });
    res.json(weights);
}

const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const [workouts, diets, water, sleep, weight] = await Promise.all([
            Workout.find({ user: userId }).lean(),
            Diet.find({ user: userId }).lean(),
            Water.find({ user: userId }).lean(),
            Sleep.find({ user: userId }).lean(),
            WeightLog.find({ user: userId }).lean()
        ]);

        const combined = [
            ...workouts.map(i => ({ ...i, type: 'workout' })),
            ...diets.map(i => ({ ...i, type: 'diet' })),
            ...water.map(i => ({ ...i, type: 'water' })),
            ...sleep.map(i => ({ ...i, type: 'sleep' })),
            ...weight.map(i => ({ ...i, type: 'weight' }))
        ].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

        res.json(combined);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const { type, id } = req.params;
        const userId = req.user._id;

        let Model;
        switch (type) {
            case 'workout': Model = Workout; break;
            case 'diet': Model = Diet; break;
            case 'water': Model = Water; break;
            case 'sleep': Model = Sleep; break;
            case 'weight': Model = WeightLog; break;
            default: return res.status(400).json({ message: 'Invalid type' });
        }

        const item = await Model.findOneAndDelete({ _id: id, user: userId });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        await Promise.all([
            Workout.deleteMany({ user: userId }),
            Diet.deleteMany({ user: userId }),
            Water.deleteMany({ user: userId }),
            Sleep.deleteMany({ user: userId }),
            WeightLog.deleteMany({ user: userId })
        ]);
        res.json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    addWorkout, getWorkouts,
    addDiet, getDiet,
    addWater, getWater,
    logSleep, getSleep,
    logWeight, getWeightHistory,
    getHistory,
    deleteActivity,
    clearHistory,

    getPersonalRecords: async (req, res) => {
        try {
            const user = await require('../models/User').findById(req.user._id).select('personalRecords');
            res.json(user.personalRecords);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePersonalRecord: async (req, res) => {
        const { exercise, weight } = req.body;
        try {
            const user = await require('../models/User').findById(req.user._id);
            const existingRecord = user.personalRecords.find(r => r.exercise === exercise);

            if (existingRecord) {
                if (weight > existingRecord.weight) {
                    existingRecord.weight = weight;
                    existingRecord.date = Date.now();
                }
            } else {
                user.personalRecords.push({ exercise, weight });
            }

            await user.save();
            res.json(user.personalRecords);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAnalytics: async (req, res) => {
        try {
            const userId = req.user._id;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const workouts = await Workout.find({
                user: userId,
                date: { $gte: thirtyDaysAgo }
            }).sort({ date: 1 });

            const volumeData = workouts.map(w => {
                const totalVolume = w.exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps * (ex.weight || 0)), 0);
                return {
                    date: w.date,
                    volume: totalVolume
                };
            });

            res.json({ volumeData });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getExerciseHistory: async (req, res) => {
        try {
            const userId = req.user._id;
            const { exercise } = req.query;

            if (!exercise) return res.status(400).json({ message: 'Exercise name required' });

            const workouts = await Workout.find({
                user: userId,
                'exercises.name': { $regex: new RegExp(`^${exercise}$`, 'i') }
            }).sort({ date: 1 });

            const history = workouts.map(w => {
                const relevantExercises = w.exercises.filter(e => e.name.toLowerCase() === exercise.toLowerCase());
                const maxWeight = Math.max(...relevantExercises.map(e => e.weight || 0));

                return {
                    date: w.date,
                    weight: maxWeight
                };
            }).filter(h => h.weight > 0);

            res.json(history);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCustomExercises: async (req, res) => {
        try {
            const exercises = await CustomExercise.find({ user: req.user._id }).sort({ createdAt: -1 });
            res.json(exercises.map(e => e.name));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addCustomExercise: async (req, res) => {
        const { exercise } = req.body;
        if (!exercise) return res.status(400).json({ message: "Exercise name required" });
        try {
            const existing = await CustomExercise.findOne({ user: req.user._id, name: exercise });
            if (existing) {
                return res.status(400).json({ message: "Exercise already exists" });
            }

            await CustomExercise.create({
                user: req.user._id,
                name: exercise
            });

            const allExercises = await CustomExercise.find({ user: req.user._id }).sort({ createdAt: -1 });
            res.json(allExercises.map(e => e.name));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
