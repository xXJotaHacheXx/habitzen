import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import AvisoConexion from '../components/AvisoConexion';
import Boton from '../components/Boton';
import HabitoCard from '../components/HabitoCard';
import Pantalla from '../components/Pantalla';
import { colores, radio } from '../constants/tema';
import { useAuth } from '../context/AuthContext';
import { useHabitos } from '../context/HabitosContext';
import { fechaLarga, hoyISO } from '../utils/fechas';
import { cumplidoEnSemana, tocaElDia } from '../utils/rachas';

export default function MisHabitosScreen() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { habitos, cargando, alternarHoy } = useHabitos();
  const hoy = hoyISO();

  // Progreso del día: hábitos que tocan hoy y cuántos ya se cumplieron
  const deHoy = habitos.filter((h) => h.activo && (h.frecuencia === 'semanal' || tocaElDia(h, hoy)));
  const hechos = deHoy.filter((h) =>
    h.frecuencia === 'semanal' ? cumplidoEnSemana(h, hoy) : h.historial.includes(hoy)
  ).length;
  const porcentaje = deHoy.length ? Math.round((hechos / deHoy.length) * 100) : 0;

  return (
    <View style={{ flex: 1 }}>
      <Pantalla cabecera={<AvisoConexion />}>
        <View>
          <Text style={styles.saludo}>¡Hola, {usuario?.nombre.split(' ')[0]}!</Text>
          <Text style={styles.fecha}>{fechaLarga(hoy)}</Text>
        </View>

        <View style={styles.progreso}>
          <View style={styles.progresoTexto}>
            <Text style={styles.progresoTitulo}>Progreso de hoy</Text>
            <Text style={styles.progresoValor}>{hechos} de {deHoy.length}</Text>
          </View>
          <View style={styles.pista} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: porcentaje }}>
            <View style={[styles.relleno, { width: `${porcentaje}%` }]} />
          </View>
        </View>

        {cargando ? (
          <ActivityIndicator color={colores.primario} style={{ marginTop: 32 }} />
        ) : habitos.length === 0 ? (
          <View style={styles.vacio}>
            <Ionicons name="leaf-outline" size={48} color={colores.primario} />
            <Text style={styles.vacioTitulo}>Aún no tienes hábitos</Text>
            <Text style={styles.vacioTexto}>Empieza con algo pequeño, como tomar agua o leer 10 minutos.</Text>
            <Boton titulo="Crear mi primer hábito" icono="add" onPress={() => router.push('/habito/nuevo')} />
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {habitos.map((h) => (
              <HabitoCard
                key={h.id}
                habito={h}
                onPress={() => router.push(`/habito/${h.id}`)}
                onAlternar={() => alternarHoy(h.id)}
              />
            ))}
          </View>
        )}
      </Pantalla>

      {habitos.length > 0 && (
        <Pressable style={styles.fab} onPress={() => router.push('/habito/nuevo')} accessibilityRole="button" accessibilityLabel="Agregar hábito">
          <Ionicons name="add" size={30} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  saludo: { fontSize: 24, fontWeight: '800', color: colores.texto },
  fecha: { fontSize: 15, color: colores.textoSuave, marginTop: 2 },
  progreso: { backgroundColor: '#fff', borderRadius: radio.md, padding: 16, borderWidth: 1, borderColor: colores.borde },
  progresoTexto: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progresoTitulo: { fontWeight: '700', color: colores.texto },
  progresoValor: { color: colores.textoSuave },
  pista: { height: 10, borderRadius: 5, backgroundColor: colores.fondo, overflow: 'hidden' },
  relleno: { height: '100%', backgroundColor: colores.primario, borderRadius: 5 },
  vacio: { alignItems: 'center', gap: 10, paddingVertical: 32 },
  vacioTitulo: { fontSize: 18, fontWeight: '700', color: colores.texto },
  vacioTexto: { textAlign: 'center', color: colores.textoSuave, marginBottom: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colores.primario,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
});
