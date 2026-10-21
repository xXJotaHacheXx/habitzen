// Clima actual con Open-Meteo (gratis, sin API key) usando la ubicación del dispositivo.
import * as Location from 'expo-location';
import { CLAVES, guardar, leer } from './almacenamiento';

// Si el usuario no da permiso se usa Aguascalientes como ubicación predeterminada
const UBICACION_PREDETERMINADA = { latitud: 21.8853, longitud: -102.2916, nombre: 'Aguascalientes' };

async function obtenerUbicacion() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return { ...UBICACION_PREDETERMINADA, predeterminada: true };
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitud: pos.coords.latitude, longitud: pos.coords.longitude, nombre: 'Tu ubicación' };
  } catch {
    return { ...UBICACION_PREDETERMINADA, predeterminada: true };
  }
}

// Códigos de clima WMO que usa Open-Meteo
function describir(codigo) {
  if (codigo === 0) return { texto: 'Despejado', icono: 'sunny-outline' };
  if (codigo <= 3) return { texto: 'Parcialmente nublado', icono: 'partly-sunny-outline' };
  if (codigo <= 48) return { texto: 'Niebla', icono: 'cloud-outline' };
  if (codigo <= 67) return { texto: 'Lluvia', icono: 'rainy-outline' };
  if (codigo <= 77) return { texto: 'Nieve', icono: 'snow-outline' };
  if (codigo <= 82) return { texto: 'Chubascos', icono: 'rainy-outline' };
  return { texto: 'Tormenta', icono: 'thunderstorm-outline' };
}

// Regla para sugerir (o no) actividad al aire libre
export function sugerencia({ temperatura, codigo, viento }) {
  if (codigo >= 51) return { aptoExterior: false, mensaje: 'Hoy hay precipitación. Mejor una rutina en casa.' };
  if (temperatura >= 33) return { aptoExterior: false, mensaje: 'Hace mucho calor. Si sales, hidrátate y evita el mediodía.' };
  if (temperatura <= 5) return { aptoExterior: false, mensaje: 'Hace frío. Abrígate o haz ejercicio bajo techo.' };
  if (viento >= 40) return { aptoExterior: false, mensaje: 'Hay mucho viento. Mejor actividad bajo techo.' };
  return { aptoExterior: true, mensaje: 'Buen momento para caminar o correr al aire libre.' };
}

// Devuelve el clima. Si no hay conexión usa el último guardado.
export async function obtenerClima() {
  const ub = await obtenerUbicacion();
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${ub.latitud}&longitude=${ub.longitud}` +
    '&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { current } = await res.json();
    const datos = {
      temperatura: Math.round(current.temperature_2m),
      codigo: current.weather_code,
      viento: Math.round(current.wind_speed_10m),
    };
    const clima = {
      ...datos,
      ...describir(datos.codigo),
      ...sugerencia(datos),
      lugar: ub.nombre,
      predeterminada: !!ub.predeterminada,
      consultado: Date.now(),
    };
    await guardar(CLAVES.clima, clima);
    return { ...clima, desdeCache: false };
  } catch {
    const guardado = await leer(CLAVES.clima);
    if (guardado) return { ...guardado, desdeCache: true };
    throw new Error('No se pudo obtener el clima.');
  }
}
