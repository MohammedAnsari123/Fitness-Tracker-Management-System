const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    role: {
        type: String,
        enum: ['user', 'admin', 'trainer'],
        default: 'user'
    },

    social: {
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },

    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },

    gamification: {
        points: { type: Number, default: 0 },
        streak: {
            current: { type: Number, default: 0 },
            longest: { type: Number, default: 0 },
            lastLogDate: { type: Date }
        },
        badges: [{
            name: String,
            icon: String,
            earnedDate: { type: Date, default: Date.now },
            description: String
        }]
    },

    personalRecords: [{
        exercise: String,
        weight: Number,
        date: { type: Date, default: Date.now }
    }],

    customExercises: [{ type: String }],

    goals: {
        dailyCalories: { type: Number, default: 2000 },
        weeklyWorkouts: { type: Number, default: 3 },
        targetWeight: { type: Number }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
