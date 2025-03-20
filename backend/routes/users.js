const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
const { username, password } = req.body;
try {
const user = new User({ username, password });
await user.save();
res.status(201).json(user);
} catch (err) {
res.status(400).json({ error: err.message });
}
});

// Login User
router.post('/login', async (req, res) => {
const { username, password } = req.body;
const user = await User.findOne({ username, password });
res.json(user);
});

// Get User Profile
router.get('/:id', async (req, res) => {
const user = await User.findById(req.params.id);
res.json(user);
});

module.exports = router;

