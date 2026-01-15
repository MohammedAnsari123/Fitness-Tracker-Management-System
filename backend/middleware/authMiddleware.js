const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Trainer = require('../models/Trainer');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) {
                return next();
            }

            req.admin = await Admin.findById(decoded.id).select('-password');
            if (req.admin) {
                return next();
            }

            req.trainer = await Trainer.findById(decoded.id).select('-password');
            if (req.trainer) {
                return next();
            }

            throw new Error('Not authorized');
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const trainerOnly = (req, res, next) => {
    if (req.trainer || req.admin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a trainer' });
    }
};

module.exports = { protect, adminOnly, trainerOnly };
