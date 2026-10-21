import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { colores } from '../constants/tema';
import { useHabitos } from '../context/HabitosContext';

// Franja que avisa cuando no hay internet o hay cambios sin sincronizar
export default function AvisoConexion() {
  const { enLinea, porSincronizar } = useHabitos();
  if (enLinea && porSincronizar === 0) return null;
  const texto = !enLinea
    ? `Sin conexión. Tus cambios se guardan en el dispositivo${porSincronizar ? ` (${porSincronizar} por sincronizar)` : ''}.`
    : `Sincronizando ${porSincronizar} cambio(s)…`;
  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <Ionicons name={enLinea ? 'sync' : 'cloud-offline-outline'} size={16} color={colores.aviso} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colores.avisoClaro, paddingHorizontal: 16, paddingVertical: 8 },
  texto: { flex: 1, fontSize: 13, color: colores.aviso, fontWeight: '600' },
});
