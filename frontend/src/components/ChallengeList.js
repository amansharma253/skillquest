import React from 'react';
import axios from 'axios';

// ChallengeList component - displays available and completed challenges
function ChallengeList({ user, token, challenges, setUser, setMessage, fetchChallenges }) {
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
      <h2>Available Challenges</h2>
      <ul>
        {challenges
          .filter(challenge => !user.completedChallenges.includes(challenge._id))
          .map(challenge => (
            <li className={challenge.difficulty.toLowerCase()} key={challenge._id}>
              {challenge.title} ({challenge.difficulty}) - {challenge.essenceReward} Essence
              <button onClick={() => handleCompleteChallenge(challenge._id)}>Complete</button>
            </li>
          ))}
      </ul>
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