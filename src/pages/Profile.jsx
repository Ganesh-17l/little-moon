import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Volume2, VolumeX, Heart, LogOut } from 'lucide-react';
import styles from './Profile.module.css';

const AVATARS = [
  '👧', '👩', '👱‍♀️', '👩‍🦰', '👩‍🦱', '🧚‍♀️'
];

const Profile = () => {
  const { state, updateUser, updateSettings, resetProgress } = useApp();
  const { user, settings } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [tapCount, setTapCount] = useState(0);

  const handleSave = () => {
    updateUser({ name: newName });
    setIsEditing(false);
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount === 5) {
      alert("Admin Mode Unlocked! (Feature coming soon)");
      setTapCount(0);
    }
  };

  const handleReset = () => {
      if(confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
          resetProgress();
          window.location.reload();
      }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Profile</h1>
      </header>

      <div className={styles.card}>
        <div className={styles.avatarSection} onClick={handleLogoTap}>
          <div className={styles.avatar}>{user.avatar}</div>
          {isEditing ? (
            <input 
              className={styles.input}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          ) : (
            <h2>{user.name}</h2>
          )}
        </div>

        {isEditing ? (
          <div className={styles.editActions}>
            <button className="btn-primary" onClick={handleSave}>Save</button>
            <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className={styles.section}>
        <h3>Settings</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingLabel}>
            {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>Sound Effects</span>
          </div>
          <button 
            className={`${styles.toggle} ${settings.soundEnabled ? styles.active : ''}`}
            onClick={toggleSound}
          >
            <div className={styles.thumb} />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>About</h3>
        <div className={styles.aboutCard}>
          <p>Made with <Heart size={12} fill="#FF7675" color="#FF7675" /> by Your Brother</p>
          <p className={styles.version}>Version 1.0.0</p>
        </div>
      </div>

      <button className={styles.resetBtn} onClick={handleReset}>
          <LogOut size={16} /> Reset App Data
      </button>
    </div>
  );
};

export default Profile;
