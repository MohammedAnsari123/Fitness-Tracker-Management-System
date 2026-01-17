const Review = require('../models/Review');
const User = require('../models/User');

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const user = await User.findById(req.user._id);

        if (!user.trainer) {
            return res.status(400).json({ message: 'You do not have an assigned trainer to review.' });
        }

        const trainerId = user.trainer;

        const reviewExists = await Review.findOne({
            user: req.user._id,
            trainer: trainerId
        });

        if (reviewExists) {
            return res.status(400).json({ message: 'You have already reviewed this trainer' });
        }

        const review = await Review.create({
            user: req.user._id,
            trainer: trainerId,
            rating: Number(rating),
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTrainerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ trainer: req.trainer._id })
            .populate('user', 'name image')
            .sort({ createdAt: -1 });

        const avg = reviews.length > 0
            ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
            : 0;

        res.json({ reviews, averageRating: avg, totalReviews: reviews.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addReview,
    getTrainerReviews
};
