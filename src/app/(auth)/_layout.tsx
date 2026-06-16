/* Frencia · Stack del flujo no autenticado (login / registro). */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
