const mongoose = require('mongoose');
const challengeSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String },
skill: { type: String, required: true },
difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
essenceReward: { type: Number, required: true },
});

module.exports = mongoose.model('Challenge', challengeSchema);

