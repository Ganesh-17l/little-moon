import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import styles from './BubblesGame.module.css';

const BubblesGame = ({ onComplete }) => {
  const [bubbles, setBubbles] = useState([]);
  const [popped, setPopped] = useState(0);
  const TARGET = 15;

  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 8) {
        const id = Date.now() + Math.random();
        const left = Math.random() * 70 + 10;
        const size = Math.random() * 40 + 50; // Bigger bubbles (50-90px)
        setBubbles(prev => [...prev, { id, left, size, bottom: -20 }]);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [bubbles.length]);

  useEffect(() => {
    const loop = setInterval(() => {
      setBubbles(prev => 
        prev.map(b => ({ ...b, bottom: b.bottom + 0.5 })) // Slower
            .filter(b => b.bottom < 120)
      );
    }, 16);
    return () => clearInterval(loop);
  }, []);

  const pop = (id) => {
    playSound('pop');
    setBubbles(prev => prev.filter(b => b.id !== id));
    setPopped(p => {
      const newCount = p + 1;
      if (newCount >= TARGET) {
        playSound('win');
        setTimeout(onComplete, 500);
      }
      return newCount;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.score}>{popped} / {TARGET}</div>
      {bubbles.map(b => (
        <div
          key={b.id}
          className={styles.bubble}
          style={{ 
            left: `${b.left}%`, 
            bottom: `${b.bottom}%`,
            width: b.size, 
            height: b.size 
          }}
          onMouseDown={() => pop(b.id)} // Mouse
          onTouchStart={(e) => { e.preventDefault(); pop(b.id); }} // Touch
        />
      ))}
    </div>
  );
};

export default BubblesGame;
