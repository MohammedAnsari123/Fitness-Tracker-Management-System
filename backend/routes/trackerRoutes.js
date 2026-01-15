const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    addWorkout, getWorkouts,
    addDiet, getDiet,
    addWater, getWater,
    logSleep, getSleep,
    logWeight, getWeightHistory,
    getHistory,
    deleteActivity,
    clearHistory,
    getPersonalRecords,
    updatePersonalRecord,
    getAnalytics,
    getExerciseHistory,
    getCustomExercises,
    addCustomExercise
} = require('../controllers/trackerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);

router.post('/workouts', protect, addWorkout);
router.get('/workouts', protect, getWorkouts);

router.post('/diet', protect, addDiet);
router.get('/diet', protect, getDiet);

router.post('/water', protect, addWater);
router.get('/water', protect, getWater);

router.post('/sleep', protect, logSleep);
router.get('/sleep', protect, getSleep);

router.post('/weight', protect, logWeight);
router.get('/weight', protect, getWeightHistory);
router.get('/history', protect, getHistory);
router.delete('/history/:type/:id', protect, deleteActivity);
router.delete('/history', protect, clearHistory);

router.get('/analytics', protect, getAnalytics);
router.get('/prs', protect, getPersonalRecords);
router.post('/prs', protect, updatePersonalRecord);
router.get('/exercise-history', protect, getExerciseHistory);
router.get('/exercises/custom', protect, getCustomExercises);
router.post('/exercises/custom', protect, addCustomExercise);

module.exports = router;
