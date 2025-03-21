const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the Express app directly

beforeAll(async () => {
  // Connect to the MongoDB database before running tests
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Close the MongoDB connection after all tests are done
  await mongoose.connection.close();
});

describe('POST /api/users/register', () => {
  it('should register a new user', async () => {
    const uniqueUsername = `testuser-${Date.now()}`; // Generate a unique username
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: uniqueUsername, password: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered');
  });
});