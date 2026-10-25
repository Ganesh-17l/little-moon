import React from 'react';
import { Compass, Sparkles, PlusCircle } from 'lucide-react';
import styles from './Explore.module.css';

const Explore = () => {
  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore Canvas</h1>
        <p className={styles.subtitle}>A clean, modular foundation ready for your new features.</p>
      </header>

      <div className={styles.placeholderCard}>
        <div className={styles.iconCircle}>
          <Compass size={28} />
        </div>
        <div className={styles.cardTitle}>Ready for New Modules</div>
        <p className={styles.cardText}>
          The old birthday games and assets have been wiped clean. Your workspace is fresh, lightweight, and ready for whatever you build next.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ color: '#EC4899' }}>
          <Sparkles size={24} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>Custom Logo Ready</div>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Upload your new logo assets to <code>assets/icon.png</code> and <code>public/</code> when you are ready.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
