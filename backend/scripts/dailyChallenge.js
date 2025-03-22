const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Function to pick a random daily challenge
async function pickDailyChallenge() {
  try {
    // Reset the current daily challenge
    await Challenge.updateMany({ dailyChallenge: true }, { $set: { dailyChallenge: false } });

    // Pick a random approved challenge
    const randomChallenge = await Challenge.aggregate([
      { $match: { status: 'approved' } },
      { $sample: { size: 1 } },
    ]);

    if (randomChallenge.length > 0) {
      await Challenge.findByIdAndUpdate(randomChallenge[0]._id, { $set: { dailyChallenge: true } });
      console.log(`Daily challenge set: ${randomChallenge[0].title}`);
    } else {
      console.log('No approved challenges available to set as daily challenge.');
    }
  } catch (err) {
    console.error('Error picking daily challenge:', err);
  }
}

// Run the function once daily
setInterval(pickDailyChallenge, 24 * 60 * 60 * 1000); // Run every 24 hours
pickDailyChallenge(); // Run immediately on startup