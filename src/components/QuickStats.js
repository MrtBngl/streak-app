import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS } from '../constants/theme';

export const QuickStats = ({ streak, tasksToday, bonusAvailable }) => {
  const { COLORS } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.statBox, { backgroundColor: COLORS.card }]}>
        <Ionicons name="flame" size={32} color={COLORS.fire} />
        <Text style={[styles.statValue, { color: COLORS.dark }]}>{streak}</Text>
        <Text style={[styles.statLabel, { color: COLORS.gray }]}>Gün Seri</Text>
      </View>

      <View style={[styles.statBox, { backgroundColor: COLORS.card }]}>
        <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
        <Text style={[styles.statValue, { color: COLORS.dark }]}>{tasksToday.completed}</Text>
        <Text style={[styles.statLabel, { color: COLORS.gray }]}>Tamamlandı</Text>
      </View>

      <View style={[styles.statBox, { backgroundColor: COLORS.card }]}>
        <Ionicons
          name={bonusAvailable ? 'gift' : 'trophy'}
          size={32}
          color={bonusAvailable ? COLORS.warning : COLORS.accent}
        />
        <Text style={[styles.statValue, { color: COLORS.dark }]}>{tasksToday.remaining}</Text>
        <Text style={[styles.statLabel, { color: COLORS.gray }]}>Kalan</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  statBox: {
    flex: 1,
    padding: SIZES.md,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { ...FONTS.h2, marginTop: SIZES.xs },
  statLabel: { ...FONTS.tiny, marginTop: 4 },
});