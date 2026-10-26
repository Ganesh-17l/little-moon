import React, { useState } from 'react';
import { Smartphone, Layers, HardDrive, Trash2, User, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import styles from './Settings.module.css';

const Settings = () => {
  const { resetState } = useApp();
  const { user, profile, role, isAuthenticated, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

      {/* Account & Security Group */}
      <section className={styles.group}>
        <span className={styles.groupCaption}>Account & Identity</span>
        <div className={styles.groupedList}>
          {isAuthenticated ? (
            <>
              <div className={styles.itemRow}>
                <div className={styles.itemLeft}>
                  <User size={18} color="#282B4A" strokeWidth={1.8} />
                  <div>
                    <div className={styles.itemTitle}>{profile?.display_name || user?.email}</div>
                    <div className={styles.itemSubtitle}>{user?.email}</div>
                  </div>
                </div>
                <span className={styles.badgeRole}>
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Authenticated'}
                </span>
              </div>
              <button
                type="button"
                className={styles.actionRowButton}
                onClick={signOut}
              >
                <div className={styles.itemLeft}>
                  <LogOut size={18} color="#282B4A" strokeWidth={1.8} />
                  <div>
                    <div className={styles.itemTitle}>Sign Out</div>
                    <div className={styles.itemSubtitle}>End active session on this device</div>
                  </div>
                </div>
                <ChevronRight size={16} color="rgba(40, 43, 74, 0.4)" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.actionRowButton}
              onClick={() => setIsAuthOpen(true)}
            >
              <div className={styles.itemLeft}>
                <User size={18} color="#282B4A" strokeWidth={1.8} />
                <div>
                  <div className={styles.itemTitle}>Sign In to Account</div>
                  <div className={styles.itemSubtitle}>Connect to cloud sync, chat, and AI companion</div>
                </div>
              </div>
              <ChevronRight size={16} color="rgba(40, 43, 74, 0.4)" />
            </button>
          )}
        </div>
      </section>

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

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Settings;
