import React, { useState } from 'react';
import axios from 'axios';

// Login component - handles user registration and login
function Login({ setUser, setToken, setMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register new user via POST /api/users/register
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

  // Login existing user via POST /api/users/login
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
    <div>
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
    </div>
  );
}

export default Login;