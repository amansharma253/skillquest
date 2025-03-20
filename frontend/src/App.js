import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      setMessage(`Registered: ${response.data.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error registering');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      setUser(response.data);
      setMessage(`Logged in as ${response.data.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error logging in');
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/challenges');
      console.log('Fetched challenges:', response.data); // Debug: log the data
      setChallenges(response.data);
    } catch (err) {
      console.error('Fetch error:', err); // Debug: log any errors
      setMessage('Error fetching challenges');
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/challenges/complete', {
        userId: user._id,
        challengeId
      });
      setUser(response.data);
      setMessage(`Completed challenge! Essence: ${response.data.essence}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error completing challenge');
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User logged in, fetching challenges'); // Debug: confirm useEffect runs
      fetchChallenges();
    }
  }, [user]);

  if (user) {
    return (
      <div className="App">
        <h1>SkillQuest</h1>
        <p>Welcome, {user.username}! Rank: {user.rank} | Essence: {user.essence}</p>
        <button onClick={() => setUser(null)}>Logout</button>
        <h2>Challenges</h2>
        <ul>
          {console.log('Rendering challenges:', challenges)} {/* Debug: log challenges state */}
          {challenges.map(challenge => (
            <li key={challenge._id}>
              {challenge.title} ({challenge.difficulty}) - {challenge.essenceReward} Essence
              {!user.completedChallenges.includes(challenge._id) && (
                <button onClick={() => handleCompleteChallenge(challenge._id)}>Complete</button>
              )}
            </li>
          ))}
        </ul>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>SkillQuest</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
}

export default App;