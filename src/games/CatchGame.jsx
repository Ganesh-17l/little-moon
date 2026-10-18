import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sound';
import { Gift, Bomb } from 'lucide-react';
import styles from './CatchGame.module.css';

const CatchGame = ({ onComplete }) => {
  const [basketLeft, setBasketLeft] = useState(50);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const gameRef = useRef(null);
  const TARGET_SCORE = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      if (score < TARGET_SCORE) {
        setItems(prev => [
          ...prev,
          {
            id: Date.now(),
            left: Math.random() * 90,
            top: -10,
            type: Math.random() > 0.8 ? 'bomb' : 'gift' // 20% chance of bomb
          }
        ]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [score]);

  useEffect(() => {
    const loop = setInterval(() => {
      setItems(prev => {
        return prev.map(item => ({ ...item, top: item.top + 2 }))
          .filter(item => {
            // Check collision
            if (item.top > 85 && item.top < 95) {
              if (Math.abs(item.left - basketLeft) < 15) {
                if (item.type === 'gift') {
                  playSound('success');
                  setScore(s => {
                    const newScore = s + 1;
                    if (newScore >= TARGET_SCORE) {
                        playSound('win');
                        setTimeout(onComplete, 100);
                    }
                    return newScore;
                  });
                } else {
                  playSound('error');
                  setScore(s => Math.max(0, s - 2)); // Penalty
                }
                return false; // Remove item
              }
            }
            return item.top < 100;
          });
      });
    }, 20);
    return () => clearInterval(loop);
  }, [basketLeft]);

  const handleMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setBasketLeft(Math.max(0, Math.min(90, x - 5))); // Center basket
  };

  return (
    <div 
      className={styles.container} 
      ref={gameRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className={styles.score}>Score: {score} / {TARGET_SCORE}</div>
      
      {items.map(item => (
        <div 
          key={item.id}
          className={styles.item}
          style={{ left: `${item.left}%`, top: `${item.top}%` }}
        >
          {item.type === 'gift' ? <Gift color="#FF7675" /> : <Bomb color="#2D3436" />}
        </div>
      ))}

      <div 
        className={styles.basket}
        style={{ left: `${basketLeft}%` }}
      >
        🧺
      </div>
    </div>
  );
};

export default CatchGame;
