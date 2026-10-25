import React from 'react';
import { Smartphone, WifiOff, RefreshCw, Trash2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import styles from './Settings.module.css';

const Settings = () => {
  const { resetState } = useApp();

  const handleClearCache = () => {
    if (window.confirm('Reset all local storage data?')) {
      resetState();
      window.location.reload();
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>System configuration & build details.</p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Build & Architecture</div>
        
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <Smartphone size={20} color="#8B5CF6" />
            <div>
              <div className={styles.rowLabel}>APK Mode</div>
              <div className={styles.rowValue}>Pure Offline / Self-Contained</div>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>ACTIVE</span>
        </div>

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <WifiOff size={20} color="#06B6D4" />
            <div>
              <div className={styles.rowLabel}>PWA Service Worker</div>
              <div className={styles.rowValue}>Version 2.0.0 (Pre-caching enabled)</div>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>READY</span>
        </div>

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <Info size={20} color="#EC4899" />
            <div>
              <div className={styles.rowLabel}>App Version</div>
              <div className={styles.rowValue}>2.0.0-clean</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Storage</div>
        <button
          className={styles.row}
          onClick={handleClearCache}
          style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className={styles.rowLeft}>
            <Trash2 size={20} color="#EF4444" />
            <div>
              <div className={styles.rowLabel} style={{ color: '#EF4444' }}>Reset Local Storage</div>
              <div className={styles.rowValue}>Clear saved client preferences</div>
            </div>
          </div>
          <RefreshCw size={16} color="var(--color-text-secondary)" />
        </button>
      </section>
    </div>
  );
};

export default Settings;
