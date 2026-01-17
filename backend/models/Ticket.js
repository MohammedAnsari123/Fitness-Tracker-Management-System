const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Resolved', 'Closed'],
        default: 'Open'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
