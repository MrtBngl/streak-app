import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WEEKLY_TASKS: '@streaklife_weekly_tasks',
  STATS: '@streaklife_stats',
};

export const StorageService = {
  async saveWeeklyTasks(weeklyTasks) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_TASKS, JSON.stringify(weeklyTasks));
    } catch (error) {
      console.error('Error saving weekly tasks:', error);
    }
  },

  async getWeeklyTasks() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_TASKS);
      return data ? JSON.parse(data) : {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
      };
    } catch (error) {
      return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    }
  },

  async saveStats(stats) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  },

  async getStats() {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      return stats ? JSON.parse(stats) : {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalTasksCompleted: 0,
        dailyCompletions: {},
        level: 1,
        lastLoginDate: null,
        streakFreezes: 0,
        doublePointsActive: false,
        currentAvatar: 'default',
        currentTheme: 'default',
        purchasedItems: [],
        unlockedAchievements: [],
      };
    } catch (error) {
      return {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalTasksCompleted: 0,
        dailyCompletions: {},
        level: 1,
        lastLoginDate: null,
        streakFreezes: 0,
        doublePointsActive: false,
        currentAvatar: 'default',
        currentTheme: 'default',
        purchasedItems: [],
        unlockedAchievements: [],
      };
    }
  },
};