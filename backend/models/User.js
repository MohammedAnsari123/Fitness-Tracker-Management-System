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
    isBlocked: { type: Boolean, default: false },

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
    },

    healthConditions: [{ type: String }],
    injuries: [{ type: String }],

    subscription: {
        plan: {
            type: String,
            enum: ['Free', 'Pro', 'Premium'],
            default: 'Free'
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Cancelled'],
            default: 'Active'
        },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        autoRenew: { type: Boolean, default: false }
    },

    pushToken: { type: String },
    connectedDevices: [{ type: String }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
