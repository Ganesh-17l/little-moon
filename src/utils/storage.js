const STORAGE_KEY = 'little_moon_data_v1';

const initialData = {
  user: {
    name: '',
    avatar: null,
    isOnboardingComplete: false,
  },
  progress: {
    currentLevel: 1,
    completedLevels: [], // Array of level IDs
    unlockedGifts: [],   // Array of gift IDs
  },
  settings: {
    theme: 'default',
    soundEnabled: true,
  },
  // Admin configurable data
  gifts: {}, // Map of levelId -> { imageUrl, caption }
  messages: [], // Array of message objects
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

  // Helper to merge updates
  update: (updates) => {
    const current = storage.get();
    const newData = { ...current, ...updates };
    storage.save(newData);
    return newData;
  },
  
  reset: () => {
    storage.save(initialData);
    return initialData;
  }
};
