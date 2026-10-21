import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, radio } from '../constants/tema';

// Selector de opciones en forma de "pastillas".
// opciones: [{ id, etiqueta, icono? }]; con multiple=true, valor es un arreglo.
export default function Chips({ opciones, valor, onCambiar, multiple = false }) {
  const activo = (id) => (multiple ? valor.includes(id) : valor === id);

  function tocar(id) {
    if (!multiple) return onCambiar(id);
    onCambiar(activo(id) ? valor.filter((v) => v !== id) : [...valor, id]);
  }

  return (
    <View style={styles.fila}>
      {opciones.map((o) => (
        <Pressable
          key={o.id}
          onPress={() => tocar(o.id)}
          accessibilityRole={multiple ? 'checkbox' : 'radio'}
          accessibilityState={{ checked: activo(o.id) }}
          accessibilityLabel={o.nombreAccesible ?? o.etiqueta}
          style={[styles.chip, activo(o.id) && styles.chipActivo]}
        >
          {o.icono && <Ionicons name={o.icono} size={16} color={activo(o.id) ? '#fff' : colores.texto} />}
          <Text style={[styles.texto, activo(o.id) && styles.textoActivo]}>{o.etiqueta}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: radio.pill,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: '#fff',
  },
  chipActivo: { backgroundColor: colores.primario, borderColor: colores.primario },
  texto: { fontSize: 14, color: colores.texto },
  textoActivo: { color: '#fff', fontWeight: '700' },
});
