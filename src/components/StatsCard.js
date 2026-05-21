import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES } from '../constants/theme';

export const StatsCard = ({ icon, title, value, color }) => {
  const { COLORS } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.card,
      borderLeftColor: color,
    }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.value, { color: COLORS.dark }]}>
          {String(value)}
        </Text>
        <Text style={[styles.title, { color: COLORS.gray }]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: SIZES.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  value: { fontSize: 22, fontWeight: 'bold' },
  title: { fontSize: 13, marginTop: 2 },
});