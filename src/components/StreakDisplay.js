import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export const StreakDisplay = ({ streak }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={80} color={COLORS.warning} />
      <Text style={styles.streakNumber}>{streak}</Text>
      <Text style={styles.streakText}>Day Streak</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SIZES.xl,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginVertical: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  streakNumber: { fontSize: 72, fontWeight: 'bold', color: COLORS.primary },
  streakText: { ...FONTS.h3, color: COLORS.dark },
});