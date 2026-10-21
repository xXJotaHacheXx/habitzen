import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colores, radio } from '../constants/tema';

// variante: 'primario' | 'secundario' | 'peligro' | 'texto'
export default function Boton({ titulo, onPress, variante = 'primario', icono, cargando, deshabilitado, estilo }) {
  const v = VARIANTES[variante];
  const inactivo = deshabilitado || cargando;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      style={({ pressed }) => [styles.base, v.caja, inactivo && styles.inactivo, pressed && styles.presionado, estilo]}
    >
      {cargando ? (
        <ActivityIndicator color={v.texto.color} />
      ) : (
        <>
          {icono && <Ionicons name={icono} size={18} color={v.texto.color} />}
          <Text style={[styles.texto, v.texto]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const VARIANTES = {
  primario: { caja: { backgroundColor: colores.primario }, texto: { color: '#fff' } },
  secundario: { caja: { backgroundColor: '#fff', borderWidth: 2, borderColor: colores.primario }, texto: { color: colores.primario } },
  peligro: { caja: { backgroundColor: '#fff', borderWidth: 2, borderColor: colores.peligro }, texto: { color: colores.peligro } },
  texto: { caja: { backgroundColor: 'transparent' }, texto: { color: colores.primario } },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: radio.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  texto: { fontSize: 16, fontWeight: '700' },
  inactivo: { opacity: 0.5 },
  presionado: { opacity: 0.8 },
});
