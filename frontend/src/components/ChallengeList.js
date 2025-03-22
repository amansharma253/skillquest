import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ChallengeList component - displays available and completed challenges
function ChallengeList({ user, token, challenges, setUser, setMessage, fetchChallenges }) {
  const [dailyChallenge, setDailyChallenge] = useState(null);

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges/daily');
      setDailyChallenge(response.data);
    } catch (err) {
      console.error('Failed to fetch daily challenge:', err);
    }
  };

  // Complete a challenge via POST /api/challenges/complete
  const handleCompleteChallenge = async (challengeId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/challenges/complete',
        { challengeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setMessage(`Completed challenge! Essence: ${response.data.essence}`);
      await fetchChallenges();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error completing challenge');
    }
  };

  return (
    <>
      <h2>Daily Challenge</h2>
      {dailyChallenge ? (
        <div className="daily-challenge">
          <h3>{dailyChallenge.title}</h3>
          <p>{dailyChallenge.description}</p>
          <p>Essence Reward: {dailyChallenge.essenceReward}</p>
          <button onClick={() => handleCompleteChallenge(dailyChallenge._id)}>Complete</button>
        </div>
      ) : (
        <p>No daily challenge available.</p>
      )}

      <div className="container py-4">
        <h2 className="text-secondary mb-4">Available Challenges</h2>
        <ul className="list-group">
          {challenges
            .filter(challenge => !user.completedChallenges.includes(challenge._id))
            .map(challenge => (
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

      <h2>Completed Challenges</h2>
      <ul>
        {challenges
          .filter(challenge => user.completedChallenges.includes(challenge._id))
          .map(challenge => (
            <li className={challenge.difficulty.toLowerCase()} key={challenge._id}>
              {challenge.title} ({challenge.difficulty}) - {challenge.essenceReward} Essence (Completed)
            </li>
          ))}
      </ul>
    </>
  );
}

export default ChallengeList;