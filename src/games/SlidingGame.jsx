import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import { Lightbulb, RotateCcw } from 'lucide-react';
import styles from './SlidingGame.module.css';

const SlidingGame = ({ onComplete }) => {
  // 3x3 grid, 0-8, 8 is empty
  const [tiles, setTiles] = useState([]);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    // Fixed solvable state (5 steps from solution)
    // 1 _ 2
    // 4 6 3
    // 7 5 8
    setTiles([0, 8, 1, 3, 5, 2, 6, 4, 7]);
  }, []);

  const handleTileClick = (index) => {
    const emptyIndex = tiles.indexOf(8);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check adjacency
    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
      playSound('slide');
      const newTiles = [...tiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = 8;
      setTiles(newTiles);

      // Check win
      if (newTiles.every((val, i) => val === i)) {
        playSound('win');
        setTimeout(onComplete, 500);
      }
    } else {
      playSound('error');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order the numbers!</h2>
      <div className={styles.grid}>
        {tiles.map((val, index) => (
          <div
            key={index}
            className={`${styles.tile} ${val === 8 ? styles.empty : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {val !== 8 ? val + 1 : ''}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.hintBtn}
          onClick={() => setShowHint(!showHint)}
        >
          <Lightbulb size={20} />
          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
        <button 
          className={styles.hintBtn}
          onClick={() => setTiles([0, 8, 1, 3, 5, 2, 6, 4, 7])}
          title="Reset Puzzle"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {showHint && (
        <div className={styles.hintContainer}>
          <p className={styles.hintText}>
            <strong>Solution Steps:</strong>
          </p>
          <ol className={styles.solutionList}>
            <li>Tap <strong>2</strong> (moves Left)</li>
            <li>Tap <strong>3</strong> (moves Up)</li>
            <li>Tap <strong>6</strong> (moves Right)</li>
            <li>Tap <strong>5</strong> (moves Up)</li>
            <li>Tap <strong>8</strong> (moves Left)</li>
          </ol>
          <p className={styles.hintNote}>
            <em>Note: Try it when you find difficulties, better try yourself first!</em>
          </p>
        </div>
      )}
    </div>
  );
};

export default SlidingGame;
