const mongoose = require('mongoose');

const payoutSchema = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Trainer'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Failed'],
        default: 'Pending'
    },
    method: {
        type: String,
        default: 'Bank Transfer'
    },
    transactionId: {
        type: String
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payout', payoutSchema);
