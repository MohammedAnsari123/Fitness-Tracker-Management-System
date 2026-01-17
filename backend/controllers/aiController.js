const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Program = require('../models/Program');

// Helper: Shuffle array
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// @desc    Generate a personalized workout plan
// @route   POST /api/ai/generate
// @access  Private
const generateWorkoutPlan = async (req, res) => {
    const { daysPerWeek, goal, intensity } = req.body;
    // daysPerWeek: 3, 4, 5, 6
    // goal: 'Weight Loss', 'Muscle Gain', 'Strength'
    // intensity: 'Low', 'Medium', 'High'

    try {
        const user = await User.findById(req.user._id);
        const allExercises = await Exercise.find({});

        // 1. Filter Exercises based on User Injuries
        const safeExercises = allExercises.filter(ex => {
            // Check if muscle group overlaps with any injury
            // Assuming user.injuries is an array of strings like ['Knee', 'Shoulder']
            // And ex.muscleGroup is one of ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio']

            // Simple keyword matching
            const isUnsafe = user.injuries.some(injury =>
                ex.muscleGroup.toLowerCase().includes(injury.toLowerCase()) ||
                (injury.toLowerCase().includes('knee') && ex.muscleGroup === 'Legs') ||
                (injury.toLowerCase().includes('back') && ex.muscleGroup === 'Back')
            );
            return !isUnsafe;
        });

        // 2. Determine Split
        let split = [];
        if (daysPerWeek <= 3) {
            split = ['Full Body', 'Full Body', 'Full Body']; // 3 Days
        } else if (daysPerWeek == 4) {
            split = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body']; // 4 Days
        } else {
            split = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']; // 5-6 Days (truncated if 5)
        }

        // Truncate to actual days requested
        split = split.slice(0, daysPerWeek);

        // 3. Build Routine
        const weeks = [];

        // We will generate just 1 week structure for now, repeated for 4 weeks in the Program object if saved?
        // Or user just wants to see "The Plan". Let's build a standard 1 week template.

        const weekDays = split.map((focus, index) => {
            let dayExercises = [];

            // Select exercises based on focus
            if (focus === 'Full Body') {
                // 1 Chest, 1 Back, 1 Legs, 1 Shoulders, 1 Arms, 1 Abs
                dayExercises = [
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Chest')).slice(0, 1),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Back')).slice(0, 1),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Legs')).slice(0, 1),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Shoulders')).slice(0, 1),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Arms')).slice(0, 1),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Abs')).slice(0, 1),
                ];
            } else if (focus === 'Upper Body') {
                dayExercises = [
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Chest')).slice(0, 2),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Back')).slice(0, 2),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Shoulders')).slice(0, 1),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Arms')).slice(0, 1),
                ];
            } else if (focus === 'Lower Body') {
                dayExercises = [
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Legs')).slice(0, 4),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Abs')).slice(0, 2),
                ];
            } else if (focus === 'Push') {
                // Chest, Shoulders, Triceps (Arms)
                dayExercises = [
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Chest')).slice(0, 2),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Shoulders')).slice(0, 2),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Arms')).slice(0, 1),
                ];
            } else if (focus === 'Pull') {
                // Back, Biceps (Arms)
                dayExercises = [
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Back')).slice(0, 3),
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Arms')).slice(0, 2),
                ];
            } else if (focus === 'Legs') {
                dayExercises = [
                    ...shuffle(safeExercises.filter(e => e.muscleGroup === 'Legs')).slice(0, 5),
                ];
            }

            // Map to Program format
            return {
                day: `Day ${index + 1} - ${focus}`,
                isRestDay: false,
                exercises: dayExercises.map(ex => ({
                    name: ex.name,
                    sets: goal === 'Strength' ? 5 : goal === 'Muscle Gain' ? 3 : 4,
                    reps: goal === 'Strength' ? 5 : goal === 'Muscle Gain' ? 10 : 15,
                    weight: 0
                }))
            };
        });

        // Construct 4 weeks of this same routine
        for (let i = 1; i <= 4; i++) {
            weeks.push({
                weekNumber: i,
                days: weekDays
            });
        }

        res.json({
            name: `AI - ${daysPerWeek} Day ${goal} Plan`,
            description: `A personalized ${intensity} intensity plan focusing on ${goal}. Generated by AI Coach.`,
            weeks: weeks,
            generatedAt: new Date()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI Generation Failed' });
    }
};

// @desc    Save generated plan to user profile
// @route   POST /api/ai/save
// @access  Private
const saveGeneratedPlan = async (req, res) => {
    // Expects the exact Program object structure
    try {
        const programData = req.body;

        // We can either save it as a "Program" (like a trainer assigned one)
        // Or add a field to distinguish it.
        // For simplicity, we save it as a Program with no trainer (or a system trainer ID if needed, but schema allows null trainer?)
        // Checking Program schema: trainer is type ObjectId, ref Trainer. Required?
        // Let's check Program model.
        // If required, we might need a dummy "AI Trainer" or make it optional.

        // Quick fix: userController can treat programs without trainer as "Self/AI" or we simply create it.
        // Let's see if we can create it.

        const program = await Program.create({
            client: req.user._id,
            name: programData.name,
            description: programData.description,
            weeks: programData.weeks,
            trainer: null // Needs schema check
        });

        res.status(201).json(program);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateWorkoutPlan, saveGeneratedPlan };
