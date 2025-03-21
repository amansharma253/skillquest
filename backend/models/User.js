const mongoose = require('mongoose');

// User schema - defines structure for user documents in MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username for each user
  password: { type: String, required: true },              // Hashed password for auth
  essence: { type: Number, default: 0 },                   // Points earned from challenges
  rank: { type: String, default: 'Apprentice' },           // User rank based on essence
  completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }], // Array of completed challenge IDs
  isAdmin: { type: Boolean, default: false }               // Flag for admin privileges
});

module.exports = mongoose.model('User', userSchema);