const mongoose = require('mongoose');

const customExerciseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    muscleGroup: {
        type: String,
        default: 'Other'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomExercise', customExerciseSchema);
