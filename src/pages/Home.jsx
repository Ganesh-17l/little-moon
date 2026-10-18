import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import DailySurprise from '../components/DailySurprise';
import { Play, Gift, Clock } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const { user, progress } = state;

  const nextLevel = progress.currentLevel;
  const isFinished = progress.completedLevels.length >= 18;

  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.greeting}>
          <div className={styles.avatar}>{user.avatar}</div>
          <div>
            <h1>Hi, {user.name} 👋</h1>
            <p className={styles.subtitle}>Welcome to your journey</p>
          </div>
        </div>
        
        <div className={styles.progressSection}>
          <ProgressRing 
            radius={60} 
            stroke={8} 
            progress={progress.completedLevels.length} 
            total={18} 
          />
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Main CTA */}
        <div className={styles.ctaCard}>
          <h2>{isFinished ? "Journey Complete!" : `Level ${nextLevel}`}</h2>
          <p>{isFinished ? "You've unlocked everything!" : "Ready for your next adventure?"}</p>
          
          <button 
            className="btn-primary w-full"
            onClick={() => navigate('/levels')}
            style={{ marginTop: '16px' }}
          >
            {isFinished ? 'Replay Levels' : 'Continue Journey'}
            <Play size={20} fill="currentColor" />
          </button>
        </div>

        {/* Daily Surprise */}
        <DailySurprise />

        {/* Shortcuts */}
        <div className={styles.shortcuts}>
          <button 
            className={`${styles.shortcutBtn} ${isFinished ? styles.unlocked : ''}`} 
            onClick={() => {
              if (isFinished) navigate('/cake');
              else alert("Complete all 18 levels to unlock the Birthday Cake!");
            }}
            style={{ opacity: isFinished ? 1 : 0.7 }}
          >
            <div className={`${styles.iconBox} ${isFinished ? styles.gold : styles.gray}`}>
              <span style={{ fontSize: '24px' }}>{isFinished ? '🎂' : '🔒'}</span>
            </div>
            <span>{isFinished ? 'Cake' : 'Locked'}</span>
          </button>
          
          <button className={styles.shortcutBtn} onClick={() => navigate('/gallery')}>
            <div className={`${styles.iconBox} ${styles.pink}`}>
              <Gift size={24} />
            </div>
            <span>Gifts</span>
          </button>
          
          <button className={styles.shortcutBtn} onClick={() => navigate('/memories')}>
            <div className={`${styles.iconBox} ${styles.lavender}`}>
              <Clock size={24} />
            </div>
            <span>Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
