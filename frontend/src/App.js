import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [message, setMessage] = useState('');

  const socket = io(process.env.REACT_APP_API_URL || 'https://skillquest-ah5g.onrender.com', { autoConnect: false }); // Updated URL

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Clear the message state after 5 seconds whenever it changes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleSetToken = (tokenData) => {
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    socket.disconnect();
  };

  return (
    <div className="App">
      <h1>SkillQuest</h1>
      {user && token ? (
        <Dashboard
          user={user}
          token={token}
          socket={socket}
          setUser={handleSetUser}
          setToken={handleSetToken}
          setMessage={setMessage}
          logout={handleLogout}
        />
      ) : (
        <Login
          setUser={handleSetUser}
          setToken={handleSetToken}
          setMessage={setMessage}
        />
      )}
      <p>{message}</p>
    </div>
  );
}

export default App;