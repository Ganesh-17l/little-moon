import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEVELS } from '../data/levels';
import { Lock, X, Download, Share2 } from 'lucide-react';
import styles from './GiftGallery.module.css';
import dummyGift from '../assets/dummy_gift.png';
import giftImages from '../assets/gifts';

const GiftGallery = () => {
  const { state } = useApp();
  const { unlockedGifts } = state.progress;
  const [selectedGift, setSelectedGift] = useState(null);

  const getGiftImage = (id) => giftImages[id] || dummyGift;

  const handleDownload = (e, giftId) => {
      e.stopPropagation();
      const link = document.createElement('a');
      link.href = dummyGift;
      link.download = `Little-Moon-Gift-${giftId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Gift Gallery</h1>
        <p>Treasures from your journey</p>
      </header>

      <div className={styles.grid}>
        {LEVELS.map((level) => {
          const isUnlocked = unlockedGifts.includes(level.giftId);

          return (
            <div 
              key={level.id} 
              className={`${styles.card} ${!isUnlocked ? styles.locked : ''}`}
              onClick={() => isUnlocked && setSelectedGift(level)}
            >
              <div className={styles.imageWrapper}>
                {isUnlocked ? (
                  <img src={getGiftImage(level.giftId)} alt={`Gift ${level.id}`} className={styles.image} />
                ) : (
                  <div className={styles.lockPlaceholder}>
                    <Lock size={24} color="#ccc" />
                  </div>
                )}
              </div>
              <div className={styles.label}>
                {isUnlocked ? `Gift ${level.id}` : `Level ${level.id}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedGift && (
        <div className={styles.modalOverlay} onClick={() => setSelectedGift(null)}>
          <div className={`${styles.modal} animate-fade-in`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedGift(null)}>
              <X size={24} />
            </button>
            
            <img 
              src={getGiftImage(selectedGift.giftId)} 
              alt="Gift" 
              className={styles.modalImage} 
            />
            
            <div className={styles.modalContent}>
              <h2>Gift from Level {selectedGift.id}</h2>
              <p>"{selectedGift.memory}"</p>
              
              <div className={styles.actions}>
                <button className="btn-primary" onClick={(e) => handleDownload(e, selectedGift.id)}>
                  <Download size={20} /> Save
                </button>
                <button className={styles.iconBtn}>
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftGallery;
