// Pantallas de acceso. Si ya hay sesión, se manda directo a los hábitos.
import { Redirect, Stack } from 'expo-router';
import Cargando from '../../components/Cargando';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Cargando />;
  if (usuario) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
