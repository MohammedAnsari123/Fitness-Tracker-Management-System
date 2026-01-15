const mongoose = require('mongoose');

const progressPhotoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    photoUrl: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    },
    notes: {
        type: String
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ProgressPhoto', progressPhotoSchema);
