import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import
import Leaderboard from './Leaderboard';
import ChallengeForm from './ChallengeForm';
import ChallengeList from './ChallengeList';
import PendingChallenges from './PendingChallenges';

// Dashboard component - orchestrates logged-in user interface
function Dashboard({ user, token, socket, setUser, setToken, setMessage }) {
  const [challenges, setChallenges] = useState([]);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch data on mount and setup socket listener
  useEffect(() => {
    if (user && token) {
      socket.connect();
      fetchChallenges();
      fetchLeaderboard();
      if (user.isAdmin) fetchPendingChallenges(); // Use isAdmin field
      socket.on('leaderboardUpdate', (updatedLeaderboard) => {
        setLeaderboard(updatedLeaderboard);
      });
    }
    return () => {
      socket.off('leaderboardUpdate');
    };
  }, [user, token, socket]);

  // Progress bar calculations
  const rankThresholds = { Apprentice: 0, Journeyman: 50, Master: 100 };
  const currentEssence = user?.essence || 0;
  const currentRank = user?.rank || 'Apprentice';
  const nextRank = currentRank === 'Apprentice' ? 'Journeyman' : currentRank === 'Journeyman' ? 'Master' : 'Master';
  const nextThreshold = rankThresholds[nextRank];
  const progressPercentage = Math.min((currentEssence / nextThreshold) * 100, 100);

  return (
    <div>
      <p>Welcome, {user.username}! Rank: {user.rank} | Essence: {user.essence}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        <span className="progress-text">{currentEssence}/{nextThreshold} to {nextRank}</span>
      </div>
      <button onClick={() => { setUser(null); setToken(null); socket.disconnect(); }}>Logout</button>

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

  // Fetch approved challenges from GET /api/challenges
  async function fetchChallenges() {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges');
      setChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      setMessage('Error fetching challenges');
    }
  }

  // Fetch pending challenges from GET /api/challenges/pending (admin only)
  async function fetchPendingChallenges() {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingChallenges(response.data);
    } catch (err) {
      console.error('Failed to fetch pending challenges:', err);
    }
  }

  // Fetch leaderboard from GET /api/users/leaderboard
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