const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    muscleGroup: {
        type: String,
        required: true,
        enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio', 'Full Body']
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Exercise', exerciseSchema);
