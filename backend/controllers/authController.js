const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Trainer = require('../models/Trainer');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const sendEmail = require('../utils/emailUtils');

const registerUser = async (req, res) => {
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });

    if (user) {
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Fitness Tracker!',
                message: `<h1>Hi ${user.name},</h1><p>Welcome to the best Fitness Tracking app. We are excited to have you on board!</p>`
            });
        } catch (error) {
            console.error('Email send failed:', error);
        }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
        name,
        email,
        password: hashedPassword,
    });

    if (admin) {
        res.status(201).json({
            _id: admin.id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
        res.json({
            _id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin',
            token: generateToken(admin.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

const registerTrainer = async (req, res) => {
    const { name, email, password, specialization, bio } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const trainerExists = await Trainer.findOne({ email });

    if (trainerExists) {
        return res.status(400).json({ message: 'Trainer already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const trainer = await Trainer.create({
        name,
        email,
        password: hashedPassword,
        specialization,
        bio
    });

    if (trainer) {
        res.status(201).json({
            _id: trainer.id,
            name: trainer.name,
            email: trainer.email,
            role: 'trainer',
            token: generateToken(trainer.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid trainer data' });
    }
};

const loginTrainer = async (req, res) => {
    const { email, password } = req.body;

    const trainer = await Trainer.findOne({ email });

    if (trainer && (await bcrypt.compare(password, trainer.password))) {
        if (trainer.isSuspended) {
            return res.status(401).json({ message: 'Account suspended. Contact admin.' });
        }
        if (!trainer.isApproved) {
            return res.status(401).json({ message: 'Account pending approval. Please wait for admin verification.' });
        }
        res.json({
            _id: trainer.id,
            name: trainer.name,
            email: trainer.email,
            role: 'trainer',
            token: generateToken(trainer.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

const getMe = async (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else if (req.admin) {
        res.status(200).json(req.admin);
    } else if (req.trainer) {
        res.status(200).json(req.trainer);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
    registerTrainer,
    loginTrainer,
    getMe,
};
