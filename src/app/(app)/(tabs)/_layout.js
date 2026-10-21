// Barra inferior de pestañas.
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { colores } from '../../../constants/tema';

const icono = (nombre) => ({ color, size }) => <Ionicons name={nombre} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSuave,
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Mis hábitos', tabBarLabel: 'Hábitos', tabBarIcon: icono('checkmark-circle-outline') }} />
      <Tabs.Screen name="estadisticas" options={{ title: 'Estadísticas y bienestar', tabBarLabel: 'Estadísticas', tabBarIcon: icono('bar-chart-outline') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('person-circle-outline') }} />
    </Tabs>
  );
}
