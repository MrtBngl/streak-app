import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@streaklife_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.log('User load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      // Kullanıcı zaten var mı kontrol et
      const existingUsers = await AsyncStorage.getItem('@streaklife_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const emailExists = users.find(u => u.email === email);
      if (emailExists) {
        return { success: false, message: 'Bu e-posta adresi zaten kullanılıyor!' };
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        avatar: 'default',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem('@streaklife_users', JSON.stringify(users));
      
      // Giriş yap
      const userToStore = { ...newUser };
      delete userToStore.password;
      await AsyncStorage.setItem('@streaklife_user', JSON.stringify(userToStore));
      setUser(userToStore);

      return { success: true };
    } catch (e) {
      return { success: false, message: 'Kayıt olurken hata oluştu!' };
    }
  };

  const login = async (email, password) => {
    try {
      const existingUsers = await AsyncStorage.getItem('@streaklife_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { success: false, message: 'E-posta veya şifre hatalı!' };
      }

      const userToStore = { ...foundUser };
      delete userToStore.password;
      await AsyncStorage.setItem('@streaklife_user', JSON.stringify(userToStore));
      setUser(userToStore);

      return { success: true };
    } catch (e) {
      return { success: false, message: 'Giriş yapılırken hata oluştu!' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@streaklife_user');
      setUser(null);
    } catch (e) {}
  };

  const updateUser = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('@streaklife_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Users listesini de güncelle
      const existingUsers = await AsyncStorage.getItem('@streaklife_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      );
      await AsyncStorage.setItem('@streaklife_users', JSON.stringify(updatedUsers));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);