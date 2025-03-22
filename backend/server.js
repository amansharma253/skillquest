const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment variables
const MONGO_URI = process.env.MONGO_URI; // Use MONGO_URI from environment variables

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('SkillQuest Backend Running'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));