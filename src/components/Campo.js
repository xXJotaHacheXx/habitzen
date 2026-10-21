import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colores, radio } from '../constants/tema';

// Campo de texto con etiqueta y mensaje de error
export default function Campo({ etiqueta, error, estilo, ...props }) {
  return (
    <View style={[styles.contenedor, estilo]}>
      {etiqueta && <Text style={styles.etiqueta}>{etiqueta}</Text>}
      <TextInput
        placeholderTextColor={colores.textoSuave}
        style={[styles.input, error && styles.inputError]}
        accessibilityLabel={etiqueta}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: 16 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto, marginBottom: 6 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.md,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    fontSize: 16,
    color: colores.texto,
  },
  inputError: { borderColor: colores.peligro },
  error: { color: colores.peligro, fontSize: 13, marginTop: 4 },
});
