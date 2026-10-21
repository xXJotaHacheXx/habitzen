// Diálogo de confirmación. Se usa Modal en lugar de Alert porque Alert no funciona en web.
import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, radio } from '../constants/tema';
import Boton from './Boton';

export default function Dialogo({ visible, titulo, mensaje, textoConfirmar = 'Aceptar', peligro, onConfirmar, onCancelar }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <Pressable style={styles.fondo} onPress={onCancelar}>
        <Pressable style={styles.caja} accessibilityRole="alert">
          <View style={[styles.icono, peligro && { backgroundColor: colores.peligroClaro }]}>
            <Ionicons name={peligro ? 'alert' : 'help'} size={26} color={peligro ? colores.peligro : colores.primario} />
          </View>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensaje}>{mensaje}</Text>
          <View style={styles.botones}>
            <Boton titulo="Cancelar" variante="secundario" onPress={onCancelar} estilo={styles.boton} />
            <Boton
              titulo={textoConfirmar}
              onPress={onConfirmar}
              estilo={[styles.boton, peligro && { backgroundColor: colores.peligro }]}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 },
  caja: { backgroundColor: '#fff', borderRadius: radio.lg, padding: 24, alignItems: 'center', maxWidth: 420, width: '100%', alignSelf: 'center' },
  icono: { width: 52, height: 52, borderRadius: 26, backgroundColor: colores.primarioClaro, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: '700', color: colores.texto, marginBottom: 8, textAlign: 'center' },
  mensaje: { fontSize: 15, color: colores.textoSuave, textAlign: 'center', marginBottom: 20 },
  botones: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  boton: { flex: 1, paddingHorizontal: 8 },
});
