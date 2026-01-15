const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createPlanTemplate, getPlanTemplates, deletePlanTemplate,
    createExercise, getExercises, deleteExercise,
    createFood, getFoods, deleteFood
} = require('../controllers/adminContentController');

router.route('/templates').get(protect, getPlanTemplates).post(protect, createPlanTemplate);
router.route('/templates/:id').delete(protect, deletePlanTemplate);

router.route('/exercises').get(protect, getExercises).post(protect, createExercise);
router.route('/exercises/:id').delete(protect, deleteExercise);

router.route('/foods').get(protect, getFoods).post(protect, createFood);
router.route('/foods/:id').delete(protect, deleteFood);

module.exports = router;
