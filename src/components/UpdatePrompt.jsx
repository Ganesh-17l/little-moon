import React, { useState, useEffect } from 'react';
import { onServiceWorkerUpdate, applyUpdate } from '../utils/serviceWorkerRegistration';
import styles from './UpdatePrompt.module.css';

const UpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('little_moon_update_dismissed') === 'true';

    const unsubscribe = onServiceWorkerUpdate(({ isUpdateAvailable }) => {
      if (isUpdateAvailable && !isDismissed) {
        setShowPrompt(true);
      } else if (!isUpdateAvailable) {
        setShowPrompt(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    sessionStorage.removeItem('little_moon_update_dismissed');
    applyUpdate();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('little_moon_update_dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <aside className={styles.promptContainer} aria-label="App update notification">
      <div className={styles.promptCard} role="status" aria-live="polite">
        <div className={styles.infoSection}>
          <span className={styles.sparkleIcon} aria-hidden="true">✨</span>
          <span className={styles.titleText}>Update available</span>
        </div>
        <div className={styles.actionsSection}>
          <button
            type="button"
            className={styles.updateButton}
            onClick={handleUpdate}
            disabled={isUpdating}
            aria-label="Update to the latest version"
          >
            {isUpdating ? 'Updating…' : 'Update'}
          </button>
          <button
            type="button"
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Dismiss update notification"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UpdatePrompt;
