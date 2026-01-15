const mongoose = require('mongoose');

const waterSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Water', waterSchema);
