const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
