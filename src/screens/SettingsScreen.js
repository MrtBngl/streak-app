import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { SIZES, FONTS } from '../constants/theme';

export const SettingsScreen = () => {
  const { theme, COLORS, toggleTheme } = useTheme();
  const { stats } = useApp();
  const { user, logout, updateUser } = useAuth();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');

  const themeOptions = [
    { id: 'light', name: 'Açık Mod ☀️', icon: 'sunny' },
    { id: 'dark', name: 'Karanlık Mod 🌙', icon: 'moon' },
    { id: 'auto', name: 'Otomatik 🔄', icon: 'contrast' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabından çıkmak istediğinden emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ Verileri Sıfırla',
      'Tüm görevlerin, puanların, serilerin ve rozetlerin silinecek. Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet, Sıfırla',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@streaklife_weekly_tasks',
                '@streaklife_stats',
              ]);
              Alert.alert(
                '✅ Sıfırlandı',
                'Tüm veriler silindi. Uygulama yeniden başlatılıyor...',
                [{
                  text: 'Tamam',
                  onPress: async () => {
                    // Uygulamayı yeniden başlatmak için logout-login yap
                    await logout();
                  }
                }]
              );
            } catch (error) {
              Alert.alert('Hata', 'Veriler silinirken bir sorun oluştu.');
            }
          },
        },
      ]
    );
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı boş olamaz!');
      return;
    }
    await updateUser({ username: newUsername.trim() });
    setEditingUsername(false);
    Alert.alert('✅ Güncellendi', 'Kullanıcı adın değiştirildi!');
  };

  const getAvatarEmoji = () => {
    switch (user?.currentAvatar) {
      case 'avatar_cool': return '😎';
      case 'avatar_star': return '⭐';
      default: return '👤';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.dark }]}>Ayarlar ⚙️</Text>
        </View>

        {/* ===== HESABIM ===== */}
        <View style={[styles.section, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>👤 Hesabım</Text>

          {/* Avatar ve kullanıcı bilgisi */}
          <View style={styles.profileRow}>
            <View style={[styles.avatarCircle, { backgroundColor: COLORS.primary + '20' }]}>
              <Text style={styles.avatarEmoji}>{getAvatarEmoji()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileUsername, { color: COLORS.dark }]}>
                {user?.username}
              </Text>
              <Text style={[styles.profileEmail, { color: COLORS.gray }]}>
                {user?.email}
              </Text>
            </View>
          </View>

          {/* Kullanıcı adı düzenleme */}
          {editingUsername ? (
            <View style={styles.editRow}>
              <View style={[styles.editInput, { backgroundColor: COLORS.background, borderColor: COLORS.primary }]}>
                <TextInput
                  style={[styles.editInputText, { color: COLORS.dark }]}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  autoFocus
                  maxLength={20}
                  placeholder="Yeni kullanıcı adı"
                  placeholderTextColor={COLORS.lightGray}
                />
              </View>
              <TouchableOpacity
                style={[styles.editSaveBtn, { backgroundColor: COLORS.success }]}
                onPress={handleUpdateUsername}
              >
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editCancelBtn, { backgroundColor: COLORS.lightGray }]}
                onPress={() => {
                  setNewUsername(user?.username || '');
                  setEditingUsername(false);
                }}
              >
                <Ionicons name="close" size={20} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.menuItem, { borderTopColor: COLORS.lightGray }]}
              onPress={() => setEditingUsername(true)}
            >
              <Ionicons name="pencil-outline" size={20} color={COLORS.gray} />
              <Text style={[styles.menuText, { color: COLORS.dark }]}>
                Kullanıcı Adını Değiştir
              </Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} />
            </TouchableOpacity>
          )}

          {/* Çıkış Yap */}
          <TouchableOpacity
            style={[styles.menuItem, { borderTopColor: COLORS.lightGray }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.menuText, { color: COLORS.danger }]}>
              Çıkış Yap
            </Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} />
          </TouchableOpacity>
        </View>

        {/* ===== TEMA ===== */}
        <View style={[styles.section, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>🎨 Tema</Text>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.themeOption,
                theme === option.id && { backgroundColor: COLORS.primary + '15', borderRadius: 10 },
              ]}
              onPress={() => toggleTheme(option.id)}
            >
              <Ionicons
                name={option.icon}
                size={22}
                color={theme === option.id ? COLORS.primary : COLORS.gray}
              />
              <Text style={[
                styles.themeText,
                { color: theme === option.id ? COLORS.primary : COLORS.dark },
              ]}>
                {option.name}
              </Text>
              {theme === option.id && (
                <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== İSTATİSTİKLER ===== */}
        <View style={[styles.section, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>📊 İstatistikler</Text>
          {[
            { label: '⭐ Toplam Puan', value: stats.totalPoints },
            { label: '🎯 Seviye', value: stats.level },
            { label: '✅ Tamamlanan Görev', value: stats.totalTasksCompleted },
            { label: '🔥 En Uzun Seri', value: `${stats.longestStreak} gün` },
            { label: '🏆 Kazanılan Rozet', value: stats.unlockedAchievements?.length || 0 },
          ].map((item, i, arr) => (
            <View key={i} style={[styles.statRow, {
              borderBottomColor: COLORS.lightGray,
              borderBottomWidth: i < arr.length - 1 ? 1 : 0,
            }]}>
              <Text style={[styles.statLabel, { color: COLORS.gray }]}>{item.label}</Text>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ===== ENVANTER ===== */}
        <View style={[styles.section, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>🎒 Envanter</Text>
          {[
            { label: '❄️ Seri Dondurucu', value: `${stats.streakFreezes || 0} adet` },
            { label: '⚡ Çift Puan', value: stats.doublePointsActive ? '✅ Aktif' : '❌ Pasif' },
          ].map((item, i, arr) => (
            <View key={i} style={[styles.statRow, {
              borderBottomColor: COLORS.lightGray,
              borderBottomWidth: i < arr.length - 1 ? 1 : 0,
            }]}>
              <Text style={[styles.statLabel, { color: COLORS.gray }]}>{item.label}</Text>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ===== TEHLİKELİ BÖLGE ===== */}
        <View style={[styles.dangerSection, { borderColor: COLORS.danger }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.danger }]}>
            ⚠️ Tehlikeli Bölge
          </Text>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: COLORS.danger }]}
            onPress={handleResetData}
          >
            <Ionicons name="trash-bin" size={20} color="#FFFFFF" />
            <Text style={styles.resetButtonText}>Tüm Verileri Sıfırla</Text>
          </TouchableOpacity>
          <Text style={[styles.warningNote, { color: COLORS.gray }]}>
            Görevler, puanlar, seriler ve rozetler silinir. Hesabın korunur.
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: COLORS.lightGray }]}>
            StreakLife v1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: COLORS.lightGray }]}>
            Made with ❤️ for productivity
          </Text>
        </View>

        <View style={{ height: SIZES.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.lg },
  header: { marginBottom: SIZES.lg, marginTop: SIZES.md },
  title: { ...FONTS.h1 },
  section: {
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { ...FONTS.h4, marginBottom: SIZES.md },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
    gap: SIZES.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileUsername: { ...FONTS.h4 },
  profileEmail: { ...FONTS.small, marginTop: 4 },
  editRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  editInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  editInputText: { ...FONTS.body },
  editSaveBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCancelBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    gap: SIZES.md,
  },
  menuText: { ...FONTS.body, flex: 1 },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    gap: SIZES.md,
    marginBottom: SIZES.xs,
  },
  themeText: { ...FONTS.body, flex: 1 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
  },
  statLabel: { ...FONTS.body },
  statValue: { ...FONTS.body, fontWeight: 'bold' },
  dangerSection: {
    padding: SIZES.lg,
    borderRadius: 16,
    marginBottom: SIZES.md,
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    gap: SIZES.sm,
  },
  resetButtonText: { ...FONTS.body, color: '#FFFFFF', fontWeight: 'bold' },
  warningNote: { ...FONTS.small, textAlign: 'center', marginTop: SIZES.sm, lineHeight: 18 },
  appInfo: { alignItems: 'center', marginTop: SIZES.lg, gap: SIZES.xs },
  appInfoText: { ...FONTS.tiny },
});