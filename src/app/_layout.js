// Layout raíz: proveedores de estado globales y navegación principal.
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { HabitosProvider } from '../context/HabitosContext';
import { configurarNotificaciones, escucharToques } from '../services/notificaciones';

function Notificaciones() {
  const router = useRouter();
  useEffect(() => {
    configurarNotificaciones();
    // Al tocar un recordatorio se abre el detalle del hábito
    return escucharToques((id) => router.push(`/habito/${id}`));
  }, [router]);
  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <HabitosProvider>
        <StatusBar style="light" />
        <Notificaciones />
        <Stack screenOptions={{ headerShown: false }} />
      </HabitosProvider>
    </AuthProvider>
  );
}
