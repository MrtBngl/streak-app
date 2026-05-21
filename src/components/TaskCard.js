import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { LIGHT_COLORS, DARK_COLORS, SIZES, FONTS } from '../constants/theme';

export const TaskCard = ({ task, onComplete, onDelete, dayId }) => {
  const { COLORS } = useTheme(); // ← Direkt al, hesaplama yapma
  
  const [scaleAnim] = useState(new Animated.Value(1));
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = async () => {
    if (task.completed) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Shake animation on complete
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const result = await onComplete(dayId, task.id);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Görevi Sil',
      'Bu görevi silmek istediğinden emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete(dayId, task.id);
          }
        },
      ]
    );
  };

  const getPointColor = (points) => {
    if (points >= 30) return COLORS.danger;
    if (points >= 20) return COLORS.warning;
    return COLORS.success;
  };

  const getPointLabel = (points) => {
    if (points >= 30) return 'ZOR';
    if (points >= 20) return 'ORTA';
    return 'KOLAY';
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.taskCard,
          { backgroundColor: COLORS.card },
          task.completed && styles.completedCard,
          { borderLeftColor: task.completed ? COLORS.success : COLORS.primary },
        ]}
        onPress={handlePress}
        disabled={task.completed}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <View style={[
            styles.checkbox, 
            { borderColor: COLORS.primary },
            task.completed && { backgroundColor: COLORS.success, borderColor: COLORS.success }
          ]}>
            {task.completed && (
              <Ionicons name="checkmark" size={24} color={COLORS.white} />
            )}
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[
              styles.title, 
              { color: COLORS.dark },
              task.completed && styles.completedText
            ]}>
              {task.title}
            </Text>
            <View style={styles.metaRow}>
              <View style={[
                styles.pointBadge, 
                { backgroundColor: getPointColor(task.points) + '20' }
              ]}>
                <Text style={[
                  styles.pointBadgeText, 
                  { color: getPointColor(task.points) }
                ]}>
                  {getPointLabel(task.points)}
                </Text>
              </View>
              <View style={styles.pointsContainer}>
                <Ionicons name="diamond" size={14} color={COLORS.primary} />
                <Text style={[styles.points, { color: COLORS.primary }]}>
                  {task.points}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SIZES.md },
  taskCard: {
    borderRadius: 16,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  completedCard: {
    opacity: 0.7,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  textContainer: { flex: 1 },
  title: {
    ...FONTS.body,
    marginBottom: 6,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  pointBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pointBadgeText: {
    ...FONTS.tiny,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  points: {
    ...FONTS.small,
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: SIZES.sm,
    marginLeft: SIZES.sm,
  },
});