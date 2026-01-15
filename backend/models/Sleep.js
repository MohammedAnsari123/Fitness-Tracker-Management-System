const mongoose = require('mongoose');

const sleepSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    duration: { type: Number, required: true },
    quality: { type: String, enum: ['Good', 'Average', 'Poor'] }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sleep', sleepSchema);
