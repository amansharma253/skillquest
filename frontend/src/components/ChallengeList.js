import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChallengeList({ challenges, handleCompleteChallenge }) {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    if (timeLeft) {
      const timer = setInterval(() => {
        updateTimeLeft();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchDailyChallenge = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges/daily');
      setDailyChallenge(response.data.dailyChallenge);
      calculateTimeLeft(new Date(response.data.resetTime));
    } catch (err) {
      console.error('Failed to fetch daily challenge:', err);
    }
  };

  const calculateTimeLeft = (resetTime) => {
    const now = new Date();
    const diff = resetTime - now;
    if (diff <= 0) {
      fetchDailyChallenge(); // Refresh the daily challenge when the timer hits zero
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
  };

  const updateTimeLeft = () => {
    if (dailyChallenge) {
      calculateTimeLeft(new Date(dailyChallenge.resetTime));
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-secondary mb-4">Daily Challenge</h2>
      {dailyChallenge ? (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{dailyChallenge.title}</h5>
            <p className="card-text">{dailyChallenge.description}</p>
            <p className="text-muted">Time left: {timeLeft}</p>
            <button
              className="btn btn-primary"
              onClick={() => handleCompleteChallenge(dailyChallenge._id)}
            >
              Complete
            </button>
          </div>
        </div>
      ) : (
        <p>No daily challenge available.</p>
      )}

      <h2 className="text-secondary mb-4">Available Challenges</h2>
      <ul className="list-group">
        {challenges.map((challenge) => (
          <li
            key={challenge._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              challenge.difficulty === 'Easy'
                ? 'list-group-item-success'
                : challenge.difficulty === 'Medium'
                ? 'list-group-item-warning'
                : 'list-group-item-danger'
            }`}
          >
            <span>
              {challenge.title} ({challenge.difficulty}) - {challenge.essenceReward} Essence
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleCompleteChallenge(challenge._id)}
            >
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChallengeList;