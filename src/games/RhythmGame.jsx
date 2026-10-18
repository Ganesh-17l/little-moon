import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import { Heart } from 'lucide-react';
import styles from './RhythmGame.module.css';

const RhythmGame = ({ onComplete }) => {
  const [beat, setBeat] = useState(0);
  const [score, setScore] = useState(0);
  const TARGET = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat(b => (b + 1) % 4); // 4 beat cycle
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    // Ideally tap when beat is 0 (visual indicator aligns)
    // For simplicity, we just count taps and animate
    playSound('tap');
    setScore(s => {
      const newScore = s + 1;
      if (newScore >= TARGET) {
          playSound('win');
          setTimeout(onComplete, 200);
      }
      return newScore;
    });
  };

  return (
    <div className={styles.container} onClick={handleTap}>
      <h2 className={styles.instruction}>Tap to the beat!</h2>
      
      <div className={styles.visualizer}>
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`${styles.bar} ${beat === i ? styles.active : ''}`}
          />
        ))}
      </div>

      <div className={styles.target}>
        <Heart 
          size={beat === 0 ? 64 : 48} 
          color={beat === 0 ? "#FF7675" : "#ccc"} 
          fill={beat === 0 ? "#FF7675" : "none"}
          className={styles.heart}
        />
      </div>

      <p className={styles.score}>{score} / {TARGET}</p>
    </div>
  );
};

export default RhythmGame;
