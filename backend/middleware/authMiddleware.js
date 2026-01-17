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

            // DEBUG LOGS
            console.log('Decoded Token ID:', decoded.id);

            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) {
                if (req.user.isBlocked) {
                    res.status(401);
                    throw new Error('Account suspended. Contact admin.');
                }
                console.log('Found User:', req.user._id);
                return next();
            }

            req.admin = await Admin.findById(decoded.id).select('-password');
            if (req.admin) {
                console.log('Found Admin:', req.admin._id);
                return next();
            }

            req.trainer = await Trainer.findById(decoded.id).select('-password');
            if (req.trainer) {
                console.log('Found Trainer:', req.trainer._id);
                return next();
            }

            console.error('User/Admin/Trainer not found for ID:', decoded.id);
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
