import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// API pública que simula el CRUD durante la Unidad I
const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1&_limit=6';
const TEAL = '#14968C';

export default function App() {
  const [habitos, setHabitos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // READ: obtiene los registros y los adapta a la entidad Hábito
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((datos) => setHabitos(datos.map((t) => (
        { id: t.id, nombre: t.title, cumplido: t.completed }
      ))))
      .catch(() => setError('No se pudo conectar con la API'))
      .finally(() => setCargando(false));
  }, []);

  const alternar = (id) =>
    setHabitos((hs) => hs.map((h) => (h.id === id ? { ...h, cumplido: !h.cumplido } : h)));

  const hechos = habitos.filter((h) => h.cumplido).length;

  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />
      <View style={styles.barra}>
        <Text style={styles.titulo}>Mis hábitos</Text>
        <Text style={styles.subtitulo}>{hechos} de {habitos.length} completados hoy</Text>
      </View>

      {cargando && <ActivityIndicator size="large" color={TEAL} style={{ marginTop: 32 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={habitos}
        keyExtractor={(h) => String(h.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.nombre} numberOfLines={2}>{item.nombre}</Text>
            <Pressable
              onPress={() => alternar(item.id)}
              style={[styles.check, item.cumplido && styles.checkHecho]}
              accessibilityLabel="Marcar como cumplido"
            >
              <Text style={styles.checkTexto}>{item.cumplido ? '✓' : ''}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F4F4F4' },
  barra: {
    backgroundColor: TEAL, paddingHorizontal: 20, paddingBottom: 18,
    paddingTop: Platform.OS === 'web' ? 18 : 56, // espacio para la barra de estado
  },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitulo: { color: '#E0F2F1', marginTop: 4 },
  tarjeta: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#DDD',
    padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  nombre: { flex: 1, marginRight: 12, fontSize: 15, color: '#444' },
  check: {
    width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#AAA',
    alignItems: 'center', justifyContent: 'center',
  },
  checkHecho: { backgroundColor: TEAL, borderColor: TEAL },
  checkTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },
  error: { color: '#C62828', textAlign: 'center', marginTop: 24 },
});
