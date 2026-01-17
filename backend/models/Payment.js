const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    method: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'UPI', 'Card', 'Other'],
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Pending', 'Failed'],
        default: 'Completed'
    },
    transactionId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
