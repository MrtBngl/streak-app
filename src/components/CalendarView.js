import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS } from '../constants/theme';

export const CalendarView = ({ dailyCompletions }) => {
  const { COLORS } = useTheme();

  const getDaysArray = () => {
    const days = [];
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const getColorForDay = (date) => {
    const dateStr = date.toDateString();
    const completion = dailyCompletions[dateStr];
    const isFuture = date > new Date();

    if (isFuture) return 'transparent';
    if (!completion || completion.completed === 0) return COLORS.lightGray;

    const percentage = completion.completed / (completion.total || 1);
    if (percentage === 1) return '#51CF66';
    if (percentage >= 0.7) return '#FCC419';
    if (percentage >= 0.4) return '#FF8E53';
    return '#FF6B6B';
  };

  const getCompletionText = (date) => {
    const dateStr = date.toDateString();
    const completion = dailyCompletions[dateStr];
    if (!completion) return '';
    return `${completion.completed}/${completion.total}`;
  };

  const days = getDaysArray();
  const weeks = [];
  let currentWeek = [];

  // İlk günün haftanın kaçıncı günü olduğunu bul
  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const dayLabels = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

  // İstatistikler
  const completedDays = Object.values(dailyCompletions).filter(d => d.completed > 0).length;
  const perfectDays = Object.values(dailyCompletions).filter(d => d.bonus).length;

  return (
    <View style={[styles.container, { backgroundColor: COLORS.card }]}>
      <Text style={[styles.title, { color: COLORS.dark }]}>📅 Son 35 Gün</Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.miniStat, { backgroundColor: COLORS.background }]}>
          <Text style={[styles.miniStatValue, { color: COLORS.success }]}>{completedDays}</Text>
          <Text style={[styles.miniStatLabel, { color: COLORS.gray }]}>Aktif Gün</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: COLORS.background }]}>
          <Text style={[styles.miniStatValue, { color: COLORS.warning }]}>{perfectDays}</Text>
          <Text style={[styles.miniStatLabel, { color: COLORS.gray }]}>Mükemmel Gün</Text>
        </View>
        <View style={[styles.miniStat, { backgroundColor: COLORS.background }]}>
          <Text style={[styles.miniStatValue, { color: COLORS.primary }]}>
            {completedDays > 0 ? Math.round((perfectDays / completedDays) * 100) : 0}%
          </Text>
          <Text style={[styles.miniStatLabel, { color: COLORS.gray }]}>Mükemmellik</Text>
        </View>
      </View>

      {/* Day Labels */}
      <View style={styles.dayLabelsRow}>
        {dayLabels.map((label, i) => (
          <Text key={i} style={[styles.dayLabel, { color: COLORS.gray }]}>{label}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((day, dayIndex) => {
            if (!day) {
              return <View key={dayIndex} style={styles.emptyCell} />;
            }

            const isToday = day.toDateString() === new Date().toDateString();
            const color = getColorForDay(day);
            const isFuture = day > new Date();

            return (
              <View key={dayIndex} style={styles.dayCell}>
                <View style={[
                  styles.dayBox,
                  { backgroundColor: color },
                  isToday && styles.todayBox,
                  isFuture && { backgroundColor: 'transparent', borderWidth: 0 },
                ]}>
                  <Text style={[
                    styles.dayNumber,
                    { color: color !== 'transparent' && color !== COLORS.lightGray ? '#FFFFFF' : COLORS.gray },
                    isToday && styles.todayNumber,
                  ]}>
                    {day.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendTitle, { color: COLORS.gray }]}>Açıklama:</Text>
        <View style={styles.legendItems}>
          {[
            { color: COLORS.lightGray, label: 'Görev yok' },
            { color: '#FF6B6B', label: '<40%' },
            { color: '#FF8E53', label: '40-70%' },
            { color: '#FCC419', label: '70-99%' },
            { color: '#51CF66', label: '100% ✨' },
          ].map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: item.color }]} />
              <Text style={[styles.legendLabel, { color: COLORS.gray }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { ...FONTS.h4, marginBottom: SIZES.md },
  statsRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  miniStat: {
    flex: 1,
    padding: SIZES.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  miniStatValue: { ...FONTS.h3 },
  miniStatLabel: { ...FONTS.tiny, marginTop: 2, textAlign: 'center' },
  dayLabelsRow: {
    flexDirection: 'row',
    marginBottom: SIZES.sm,
  },
  dayLabel: {
    flex: 1,
    ...FONTS.tiny,
    textAlign: 'center',
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
  emptyCell: { flex: 1 },
  dayBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBox: {
    borderWidth: 2.5,
    borderColor: '#FF6B6B',
  },
  dayNumber: { ...FONTS.tiny, fontWeight: 'bold' },
  todayNumber: { fontWeight: 'bold' },
  legend: { marginTop: SIZES.md },
  legendTitle: { ...FONTS.tiny, marginBottom: SIZES.sm },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBox: { width: 14, height: 14, borderRadius: 3 },
  legendLabel: { ...FONTS.tiny },
});