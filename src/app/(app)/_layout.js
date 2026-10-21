// Zona privada de la app: solo con sesión iniciada.
import { Redirect, Stack } from 'expo-router';
import Cargando from '../../components/Cargando';
import { colores } from '../../constants/tema';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Cargando />;
  if (!usuario) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="habito/nuevo" options={{ title: 'Nuevo hábito' }} />
      <Stack.Screen name="habito/[id]" options={{ title: 'Detalle' }} />
      <Stack.Screen name="habito/editar/[id]" options={{ title: 'Editar hábito' }} />
    </Stack>
  );
}
