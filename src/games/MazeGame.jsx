import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import styles from './MazeGame.module.css';

const GRID_SIZE = 5;
const MAZE = [
  [0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 2, 0] // 2 is goal
];

const MazeGame = ({ onComplete }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = (dx, dy) => {
    const newX = pos.x + dx;
    const newY = pos.y + dy;

    if (
      newX >= 0 && newX < GRID_SIZE &&
      newY >= 0 && newY < GRID_SIZE &&
      MAZE[newY][newX] !== 1
    ) {
      setPos({ x: newX, y: newY });
      playSound('tap'); // Sound on move
      if (MAZE[newY][newX] === 2) {
        playSound('win');
        setTimeout(onComplete, 500);
      }
    } else {
      playSound('error'); // Sound on wall hit
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Guide the dot to the Star!</h2>
      <div className={styles.grid}>
        {MAZE.map((row, y) => (
          row.map((cell, x) => (
            <div 
              key={`${x}-${y}`} 
              className={`
                ${styles.cell} 
                ${cell === 1 ? styles.wall : ''}
                ${cell === 2 ? styles.goal : ''}
              `}
            >
              {cell === 2 && <Star size={20} fill="#FFD700" color="#FFD700" />}
              {pos.x === x && pos.y === y && <div className={styles.player} />}
            </div>
          ))
        ))}
      </div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => move(0, -1)}><ArrowUp /></button>
        <div className={styles.row}>
          <button className={styles.btn} onClick={() => move(-1, 0)}><ArrowLeft /></button>
          <button className={styles.btn} onClick={() => move(1, 0)}><ArrowRight /></button>
        </div>
        <button className={styles.btn} onClick={() => move(0, 1)}><ArrowDown /></button>
      </div>
    </div>
  );
};

export default MazeGame;
