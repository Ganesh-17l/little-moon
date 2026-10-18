import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import styles from './BalloonsGame.module.css';

const BalloonsGame = ({ onComplete }) => {
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const TARGET = 5;

  useEffect(() => {
    // Spawn balloons periodically
    const interval = setInterval(() => {
      if (balloons.length < 5) {
        const id = Date.now() + Math.random();
        const left = Math.random() * 70 + 10; // Keep away from edges
        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        setBalloons(prev => [...prev, { id, left, color, bottom: -20 }]);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [balloons.length]);

  useEffect(() => {
    // Float up loop
    const loop = setInterval(() => {
      setBalloons(prev => 
        prev.map(b => ({ ...b, bottom: b.bottom + 0.8 })) // Slower speed for easier touch
            .filter(b => b.bottom < 120)
      );
    }, 16);
    return () => clearInterval(loop);
  }, []);

  const popBalloon = (id) => {
    playSound('pop');
    setBalloons(prev => prev.filter(b => b.id !== id));
    setPoppedCount(prev => {
      const newCount = prev + 1;
      if (newCount === TARGET) {
        playSound('win');
        setTimeout(onComplete, 500);
      }
      return newCount;
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.counter}>Popped: {poppedCount} / {TARGET}</h2>
      {balloons.map(b => (
        <div
          key={b.id}
          className={styles.balloonWrapper}
          style={{ left: `${b.left}%`, bottom: `${b.bottom}%` }}
          onClick={() => popBalloon(b.id)}
          onTouchStart={(e) => { e.preventDefault(); popBalloon(b.id); }} // Instant touch response
        >
          <div className={styles.balloon} style={{ backgroundColor: b.color }} />
          <div className={styles.string} />
        </div>
      ))}
    </div>
  );
};

export default BalloonsGame;
