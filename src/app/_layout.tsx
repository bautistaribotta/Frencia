import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useFrenciaFonts } from '@/design';
// PREVIEW TEMPORAL: arranca directo en el flujo de auth para verlo.
import HomeScreen from './home';
import LoginScreen from './login';
import RegisterScreen from './register';

const PREVIEW_AUTH = true;

type AuthView = 'login' | 'register' | 'home';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFrenciaFonts();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [userName, setUserName] = useState<string | undefined>(undefined);

  // No bloquear para siempre si una fuente falla en cargar (web): renderizar igual.
  if (!fontsLoaded && !fontError) return null;

  function renderAuth() {
    if (authView === 'home') {
      return <HomeScreen userName={userName} />;
    }
    if (authView === 'register') {
      return <RegisterScreen onNavigateToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginScreen
        onNavigateToRegister={() => setAuthView('register')}
        onLoginSuccess={(name) => {
          setUserName(name);
          setAuthView('home');
        }}
      />
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {PREVIEW_AUTH ? renderAuth() : <AppTabs />}
    </ThemeProvider>
  );
}
