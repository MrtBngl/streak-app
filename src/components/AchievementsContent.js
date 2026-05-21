import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES, ACHIEVEMENTS } from '../constants/theme';

export const AchievementsContent = ({ stats }) => {
  const { COLORS } = useTheme();

  const isUnlocked = (achievement) => {
    if (!stats.unlockedAchievements) return false;
    return stats.unlockedAchievements.includes(achievement.id);
  };

  const getProgress = (achievement) => {
    let current = 0;
    switch (achievement.requirement) {
      case 'totalTasks':
        current = stats.totalTasksCompleted || 0;
        break;
      case 'streak':
        current = stats.longestStreak || 0;
        break;
      case 'level':
        current = stats.level || 1;
        break;
      case 'points':
        current = stats.totalPoints || 0;
        break;
      case 'perfectDay':
        current = Object.values(stats.dailyCompletions || {}).filter(d => d && d.bonus).length;
        break;
      default:
        current = 0;
    }
    const percentage = achievement.value > 0
      ? Math.min((current / achievement.value) * 100, 100)
      : 0;
    return { current, percentage };
  };

  const unlockedList = ACHIEVEMENTS.filter(a => isUnlocked(a));
  const lockedList = ACHIEVEMENTS.filter(a => !isUnlocked(a));

  return (
    <View>
      {/* Özet */}
      <View style={[styles.summaryBox, { backgroundColor: COLORS.primary + '18' }]}>
        <Text style={[styles.summaryText, { color: COLORS.primary }]}>
          {unlockedList.length}/{ACHIEVEMENTS.length} rozet kazanildi
        </Text>
      </View>

      <Text style={[styles.desc, { color: COLORS.gray }]}>
        Görevleri tamamlayarak rozetler kazan. Gizli rozetler sürpriz olarak acilar!
      </Text>

      {/* Kazanılan */}
      {unlockedList.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: COLORS.dark }]}>
            Kazanilan Rozetler
          </Text>
          {unlockedList.map((achievement) => (
            <View
              key={achievement.id}
              style={[styles.card, {
                backgroundColor: '#E8F8F5',
                borderColor: COLORS.success,
                borderWidth: 1.5,
              }]}
            >
              <View style={styles.emojiBox}>
                <Text style={styles.emojiText}>
                  {achievement.emoji}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: COLORS.dark }]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.cardDesc, { color: COLORS.gray }]}>
                  {achievement.description}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            </View>
          ))}
        </View>
      )}

      {/* Kilitli */}
      {lockedList.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: COLORS.dark }]}>
            Kilitli Rozetler
          </Text>
          {lockedList.map((achievement) => {
            const { current, percentage } = getProgress(achievement);
            const isHidden = achievement.hidden === true;

            return (
              <View
                key={achievement.id}
                style={[styles.card, {
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.lightGray,
                  borderWidth: 1,
                  opacity: isHidden ? 0.65 : 1,
                }]}
              >
                <View style={[styles.emojiBox, { opacity: isHidden ? 0.3 : 1 }]}>
                  <Text style={styles.emojiText}>
                    {isHidden ? '?' : achievement.emoji}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: COLORS.dark }]}>
                    {isHidden ? 'Gizli Rozet' : achievement.title}
                  </Text>
                  <Text style={[styles.cardDesc, { color: COLORS.gray }]}>
                    {isHidden
                      ? 'Bu rozeti kesfetmek icin daha fazla oyna!'
                      : achievement.description}
                  </Text>
                  {!isHidden && (
                    <View style={styles.progressWrap}>
                      <View style={[styles.progressBg, { backgroundColor: COLORS.lightGray }]}>
                        <View style={[styles.progressBar, {
                          width: percentage + '%',
                          backgroundColor: COLORS.primary,
                        }]} />
                      </View>
                      <Text style={[styles.progressLabel, { color: COLORS.gray }]}>
                        {current}/{achievement.value}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryBox: {
    padding: SIZES.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 13,
    marginBottom: SIZES.lg,
    lineHeight: 20,
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  emojiBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  emojiText: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressWrap: {
    marginTop: SIZES.sm,
    gap: 4,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    textAlign: 'right',
  },
});