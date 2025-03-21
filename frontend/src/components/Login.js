import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser, setToken, setMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      setMessage(`Registered successfully as: ${response.data.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred during registration.';
      setMessage(errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      setUser(response.data.user);
      setToken(response.data.token);
      setMessage(`Logged in successfully as: ${response.data.user.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred during login.';
      setMessage(errorMessage);
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
      </div>
    </div>
  );
}

export default Login;