const express = require('express');
const router = express.Router();
const {
    getClients,
    addClient,
    removeClient,
    createProgram,
    getClientPrograms,
    getProfile,
    updateProfile,
    createExercise,
    createFood,
    createPlanTemplate
} = require('../controllers/trainerController');
const { getExercises, getFoods, getPlanTemplates } = require('../controllers/adminContentController');
const { protect, trainerOnly } = require('../middleware/authMiddleware');

router.get('/clients', protect, trainerOnly, getClients);
router.post('/clients', protect, trainerOnly, addClient);
router.delete('/clients/:id', protect, trainerOnly, removeClient);

router.post('/programs', protect, trainerOnly, createProgram);
router.get('/programs/:clientId', protect, trainerOnly, getClientPrograms);

router.get('/exercises', protect, trainerOnly, getExercises);
router.post('/exercises', protect, trainerOnly, createExercise);

router.get('/foods', protect, trainerOnly, getFoods);
router.post('/foods', protect, trainerOnly, createFood);

router.get('/templates', protect, trainerOnly, getPlanTemplates);
router.post('/templates', protect, trainerOnly, createPlanTemplate);

router.get('/profile', protect, trainerOnly, getProfile);
router.put('/profile', protect, trainerOnly, updateProfile);

module.exports = router;
