const PlanTemplate = require('../models/PlanTemplate');
const Exercise = require('../models/Exercise');
const Food = require('../models/Food');

const createPlanTemplate = async (req, res) => {
    try {
        const template = await PlanTemplate.create(req.body);
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPlanTemplates = async (req, res) => {
    try {
        const templates = await PlanTemplate.find().sort('-createdAt');
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlanTemplate = async (req, res) => {
    try {
        await PlanTemplate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExercise = async (req, res) => {
    try {
        const exercise = await Exercise.create(req.body);
        res.status(201).json(exercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find().sort('name');
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExercise = async (req, res) => {
    try {
        await Exercise.findByIdAndDelete(req.params.id);
        res.json({ message: 'Exercise removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFood = async (req, res) => {
    try {
        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFoods = async (req, res) => {
    try {
        const foods = await Food.find().sort('name');
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFood = async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPlanTemplate, getPlanTemplates, deletePlanTemplate,
    createExercise, getExercises, deleteExercise,
    createFood, getFoods, deleteFood
};
