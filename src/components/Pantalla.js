import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { colores } from '../constants/tema';

// Contenedor de pantalla con scroll y ancho máximo (para que en computadora no se estire)
export default function Pantalla({ children, cabecera, pie }) {
  return (
    <KeyboardAvoidingView style={styles.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {cabecera}
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <View style={styles.ancho}>{children}</View>
      </ScrollView>
      {pie}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, paddingBottom: 96 },
  ancho: { width: '100%', maxWidth: 640, alignSelf: 'center', gap: 16 },
});
