import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { LIGHT_COLORS, DARK_COLORS, FONTS, SIZES, LEVEL_RANKS } from '../constants/theme';
import { InfoModal } from './InfoModal';
import { LevelInfoContent } from './LevelInfoContent';

export const LevelProgress = ({ level, totalPoints }) => {
  const { COLORS } = useTheme(); // ← Direkt al, hesaplama yapma
  const [showInfo, setShowInfo] = useState(false);
  
  const pointsInCurrentLevel = totalPoints % 100;
  const progress = pointsInCurrentLevel / 100;

  const getCurrentRank = (lvl) => {
    return LEVEL_RANKS.find(rank => lvl >= rank.min && lvl <= rank.max);
  };

  const currentRank = getCurrentRank(level);

  return (
    <>
      <View style={[styles.container, { backgroundColor: COLORS.card }]}>
        <View style={styles.header}>
          <View>
            <View style={styles.levelRow}>
              <Text style={[styles.levelText, { color: COLORS.primary }]}>Level {level}</Text>
              <TouchableOpacity 
                onPress={() => setShowInfo(true)}
                style={styles.infoButton}
              >
                <Ionicons name="information-circle" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.rankText, { color: currentRank.color }]}>
              {currentRank.title}
            </Text>
            <Text style={[styles.pointsText, { color: COLORS.gray }]}>{totalPoints} Puan</Text>
          </View>
          <View style={styles.nextLevel}>
            <Text style={[styles.nextLevelText, { color: COLORS.dark }]}>
              {100 - pointsInCurrentLevel}
            </Text>
            <Text style={[styles.nextLevelLabel, { color: COLORS.gray }]}>sonraki seviye</Text>
          </View>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: COLORS.lightGray }]}>
          <LinearGradient
            colors={COLORS.gradient1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      <InfoModal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        title="🎯 Seviye Sistemi"
        content={<LevelInfoContent currentLevel={level} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.lg,
    borderRadius: 16,
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  levelText: { ...FONTS.h2 },
  infoButton: { padding: 2 },
  rankText: {
    ...FONTS.body,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pointsText: { ...FONTS.small, marginTop: 4 },
  nextLevel: { alignItems: 'flex-end' },
  nextLevelText: { ...FONTS.h4, fontWeight: 'bold' },
  nextLevelLabel: { ...FONTS.tiny },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
});