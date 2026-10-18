import React from 'react';

const PlaceholderGame = ({ onComplete }) => {
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      <h2>Tap to Win!</h2>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        This is a placeholder for a future mini-game.
      </p>
      <button 
        className="btn-primary"
        onClick={onComplete}
      >
        Complete Level
      </button>
    </div>
  );
};

export default PlaceholderGame;
