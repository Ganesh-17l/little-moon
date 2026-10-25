import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Layers, Shield, Zap } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.container} animate-apple-in`}>
      {/* Top Editorial Header */}
      <header className={styles.topHeader}>
        <span className={styles.headerDate}>Application Hub</span>
        <h1 className={styles.mainTitle}>Little Moon</h1>
      </header>

      {/* Midnight Indigo Hero Feature Card */}
      <section className={styles.heroCard}>
        <span className={styles.heroTag}>Architecture v2.0</span>
        <h2 className={styles.heroHeadline}>Engineered for simplicity and speed.</h2>
        <p className={styles.heroDescription}>
          Zero extraneous scripts, clean typography, and a self-contained offline architecture built to last.
        </p>
        <button className={styles.heroButton} onClick={() => navigate('/explore')}>
          <span>Explore Modules</span>
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </section>

      {/* Grouped Capabilities List */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>System Specifications</span>
        <div className={styles.groupContainer}>
          <div className={styles.itemRow}>
            <div className={styles.itemLeft}>
              <Shield size={20} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>Pure Offline Engine</div>
                <div className={styles.itemSubtitle}>Local standalone APK asset packaging</div>
              </div>
            </div>
            <span className={styles.badgeActive}>Ready</span>
          </div>

          <div className={styles.itemRow}>
            <div className={styles.itemLeft}>
              <Zap size={20} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>Progressive Web App</div>
                <div className={styles.itemSubtitle}>Pre-cached background service worker</div>
              </div>
            </div>
            <span className={styles.badgeActive}>v2.0</span>
          </div>

          <div
            className={styles.itemRow}
            onClick={() => navigate('/settings')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.itemLeft}>
              <Layers size={20} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>System Configuration</div>
                <div className={styles.itemSubtitle}>Storage, build runtime, and diagnostics</div>
              </div>
            </div>
            <ChevronRight size={18} color="rgba(40, 43, 74, 0.4)" strokeWidth={2} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
