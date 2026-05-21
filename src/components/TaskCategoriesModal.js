import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TASK_CATEGORIES, SIZES, FONTS } from '../constants/theme';

export const TaskCategoriesModal = ({
  visible,
  onClose,
  onSelectTask,
  currentTaskCount,
}) => {
  const { COLORS } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const taskCount = currentTaskCount || 0;
  const remainingSlots = 15 - taskCount;

  const handleSelectTask = (task, category) => {
    if (taskCount >= 15) {
      Alert.alert('Limit Doldu', 'Bir güne en fazla 15 görev eklenebilir.');
      return;
    }
    onSelectTask({ title: task.title, points: task.points, category: category.id });
    Alert.alert('Eklendi', task.title + ' eklendi!');
  };

  const handleClose = () => {
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: COLORS.card }]}>

          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: COLORS.lightGray }]} />

          {/* Header */}
          <View style={styles.header}>
            {selectedCategory !== null ? (
              <TouchableOpacity
                style={styles.backRow}
                onPress={() => setSelectedCategory(null)}
              >
                <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
                <Text style={[styles.backText, { color: COLORS.primary }]}>
                  Kategoriler
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
                Hazir Görevler
              </Text>
            )}
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: COLORS.background }]}
            >
              <Ionicons name="close" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          {/* Limit Info */}
          <View style={[styles.limitRow, { backgroundColor: COLORS.background }]}>
            <Text style={[styles.limitLabel, { color: COLORS.gray }]}>
              Slot:
            </Text>
            <Text style={[styles.limitValue, { color: COLORS.dark }]}>
              {taskCount}/15
            </Text>
            <View style={[styles.limitBg, { backgroundColor: COLORS.lightGray }]}>
              <View
                style={[
                  styles.limitFill,
                  {
                    width: (taskCount / 15) * 100 + '%',
                    backgroundColor: taskCount >= 15
                      ? COLORS.danger
                      : COLORS.success,
                  },
                ]}
              />
            </View>
            <Text style={[styles.limitRemain, { color: COLORS.gray }]}>
              {remainingSlots} kaldi
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {selectedCategory === null ? (
              /* KATEGORİLER */
              <View style={styles.grid}>
                {TASK_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, { backgroundColor: COLORS.background }]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.catIconWrap, { backgroundColor: cat.color + '22' }]}>
                      <Ionicons name={cat.iconName} size={26} color={cat.color} />
                    </View>
                    <Text style={[styles.catEmoji]}>{cat.emoji}</Text>
                    <Text style={[styles.catName, { color: COLORS.dark }]}>
                      {cat.name}
                    </Text>
                    <Text style={[styles.catCount, { color: COLORS.gray }]}>
                      {cat.tasks.length} görev
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              /* GÖREVLER */
              <View>
                {/* Kategori başlık */}
                <View style={[styles.catHeader, { backgroundColor: selectedCategory.color + '18' }]}>
                  <Ionicons
                    name={selectedCategory.iconName}
                    size={20}
                    color={selectedCategory.color}
                  />
                  <Text style={[styles.catHeaderName, { color: selectedCategory.color }]}>
                    {selectedCategory.emoji}
                    {'  '}
                    {selectedCategory.name}
                  </Text>
                </View>

                {/* Görev kartları */}
                {selectedCategory.tasks.map((task, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.taskCard, { backgroundColor: COLORS.background }]}
                    onPress={() => handleSelectTask(task, selectedCategory)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.taskDot, { backgroundColor: selectedCategory.color }]}
                    />
                    <View style={styles.taskInfo}>
                      <Text style={[styles.taskName, { color: COLORS.dark }]}>
                        {task.title}
                      </Text>
                      <View style={[styles.ptBadge, { backgroundColor: selectedCategory.color + '22' }]}>
                        <Ionicons name="diamond" size={10} color={selectedCategory.color} />
                        <Text style={[styles.ptText, { color: selectedCategory.color }]}>
                          {task.points} puan
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.addBtn, { backgroundColor: selectedCategory.color + '22' }]}>
                      <Ionicons name="add" size={20} color={selectedCategory.color} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SIZES.lg,
    paddingBottom: 40,
    maxHeight: '82%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: 10,
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  limitLabel: {
    fontSize: 12,
  },
  limitValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  limitBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  limitFill: {
    height: '100%',
    borderRadius: 3,
  },
  limitRemain: {
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: SIZES.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.md,
  },
  catCard: {
    width: '47%',
    padding: SIZES.md,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
  },
  catIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: {
    fontSize: 16,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  catCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  catHeaderName: {
    fontSize: 16,
    fontWeight: '700',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskInfo: {
    flex: 1,
    gap: 6,
  },
  taskName: {
    fontSize: 15,
    lineHeight: 20,
  },
  ptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  ptText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});