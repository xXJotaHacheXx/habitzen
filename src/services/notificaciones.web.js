// Recordatorios en la versión web (PWA).
// El navegador no permite programar notificaciones a futuro, así que mientras la app
// está abierta se revisa cada 30 s si algún hábito llegó a su hora y sigue pendiente.
import { hoyISO } from '../utils/fechas';
import { estaPendienteHoy } from '../utils/rachas';
import { CLAVES, guardar, leer } from './almacenamiento';

const soportado = () => typeof window !== 'undefined' && 'Notification' in window;
let habitosActuales = [];
let intervalo = null;

export async function configurarNotificaciones() {}

export async function estadoPermiso() {
  if (!soportado()) return 'no-soportado';
  if (Notification.permission === 'granted') return 'concedido';
  if (Notification.permission === 'denied') return 'denegado';
  return 'pendiente';
}

export async function pedirPermiso() {
  if (!soportado()) return false;
  return (await Notification.requestPermission()) === 'granted';
}

async function mostrar(titulo, cuerpo) {
  // En Android Chrome solo funciona a través del service worker
  if ('serviceWorker' in navigator) {
    const registro = await navigator.serviceWorker.getRegistration();
    if (registro) return registro.showNotification(titulo, { body: cuerpo, icon: '/icon-192.png' });
  }
  return new Notification(titulo, { body: cuerpo, icon: '/icon-192.png' });
}

async function revisar() {
  if ((await estadoPermiso()) !== 'concedido') return;
  const hoy = hoyISO();
  const ahora = new Date();
  const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
  const avisados = await leer(CLAVES.avisosWeb, {}); // { habitoId: 'AAAA-MM-DD' }

  for (const h of habitosActuales) {
    const toca = h.activo && h.recordatorioActivo && h.horaRecordatorio <= horaActual;
    if (toca && estaPendienteHoy(h, hoy) && avisados[h.id] !== hoy) {
      await mostrar(`Recordatorio: ${h.nombre}`, 'Aún no registras este hábito hoy. ¡No rompas tu racha!');
      avisados[h.id] = hoy;
    }
  }
  await guardar(CLAVES.avisosWeb, avisados);
}

export async function reprogramarRecordatorios(habitos) {
  habitosActuales = habitos;
  if (!intervalo && soportado()) intervalo = setInterval(revisar, 30000);
  await revisar();
  return habitos.filter((h) => h.recordatorioActivo).length;
}

export function escucharToques() {
  return () => {};
}
