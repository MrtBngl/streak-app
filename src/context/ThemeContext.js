import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

const ThemeContext = createContext({
  theme: 'auto',
  isDark: false,
  COLORS: LIGHT_COLORS,
  customPrimary: null,
  toggleTheme: () => {},
  applyTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto');
  const [customPrimary, setCustomPrimary] = useState(null);
  const [customGradient, setCustomGradient] = useState(null);

  const isDark = themeMode === 'auto'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const baseColors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const COLORS = {
    ...baseColors,
    primary: customPrimary || baseColors.primary,
    gradient1: customGradient || baseColors.gradient1,
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('@theme_preference');
      const savedCustom = await AsyncStorage.getItem('@theme_custom');
      if (saved) setThemeMode(saved);
      if (savedCustom) {
        const custom = JSON.parse(savedCustom);
        setCustomPrimary(custom.primary);
        setCustomGradient(custom.gradient);
      }
    } catch (e) {}
  };

  const toggleTheme = async (newTheme) => {
    setThemeMode(newTheme);
    try {
      await AsyncStorage.setItem('@theme_preference', newTheme);
    } catch (e) {}
  };

  const applyTheme = async (themeItem) => {
    try {
      setCustomPrimary(themeItem.primaryColor);
      setCustomGradient(themeItem.gradient);
      await AsyncStorage.setItem('@theme_custom', JSON.stringify({
        primary: themeItem.primaryColor,
        gradient: themeItem.gradient,
        id: themeItem.id,
      }));
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{
      theme: themeMode,
      isDark,
      COLORS,
      customPrimary,
      toggleTheme,
      applyTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);