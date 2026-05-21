import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/Logo';
import { SIZES, FONTS } from '../constants/theme';

const SHOP_ITEMS = [
  // Tüketilebilir
  {
    id: 'streak_freeze',
    name: '❄️ Seri Dondurucu',
    description: '1 gün görev yapmasan bile serini korur',
    price: 100,
    type: 'consumable',
    icon: 'snow',
    gradient: ['#74b9ff', '#0984e3'],
  },
  {
    id: 'double_points',
    name: '⚡ Çift Puan',
    description: '1 gün boyunca puanların 2 katına çıkar',
    price: 150,
    type: 'consumable',
    icon: 'flash',
    gradient: ['#fdcb6e', '#e17055'],
  },
  {
    id: 'triple_points',
    name: '💫 Üçlü Puan',
    description: '1 gün boyunca puanların 3 katına çıkar',
    price: 300,
    type: 'consumable',
    icon: 'star',
    gradient: ['#a29bfe', '#6c5ce7'],
  },
  {
    id: 'streak_freeze_3',
    name: '🧊 3x Seri Dondurucu',
    description: '3 adet seri dondurucu paketi',
    price: 250,
    type: 'consumable',
    icon: 'snow',
    gradient: ['#55efc4', '#00b894'],
    amount: 3,
  },
  // Temalar
  {
    id: 'theme_default',
    name: '🔥 Varsayılan Tema',
    description: 'Kırmızı/turuncu klasik tema',
    price: 0,
    type: 'theme',
    icon: 'flame',
    gradient: ['#FF6B6B', '#FF8E53'],
    primaryColor: '#FF6B6B',
    free: true,
  },
  {
    id: 'theme_ocean',
    name: '🌊 Okyanus Teması',
    description: 'Derin mavi sakinliği',
    price: 500,
    type: 'theme',
    icon: 'water',
    gradient: ['#667eea', '#764ba2'],
    primaryColor: '#667eea',
  },
  {
    id: 'theme_sunset',
    name: '🌅 Gün Batımı',
    description: 'Turuncu-pembe sıcaklığı',
    price: 500,
    type: 'theme',
    icon: 'sunny',
    gradient: ['#f093fb', '#f5576c'],
    primaryColor: '#f5576c',
  },
  {
    id: 'theme_forest',
    name: '🌿 Orman Teması',
    description: 'Doğanın yeşil huzuru',
    price: 500,
    type: 'theme',
    icon: 'leaf',
    gradient: ['#11998e', '#38ef7d'],
    primaryColor: '#11998e',
  },
  {
    id: 'theme_galaxy',
    name: '🌌 Galaksi Teması',
    description: 'Uzayın koyu şıklığı',
    price: 750,
    type: 'theme',
    icon: 'planet',
    gradient: ['#2C3E50', '#4CA1AF'],
    primaryColor: '#4CA1AF',
  },
  {
    id: 'theme_gold',
    name: '👑 Altın Tema',
    description: 'Prestijli altın görünümü',
    price: 1000,
    type: 'theme',
    icon: 'trophy',
    gradient: ['#F7971E', '#FFD200'],
    primaryColor: '#F7971E',
  },
];

export const ShopScreen = () => {
  const { stats, purchaseItem } = useApp();
  const { COLORS, applyTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('consumable');

  const handlePurchase = async (item) => {
    if (item.free) {
      applyTheme && applyTheme(item);
      Alert.alert('✅ Tema Uygulandı', `${item.name} aktif edildi!`);
      return;
    }

    if (isOwned(item.id) && item.type === 'theme') {
      applyTheme && applyTheme(item);
      Alert.alert('✅ Tema Uygulandı', `${item.name} aktif edildi!`);
      return;
    }

    Alert.alert(
      `${item.name}`,
      `${item.description}\n\nFiyat: ${item.price} 💎\nMevcut Puan: ${stats.totalPoints}\n\nSatın almak istiyor musun?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Satın Al 🛒',
          onPress: async () => {
            const result = await purchaseItem(item);
            if (result.success) {
              if (item.type === 'theme') {
                applyTheme && applyTheme(item);
              }
              Alert.alert('🎉 Başarılı!', result.message);
            } else {
              Alert.alert('❌ Hata', result.message);
            }
          },
        },
      ]
    );
  };

  const isOwned = (itemId) => {
    if (itemId === 'theme_default') return true;
    return stats.purchasedItems?.includes(itemId);
  };

  const isActive = (item) => {
    return stats.currentTheme === item.id;
  };

  const filteredItems = SHOP_ITEMS.filter(item => item.type === activeTab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.dark }]}>Mağaza 🛒</Text>
          <View style={[styles.pointsBadge, { backgroundColor: COLORS.success }]}>
            <Ionicons name="diamond" size={18} color="#FFFFFF" />
            <Text style={styles.pointsText}>{stats.totalPoints}</Text>
          </View>
        </View>

        {/* Active Items Banner */}
        {(stats.streakFreezes > 0 || stats.doublePointsActive) && (
          <View style={[styles.activeBanner, { backgroundColor: COLORS.card }]}>
            <Text style={[styles.activeBannerTitle, { color: COLORS.dark }]}>
              ⚡ Aktif Eşyalar
            </Text>
            <View style={styles.activeItems}>
              {stats.streakFreezes > 0 && (
                <View style={styles.activeItem}>
                  <Text style={styles.activeItemIcon}>❄️</Text>
                  <Text style={[styles.activeItemText, { color: COLORS.gray }]}>
                    x{stats.streakFreezes}
                  </Text>
                </View>
              )}
              {stats.doublePointsActive && (
                <View style={styles.activeItem}>
                  <Text style={styles.activeItemIcon}>⚡</Text>
                  <Text style={[styles.activeItemText, { color: COLORS.gray }]}>
                    Aktif!
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: COLORS.card }]}>
          {[
            { id: 'consumable', label: '🎁 Eşyalar' },
            { id: 'theme', label: '🎨 Temalar' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: COLORS.primary },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#FFFFFF' : COLORS.gray },
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Items */}
        {filteredItems.map((item) => {
          const owned = isOwned(item.id);
          const active = isActive(item);
          const canAfford = stats.totalPoints >= item.price;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                { backgroundColor: COLORS.card },
                active && { borderColor: COLORS.success, borderWidth: 2 },
              ]}
              onPress={() => handlePurchase(item)}
            >
              <LinearGradient
                colors={item.gradient}
                style={styles.itemIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={item.icon} size={28} color="#FFFFFF" />
              </LinearGradient>

              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: COLORS.dark }]}>{item.name}</Text>
                <Text style={[styles.itemDesc, { color: COLORS.gray }]}>
                  {item.description}
                </Text>
                {active && (
                  <Text style={[styles.activeLabel, { color: COLORS.success }]}>
                    ✓ Aktif Tema
                  </Text>
                )}
              </View>

              <View style={styles.itemRight}>
                {item.free || owned ? (
                  <TouchableOpacity
                    style={[styles.useButton, {
                      backgroundColor: active ? COLORS.success : COLORS.primary,
                    }]}
                    onPress={() => handlePurchase(item)}
                  >
                    <Text style={styles.useButtonText}>
                      {item.type === 'theme'
                        ? active ? '✓' : 'Uygula'
                        : owned && item.type === 'consumable' ? 'Var' : 'Uygula'
                      }
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.priceTag, {
                    backgroundColor: canAfford ? COLORS.primary + '20' : COLORS.lightGray,
                  }]}>
                    <Ionicons
                      name="diamond"
                      size={12}
                      color={canAfford ? COLORS.primary : COLORS.gray}
                    />
                    <Text style={[styles.priceText, {
                      color: canAfford ? COLORS.primary : COLORS.gray,
                    }]}>
                      {item.price}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: SIZES.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    marginTop: SIZES.md,
  },
  title: { ...FONTS.h1 },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: { ...FONTS.body, color: '#FFFFFF', fontWeight: 'bold' },
  activeBanner: {
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeBannerTitle: { ...FONTS.body, fontWeight: '600' },
  activeItems: { flexDirection: 'row', gap: SIZES.md },
  activeItem: { alignItems: 'center' },
  activeItemIcon: { fontSize: 24 },
  activeItemText: { ...FONTS.tiny, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: SIZES.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: { ...FONTS.body, fontWeight: '600' },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 16,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1, marginLeft: SIZES.md },
  itemName: { ...FONTS.body, fontWeight: '600', marginBottom: 4 },
  itemDesc: { ...FONTS.small },
  activeLabel: { ...FONTS.tiny, fontWeight: 'bold', marginTop: 4 },
  itemRight: { marginLeft: SIZES.sm },
  useButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 10,
  },
  useButtonText: { ...FONTS.small, color: '#FFFFFF', fontWeight: 'bold' },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,
    borderRadius: 10,
    gap: 4,
  },
  priceText: { ...FONTS.small, fontWeight: 'bold' },
});