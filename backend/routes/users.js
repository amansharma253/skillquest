const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET; // Secret for JWT signing, from .env
const ADMIN_KEY = process.env.ADMIN_KEY; // Secret admin key, from .env

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Register attempt:', { username }); // Log incoming request
  try {
    if (!username || !password) {
      console.log('Missing username or password'); // Log validation failure
      return res.status(400).json({ error: 'Username and password required' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); // Increase salt rounds to 12
    console.log('Password hashed:', hashedPassword); // Log hash success
    const user = new User({ 
      username, 
      password: hashedPassword,
      isAdmin: false // Default to non-admin
    });
    await user.save(); // Save user to MongoDB
    console.log('User saved:', user); // Log save success
    res.status(201).json({ message: 'User registered', username: user.username });
  } catch (err) {
    console.error('Registration failed:', err.message, err.stack); // Log full error details
    res.status(400).json({ error: err.message || 'Registration failed' }); // Handle errors
  }
});

// POST /api/users/register-admin - Register a new admin user
router.post('/register-admin', async (req, res) => {
  const { username, password, adminKey } = req.body;
  console.log('Admin register attempt:', { username }); // Log incoming request
  try {
    if (!username || !password || !adminKey) {
      console.log('Missing username, password, or admin key'); // Log validation failure
      return res.status(400).json({ error: 'Username, password, and admin key required' });
    }
    if (adminKey !== ADMIN_KEY) {
      console.log('Invalid admin key'); // Log invalid admin key
      return res.status(403).json({ error: 'Invalid admin key' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); // Increase salt rounds to 12
    console.log('Password hashed:', hashedPassword); // Log hash success
    const user = new User({ 
      username, 
      password: hashedPassword,
      isAdmin: true // Set admin privileges
    });
    await user.save(); // Save admin user to MongoDB
    console.log('Admin user saved:', user); // Log save success
    res.status(201).json({ message: 'Admin user registered', username: user.username });
  } catch (err) {
    console.error('Admin registration failed:', err.message, err.stack); // Log full error details
    res.status(400).json({ error: err.message || 'Admin registration failed' }); // Handle errors
  }
});

// POST /api/users/login - Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username }); // Log login attempt
  try {
    const user = await User.findOne({ username }); // Find user by username
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials for:', username); // Log invalid login
      return res.status(400).json({ error: 'Invalid credentials' }); // Wrong username or password
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' }); // Generate JWT
    console.log('Login success:', username); // Log successful login
    res.json({ token, user }); // Return token and user data (including isAdmin)
  } catch (err) {
    console.error('Login failed:', err.message); // Log login errors
    res.status(500).json({ error: 'Server error' }); // Handle unexpected errors
  }
});

// GET /api/users/leaderboard - Fetch top 5 users by essence
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ essence: -1 }) // Sort by essence descending
      .limit(5)             // Limit to top 5
      .select('username essence rank'); // Only return these fields
    console.log('Leaderboard fetched:', leaderboard); // Log leaderboard data
    res.json(leaderboard);
    const io = req.app.get('io'); // Get Socket.IO instance from app
    io.emit('leaderboardUpdate', leaderboard); // Broadcast update to all clients
  } catch (err) {
    console.error('Leaderboard error:', err.message); // Log errors
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/:id - Fetch user by ID (for future use)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('User not found:', req.params.id); // Log missing user
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User fetched:', user.username); // Log found user
    res.json(user);
  } catch (err) {
    console.error('User fetch error:', err.message); // Log errors
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;