const STORAGE_KEY = 'little_moon_v2';

const initialData = {
  user: {
    name: 'Little Moon',
    isSetupComplete: true,
  },
  settings: {
    theme: 'system',
    notificationsEnabled: false,
  },
  modules: [],
};

export const storage = {
  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : initialData;
    } catch (e) {
      console.error('Error reading from storage', e);
      return initialData;
    }
  },

  save: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to storage', e);
    }
  },

  update: (updates) => {
    const current = storage.get();
    const newData = { ...current, ...updates };
    storage.save(newData);
    return newData;
  },

  reset: () => {
    storage.save(initialData);
    return initialData;
  },
};
