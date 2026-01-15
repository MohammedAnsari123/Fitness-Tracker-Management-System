const mongoose = require('mongoose');

const programSchema = mongoose.Schema({
    name: { type: String, required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    weeks: [{
        weekNumber: Number,
        days: [{
            day: String,
            workoutName: String,
            exercises: [{
                name: String,
                sets: Number,
                reps: Number,
                weight: Number
            }]
        }]
    }],
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Program', programSchema);
