import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, radio } from '../constants/tema';
import { obtenerClima } from '../services/clima';

// Clima actual + sugerencia de actividad al aire libre
export default function TarjetaClima() {
  const [clima, setClima] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      setClima(await obtenerClima());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  if (cargando && !clima) {
    return (
      <View style={[styles.tarjeta, styles.centro]}>
        <ActivityIndicator color={colores.primario} />
        <Text style={styles.suave}>Consultando el clima…</Text>
      </View>
    );
  }
  if (error && !clima) {
    return (
      <Pressable style={[styles.tarjeta, styles.centro]} onPress={cargar} accessibilityRole="button">
        <Ionicons name="cloud-offline-outline" size={22} color={colores.textoSuave} />
        <Text style={styles.suave}>{error} Toca para reintentar.</Text>
      </Pressable>
    );
  }

  const color = clima.aptoExterior ? colores.primarioOscuro : colores.aviso;
  return (
    <View style={[styles.tarjeta, { borderColor: color }]}>
      <Text style={[styles.encabezado, { color }]}>
        Clima · {clima.lugar}
        {clima.predeterminada ? ' (sin permiso de ubicación)' : ''}
      </Text>
      <View style={styles.fila}>
        <View style={[styles.icono, { borderColor: color }]}>
          <Ionicons name={clima.icono} size={26} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.temp}>
            {clima.temperatura} °C · {clima.texto}
          </Text>
          <Text style={styles.mensaje}>{clima.mensaje}</Text>
          {clima.desdeCache && <Text style={styles.suave}>Sin conexión: mostrando el último clima guardado.</Text>}
        </View>
        <Pressable onPress={cargar} hitSlop={10} accessibilityLabel="Actualizar clima">
          <Ionicons name="refresh" size={20} color={colores.textoSuave} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: colores.primarioClaro, borderWidth: 2, borderColor: colores.primario, borderRadius: radio.md, padding: 14 },
  centro: { flexDirection: 'row', alignItems: 'center', gap: 10, borderColor: colores.borde, backgroundColor: '#fff' },
  encabezado: { fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icono: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  temp: { fontSize: 17, fontWeight: '700', color: colores.texto },
  mensaje: { fontSize: 14, color: colores.texto, marginTop: 2 },
  suave: { fontSize: 13, color: colores.textoSuave, flexShrink: 1 },
});
