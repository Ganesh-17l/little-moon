import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sound';
import styles from './StackerGame.module.css';

const StackerGame = ({ onComplete }) => {
  const [stack, setStack] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({
    width: 200,
    x: 50,
    direction: 1
  });
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef();
  const speedRef = useRef(3);

  const GAME_WIDTH = 300;
  const BLOCK_HEIGHT = 30;
  const WIN_LEVEL = 10;

  useEffect(() => {
    if (gameOver || level >= WIN_LEVEL) return;

    const animate = () => {
      setCurrentBlock(prev => {
        let newX = prev.x + prev.direction * speedRef.current;
        let newDirection = prev.direction;

        if (newX <= 0) {
          newX = 0;
          newDirection = 1;
        } else if (newX + prev.width >= GAME_WIDTH) {
          newX = GAME_WIDTH - prev.width;
          newDirection = -1;
        }

        return { ...prev, x: newX, direction: newDirection };
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [level, gameOver]);

  const handleTap = () => {
    if (gameOver) {
      resetGame();
      return;
    }

    cancelAnimationFrame(requestRef.current);
    playSound('tap');

    const prevBlock = stack[stack.length - 1];
    let newWidth = currentBlock.width;
    let newX = currentBlock.x;

    if (prevBlock) {
      const overlap = 
        Math.min(currentBlock.x + currentBlock.width, prevBlock.x + prevBlock.width) -
        Math.max(currentBlock.x, prevBlock.x);

      if (overlap <= 0) {
        endGame();
        return;
      }

      newWidth = overlap;
      newX = Math.max(currentBlock.x, prevBlock.x);
    }

    const newStackBlock = {
      width: newWidth,
      x: newX,
      level: level
    };

    setStack(prev => [...prev, newStackBlock]);
    
    if (level + 1 >= WIN_LEVEL) {
      playSound('win');
      setTimeout(onComplete, 1000);
    } else {
      setLevel(l => l + 1);
      setCurrentBlock({
        width: newWidth,
        x: 0,
        direction: 1
      });
      speedRef.current += 0.5;
    }
  };

  const endGame = () => {
    setGameOver(true);
    playSound('error');
  };

  const resetGame = () => {
    setStack([]);
    setCurrentBlock({ width: 200, x: 50, direction: 1 });
    setLevel(0);
    setGameOver(false);
    speedRef.current = 3;
  };

  return (
    <div className={styles.container} onClick={handleTap}>
      <h2 className={styles.title}>Stack High!</h2>
      <div className={styles.score}>{level} / {WIN_LEVEL}</div>
      
      <div className={styles.gameArea}>
        {stack.map((block, i) => (
          <div
            key={i}
            className={styles.block}
            style={{
              width: block.width,
              left: block.x,
              bottom: i * BLOCK_HEIGHT
            }}
          />
        ))}
        
        {!gameOver && level < WIN_LEVEL && (
          <div
            className={`${styles.block} ${styles.currentBlock}`}
            style={{
              width: currentBlock.width,
              left: currentBlock.x,
              bottom: level * BLOCK_HEIGHT
            }}
          />
        )}
      </div>

      {gameOver && (
        <div className={styles.message}>
          Tap to Retry
        </div>
      )}
    </div>
  );
};

export default StackerGame;
