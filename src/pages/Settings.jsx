import React from 'react';
import { Smartphone, Layers, HardDrive, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import styles from './Settings.module.css';

const Settings = () => {
  const { resetState } = useApp();

  const handleClearCache = () => {
    if (window.confirm('Reset all local storage data to defaults?')) {
      resetState();
      window.location.reload();
    }
  };

  return (
    <div className={`${styles.container} animate-apple-in`}>
      <header className={styles.topHeader}>
        <span className={styles.headerDate}>Preferences</span>
        <h1 className={styles.mainTitle}>Settings</h1>
      </header>

      {/* Build Environment Group */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>Deployment & Architecture</span>
        <div className={styles.groupedList}>
          <div className={styles.itemRow}>
            <div className={styles.itemLeft}>
              <Smartphone size={18} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>Capacitor Android APK</div>
                <div className={styles.itemSubtitle}>Standalone offline packaging</div>
              </div>
            </div>
            <span className={styles.badgeSuccess}>Enabled</span>
          </div>

          <div className={styles.itemRow}>
            <div className={styles.itemLeft}>
              <Layers size={18} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>Progressive Web App</div>
                <div className={styles.itemSubtitle}>Service Worker cache engine</div>
              </div>
            </div>
            <span className={styles.badgeSuccess}>v2.0.0</span>
          </div>

          <div className={styles.itemRow}>
            <div className={styles.itemLeft}>
              <HardDrive size={18} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>Asset Scope</div>
                <div className={styles.itemSubtitle}>Local dist bundle directory</div>
              </div>
            </div>
            <span className={styles.itemValue}>Relative (./)</span>
          </div>
        </div>
      </section>

      {/* Storage Management Group */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>Data Management</span>
        <div className={styles.groupedList}>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={handleClearCache}
          >
            <div className={styles.itemLeft}>
              <Trash2 size={18} color="#DC2626" strokeWidth={1.8} />
              <div>
                <div className={styles.dangerTitle}>Reset Storage</div>
                <div className={styles.dangerSubtitle}>Clear local preferences and reset to defaults</div>
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
