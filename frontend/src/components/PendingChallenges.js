import React from 'react';
import axios from 'axios';

// PendingChallenges component - admin view for approving/rejecting challenges
function PendingChallenges({ token, pendingChallenges, setMessage, fetchPendingChallenges, fetchChallenges }) {
  // Approve or reject a challenge via POST /api/challenges/approve
  const handleApproveChallenge = async (challengeId, action) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/challenges/approve',
        { challengeId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Challenge ${action}ed`);
      await fetchPendingChallenges();
      await fetchChallenges();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error processing challenge');
    }
  };

  return (
    <>
      <h2>Pending Challenges (Admin)</h2>
      <ul>
        {pendingChallenges.map(challenge => (
          <li key={challenge._id}>
            {challenge.title} ({challenge.difficulty}) - {challenge.essenceReward} Essence
            <button onClick={() => handleApproveChallenge(challenge._id, 'approve')}>Approve</button>
            <button onClick={() => handleApproveChallenge(challenge._id, 'reject')}>Reject</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PendingChallenges;