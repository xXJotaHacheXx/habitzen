import { StyleSheet, Text, View } from 'react-native';
import { colores } from '../constants/tema';

// Gráfica de barras sencilla hecha con View (sin librerías).
// datos: [{ etiqueta, valor (0-100 o null), resaltar }]
export default function GraficaBarras({ datos, alto = 150 }) {
  return (
    <View style={[styles.contenedor, { height: alto + 44 }]} accessibilityLabel={describir(datos)}>
      {datos.map((d, i) => (
        <View key={i} style={styles.columna}>
          <Text style={styles.valor}>{d.valor === null ? '' : `${d.valor}%`}</Text>
          <View style={[styles.pista, { height: alto }]}>
            {d.valor !== null && (
              <View
                style={[
                  styles.barra,
                  { height: `${Math.max(d.valor, 2)}%` },
                  d.resaltar ? styles.resaltada : null,
                ]}
              />
            )}
          </View>
          <Text style={[styles.etiqueta, d.resaltar && styles.etiquetaResaltada]}>{d.etiqueta}</Text>
        </View>
      ))}
    </View>
  );
}

const describir = (datos) =>
  datos.map((d) => `${d.etiqueta}: ${d.valor === null ? 'sin datos' : `${d.valor}%`}`).join(', ');

const styles = StyleSheet.create({
  contenedor: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  columna: { flex: 1, alignItems: 'center' },
  valor: { fontSize: 11, fontWeight: '700', color: colores.textoSuave, marginBottom: 4, height: 14 },
  pista: { width: '100%', maxWidth: 34, backgroundColor: colores.fondo, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barra: { width: '100%', backgroundColor: '#7CCBC3', borderRadius: 6 },
  resaltada: { backgroundColor: colores.primario },
  etiqueta: { fontSize: 12, color: colores.textoSuave, marginTop: 6 },
  etiquetaResaltada: { color: colores.primarioOscuro, fontWeight: '700' },
});
