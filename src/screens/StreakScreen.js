import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/Logo';
import { SIZES, FONTS } from '../constants/theme';

export const StreakScreen = () => {
  const { stats } = useApp();
  const { COLORS } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.dark }]}>Serin 🔥</Text>
          <Text style={[styles.subtitle, { color: COLORS.gray }]}>
            Her gün devam ettir, kaybetme!
          </Text>
        </View>

        {/* Streak Display */}
        <View style={[styles.streakCard, { backgroundColor: COLORS.card }]}>
          <Ionicons name="flame" size={80} color={COLORS.warning} />
          <Text style={[styles.streakNumber, { color: COLORS.primary }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: COLORS.dark }]}>Günlük Seri</Text>
          <Text style={[styles.streakSub, { color: COLORS.gray }]}>Keep it up! 🎯</Text>
        </View>

        {/* Longest Streak */}
        <View style={[styles.infoCard, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.infoTitle, { color: COLORS.gray }]}>🏅 En Uzun Serin</Text>
          <Text style={[styles.infoValue, { color: COLORS.primary }]}>
            {stats.longestStreak} gün
          </Text>
        </View>

        {/* How it works */}
        <View style={[styles.tipCard, { backgroundColor: '#FFF9E6' }]}>
          <Text style={[styles.tipTitle, { color: COLORS.dark }]}>💡 Nasıl Çalışır?</Text>
          <Text style={[styles.tipText, { color: COLORS.darkGray }]}>
            • Her gün en az 1 görevi tamamla{'\n'}
            • Serin bir gün artar{'\n'}
            • 1 gün kaçırırsan sıfırlanır{'\n'}
            • Seri Dondurucu ile 1 günü atlayabilirsin!
          </Text>
        </View>

        {/* Motivation */}
        {stats.currentStreak === 0 && (
          <View style={[styles.motivationCard, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.motivationEmoji}>🚀</Text>
            <Text style={styles.motivationText}>
              Serine bugün başla! İlk görevini tamamla ve ateşini yak.
            </Text>
          </View>
        )}

        {stats.currentStreak >= 3 && stats.currentStreak < 7 && (
          <View style={[styles.encouragementCard, { backgroundColor: COLORS.success }]}>
            <Text style={styles.encouragementText}>
              Harika gidiyorsun! {7 - stats.currentStreak} gün daha devam et! 💪
            </Text>
          </View>
        )}

        {stats.currentStreak >= 7 && (
          <View style={[styles.badgeCard, { backgroundColor: COLORS.success }]}>
            <Text style={styles.badgeEmoji}>🏆</Text>
            <Text style={styles.badgeText}>Haftalık Savaşçı!</Text>
          </View>
        )}

        <View style={{ height: SIZES.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.lg },
  header: { marginBottom: SIZES.lg, marginTop: SIZES.md },
  title: { ...FONTS.h1 },
  subtitle: { ...FONTS.body, marginTop: SIZES.xs },
  streakCard: {
    alignItems: 'center',
    padding: SIZES.xl,
    borderRadius: 24,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  streakNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    marginVertical: SIZES.sm,
  },
  streakLabel: { ...FONTS.h3 },
  streakSub: { ...FONTS.body, marginTop: SIZES.xs },
  infoCard: {
    padding: SIZES.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: { ...FONTS.body, marginBottom: SIZES.sm },
  infoValue: { ...FONTS.h1 },
  tipCard: {
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.md,
  },
  tipTitle: { ...FONTS.h3, marginBottom: SIZES.sm },
  tipText: { ...FONTS.body, lineHeight: 28 },
  motivationCard: {
    padding: SIZES.xl,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  motivationEmoji: { fontSize: 48, marginBottom: SIZES.md },
  motivationText: {
    ...FONTS.body,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  encouragementCard: {
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.md,
  },
  encouragementText: {
    ...FONTS.body,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  badgeCard: {
    padding: SIZES.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  badgeEmoji: { fontSize: 48, marginBottom: SIZES.sm },
  badgeText: { ...FONTS.h2, color: '#FFFFFF' },
});