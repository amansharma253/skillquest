import React from 'react';
import './Profile.css'; // Add custom styles for profile

function Profile({ user }) {
  return (
    <div className="profile-container">
      <h2>{user.username}'s Profile</h2>
      <p>Rank: {user.rank}</p>
      <p>Essence: {user.essence}</p>
      <h3>Achievements</h3>
      <ul className="achievements-list">
        {user.achievements.map((achievement) => (
          <li key={achievement._id} className="achievement-badge">
            <strong>{achievement.name}</strong>: {achievement.description} (+{achievement.essenceReward} Essence)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;