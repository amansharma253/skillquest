const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true },
essence: { type: Number, default: 0 },
rank: { type: String, default: 'Apprentice' },
avatar: { type: String, default: 'assets/peasant.png' },
completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
});

module.exports = mongoose.model('User', userSchema);

