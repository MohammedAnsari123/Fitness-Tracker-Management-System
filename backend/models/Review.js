const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

reviewSchema.index({ trainer: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
