const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin',
    },
    type: {
        type: String,
        enum: ['workout', 'diet'],
        required: true,
    },
    title: {
        type: String, 
        required: true
    },
    content: {
        type: String, 
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Plan', planSchema);
