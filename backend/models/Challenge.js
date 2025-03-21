const mongoose = require('mongoose');

// Challenge schema - defines structure for challenge documents in MongoDB
const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },                 // Challenge title
  description: String,                                     // Optional description
  skill: { type: String, required: true },                 // Skill category (e.g., "Coding")
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true }, // Difficulty level
  essenceReward: { type: Number, required: true },         // Points awarded on completion
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Approval status
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // User who submitted the challenge
});

module.exports = mongoose.model('Challenge', challengeSchema);