const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Get All Challenges
router.get('/', async (req, res) => {
  const challenges = await Challenge.find();
  res.json(challenges);
});

// Complete Challenge
router.post('/complete', async (req, res) => {
  const { userId, challengeId } = req.body;
  const user = await User.findById(userId);
  const challenge = await Challenge.findById(challengeId);
  if (!user || !challenge) return res.status(404).json({ error: 'Not found' });
  if (!user.completedChallenges.includes(challengeId)) {
    user.completedChallenges.push(challengeId);
    user.essence += challenge.essenceReward;
    user.rank = updateRank(user.essence);
    await user.save();
  }
  res.json(user);
});

// Rank Logic
const ranks = [
  { name: 'Apprentice', threshold: 0 },
  { name: 'Journeyman', threshold: 50 },
  { name: 'Knight', threshold: 100 },
  { name: 'Master', threshold: 200 },
  { name: 'Sage', threshold: 500 }
];

function updateRank(essence) {
  return ranks.reduce((prev, curr) => essence >= curr.threshold ? curr : prev, ranks[0]).name;
}

module.exports = router;