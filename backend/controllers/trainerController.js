const User = require('../models/User');
const Program = require('../models/Program');
const Trainer = require('../models/Trainer');
const Exercise = require('../models/Exercise');
const Food = require('../models/Food');
const PlanTemplate = require('../models/PlanTemplate');

const getClients = async (req, res) => {
    try {
        const clients = await User.find({ trainer: req.trainer._id }).select('-password');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addClient = async (req, res) => {
    const { email } = req.body;
    try {
        const client = await User.findOne({ email });
        if (!client) {
            return res.status(404).json({ message: 'User not found with that email' });
        }

        if (client.role && client.role !== 'user') {
            return res.status(400).json({ message: 'Can only add regular users as clients' });
        }

        if (client.trainer) {
            return res.status(400).json({ message: 'User already has a trainer' });
        }

        client.trainer = req.trainer._id;
        await client.save();

        res.json({ message: `Client ${client.name} added successfully`, client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeClient = async (req, res) => {
    try {
        const client = await User.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        if (client.trainer.toString() !== req.trainer._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to remove this client' });
        }

        client.trainer = undefined;
        await client.save();

        res.json({ message: 'Client removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProgram = async (req, res) => {
    try {
        const { clientId, name, description, weeks, endDate } = req.body;

        const program = await Program.create({
            trainer: req.trainer._id,
            client: clientId,
            name,
            description,
            weeks,
            endDate
        });

        res.status(201).json(program);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getClientPrograms = async (req, res) => {
    try {
        const programs = await Program.find({
            trainer: req.trainer._id,
            client: req.params.clientId
        });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.trainer._id).select('-password');
        res.json(trainer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.trainer._id);
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

        trainer.name = req.body.name || trainer.name;
        trainer.email = req.body.email || trainer.email;
        trainer.bio = req.body.bio || trainer.bio;
        trainer.specialization = req.body.specialization || trainer.specialization;

        if (req.body.password) {

        }

        const updatedTrainer = await trainer.save();
        res.json({
            _id: updatedTrainer._id,
            name: updatedTrainer.name,
            email: updatedTrainer.email,
            bio: updatedTrainer.bio,
            specialization: updatedTrainer.specialization
        });

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

const createFood = async (req, res) => {
    try {
        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createPlanTemplate = async (req, res) => {
    try {
        const template = await PlanTemplate.create(req.body);
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
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
};
