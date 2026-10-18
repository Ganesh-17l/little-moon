import React from 'react';
import { Play } from 'lucide-react';
import styles from './LevelIntro.module.css';

const LevelIntro = ({ level, onStart }) => {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} animate-fade-in`}>
        <div className={styles.header}>
          <span className={styles.levelNum}>Level {level.id}</span>
          <h1>{level.title}</h1>
        </div>
        
        <div className={styles.content}>
          <p className={styles.year}>Year {level.year}</p>
          <p className={styles.description}>{level.description}</p>
        </div>

        <button className="btn-primary" onClick={onStart}>
          Start Level
          <Play size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default LevelIntro;
