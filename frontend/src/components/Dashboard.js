import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Leaderboard from './Leaderboard';
import ChallengeForm from './ChallengeForm';
import ChallengeList from './ChallengeList';
import PendingChallenges from './PendingChallenges';

function Dashboard({ user, token, socket, setUser, setToken, setMessage, logout }) {
  const [challenges, setChallenges] = useState([]);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Define rank thresholds
  const rankThresholds = [
    { name: 'Apprentice', minEssence: 0 },
    { name: 'Journeyman', minEssence: 50 },
    { name: 'Master', minEssence: 100 },
  ];

  useEffect(() => {
    if (user && token) {
      socket.connect();
      fetchChallenges();
      fetchLeaderboard();
      if (user.isAdmin) fetchPendingChallenges();
      socket.on('leaderboardUpdate', (updatedLeaderboard) => {
        setLeaderboard(updatedLeaderboard);
      });
    }
    return () => {
      socket.off('leaderboardUpdate');
    };
  }, [user, token, socket]);

  // Determine current rank and progress
  const currentEssence = user?.essence || 0;
  const currentRankIndex = rankThresholds.findIndex((rank) => rank.name === user.rank);
  const nextRank = rankThresholds[currentRankIndex + 1]?.name || user.rank;
  const nextThreshold = rankThresholds[currentRankIndex + 1]?.minEssence || currentEssence;
  const progressPercentage = Math.min((currentEssence / nextThreshold) * 100, 100);

  return (
    <div>
      <p>Welcome, {user.username}! Rank: {user.rank} | Essence: {user.essence}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        <span className="progress-text">
          {currentEssence}/{nextThreshold} to {nextRank}
        </span>
      </div>
      <button onClick={logout}>Logout</button>

      <Leaderboard leaderboard={leaderboard} />
      <ChallengeForm token={token} setMessage={setMessage} fetchChallenges={fetchChallenges} />
      {user.isAdmin && (
        <PendingChallenges
          token={token}
          pendingChallenges={pendingChallenges}
          setMessage={setMessage}
          fetchPendingChallenges={fetchPendingChallenges}
          fetchChallenges={fetchChallenges}
        />
      )}
      <ChallengeList
        user={user}
        token={token}
        challenges={challenges}
        setUser={setUser}
        setMessage={setMessage}
        fetchChallenges={fetchChallenges}
      />
    </div>
  );

  async function fetchChallenges() {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges');
      setChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      setMessage('Error fetching challenges');
    }
  }

  async function fetchPendingChallenges() {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch pending challenges:', err);
    }
  }

  async function fetchLeaderboard() {
    try {
      const response = await axios.get('http://localhost:5000/api/users/leaderboard');
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  }
}

export default Dashboard;