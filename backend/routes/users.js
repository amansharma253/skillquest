const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET; // From .env (S5wWyuMN5zuQ2RcI72T1EMix1yvwSap085a9ybz-hW-1hmIASEZhznrWVdL3X17FfX0aNO-AlPMHpRUU52c2cg)

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered', username: user.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login and return JWT token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get top 5 users for leaderboard - MOVED ABOVE :id to avoid route conflict
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ essence: -1 }) // Sort by essence descending
      .limit(5) // Top 5 users
      .select('username essence rank'); // Only these fields
    res.json(leaderboard);
    // Emit leaderboard update to all connected clients
    const io = req.app.get('io');
    io.emit('leaderboardUpdate', leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID - KEEP THIS BELOW SPECIFIC ROUTES
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;