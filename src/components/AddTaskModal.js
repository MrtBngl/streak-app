import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS } from '../constants/theme';

const POINT_OPTIONS = [
  { value: 10, label: '😊 Kolay', color: '#51CF66' },
  { value: 20, label: '💪 Orta', color: '#FCC419' },
  { value: 30, label: '🔥 Zor', color: '#FF6B6B' },
];

export const AddTaskModal = ({ visible, onClose, onAdd, dayName, currentTaskCount = 0 }) => {
  const { COLORS } = useTheme();
  const [title, setTitle] = useState('');
  const [selectedPoints, setSelectedPoints] = useState(10);

  const remainingSlots = 15 - currentTaskCount;

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen bir görev adı girin');
      return;
    }

    if (currentTaskCount >= 15) {
      Alert.alert('Limit Doldu! ⚠️', 'Bir güne en fazla 15 görev eklenebilir.');
      return;
    }

    const result = await onAdd({ title: title.trim(), points: selectedPoints });
    setTitle('');
    setSelectedPoints(10);
  };

  const handleClose = () => {
    setTitle('');
    setSelectedPoints(10);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={[styles.modal, { backgroundColor: COLORS.card }]}>
            {/* Handle Bar */}
            <View style={[styles.handleBar, { backgroundColor: COLORS.lightGray }]} />

            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: COLORS.dark }]}>Yeni Görev</Text>
                <Text style={[styles.subtitle, { color: COLORS.gray }]}>
                  {dayName} • {remainingSlots} slot kaldı
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.closeButton, { backgroundColor: COLORS.background }]}
              >
                <Ionicons name="close" size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            {/* Limit uyarısı */}
            {currentTaskCount >= 12 && currentTaskCount < 15 && (
              <View style={[styles.warningBanner, { backgroundColor: COLORS.warning + '20' }]}>
                <Ionicons name="warning" size={16} color={COLORS.warning} />
                <Text style={[styles.warningText, { color: COLORS.warning }]}>
                  Sadece {remainingSlots} görev daha ekleyebilirsin!
                </Text>
              </View>
            )}

            {currentTaskCount >= 15 ? (
              <View style={styles.limitReached}>
                <Text style={styles.limitEmoji}>⚠️</Text>
                <Text style={[styles.limitText, { color: COLORS.dark }]}>
                  Günlük limit doldu!
                </Text>
                <Text style={[styles.limitSubtext, { color: COLORS.gray }]}>
                  Bu güne en fazla 15 görev eklenebilir.
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Input */}
                <View style={styles.section}>
                  <Text style={[styles.label, { color: COLORS.dark }]}>Görev Adı</Text>
                  <View style={[styles.inputWrapper, {
                    backgroundColor: COLORS.background,
                    borderColor: title.length > 0 ? COLORS.primary : COLORS.lightGray,
                  }]}>
                    <TextInput
                      style={[styles.input, { color: COLORS.dark }]}
                      placeholder="Örn: 30 dk kitap oku..."
                      placeholderTextColor={COLORS.lightGray}
                      value={title}
                      onChangeText={setTitle}
                      maxLength={50}
                      autoFocus
                    />
                  </View>
                  <Text style={[styles.charCount, { color: COLORS.lightGray }]}>
                    {title.length}/50
                  </Text>
                </View>

                {/* Points */}
                <View style={styles.section}>
                  <Text style={[styles.label, { color: COLORS.dark }]}>Zorluk Seviyesi</Text>
                  <View style={styles.pointsRow}>
                    {POINT_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.pointButton,
                          { borderColor: option.color },
                          selectedPoints === option.value && {
                            backgroundColor: option.color,
                          },
                        ]}
                        onPress={() => setSelectedPoints(option.value)}
                      >
                        <Text style={[
                          styles.pointLabel,
                          { color: selectedPoints === option.value ? '#FFFFFF' : option.color },
                        ]}>
                          {option.label}
                        </Text>
                        <Text style={[
                          styles.pointValue,
                          { color: selectedPoints === option.value ? '#FFFFFF' : option.color },
                        ]}>
                          +{option.value} puan
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Button */}
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: title.trim() ? COLORS.primary : COLORS.lightGray },
                  ]}
                  onPress={handleAdd}
                  disabled={!title.trim()}
                >
                  <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Görevi Ekle</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
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
  container: { justifyContent: 'flex-end' },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SIZES.lg,
    paddingBottom: SIZES.xxl,
    minHeight: 400,
  },
  handleBar: {
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
    marginBottom: SIZES.lg,
  },
  title: { ...FONTS.h3 },
  subtitle: { ...FONTS.small, marginTop: 4 },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: 8,
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  warningText: { ...FONTS.small, fontWeight: '600' },
  limitReached: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  limitEmoji: { fontSize: 48, marginBottom: SIZES.md },
  limitText: { ...FONTS.h3, marginBottom: SIZES.sm },
  limitSubtext: { ...FONTS.body, textAlign: 'center' },
  section: { marginBottom: SIZES.lg },
  label: { ...FONTS.h4, marginBottom: SIZES.sm },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  input: { ...FONTS.body },
  charCount: { ...FONTS.tiny, textAlign: 'right', marginTop: 4 },
  pointsRow: { gap: SIZES.sm },
  pointButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  pointLabel: { ...FONTS.body, fontWeight: '600' },
  pointValue: { ...FONTS.small, fontWeight: 'bold' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.md,
    borderRadius: 14,
    gap: SIZES.sm,
    marginTop: SIZES.sm,
  },
  addButtonText: { ...FONTS.h3, color: '#FFFFFF' },
});