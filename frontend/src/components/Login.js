import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser, setToken, setMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://skillquest-ah5g.onrender.com'}/api/users/register`,
        { username, password }
      );
      setMessage(`Registered successfully as: ${response.data.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred during registration.';
      setMessage(errorMessage);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://skillquest-ah5g.onrender.com'}/api/users/login`,
        { username, password }
      );
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
        <form onSubmit={handleLogin}>
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
            autocomplete="current-password" // Added to fix DOM warning
          />
          <div className="button-group">
            <button type="button" className="register" onClick={handleRegister}>
              Register
            </button>
            <button type="submit" className="login">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;