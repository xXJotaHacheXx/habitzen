import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, infoCategoria, radio } from '../constants/tema';
import { hoyISO } from '../utils/fechas';
import { cumplidoEnSemana, rachaActual, tocaElDia, unidadRacha } from '../utils/rachas';

// Tarjeta de un hábito en la lista: nombre, meta, racha y botón para marcar cumplido
export default function HabitoCard({ habito, onPress, onAlternar }) {
  const hoy = hoyISO();
  const cat = infoCategoria(habito.categoria);
  const racha = rachaActual(habito, hoy);
  const hechoHoy = habito.historial.includes(hoy);
  const semanalHecho = habito.frecuencia === 'semanal' && cumplidoEnSemana(habito, hoy);
  const descansa = !tocaElDia(habito, hoy);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tarjeta, pressed && { opacity: 0.85 }]} accessibilityRole="button" accessibilityLabel={`Ver ${habito.nombre}`}>
      <View style={[styles.icono, { backgroundColor: cat.color + '22' }]}>
        <Ionicons name={cat.icono} size={22} color={cat.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>{habito.nombre}</Text>
        <Text style={styles.meta}>
          {habito.categoria} · {habito.metaDiaria} {habito.unidad}
          {habito.recordatorioActivo ? `  ·  ⏰ ${habito.horaRecordatorio}` : ''}
        </Text>
        <Text style={styles.racha}>
          🔥 {racha} {unidadRacha(habito, racha)}
          {descansa ? '  ·  hoy descansa' : semanalHecho && !hechoHoy ? '  ·  semana cumplida' : ''}
        </Text>
      </View>
      <Pressable
        onPress={onAlternar}
        hitSlop={8}
        disabled={descansa && !hechoHoy}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: hechoHoy }}
        accessibilityLabel={`Marcar ${habito.nombre} como cumplido hoy`}
        style={[styles.check, hechoHoy && styles.checkHecho, descansa && !hechoHoy && { opacity: 0.35 }]}
      >
        {hechoHoy && <Ionicons name="checkmark" size={22} color="#fff" />}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: radio.md,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  icono: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  nombre: { fontSize: 16, fontWeight: '700', color: colores.texto },
  meta: { fontSize: 13, color: colores.textoSuave },
  racha: { fontSize: 13, fontWeight: '700', color: colores.primarioOscuro },
  check: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkHecho: { backgroundColor: colores.primario, borderColor: colores.primario },
});
