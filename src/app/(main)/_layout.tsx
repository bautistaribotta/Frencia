/* Frencia · Stack de la app autenticada. Aca crecen las pantallas
   principales (home y, mas adelante, historial, rutinas, etc). */

import { Stack } from 'expo-router';

export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
