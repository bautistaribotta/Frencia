import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useFrenciaFonts } from '@/design';
// PREVIEW TEMPORAL: arranca directo en el login para verlo.
import LoginScreen from './login';

const PREVIEW_LOGIN = true;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFrenciaFonts();

  // No bloquear para siempre si una fuente falla en cargar (web): renderizar igual.
  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {PREVIEW_LOGIN ? <LoginScreen /> : <AppTabs />}
    </ThemeProvider>
  );
}
