import React, { useState } from 'react';
import { playSound } from '../utils/sound';
import styles from './DifferenceGame.module.css';

const DifferenceGame = ({ onComplete }) => {
  const [found, setFound] = useState([]);
  
  // Coordinates of differences (percentages)
  const DIFFS = [
    { id: 1, x: 20, y: 30 },
    { id: 2, x: 60, y: 50 },
    { id: 3, x: 80, y: 20 }
  ];

  const handleTap = (id) => {
    if (!found.includes(id)) {
      playSound('success');
      const newFound = [...found, id];
      setFound(newFound);
      if (newFound.length === DIFFS.length) {
        playSound('win');
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Find 3 Differences</h2>
      
      {/* Image 1 (Original) */}
      <div className={styles.imageContainer}>
        <div className={styles.placeholder}>
           Original
           <div className={styles.shape1} />
           <div className={styles.shape2} />
           <div className={styles.shape3} />
        </div>
      </div>

      {/* Image 2 (With Differences) */}
      <div className={styles.imageContainer}>
        <div className={styles.placeholder}>
           Modified
           {/* Missing shape 1 */}
           <div className={`${styles.shape2} ${styles.diffColor}`} /> {/* Color change */}
           <div className={`${styles.shape3} ${styles.diffPos}`} /> {/* Position change */}
           
           {/* Invisible click targets for differences */}
           {DIFFS.map(d => (
             <div
               key={d.id}
               className={`${styles.target} ${found.includes(d.id) ? styles.found : ''}`}
               style={{ left: `${d.x}%`, top: `${d.y}%` }}
               onClick={() => handleTap(d.id)}
             />
           ))}
        </div>
      </div>
      
      <p>Found: {found.length} / 3</p>
    </div>
  );
};

export default DifferenceGame;
