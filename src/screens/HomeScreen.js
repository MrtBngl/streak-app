import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { DaySelector } from '../components/DaySelector';
import { LevelProgress } from '../components/LevelProgress';
import { QuickStats } from '../components/QuickStats';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';
import { TaskCategoriesModal } from '../components/TaskCategoriesModal';
import { ConfettiReward } from '../components/ConfettiReward';
import { SIZES, FONTS, DAYS, MOTIVATIONAL_QUOTES } from '../constants/theme';

export const HomeScreen = ({ navigation }) => {
  const { weeklyTasks, stats, selectedDay, setSelectedDay, completeTask, deleteTask, addTask } = useApp();
  const { COLORS } = useTheme();
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setDailyQuote(randomQuote);
  }, []);

  const currentDayTasks = weeklyTasks[selectedDay] || [];
  const completedCount = currentDayTasks.filter(t => t.completed).length;
  const totalCount = currentDayTasks.length;
  const remainingCount = totalCount - completedCount;
  const totalPossiblePoints = currentDayTasks.reduce((sum, t) => sum + t.points, 0);
  const currentDayName = DAYS.find(d => d.id === selectedDay)?.full || '';

  const handleAddTask = async (taskData) => {
    await addTask(selectedDay, taskData);
    setModalVisible(false);
  };

  const handleSelectPredefinedTask = async (task) => {
    await addTask(selectedDay, task);
  };

  const handleCompleteTask = async (dayId, taskId) => {
    const result = await completeTask(dayId, taskId);
    if (result?.bonusAwarded) {
      setShowConfetti(true);
      Alert.alert(
        'Tebrikler! 🎊',
        `🎉 BONUS PUAN!\n\nTüm görevleri tamamladın!\n+${result.pointsToAdd} puan kazandın!`,
        [{ text: 'Harika! 🔥' }]
      );
    }
  };

  const getAvatarEmoji = () => {
    switch (user?.currentAvatar) {
      case 'avatar_cool': return '😎';
      case 'avatar_star': return '⭐';
      default: return '👤';
    }
  };

  if (!COLORS) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Logo />

          <View style={styles.headerRight}>
            {/* Çift Puan Badge */}
            {stats.doublePointsActive && (
              <View style={[styles.doubleBadge, { backgroundColor: COLORS.warning }]}>
                <Ionicons name="flash" size={14} color="#FFFFFF" />
                <Text style={styles.doubleBadgeText}>2X</Text>
              </View>
            )}

            {/* Streak Badge */}
            <View style={[styles.streakBadge, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="flame" size={18} color="#FFFFFF" />
              <Text style={styles.streakText}>{stats.currentStreak}</Text>
            </View>

            {/* Profil Butonu */}
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: COLORS.card }]}
              onPress={() => navigation.navigate('Ayarlar')}
            >
              <Text style={styles.profileEmoji}>{getAvatarEmoji()}</Text>
              <Text style={[styles.profileName, { color: COLORS.dark }]} numberOfLines={1}>
                {user?.username?.slice(0, 8) || 'Kullanıcı'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== MOTİVASYON SÖZÜ ===== */}
        <View style={[styles.quoteCard, {
          backgroundColor: COLORS.card,
          borderLeftColor: COLORS.primary,
        }]}>
          <Ionicons name="bulb-outline" size={16} color={COLORS.primary} />
          <Text style={[styles.quoteText, { color: COLORS.dark }]}>{dailyQuote}</Text>
        </View>

        {/* ===== SEVİYE PROGRESS ===== */}
        <LevelProgress level={stats.level} totalPoints={stats.totalPoints} />

        {/* ===== HIZLI İSTATİSTİKLER ===== */}
        <QuickStats
          streak={stats.currentStreak}
          tasksToday={{ completed: completedCount, remaining: remainingCount }}
          bonusAvailable={remainingCount === 0 && totalCount > 0}
        />

        {/* ===== GÜN SEÇİCİ ===== */}
        <DaySelector
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          weeklyTasks={weeklyTasks}
        />

        {/* ===== GÜN BAŞLIĞI ===== */}
        <View style={styles.dayHeader}>
          <View>
            <Text style={[styles.dayTitle, { color: COLORS.dark }]}>{currentDayName}</Text>
            <Text style={[styles.daySubtitle, { color: COLORS.gray }]}>
              {totalCount === 0
                ? 'Henüz görev eklenmedi'
                : `${completedCount}/${totalCount} görev tamamlandı`}
            </Text>
          </View>
          <View style={styles.addButtons}>
            {/* Hazır Görevler Butonu */}
            <TouchableOpacity
              style={[styles.addButtonSmall, { backgroundColor: COLORS.secondary }]}
              onPress={() => setCategoriesVisible(true)}
            >
              <Ionicons name="apps" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            {/* Yeni Görev Ekle Butonu */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: COLORS.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== BONUS UYARISI ===== */}
        {totalCount > 0 && remainingCount > 0 && (
          <View style={[styles.bonusAlert, { backgroundColor: COLORS.warning + '20' }]}>
            <Ionicons name="gift" size={20} color={COLORS.warning} />
            <Text style={[styles.bonusText, { color: COLORS.dark }]}>
              Tümünü tamamla,{' '}
              <Text style={{ fontWeight: 'bold', color: COLORS.warning }}>
                +{Math.floor(totalPossiblePoints * 0.5)} bonus puan
              </Text>{' '}
              kazan! 🎁
            </Text>
          </View>
        )}

        {/* ===== GÖREV LİSTESİ ===== */}
        <View style={styles.tasksContainer}>
          {currentDayTasks.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: COLORS.card }]}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={[styles.emptyText, { color: COLORS.dark }]}>
                Bu gün için görev yok!
              </Text>
              <Text style={[styles.emptySubtext, { color: COLORS.gray }]}>
                Görev eklemek için aşağıdaki butonları kullan
              </Text>
              <View style={styles.emptyButtons}>
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: COLORS.primary }]}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>Yeni Görev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: COLORS.secondary }]}
                  onPress={() => setCategoriesVisible(true)}
                >
                  <Ionicons name="apps" size={18} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>Hazır Görevler</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            currentDayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                dayId={selectedDay}
                onComplete={handleCompleteTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </View>

        {/* ===== GÜN TAMAMLANDI BADGE ===== */}
        {totalCount > 0 && completedCount === totalCount && (
          <View style={[styles.completedBadge, { backgroundColor: COLORS.success }]}>
            <Ionicons name="trophy" size={24} color="#FFFFFF" />
            <View>
              <Text style={styles.completedText}>Tebrikler! 🎉</Text>
              <Text style={styles.completedSubtext}>Günün tüm görevlerini tamamladın!</Text>
            </View>
          </View>
        )}

        <View style={{ height: SIZES.xxl }} />
      </ScrollView>

      {/* ===== MODALLER ===== */}
<AddTaskModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onAdd={handleAddTask}
  dayName={currentDayName}
  currentTaskCount={currentDayTasks.length}  // ← Ekle
/>

<TaskCategoriesModal
  visible={categoriesVisible}
  onClose={() => setCategoriesVisible(false)}
  onSelectTask={handleSelectPredefinedTask}
  currentTaskCount={currentDayTasks.length}  // ← Ekle
/>


      <ConfettiReward
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.sm,
    paddingBottom: SIZES.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  doubleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 3,
  },
  doubleBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 3,
  },
  streakText: {
    ...FONTS.small,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    maxWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileEmoji: { fontSize: 18 },
  profileName: {
    ...FONTS.small,
    fontWeight: '600',
    flexShrink: 1,
  },

  // Quote
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.lg,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.md,
    borderLeftWidth: 4,
    gap: SIZES.sm,
  },
  quoteText: {
    ...FONTS.small,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 20,
  },

  // Day Header
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  dayTitle: { ...FONTS.h2 },
  daySubtitle: { ...FONTS.small, marginTop: 4 },
  addButtons: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  addButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  // Bonus Alert
  bonusAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.lg,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  bonusText: {
    ...FONTS.small,
    flex: 1,
    lineHeight: 20,
  },

  // Tasks
  tasksContainer: {
    paddingHorizontal: SIZES.lg,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl,
    borderRadius: 20,
    marginTop: SIZES.md,
    padding: SIZES.xl,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: SIZES.md,
  },
  emptyText: {
    ...FONTS.h3,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...FONTS.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.lg,
  },
  emptyButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 12,
    gap: SIZES.xs,
  },
  emptyButtonText: {
    ...FONTS.small,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Completed Badge
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.md,
    padding: SIZES.md,
    borderRadius: 16,
    gap: SIZES.md,
  },
  completedText: {
    ...FONTS.body,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  completedSubtext: {
    ...FONTS.small,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
});