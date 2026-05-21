import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS, DAYS } from '../constants/theme';

export const DaySelector = ({ selectedDay, onSelectDay, weeklyTasks }) => {
  const { COLORS } = useTheme();
  const today = new Date().getDay();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DAYS.map((day) => {
        const isSelected = selectedDay === day.id;
        const isToday = today === day.id;
        const tasks = weeklyTasks[day.id] || [];
        const completedCount = tasks.filter(t => t.completed).length;
        const totalCount = tasks.length;
        const allCompleted = totalCount > 0 && completedCount === totalCount;

        return (
          <TouchableOpacity
            key={day.id}
            style={[
              styles.dayButton,
              { backgroundColor: COLORS.card },
              isSelected && { backgroundColor: COLORS.primary },
              allCompleted && !isSelected && { backgroundColor: COLORS.success },
            ]}
            onPress={() => onSelectDay(day.id)}
          >
            <Text style={[
              styles.dayText,
              { color: COLORS.dark },
              (isSelected || allCompleted) && { color: '#FFFFFF' },
            ]}>
              {day.short}
            </Text>
            {isToday && !isSelected && (
              <View style={[styles.todayDot, { backgroundColor: COLORS.primary }]} />
            )}
            {totalCount > 0 && (
              <Text style={[
                styles.taskCount,
                { color: COLORS.gray },
                (isSelected || allCompleted) && { color: 'rgba(255,255,255,0.8)' },
              ]}>
                {completedCount}/{totalCount}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.md,
    gap: SIZES.sm,
    paddingVertical: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  dayButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: { ...FONTS.body, fontWeight: '600' },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  taskCount: { ...FONTS.tiny, marginTop: 4 },
});