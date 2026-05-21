import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS } from '../constants/theme';

export const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { COLORS } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Hata', result.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="flame" size={60} color="#FFFFFF" />
            <Text style={styles.logoText}>StreakLife</Text>
            <Text style={styles.logoSubtext}>Alışkanlıklarını takip et, başar!</Text>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.title, { color: COLORS.dark }]}>Tekrar Hoş Geldin! 👋</Text>
            <Text style={[styles.subtitle, { color: COLORS.gray }]}>
              Hesabına giriş yap
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: COLORS.dark }]}>E-posta</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.card, borderColor: COLORS.lightGray }]}>
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
                <TextInput
                  style={[styles.input, { color: COLORS.dark }]}
                  placeholder="ornek@email.com"
                  placeholderTextColor={COLORS.lightGray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: COLORS.dark }]}>Şifre</Text>
              <View style={[styles.inputWrapper, { backgroundColor: COLORS.card, borderColor: COLORS.lightGray }]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
                <TextInput
                  style={[styles.input, { color: COLORS.dark }]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.lightGray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { opacity: loading ? 0.7 : 1 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.registerText, { color: COLORS.gray }]}>
                Hesabın yok mu?{' '}
                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                  Kayıt Ol
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
    paddingTop: 60,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: SIZES.md,
  },
  logoSubtext: {
    ...FONTS.body,
    color: 'rgba(255,255,255,0.85)',
    marginTop: SIZES.sm,
  },
  form: {
    flex: 1,
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  title: { ...FONTS.h2, marginBottom: SIZES.xs },
  subtitle: { ...FONTS.body, marginBottom: SIZES.xl },
  inputContainer: { marginBottom: SIZES.lg },
  label: { ...FONTS.small, fontWeight: '600', marginBottom: SIZES.sm },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
  },
  input: { flex: 1, ...FONTS.body },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: SIZES.md,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginGradient: {
    padding: SIZES.md,
    alignItems: 'center',
  },
  loginButtonText: { ...FONTS.h3, color: '#FFFFFF' },
  registerLink: { alignItems: 'center', marginTop: SIZES.xl },
  registerText: { ...FONTS.body },
});