import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './ColoringGame.module.css';

const COLORS = ['#FF7675', '#74B9FF', '#55EFC4', '#FFEAA7', '#A29BFE'];

const ColoringGame = ({ onComplete }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [fills, setFills] = useState({ 0: '#fff', 1: '#fff', 2: '#fff' });

  const handleFill = (id) => {
    playSound('pop');
    setFills(prev => ({ ...prev, [id]: selectedColor }));
  };

  const handleDone = () => {
    if (Object.values(fills).some(c => c !== '#fff')) {
      playSound('win');
      onComplete();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        {/* Simple SVG Cake */}
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Base */}
          <rect 
            x="40" y="100" width="120" height="60" 
            fill={fills[0]} stroke="#333" strokeWidth="4"
            onClick={() => handleFill(0)}
          />
          {/* Top Layer */}
          <rect 
            x="50" y="60" width="100" height="40" 
            fill={fills[1]} stroke="#333" strokeWidth="4"
            onClick={() => handleFill(1)}
          />
          {/* Candle */}
          <rect 
            x="95" y="30" width="10" height="30" 
            fill={fills[2]} stroke="#333" strokeWidth="4"
            onClick={() => handleFill(2)}
          />
          <circle cx="100" cy="20" r="5" fill="#FFD700" />
        </svg>
      </div>

      <div className={styles.palette}>
        {COLORS.map(c => (
          <button
            key={c}
            className={`${styles.colorBtn} ${selectedColor === c ? styles.selected : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setSelectedColor(c)}
          />
        ))}
      </div>

      <button className="btn-primary" onClick={handleDone}>
        Done
      </button>
    </div>
  );
};

export default ColoringGame;
