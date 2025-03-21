import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser, setToken, setMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    console.log('Sending:', { username, password });
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      setMessage(`Registered: ${response.data.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.log('Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.error || 'Error registering');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      setUser(response.data.user);
      setToken(response.data.token);
      setMessage(`Logged in as ${response.data.user.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error logging in');
    }
  };

  return (
    <div className="split-background">
      <div className="login-container">
        <div className="typing-container">SkillQuest</div>
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
        <div className="button-group">
          <button className="register" onClick={handleRegister}>
            Register
          </button>
          <button className="login" onClick={handleLogin}>
            Login
          </button>
        </div>
        {setMessage && <p>{setMessage}</p>}
      </div>
    </div>
  );
}

export default Login;