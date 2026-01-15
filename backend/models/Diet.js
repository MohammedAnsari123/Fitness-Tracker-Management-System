const mongoose = require('mongoose');

const dietSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    meals: [{
        name: { type: String, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number },
        carbs: { type: Number },
        fat: { type: Number }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Diet', dietSchema);
