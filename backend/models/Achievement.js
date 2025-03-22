const mongoose = require('mongoose');

// Achievement schema - defines structure for achievement documents in MongoDB
const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },                 // Achievement name
  description: { type: String, required: true },          // Description of the achievement
  condition: { type: String, required: true },            // Condition to earn the achievement (e.g., "Complete 10 Coding Challenges")
  essenceReward: { type: Number, required: true },        // Essence reward for earning the achievement
});

module.exports = mongoose.model('Achievement', achievementSchema);