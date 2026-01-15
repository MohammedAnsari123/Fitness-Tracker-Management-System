const mongoose = require('mongoose');

const planTemplateSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['workout', 'diet'],
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true, 
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    durationWeeks: {
        type: Number,
        default: 4
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('PlanTemplate', planTemplateSchema);
