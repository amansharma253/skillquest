import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');

  // Socket.IO setup - connects to backend for real-time updates
  const socket = io('http://localhost:5000', { autoConnect: false });

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="App">
      <h1>SkillQuest</h1>
      {user && token ? (
        <Dashboard 
          user={user} 
          token={token} 
          socket={socket} 
          setUser={setUser} 
          setToken={setToken} 
          setMessage={setMessage} 
        />
      ) : (
        <Login 
          setUser={setUser} 
          setToken={setToken} 
          setMessage={setMessage} 
        />
      )}
      <p>{message}</p>
    </div>
  );
}

export default App;