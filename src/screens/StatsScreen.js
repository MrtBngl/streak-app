import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/Logo';
import { StatsCard } from '../components/StatsCard';
import { CalendarView } from '../components/CalendarView';
import { InfoModal } from '../components/InfoModal';
import { AchievementsContent } from '../components/AchievementsContent';
import { SIZES, ACHIEVEMENTS } from '../constants/theme';

export const StatsScreen = () => {
  const { stats, weeklyTasks } = useApp();
  const { COLORS } = useTheme();
  const [showAchievements, setShowAchievements] = useState(false);

  const totalActiveTasks = Object.values(weeklyTasks).reduce(
    (sum, dayTasks) => sum + (dayTasks ? dayTasks.length : 0),
    0
  );

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
    if (!stats.unlockedAchievements) return false;
    return stats.unlockedAchievements.includes(achievement.id);
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.dark }]}>
            Istatistikler
          </Text>
          <Text style={[styles.subtitle, { color: COLORS.gray }]}>
            Performansini takip et
          </Text>
        </View>

        {/* Level Card */}
        <View style={[styles.levelCard, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="trophy" size={44} color="#FFFFFF" />
          <Text style={styles.levelNumber}>
            Seviye {stats.level}
          </Text>
          <Text style={styles.levelPoints}>
            {stats.totalPoints} Toplam Puan
          </Text>
        </View>

        {/* Calendar */}
        <CalendarView dailyCompletions={stats.dailyCompletions || {}} />

        {/* Stats Cards */}
        <StatsCard
          icon="flame"
          title="Mevcut Seri"
          value={stats.currentStreak + ' gun'}
          color={COLORS.fire}
        />
        <StatsCard
          icon="ribbon"
          title="En Uzun Seri"
          value={stats.longestStreak + ' gun'}
          color={COLORS.primary}
        />
        <StatsCard
          icon="checkmark-done"
          title="Tamamlanan Görev"
          value={stats.totalTasksCompleted}
          color={COLORS.success}
        />
        <StatsCard
          icon="list"
          title="Toplam Aktif Görev"
          value={totalActiveTasks}
          color={COLORS.secondary}
        />

        {/* Achievements */}
        <View style={styles.achieveSection}>
          <View style={styles.achieveHeader}>
            <Text style={[styles.achieveTitle, { color: COLORS.dark }]}>
              Rozetler ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowAchievements(true)}
              style={[styles.infoBtn, { backgroundColor: COLORS.primary + '18' }]}
            >
              <Ionicons name="information-circle" size={22} color={COLORS.primary} />
              <Text style={[styles.infoBtnText, { color: COLORS.primary }]}>
                Tümünü Gör
              </Text>
            </TouchableOpacity>
          </View>

          {unlockedAchievements.length === 0 ? (
            <View style={[styles.emptyAchieve, { backgroundColor: COLORS.card }]}>
              <Text style={styles.emptyAchieveEmoji}>🏆</Text>
              <Text style={[styles.emptyAchieveText, { color: COLORS.gray }]}>
                Henüz rozet kazanmadiniz
              </Text>
              <Text style={[styles.emptyAchieveSub, { color: COLORS.lightGray }]}>
                Görevleri tamamlayarak rozet kazan!
              </Text>
            </View>
          ) : (
            <View>
              {unlockedAchievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[styles.badgeCard, { backgroundColor: COLORS.card }]}
                >
                  <View style={styles.badgeEmojiWrap}>
                    <Text style={styles.badgeEmoji}>
                      {achievement.emoji}
                    </Text>
                  </View>
                  <View style={styles.badgeInfo}>
                    <Text style={[styles.badgeName, { color: COLORS.dark }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.badgeDesc, { color: COLORS.gray }]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <InfoModal
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
        title="Tüm Rozetler"
        content={<AchievementsContent stats={stats} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.lg },
  header: { marginBottom: SIZES.lg, marginTop: SIZES.md },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: SIZES.xs },
  levelCard: {
    padding: SIZES.xl,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  levelNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: SIZES.sm,
  },
  levelPoints: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: SIZES.xs,
  },
  achieveSection: { marginTop: SIZES.lg },
  achieveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  achieveTitle: { fontSize: 18, fontWeight: '600' },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  infoBtnText: { fontSize: 13, fontWeight: '600' },
  emptyAchieve: {
    padding: SIZES.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyAchieveEmoji: { fontSize: 40, marginBottom: SIZES.sm },
  emptyAchieveText: { fontSize: 16, fontWeight: '600' },
  emptyAchieveSub: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  badgeEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: { fontSize: 24 },
  badgeInfo: { flex: 1 },
  badgeName: { fontSize: 15, fontWeight: '600' },
  badgeDesc: { fontSize: 13, marginTop: 2 },
});