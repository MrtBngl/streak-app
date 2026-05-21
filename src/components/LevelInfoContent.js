import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS, LEVEL_RANKS } from '../constants/theme';

export const LevelInfoContent = ({ currentLevel }) => {
  const getCurrentRank = (level) => {
    return LEVEL_RANKS.find(rank => level >= rank.min && level <= rank.max);
  };

  const currentRank = getCurrentRank(currentLevel);

  return (
    <View>
      <View style={styles.currentRankCard}>
        <Text style={styles.currentRankLabel}>Mevcut Unvanın</Text>
        <Text style={[styles.currentRankTitle, { color: currentRank.color }]}>
          {currentRank.title}
        </Text>
        <Text style={styles.currentRankLevel}>Seviye {currentLevel}</Text>
      </View>

      <Text style={styles.sectionTitle}>Tüm Unvanlar</Text>
      <Text style={styles.description}>
        Görev tamamlayarak puan kazan, seviye atla ve yeni unvanlar aç!
        Her 100 puan = 1 seviye
      </Text>

      {LEVEL_RANKS.map((rank) => {
        const isUnlocked = currentLevel >= rank.min;
        const isCurrent = currentLevel >= rank.min && currentLevel <= rank.max;

        return (
          <View
            key={rank.min}
            style={[
              styles.rankCard,
              isCurrent && styles.rankCardCurrent,
              !isUnlocked && styles.rankCardLocked,
            ]}
          >
            <View style={[styles.rankBadge, { backgroundColor: rank.color + '30' }]}>
              <Text style={styles.rankTitle}>{rank.title}</Text>
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankRange}>
                Seviye {rank.min} - {rank.max}
              </Text>
              {isUnlocked && (
                <Text style={styles.unlockedText}>✓ Açıldı</Text>
              )}
              {!isUnlocked && (
                <Text style={styles.lockedText}>🔒 Kilitli</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  currentRankCard: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  currentRankLabel: {
    ...FONTS.small,
    color: 'rgba(255,255,255,0.8)',
  },
  currentRankTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginVertical: SIZES.sm,
  },
  currentRankLevel: {
    ...FONTS.body,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  description: {
    ...FONTS.small,
    color: COLORS.gray,
    marginBottom: SIZES.lg,
    lineHeight: 20,
  },
  rankCard: {
    backgroundColor: COLORS.background,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankCardCurrent: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  rankCardLocked: {
    opacity: 0.5,
  },
  rankBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 8,
  },
  rankTitle: {
    ...FONTS.body,
    fontWeight: 'bold',
  },
  rankInfo: {
    alignItems: 'flex-end',
  },
  rankRange: {
    ...FONTS.small,
    color: COLORS.gray,
  },
  unlockedText: {
    ...FONTS.tiny,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  lockedText: {
    ...FONTS.tiny,
    color: COLORS.gray,
  },
});