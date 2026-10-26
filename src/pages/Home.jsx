import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CompanionCard from '../components/Companion3D/CompanionCard';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, profile, role } = useAuth();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Sister';
  const roleName = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Sister';

  return (
    <div className={`${styles.container} animate-apple-in`}>
      {/* Top Editorial Header */}
      <header className={styles.topHeader}>
        <span className={styles.headerDate}>Little Moon Companion</span>
        <h1 className={styles.mainTitle}>Hi, {displayName}</h1>
      </header>

      {/* 3D AI Brother Companion Character Card */}
      <CompanionCard sisterName={displayName} />

      {/* Quick Navigation Rows */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>Companion Studio & Preferences</span>
        <div className={styles.groupContainer}>
          <div
            className={styles.itemRow}
            onClick={() => navigate('/explore')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.itemLeft}>
              <Sparkles size={20} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>3D Companion Studio</div>
                <div className={styles.itemSubtitle}>Test 16 eye expressions & 12 animation clips</div>
              </div>
            </div>
            <ChevronRight size={18} color="rgba(40, 43, 74, 0.4)" strokeWidth={2} />
          </div>

          <div
            className={styles.itemRow}
            onClick={() => navigate('/settings')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.itemLeft}>
              <Sliders size={20} color="#282B4A" strokeWidth={1.8} />
              <div>
                <div className={styles.itemTitle}>Account & Preferences</div>
                <div className={styles.itemSubtitle}>{roleName} account • Cloud sync enabled</div>
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
