import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(storage.get());

  // Persist state changes to storage
  useEffect(() => {
    storage.save(state);
  }, [state]);

  const updateUser = (userData) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...userData }
    }));
  };

  const completeLevel = (levelId) => {
    setState(prev => {
      const completedLevels = new Set([...prev.progress.completedLevels, levelId]);
      const nextLevel = Math.max(prev.progress.currentLevel, levelId + 1);
      
      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedLevels: Array.from(completedLevels),
          currentLevel: Math.min(nextLevel, 18) // Cap at 18
        }
      };
    });
  };

  const unlockGift = (giftId) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        unlockedGifts: [...new Set([...prev.progress.unlockedGifts, giftId])]
      }
    }));
  };

  const updateSettings = (settingsData) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settingsData }
    }));
  };

  const resetProgress = () => {
      setState(storage.reset());
  }

  const value = {
    state,
    updateUser,
    completeLevel,
    unlockGift,
    updateSettings,
    resetProgress
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
