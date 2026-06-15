import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useFrenciaFonts } from '@/design';
// PREVIEW TEMPORAL: arranca directo en el flujo de auth para verlo.
import LoginScreen from './login';
import RegisterScreen from './register';

const PREVIEW_AUTH = true;

type AuthView = 'login' | 'register';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFrenciaFonts();
  const [authView, setAuthView] = useState<AuthView>('login');

  // No bloquear para siempre si una fuente falla en cargar (web): renderizar igual.
  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {PREVIEW_AUTH ? (
        authView === 'login' ? (
          <LoginScreen onNavigateToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterScreen onNavigateToLogin={() => setAuthView('login')} />
        )
      ) : (
        <AppTabs />
      )}
    </ThemeProvider>
  );
}
