const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    exercises: [{
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number }
    }],
    duration: { type: Number }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
