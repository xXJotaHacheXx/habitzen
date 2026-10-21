import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import Dialogo from '../components/Dialogo';
import Pantalla from '../components/Pantalla';
import { colores, radio } from '../constants/tema';
import { useAuth } from '../context/AuthContext';
import { useHabitos } from '../context/HabitosContext';
import { estadoPermiso, pedirPermiso, reprogramarRecordatorios } from '../services/notificaciones';
import useInstalarPWA from '../utils/useInstalarPWA';

const TEXTO_PERMISO = {
  concedido: 'Activadas',
  pendiente: 'Sin permiso todavía',
  denegado: 'Bloqueadas en el navegador',
  'no-soportado': 'No disponibles en este navegador',
};

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const { habitos, enLinea, porSincronizar, sincronizar } = useHabitos();
  const pwa = useInstalarPWA();
  const [permiso, setPermiso] = useState('pendiente');
  const [resultadoSync, setResultadoSync] = useState('');
  const [sincronizando, setSincronizando] = useState(false);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  useFocusEffect(
    useCallback(() => {
      estadoPermiso().then(setPermiso);
    }, [])
  );

  async function activarNotificaciones() {
    await pedirPermiso();
    setPermiso(await estadoPermiso());
    await reprogramarRecordatorios(habitos);
  }

  async function sincronizarAhora() {
    setSincronizando(true);
    const r = await sincronizar();
    setSincronizando(false);
    if (!r) return;
    setResultadoSync(
      r.sinConexion
        ? 'Sin conexión: se enviará cuando vuelva el internet.'
        : `Listo: ${r.enviados} cambio(s) enviados a la API.`
    );
  }

  const conRecordatorio = habitos.filter((h) => h.recordatorioActivo).length;

  return (
    <Pantalla>
      <View style={styles.usuario}>
        <View style={styles.avatar}>
          <Text style={styles.inicial}>{usuario?.nombre[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.nombre}>{usuario?.nombre}</Text>
          <Text style={styles.suave}>{usuario?.correo}</Text>
        </View>
      </View>

      <View style={styles.tarjeta}>
        <Encabezado icono={enLinea ? 'cloud-done-outline' : 'cloud-offline-outline'} titulo="Sincronización" />
        <Text style={styles.suave}>
          {enLinea ? 'En línea' : 'Sin conexión'} · {porSincronizar} cambio(s) pendientes de enviar
        </Text>
        {resultadoSync ? <Text style={styles.resultado}>{resultadoSync}</Text> : null}
        <Boton titulo="Sincronizar ahora" variante="secundario" icono="sync" onPress={sincronizarAhora} cargando={sincronizando} estilo={styles.boton} />
      </View>

      <View style={styles.tarjeta}>
        <Encabezado icono="notifications-outline" titulo="Recordatorios" />
        <Text style={styles.suave}>
          Notificaciones: {TEXTO_PERMISO[permiso]} · {conRecordatorio} hábito(s) con recordatorio
        </Text>
        {pwa.esWeb && <Text style={styles.suave}>En web los recordatorios suenan mientras la app está abierta.</Text>}
        {permiso === 'pendiente' && (
          <Boton titulo="Activar notificaciones" icono="notifications" onPress={activarNotificaciones} estilo={styles.boton} />
        )}
      </View>

      {pwa.esWeb && (
        <View style={styles.tarjeta}>
          <Encabezado icono="download-outline" titulo="Instalar HabitZen" />
          <Text style={styles.suave}>
            {pwa.instalada
              ? 'La app ya está instalada en este dispositivo.'
              : pwa.disponible
                ? 'Instálala para abrirla desde tu pantalla de inicio, incluso sin internet.'
                : 'Usa el menú del navegador → "Instalar app" o "Agregar a pantalla de inicio".'}
          </Text>
          {pwa.disponible && <Boton titulo="Instalar app" icono="download" onPress={pwa.instalar} estilo={styles.boton} />}
        </View>
      )}

      <Boton titulo="Cerrar sesión" variante="peligro" icono="log-out-outline" onPress={() => setConfirmarSalida(true)} />

      <Dialogo
        visible={confirmarSalida}
        titulo="¿Cerrar sesión?"
        mensaje="Tus hábitos se quedan guardados en este dispositivo."
        textoConfirmar="Cerrar sesión"
        onCancelar={() => setConfirmarSalida(false)}
        onConfirmar={() => {
          setConfirmarSalida(false);
          cerrarSesion();
        }}
      />
    </Pantalla>
  );
}

function Encabezado({ icono, titulo }) {
  return (
    <View style={styles.encabezado}>
      <Ionicons name={icono} size={20} color={colores.primario} />
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  usuario: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colores.primario, alignItems: 'center', justifyContent: 'center' },
  inicial: { color: '#fff', fontSize: 24, fontWeight: '800' },
  nombre: { fontSize: 20, fontWeight: '800', color: colores.texto },
  tarjeta: { backgroundColor: '#fff', borderRadius: radio.md, borderWidth: 1, borderColor: colores.borde, padding: 16, gap: 6 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  titulo: { fontSize: 16, fontWeight: '700', color: colores.texto },
  suave: { fontSize: 14, color: colores.textoSuave },
  resultado: { fontSize: 14, color: colores.primarioOscuro, fontWeight: '600' },
  boton: { marginTop: 8 },
});
