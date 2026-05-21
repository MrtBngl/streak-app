import React, { createContext, useState, useEffect, useContext } from 'react';
import { StorageService } from '../utils/storage';
import * as Haptics from 'expo-haptics';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [weeklyTasks, setWeeklyTasks] = useState({
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  });

  const [stats, setStats] = useState({
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
    bonusClaimedDates: [], // ← Bonus alınan günleri takip et
  });

  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedTasks = await StorageService.getWeeklyTasks();
    const savedStats = await StorageService.getStats();
    setWeeklyTasks(savedTasks);
    setStats(savedStats);
    checkDailyLogin(savedStats);
  };

  const checkDailyLogin = (currentStats) => {
    const today = new Date().toDateString();
    const lastLogin = currentStats.lastLoginDate
      ? new Date(currentStats.lastLoginDate).toDateString()
      : null;
    if (lastLogin !== today) {
      calculateStreak(currentStats);
      resetDailyTasksOnNewDay();
    }
  };

  const calculateStreak = (currentStats) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const yesterdayData = currentStats.dailyCompletions[yesterdayStr];

    let newStreak = currentStats.currentStreak;

    if (yesterdayData && yesterdayData.completed > 0) {
      newStreak += 1;
    } else if (Object.keys(currentStats.dailyCompletions).length > 0) {
      if (currentStats.streakFreezes > 0) {
        const updatedStats = {
          ...currentStats,
          streakFreezes: currentStats.streakFreezes - 1,
          lastLoginDate: new Date().toISOString(),
        };
        setStats(updatedStats);
        StorageService.saveStats(updatedStats);
        return;
      }
      newStreak = 0;
    }

    const newStats = {
      ...currentStats,
      currentStreak: newStreak,
      longestStreak: Math.max(currentStats.longestStreak, newStreak),
      lastLoginDate: new Date().toISOString(),
    };
    setStats(newStats);
    StorageService.saveStats(newStats);
  };

  // Görev ekleme - 15 limit
  const addTask = async (dayId, task) => {
    const currentTasks = weeklyTasks[dayId] || [];

    // 15 görev limiti
    if (currentTasks.length >= 15) {
      return { success: false, message: 'Bir güne en fazla 15 görev eklenebilir!' };
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      points: task.points,
      category: task.category || 'custom',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedDayTasks = [...currentTasks, newTask];
    const updatedWeeklyTasks = { ...weeklyTasks, [dayId]: updatedDayTasks };
    setWeeklyTasks(updatedWeeklyTasks);
    await StorageService.saveWeeklyTasks(updatedWeeklyTasks);

    return { success: true };
  };

  const deleteTask = async (dayId, taskId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updatedDayTasks = weeklyTasks[dayId].filter(task => task.id !== taskId);
    const updatedWeeklyTasks = { ...weeklyTasks, [dayId]: updatedDayTasks };
    setWeeklyTasks(updatedWeeklyTasks);
    await StorageService.saveWeeklyTasks(updatedWeeklyTasks);
  };

  const completeTask = async (dayId, taskId) => {
    const task = weeklyTasks[dayId].find(t => t.id === taskId);
    if (!task || task.completed) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const completedAt = new Date().toISOString();
    const updatedDayTasks = weeklyTasks[dayId].map(t =>
      t.id === taskId ? { ...t, completed: true, completedAt } : t
    );
    const updatedWeeklyTasks = { ...weeklyTasks, [dayId]: updatedDayTasks };
    setWeeklyTasks(updatedWeeklyTasks);
    await StorageService.saveWeeklyTasks(updatedWeeklyTasks);

    const today = new Date().toDateString();
    const todaysTasks = updatedDayTasks;
    const totalTasks = todaysTasks.length;
    const completedTasks = todaysTasks.filter(t => t.completed).length;
    const totalPossiblePoints = todaysTasks.reduce((sum, t) => sum + t.points, 0);

    let pointsToAdd = task.points;
    if (stats.doublePointsActive) pointsToAdd *= 2;

    // BONUS: Sadece o gün ilk kez tüm görevler tamamlandığında
    let bonusAwarded = false;
    const bonusClaimedDates = stats.bonusClaimedDates || [];
    const bonusAlreadyClaimed = bonusClaimedDates.includes(today);

    if (
      completedTasks === totalTasks &&
      totalTasks > 0 &&
      !bonusAlreadyClaimed
    ) {
      const bonusPoints = Math.floor(totalPossiblePoints * 0.5);
      pointsToAdd += bonusPoints;
      bonusAwarded = true;
    }

    const newDailyCompletions = {
      ...stats.dailyCompletions,
      [today]: {
        completed: completedTasks,
        total: totalTasks,
        bonus: bonusAwarded || (stats.dailyCompletions[today]?.bonus || false),
        points: pointsToAdd,
      },
    };

    const newTotalPoints = stats.totalPoints + pointsToAdd;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;

    const newStats = {
      ...stats,
      totalPoints: newTotalPoints,
      totalTasksCompleted: stats.totalTasksCompleted + 1,
      dailyCompletions: newDailyCompletions,
      level: newLevel,
      bonusClaimedDates: bonusAwarded
        ? [...bonusClaimedDates, today]
        : bonusClaimedDates,
    };

    // Rozet kontrolü
    const finalStats = await checkAndUnlockAchievements(newStats, completedAt);
    setStats(finalStats);
    await StorageService.saveStats(finalStats);

    return { bonusAwarded, pointsToAdd, doublePoints: stats.doublePointsActive };
  };

  // Rozet sistemi - düzeltildi
  const checkAndUnlockAchievements = async (newStats, completedAt) => {
    let updatedStats = { ...newStats };
    const hour = new Date(completedAt).getHours();
    const newlyUnlocked = [];

    const tryUnlock = (id) => {
      if (!updatedStats.unlockedAchievements?.includes(id)) {
        updatedStats = {
          ...updatedStats,
          unlockedAchievements: [...(updatedStats.unlockedAchievements || []), id],
        };
        newlyUnlocked.push(id);
      }
    };

    // İlk görev
    if (newStats.totalTasksCompleted >= 1) tryUnlock('first_task');

    // 50 görev
    if (newStats.totalTasksCompleted >= 50) tryUnlock('super_active');

    // 100 görev
    if (newStats.totalTasksCompleted >= 100) tryUnlock('centurion');

    // 1000 puan
    if (newStats.totalPoints >= 1000) tryUnlock('point_collector');

    // Seviye 10
    if (newStats.level >= 10) tryUnlock('level_master');

    // Streak rozetleri
    if (newStats.currentStreak >= 7) tryUnlock('week_warrior');
    if (newStats.currentStreak >= 30) tryUnlock('month_master');

    // Mükemmel gün
    const today = new Date().toDateString();
    if (newStats.dailyCompletions[today]?.bonus) tryUnlock('perfect_day');

    // Mükemmel 5 gün serisi
    const dates = Object.keys(newStats.dailyCompletions).sort().reverse();
    let perfectStreak = 0;
    for (let date of dates) {
      if (newStats.dailyCompletions[date]?.bonus) perfectStreak++;
      else break;
    }
    if (perfectStreak >= 5) tryUnlock('perfectionist');

    // Gece kuşu
    if (hour >= 22) tryUnlock('night_owl');

    return updatedStats;
  };

  const purchaseItem = async (item) => {
    if (stats.totalPoints < item.price) {
      return { success: false, message: 'Yetersiz puan! 💸' };
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    let updatedStats = {
      ...stats,
      totalPoints: stats.totalPoints - item.price,
      purchasedItems: [...(stats.purchasedItems || []), item.id],
    };

    if (item.id === 'streak_freeze') {
      updatedStats.streakFreezes = (updatedStats.streakFreezes || 0) + 1;
    } else if (item.id === 'streak_freeze_3') {
      updatedStats.streakFreezes = (updatedStats.streakFreezes || 0) + 3;
    } else if (item.id === 'double_points') {
      updatedStats.doublePointsActive = true;
    } else if (item.id === 'triple_points') {
      updatedStats.triplePointsActive = true;
    } else if (item.type === 'theme') {
      updatedStats.currentTheme = item.id;
    }

    setStats(updatedStats);
    await StorageService.saveStats(updatedStats);
    return { success: true, message: `${item.name} satın alındı! 🎉` };
  };

  const resetDailyTasksOnNewDay = async () => {
    const resetWeeklyTasks = {};
    Object.keys(weeklyTasks).forEach(dayId => {
      resetWeeklyTasks[dayId] = weeklyTasks[dayId].map(task => ({
        ...task,
        completed: false,
      }));
    });
    setWeeklyTasks(resetWeeklyTasks);
    await StorageService.saveWeeklyTasks(resetWeeklyTasks);
  };

  return (
    <AppContext.Provider value={{
      weeklyTasks,
      stats,
      selectedDay,
      setSelectedDay,
      addTask,
      deleteTask,
      completeTask,
      purchaseItem,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);