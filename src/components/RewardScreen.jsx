import React from 'react';
import { Gift, ArrowRight, Download } from 'lucide-react';
import styles from './RewardScreen.module.css';
import dummyGift from '../assets/dummy_gift.png';
import giftImages from '../assets/gifts';

const RewardScreen = ({ level, onContinue }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = giftImages[level.id] || dummyGift;
    link.download = `Little-Moon-Gift-${level.id}.${(giftImages[level.id] || dummyGift).split('.').pop()}`; // Simple extension guess or default
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} animate-fade-in`}>
        <div className={styles.confetti}>🎉</div>
        
        <h1 className={styles.title}>Level {level.id} Complete!</h1>
        <p className={styles.memory}>"{level.memory}"</p>

        <div className={styles.giftBox}>
          <div className={styles.giftIcon}>
            {giftImages[level.id] ? (
              <img src={giftImages[level.id]} alt={`Gift ${level.id}`} style={{ width: 64, height: 64, objectFit: 'contain' }} />
            ) : (
              <Gift size={48} color="var(--color-white)" />
            )}
          </div>
          <p>You unlocked a new gift!</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.secondaryBtn} onClick={handleDownload}>
            <Download size={20} />
            Save Gift
          </button>
          
          <button className="btn-primary" onClick={onContinue}>
            Continue
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardScreen;
