import React, { useState } from 'react';
import axios from 'axios';

// ChallengeForm component - form for creating new challenges
function ChallengeForm({ token, setMessage, fetchChallenges }) {
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    skill: '',
    difficulty: 'Easy',
    essenceReward: ''
  });

  // Submit new challenge to POST /api/challenges/create
  const handleCreateChallenge = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/challenges/create',
        { ...newChallenge, essenceReward: parseInt(newChallenge.essenceReward) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setNewChallenge({ title: '', description: '', skill: '', difficulty: 'Easy', essenceReward: '' });
      fetchChallenges(); // Refresh challenges after creation
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error creating challenge');
    }
  };

  return (
    <>
      <h2>Create New Challenge</h2>
      <div className="create-challenge">
        <input 
          type="text" 
          placeholder="Title" 
          value={newChallenge.title} 
          onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={newChallenge.description} 
          onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Skill" 
          value={newChallenge.skill} 
          onChange={(e) => setNewChallenge({ ...newChallenge, skill: e.target.value })} 
        />
        <select 
          value={newChallenge.difficulty} 
          onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input 
          type="number" 
          placeholder="Essence Reward" 
          value={newChallenge.essenceReward} 
          onChange={(e) => setNewChallenge({ ...newChallenge, essenceReward: e.target.value })} 
        />
        <button onClick={handleCreateChallenge}>Submit for Approval</button>
      </div>
    </>
  );
}

export default ChallengeForm;