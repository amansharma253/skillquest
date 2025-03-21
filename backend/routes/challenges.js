const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

module.exports = (authMiddleware) => {
  const router = express.Router();

  // Get all challenges
  router.get('/', async (req, res) => {
    try {
      const challenges = await Challenge.find();
      res.json(challenges);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Create a new challenge (authenticated)
  router.post('/create', authMiddleware, async (req, res) => {
    const { title, description, skill, difficulty, essenceReward } = req.body;
    try {
      if (!title || !skill || !difficulty || !essenceReward) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const challenge = new Challenge({
        title,
        description,
        skill,
        difficulty,
        essenceReward
      });
      await challenge.save();
      res.status(201).json(challenge);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Complete a challenge (authenticated)
  router.post('/complete', authMiddleware, async (req, res) => {
    const { challengeId } = req.body;
    const userId = req.user; // From authMiddleware
    try {
      const user = await User.findById(userId);
      const challenge = await Challenge.findById(challengeId);
      if (!user || !challenge) {
        return res.status(404).json({ error: 'User or challenge not found' });
      }
      if (user.completedChallenges.includes(challengeId)) {
        return res.status(400).json({ error: 'Challenge already completed' });
      }
      user.completedChallenges.push(challengeId);
      user.essence += challenge.essenceReward;
      if (user.essence >= 100) user.rank = 'Master';
      else if (user.essence >= 50) user.rank = 'Journeyman';
      else user.rank = 'Apprentice';
      await user.save();
      res.json(user);
      // Emit leaderboard update after completion
      const leaderboard = await User.find()
        .sort({ essence: -1 })
        .limit(5)
        .select('username essence rank');
      const io = req.app.get('io');
      io.emit('leaderboardUpdate', leaderboard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};