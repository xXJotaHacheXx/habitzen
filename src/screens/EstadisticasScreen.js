import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Chips from '../components/Chips';
import GraficaBarras from '../components/GraficaBarras';
import Pantalla from '../components/Pantalla';
import TarjetaClima from '../components/TarjetaClima';
import { colores, radio } from '../constants/tema';
import { useHabitos } from '../context/HabitosContext';
import { datosMes, datosSemana, resumenRango } from '../utils/estadisticas';
import { hoyISO, inicioSemana, sumarDias } from '../utils/fechas';
import { rachaActual } from '../utils/rachas';

export default function EstadisticasScreen() {
  const { habitos } = useHabitos();
  const [vista, setVista] = useState('semanal');
  const hoy = hoyISO();

  const activos = habitos.filter((h) => h.activo);
  const semana = resumenRango(activos, inicioSemana(hoy), hoy);
  const mes = resumenRango(activos, sumarDias(hoy, -27), hoy);
  const resumen = vista === 'semanal' ? semana : mes;
  const mejorRachaActual = Math.max(0, ...activos.map((h) => rachaActual(h, hoy)));
  const datos = vista === 'semanal' ? datosSemana(activos, hoy) : datosMes(activos, hoy);

  return (
    <Pantalla>
      <TarjetaClima />

      <Chips
        opciones={[{ id: 'semanal', etiqueta: 'Semanal' }, { id: 'mensual', etiqueta: 'Mensual' }]}
        valor={vista}
        onCambiar={setVista}
      />

      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>Cumplimiento (%)</Text>
        <Text style={styles.suave}>{vista === 'semanal' ? 'Esta semana, por día' : 'Últimas 4 semanas (inicio de cada semana)'}</Text>
        {activos.length === 0 ? (
          <Text style={[styles.suave, { marginTop: 16 }]}>Crea un hábito para ver tus estadísticas.</Text>
        ) : (
          <View style={{ marginTop: 12 }}>
            <GraficaBarras datos={datos} />
          </View>
        )}
      </View>

      <View style={styles.kpis}>
        <Kpi valor={resumen.porcentaje === null ? '—' : `${resumen.porcentaje}%`} etiqueta={vista === 'semanal' ? 'Promedio semanal' : 'Promedio del mes'} />
        <Kpi valor={`${resumen.hechos}/${resumen.esperados}`} etiqueta="Cumplidos" />
        <Kpi valor={String(mejorRachaActual)} etiqueta="Mejor racha activa" />
      </View>

      {activos.length > 0 && (
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Por hábito (últimos 28 días)</Text>
          {activos.map((h) => {
            const r = resumenRango([h], sumarDias(hoy, -27), hoy);
            return (
              <View key={h.id} style={styles.filaHabito}>
                <Text style={styles.nombre} numberOfLines={1}>{h.nombre}</Text>
                <View style={styles.pista}>
                  <View style={[styles.relleno, { width: `${r.porcentaje ?? 0}%` }]} />
                </View>
                <Text style={styles.porcentaje}>{r.porcentaje ?? 0}%</Text>
              </View>
            );
          })}
        </View>
      )}
    </Pantalla>
  );
}

function Kpi({ valor, etiqueta }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValor}>{valor}</Text>
      <Text style={styles.kpiEtiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#fff', borderRadius: radio.md, borderWidth: 1, borderColor: colores.borde, padding: 16 },
  titulo: { fontSize: 16, fontWeight: '700', color: colores.texto },
  suave: { fontSize: 13, color: colores.textoSuave, marginTop: 2 },
  kpis: { flexDirection: 'row', gap: 12 },
  kpi: { flex: 1, backgroundColor: '#fff', borderRadius: radio.md, borderWidth: 1, borderColor: colores.borde, padding: 12 },
  kpiValor: { fontSize: 22, fontWeight: '800', color: colores.primario },
  kpiEtiqueta: { fontSize: 12, color: colores.textoSuave, marginTop: 2 },
  filaHabito: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  nombre: { width: 110, color: colores.texto },
  pista: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colores.fondo, overflow: 'hidden' },
  relleno: { height: '100%', backgroundColor: colores.primario },
  porcentaje: { width: 42, textAlign: 'right', fontWeight: '700', color: colores.texto },
});
