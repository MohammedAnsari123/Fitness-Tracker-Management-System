const mongoose = require('mongoose');

const userChallengeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    lastCheckIn: {
        type: Date
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('UserChallenge', userChallengeSchema);
