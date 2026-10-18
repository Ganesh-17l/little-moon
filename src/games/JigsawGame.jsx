import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import styles from './JigsawGame.module.css';

const JigsawGame = ({ onComplete }) => {
  // Simple 2x2 puzzle
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // 0,1,2,3 are correct positions
    const initial = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    setPieces(initial);
  }, []);

  const handlePieceClick = (index) => {
    if (selected === null) {
      playSound('tap');
      setSelected(index);
    } else {
      // Swap
      playSound('slide');
      const newPieces = [...pieces];
      const temp = newPieces[index];
      newPieces[index] = newPieces[selected];
      newPieces[selected] = temp;
      setPieces(newPieces);
      setSelected(null);

      // Check win
      if (newPieces.every((val, i) => val === i)) {
        playSound('win');
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tap two pieces to swap!</h2>
      <div className={styles.grid}>
        {pieces.map((val, index) => (
          <div 
            key={index}
            className={`${styles.piece} ${selected === index ? styles.selected : ''}`}
            onClick={() => handlePieceClick(index)}
          >
            {/* Using a placeholder colored grid for now */}
            <div className={`${styles.content} ${styles['p' + val]}`}>
              {/* In real app, use background-position with an image */}
              {val + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JigsawGame;
