import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LEVELS } from '../data/levels';
import { Lock, Check, Star } from 'lucide-react';
import styles from './Levels.module.css';

const Levels = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const { completedLevels, currentLevel } = state.progress;

  const handleLevelClick = (levelId) => {
    if (levelId <= currentLevel) {
      navigate(`/play/${levelId}`);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Journey</h1>
        <p>18 Years, 18 Levels</p>
      </header>

      <div className={styles.grid}>
        {LEVELS.map((level) => {
          const isCompleted = completedLevels.includes(level.id);
          const isLocked = level.id > currentLevel;
          const isCurrent = level.id === currentLevel;

          return (
            <button
              key={level.id}
              className={`
                ${styles.card} 
                ${isLocked ? styles.locked : ''} 
                ${isCurrent ? styles.current : ''}
                ${isCompleted ? styles.completed : ''}
              `}
              onClick={() => handleLevelClick(level.id)}
              disabled={isLocked}
            >
              <div className={styles.levelNum}>{level.id}</div>
              <div className={styles.levelInfo}>
                <span className={styles.year}>{level.year}</span>
                <span className={styles.title}>{level.title}</span>
              </div>
              
              <div className={styles.statusIcon}>
                {isCompleted && <Check size={20} />}
                {isLocked && <Lock size={16} />}
                {isCurrent && <Star size={20} fill="currentColor" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Levels;
