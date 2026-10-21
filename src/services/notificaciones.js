// Recordatorios con notificaciones locales (Android / iOS).
// En web se usa notificaciones.web.js (Expo elige el archivo según la plataforma).
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { aISO, sumarDias } from '../utils/fechas';
import { cumplidoEnSemana, estaPendienteHoy, tocaElDia } from '../utils/rachas';

const CANAL = 'recordatorios';
const DIAS_A_PROGRAMAR = 7; // iOS permite ~64 notificaciones programadas
const MAXIMO = 60;

export async function configurarNotificaciones() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Recordatorios de hábitos',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function estadoPermiso() {
  const { granted } = await Notifications.getPermissionsAsync();
  return granted ? 'concedido' : 'pendiente';
}

export async function pedirPermiso() {
  const actual = await Notifications.getPermissionsAsync();
  if (actual.granted) return true;
  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

// Fechas (Date) en que debe sonar el recordatorio de un hábito en los próximos días
function proximasFechas(habito, ahora) {
  const [hh, mm] = habito.horaRecordatorio.split(':').map(Number);
  const hoy = aISO(ahora);
  const fechas = [];
  for (let i = 0; i < DIAS_A_PROGRAMAR; i += 1) {
    const iso = sumarDias(hoy, i);
    if (!tocaElDia(habito, iso)) continue;
    // Solo si sigue pendiente: hoy se revisa con el historial; los días futuros aún están pendientes
    if (iso === hoy && !estaPendienteHoy(habito, hoy)) continue;
    if (habito.frecuencia === 'semanal' && iso !== hoy && cumplidoEnSemana(habito, iso)) continue;
    const fecha = new Date(`${iso}T00:00:00`);
    fecha.setHours(hh, mm, 0, 0);
    if (fecha > ahora) fechas.push(fecha);
  }
  return fechas;
}

// Borra lo programado y vuelve a programar según el estado actual de los hábitos.
// Se llama al abrir la app y cada vez que un hábito cambia (al marcarlo cumplido se cancela el de hoy).
export async function reprogramarRecordatorios(habitos) {
  const { granted } = await Notifications.getPermissionsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!granted) return 0;

  const ahora = new Date();
  let total = 0;
  for (const h of habitos.filter((x) => x.activo && x.recordatorioActivo)) {
    for (const fecha of proximasFechas(h, ahora)) {
      if (total >= MAXIMO) return total;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Recordatorio: ${h.nombre}`,
          body: `Aún no registras este hábito ${h.frecuencia === 'semanal' ? 'esta semana' : 'hoy'}. ¡No rompas tu racha!`,
          data: { habitoId: h.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fecha,
          channelId: CANAL,
        },
      });
      total += 1;
    }
  }
  return total;
}

// Al tocar la notificación se abre el detalle del hábito
export function escucharToques(abrirHabito) {
  const sub = Notifications.addNotificationResponseReceivedListener((r) => {
    const id = r.notification.request.content.data?.habitoId;
    if (id) abrirHabito(id);
  });
  return () => sub.remove();
}

