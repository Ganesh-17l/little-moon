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
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...userData },
    }));
  };

  const updateSettings = (settingsData) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settingsData },
    }));
  };

  const resetState = () => {
    setState(storage.reset());
  };

  const value = {
    state,
    updateUser,
    updateSettings,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
