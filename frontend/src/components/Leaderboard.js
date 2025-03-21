import React from 'react';

// Leaderboard component - displays top 5 users by essence
function Leaderboard({ leaderboard }) {
  return (
    <>
      <h2>Leaderboard</h2>
      <ul className="leaderboard">
        {leaderboard.map((player, index) => (
          <li key={player._id} className={index === 0 ? 'top' : ''}>
            {index + 1}. {player.username} - {player.essence} Essence ({player.rank})
          </li>
        ))}
      </ul>
    </>
  );
}

export default Leaderboard;