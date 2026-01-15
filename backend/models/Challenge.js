const mongoose = require('mongoose');

const challengeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    durationDays: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['workout', 'habit', 'diet'],
        default: 'workout'
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    startDate: {
        type: Date
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Challenge', challengeSchema);
