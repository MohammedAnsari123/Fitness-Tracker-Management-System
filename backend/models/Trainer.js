const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, default: 'General Fitness' },
    bio: { type: String },
    role: { type: String, default: 'trainer' },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Trainer', trainerSchema);
