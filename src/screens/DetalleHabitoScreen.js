import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import Calendario from '../components/Calendario';
import Dialogo from '../components/Dialogo';
import Pantalla from '../components/Pantalla';
import { colores, FRECUENCIAS, infoCategoria, radio } from '../constants/tema';
import { useHabitos } from '../context/HabitosContext';
import { DIAS_NOMBRE, hoyISO, sumarDias } from '../utils/fechas';
import { resumenRango } from '../utils/estadisticas';
import { mejorRacha, rachaActual, tocaElDia, unidadRacha } from '../utils/rachas';

export default function DetalleHabitoScreen({ id }) {
  const router = useRouter();
  const { obtener, alternarHoy, eliminar } = useHabitos();
  const [confirmando, setConfirmando] = useState(false);
  const habito = obtener(id);

  if (!habito) {
    return (
      <Pantalla>
        <Text style={styles.suave}>Este hábito no existe o fue eliminado.</Text>
        <Boton titulo="Volver a mis hábitos" onPress={() => router.replace('/')} />
      </Pantalla>
    );
  }

  const hoy = hoyISO();
  const racha = rachaActual(habito, hoy);
  const mejor = mejorRacha(habito, hoy);
  const hechoHoy = habito.historial.includes(hoy);
  const descansa = !tocaElDia(habito, hoy);
  const mes = resumenRango([habito], sumarDias(hoy, -29), hoy);
  const cat = infoCategoria(habito.categoria);
  const frecuencia =
    habito.frecuencia === 'dias'
      ? habito.diasSemana.map((d) => DIAS_NOMBRE[d]).join(', ')
      : FRECUENCIAS.find((f) => f.id === habito.frecuencia).etiqueta;

  async function borrar() {
    setConfirmando(false);
    await eliminar(id);
    router.replace('/');
  }

  return (
    <Pantalla>
      <Stack.Screen options={{ title: habito.nombre }} />

      <View style={styles.rachas}>
        <View>
          <Text style={styles.suave}>Racha actual</Text>
          <Text style={styles.rachaValor}>{racha} {unidadRacha(habito, racha)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.suave}>Mejor racha</Text>
          <Text style={[styles.rachaValor, { color: colores.texto }]}>{mejor} {unidadRacha(habito, mejor)}</Text>
        </View>
      </View>

      <Boton
        titulo={hechoHoy ? 'Cumplido hoy ✓ (toca para deshacer)' : descansa ? 'Hoy no toca este hábito' : 'Marcar como cumplido hoy'}
        icono={hechoHoy ? undefined : 'checkmark-circle-outline'}
        variante={hechoHoy ? 'secundario' : 'primario'}
        deshabilitado={descansa && !hechoHoy}
        onPress={() => alternarHoy(id)}
      />

      <View style={styles.tarjeta}>
        <Calendario habito={habito} />
        <Text style={[styles.suave, { marginTop: 8 }]}>
          Últimos 30 días: {mes.hechos} de {mes.esperados} cumplidos{mes.porcentaje !== null ? ` (${mes.porcentaje}%)` : ''}
        </Text>
      </View>

      <View style={styles.tarjeta}>
        <Dato icono={cat.icono} etiqueta="Categoría" valor={habito.categoria} />
        <Dato icono="repeat" etiqueta="Frecuencia" valor={frecuencia} />
        <Dato icono="flag-outline" etiqueta="Meta diaria" valor={`${habito.metaDiaria} ${habito.unidad}`} />
        <Dato icono="alarm-outline" etiqueta="Recordatorio" valor={habito.recordatorioActivo ? habito.horaRecordatorio : 'Desactivado'} />
        <Dato icono="cloud-done-outline" etiqueta="Sincronizado" valor={habito.remoteId ? 'Sí, guardado en la nube' : 'Pendiente'} ultimo />
      </View>

      <View style={styles.botones}>
        <Boton titulo="Editar" icono="create-outline" onPress={() => router.push(`/habito/editar/${id}`)} estilo={{ flex: 1 }} />
        <Boton titulo="Eliminar" icono="trash-outline" variante="peligro" onPress={() => setConfirmando(true)} estilo={{ flex: 1 }} />
      </View>

      <Dialogo
        visible={confirmando}
        peligro
        titulo="¿Eliminar hábito?"
        mensaje={`Se eliminará «${habito.nombre}» y su historial. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={borrar}
      />
    </Pantalla>
  );
}

function Dato({ icono, etiqueta, valor, ultimo }) {
  return (
    <View style={[styles.dato, !ultimo && styles.datoBorde]}>
      <Ionicons name={icono} size={18} color={colores.textoSuave} />
      <Text style={styles.datoEtiqueta}>{etiqueta}</Text>
      <Text style={styles.datoValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  suave: { fontSize: 13, color: colores.textoSuave },
  rachas: { flexDirection: 'row', justifyContent: 'space-between' },
  rachaValor: { fontSize: 26, fontWeight: '800', color: colores.primario },
  tarjeta: { backgroundColor: '#fff', borderRadius: radio.md, borderWidth: 1, borderColor: colores.borde, padding: 16 },
  dato: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  datoBorde: { borderBottomWidth: 1, borderBottomColor: colores.borde },
  datoEtiqueta: { flex: 1, color: colores.textoSuave },
  datoValor: { fontWeight: '700', color: colores.texto, textAlign: 'right', flexShrink: 1 },
  botones: { flexDirection: 'row', gap: 12 },
});
