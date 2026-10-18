import React, { useState, useEffect } from 'react';
import { Heart, Skull } from 'lucide-react';
import { playSound } from '../utils/sound';
import styles from './QuickTapGame.module.css';

const QuickTapGame = ({ onComplete }) => {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const TARGET = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length < 4) { // Fewer items at once to avoid chaos
        const id = Date.now();
        const type = Math.random() > 0.3 ? 'heart' : 'skull';
        const x = Math.random() * 70 + 10;
        const y = Math.random() * 70 + 10;
        setItems(prev => [...prev, { id, type, x, y }]);
        
        // Auto remove after 2.5s (slower)
        setTimeout(() => {
          setItems(prev => prev.filter(i => i.id !== id));
        }, 2500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [items.length]);

  const handleTap = (id, type) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (type === 'heart') {
      playSound('success');
      setScore(s => {
        const newScore = s + 1;
        if (newScore >= TARGET) {
          playSound('win');
          setTimeout(onComplete, 200);
        }
        return newScore;
      });
    } else {
      playSound('error');
      setScore(s => Math.max(0, s - 2));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.score}>Score: {score} / {TARGET}</div>
      {items.map(item => (
        <button
          key={item.id}
          className={styles.item}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          onMouseDown={() => handleTap(item.id, item.type)}
          onTouchStart={(e) => { e.preventDefault(); handleTap(item.id, item.type); }}
        >
          {item.type === 'heart' ? (
            <Heart fill="#FF7675" color="#FF7675" size={60} /> // Bigger icon
          ) : (
            <Skull fill="#636E72" color="#2D3436" size={60} />
          )}
        </button>
      ))}
    </div>
  );
};

export default QuickTapGame;
