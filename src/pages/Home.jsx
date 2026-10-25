import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Moon, Layers, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.logoBadge}>
          <Moon size={14} fill="currentColor" />
          <span>Little Moon v2.0</span>
        </div>
        <h1 className={styles.title}>Your Digital Universe Awaits</h1>
        <p className={styles.subtitle}>
          Clean, modern, and built from the ground up. Ready for your next big vision.
        </p>

        <div className={styles.statusRow}>
          <div className={styles.statusChip}>
            <span className={styles.statusDot} />
            <span>Standalone APK Ready</span>
          </div>
          <div className={styles.statusChip}>
            <Sparkles size={12} color="#A78BFA" />
            <span>PWA Enabled</span>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section className={styles.grid}>
        <div className={`${styles.card} ${styles.fullCard}`} onClick={() => navigate('/explore')}>
          <div className={styles.cardIcon}>
            <Layers size={22} />
          </div>
          <div className={styles.cardTitle}>Explore Modules</div>
          <div className={styles.cardDesc}>
            Discover features and new modular components ready to expand.
          </div>
          <button className="btn-primary" style={{ marginTop: '8px' }}>
            <span>Explore Canvas</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <Zap size={20} />
          </div>
          <div className={styles.cardTitle}>Ultra Fast</div>
          <div className={styles.cardDesc}>Zero bloat, instant local performance.</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.cardTitle}>Pure Offline</div>
          <div className={styles.cardDesc}>Runs natively inside your device.</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
