const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

module.exports = (authMiddleware) => {
  const router = express.Router();

  // GET /api/challenges - Fetch all approved challenges (public)
  router.get('/', async (req, res) => {
    try {
      const challenges = await Challenge.find({ status: 'approved' }); // Only approved challenges
      res.json(challenges);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET /api/challenges/pending - Fetch pending challenges (admin only)
  router.get('/pending', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user); // Get user from token via authMiddleware
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin only' }); // Check isAdmin field
      }
      const challenges = await Challenge.find({ status: 'pending' });
      res.json(challenges);
    } catch (err) {
      console.error('Error fetching pending challenges:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /api/challenges/create - Create a new challenge (pending status)
  router.post('/create', authMiddleware, async (req, res) => {
    const { title, description, skill, difficulty, essenceReward } = req.body;
    try {
      if (!title || !skill || !difficulty || !essenceReward) {
        return res.status(400).json({ error: 'Missing required fields' }); // Validate input
      }
      const challenge = new Challenge({
        title,
        description,
        skill,
        difficulty,
        essenceReward,
        createdBy: req.user, // Link to user who created it
        status: 'pending'   // Default status
      });
      await challenge.save();
      res.status(201).json({ message: 'Challenge submitted for approval', challenge });
    } catch (err) {
      console.error('Error creating challenge:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /api/challenges/approve - Approve or reject a challenge (admin only)
  router.post('/approve', authMiddleware, async (req, res) => {
    const { challengeId, action } = req.body; // action: 'approve' or 'reject'
    try {
      const user = await User.findById(req.user);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin only' }); // Check isAdmin field
      }
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      challenge.status = action === 'approve' ? 'approved' : 'rejected';
      await challenge.save();
      res.json(challenge);
    } catch (err) {
      console.error('Error approving/rejecting challenge:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /api/challenges/complete - Complete a challenge and update user
  router.post('/complete', authMiddleware, async (req, res) => {
    const { challengeId } = req.body;
    const userId = req.user; // From authMiddleware
    try {
      const user = await User.findById(userId);
      const challenge = await Challenge.findById(challengeId);
      if (!user || !challenge || challenge.status !== 'approved') {
        return res.status(404).json({ error: 'User or challenge not found, or not approved' });
      }
      if (user.completedChallenges.includes(challengeId)) {
        return res.status(400).json({ error: 'Challenge already completed' });
      }
      user.completedChallenges.push(challengeId);
      user.essence += challenge.essenceReward;
      if (user.essence >= 100) user.rank = 'Master';      // Update rank based on essence
      else if (user.essence >= 50) user.rank = 'Journeyman';
      else user.rank = 'Apprentice';
      await user.save();
      res.json(user);
      const leaderboard = await User.find()
        .sort({ essence: -1 })
        .limit(5)
        .select('username essence rank');
      const io = req.app.get('io');
      io.emit('leaderboardUpdate', leaderboard); // Update all clients
    } catch (err) {
      console.error('Error completing challenge:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};