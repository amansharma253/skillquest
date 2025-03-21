const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'] }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

app.set('io', io);

app.use('/api/users', require('./routes/users'));
app.use('/api/challenges', require('./routes/challenges')(authMiddleware));

app.get('/', (req, res) => res.send('SkillQuest Backend Running'));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));