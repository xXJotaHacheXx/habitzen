import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores } from '../constants/tema';
import { aISO, hoyISO, MESES } from '../utils/fechas';
import { tocaElDia } from '../utils/rachas';

const ENCABEZADO = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Calendario mensual con los días cumplidos del hábito
export default function Calendario({ habito }) {
  const hoy = hoyISO();
  const [mes, setMes] = useState(() => {
    const f = new Date();
    return { anio: f.getFullYear(), mes: f.getMonth() };
  });

  const primero = new Date(mes.anio, mes.mes, 1);
  const diasEnMes = new Date(mes.anio, mes.mes + 1, 0).getDate();
  const huecos = (primero.getDay() + 6) % 7; // la semana empieza en lunes
  const celdas = [
    ...Array(huecos).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => aISO(new Date(mes.anio, mes.mes, i + 1))),
  ];

  const mover = (delta) =>
    setMes(({ anio, mes: m }) => {
      const f = new Date(anio, m + delta, 1);
      return { anio: f.getFullYear(), mes: f.getMonth() };
    });
  const esMesActual = mes.anio === new Date().getFullYear() && mes.mes === new Date().getMonth();

  return (
    <View>
      <View style={styles.cabecera}>
        <Pressable onPress={() => mover(-1)} hitSlop={10} accessibilityLabel="Mes anterior">
          <Ionicons name="chevron-back" size={22} color={colores.texto} />
        </Pressable>
        <Text style={styles.mes}>{MESES[mes.mes]} {mes.anio}</Text>
        <Pressable onPress={() => mover(1)} hitSlop={10} disabled={esMesActual} accessibilityLabel="Mes siguiente">
          <Ionicons name="chevron-forward" size={22} color={esMesActual ? colores.borde : colores.texto} />
        </Pressable>
      </View>
      <View style={styles.grid}>
        {ENCABEZADO.map((d, i) => (
          <Text key={`e${i}`} style={styles.diaSemana}>{d}</Text>
        ))}
        {celdas.map((iso, i) => {
          if (!iso) return <View key={`h${i}`} style={styles.celda} />;
          const hecho = habito.historial.includes(iso);
          const futuro = iso > hoy;
          const fuera = iso < habito.fechaCreacion || !tocaElDia(habito, iso);
          return (
            <View key={iso} style={styles.celda}>
              <View style={[styles.circulo, hecho && styles.hecho, iso === hoy && !hecho && styles.hoy]}>
                <Text style={[styles.numero, hecho && styles.numeroHecho, (futuro || fuera) && !hecho && styles.numeroTenue]}>
                  {Number(iso.slice(8))}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  mes: { fontSize: 16, fontWeight: '700', color: colores.texto, textTransform: 'capitalize' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  diaSemana: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, fontWeight: '700', color: colores.textoSuave, marginBottom: 6 },
  celda: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  circulo: { width: '80%', height: '80%', maxWidth: 38, maxHeight: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  hecho: { backgroundColor: colores.primario },
  hoy: { borderWidth: 2, borderColor: colores.primario },
  numero: { fontSize: 13, color: colores.texto },
  numeroHecho: { color: '#fff', fontWeight: '700' },
  numeroTenue: { color: '#94A3B8' },
});
