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

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const { COLORS } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır!');
      return;
    }

    setLoading(true);
    const result = await register(username.trim(), email.trim(), password);
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
          {/* Header */}
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="flame" size={48} color="#FFFFFF" />
            <Text style={styles.headerTitle}>StreakLife</Text>
            <Text style={styles.headerSubtext}>Hesap Oluştur</Text>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.title, { color: COLORS.dark }]}>Merhaba! 👋</Text>
            <Text style={[styles.subtitle, { color: COLORS.gray }]}>
              Yeni hesap oluştur
            </Text>

            {[
              {
                label: 'Kullanıcı Adı',
                icon: 'person-outline',
                value: username,
                setter: setUsername,
                placeholder: 'kullanici_adi',
                keyboardType: 'default',
                secure: false,
              },
              {
                label: 'E-posta',
                icon: 'mail-outline',
                value: email,
                setter: setEmail,
                placeholder: 'ornek@email.com',
                keyboardType: 'email-address',
                secure: false,
              },
              {
                label: 'Şifre',
                icon: 'lock-closed-outline',
                value: password,
                setter: setPassword,
                placeholder: 'En az 6 karakter',
                keyboardType: 'default',
                secure: true,
              },
              {
                label: 'Şifre Tekrar',
                icon: 'lock-closed-outline',
                value: confirmPassword,
                setter: setConfirmPassword,
                placeholder: 'Şifreni tekrar gir',
                keyboardType: 'default',
                secure: true,
              },
            ].map((field, i) => (
              <View key={i} style={styles.inputContainer}>
                <Text style={[styles.label, { color: COLORS.dark }]}>{field.label}</Text>
                <View style={[styles.inputWrapper, {
                  backgroundColor: COLORS.card,
                  borderColor: COLORS.lightGray,
                }]}>
                  <Ionicons name={field.icon} size={20} color={COLORS.gray} />
                  <TextInput
                    style={[styles.input, { color: COLORS.dark }]}
                    placeholder={field.placeholder}
                    placeholderTextColor={COLORS.lightGray}
                    value={field.value}
                    onChangeText={field.setter}
                    keyboardType={field.keyboardType}
                    autoCapitalize="none"
                    secureTextEntry={field.secure && !showPassword}
                  />
                  {field.secure && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={COLORS.gray}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.registerButton, { opacity: loading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.registerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.loginText, { color: COLORS.gray }]}>
                Zaten hesabın var mı?{' '}
                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                  Giriş Yap
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
  header: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: SIZES.md,
  },
  headerSubtext: { ...FONTS.body, color: 'rgba(255,255,255,0.85)', marginTop: SIZES.xs },
  form: { flex: 1, padding: SIZES.lg, paddingTop: SIZES.xl },
  title: { ...FONTS.h2, marginBottom: SIZES.xs },
  subtitle: { ...FONTS.body, marginBottom: SIZES.lg },
  inputContainer: { marginBottom: SIZES.md },
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
  registerButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: SIZES.md,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerGradient: { padding: SIZES.md, alignItems: 'center' },
  registerButtonText: { ...FONTS.h3, color: '#FFFFFF' },
  loginLink: { alignItems: 'center', marginTop: SIZES.xl, marginBottom: SIZES.xl },
  loginText: { ...FONTS.body },
});