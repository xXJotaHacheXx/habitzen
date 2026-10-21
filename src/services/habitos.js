// CRUD de hábitos sobre el almacenamiento local. Cada usuario tiene su propia lista.
import * as Crypto from 'expo-crypto';
import { hoyISO } from '../utils/fechas';
import { CLAVES, guardar, leer } from './almacenamiento';

export const obtenerHabitos = (usuarioId) => leer(CLAVES.habitos(usuarioId), []);
export const guardarHabitos = (usuarioId, lista) => guardar(CLAVES.habitos(usuarioId), lista);

// Normaliza lo que llega del formulario
function limpiar(datos) {
  return {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    frecuencia: datos.frecuencia,
    diasSemana: datos.frecuencia === 'dias' ? [...datos.diasSemana].sort() : [],
    metaDiaria: Number(datos.metaDiaria),
    unidad: datos.unidad.trim(),
    recordatorioActivo: datos.recordatorioActivo,
    horaRecordatorio: datos.horaRecordatorio,
  };
}

// CREATE
export async function crearHabito(usuarioId, datos) {
  const habito = {
    id: Crypto.randomUUID(),
    usuarioId,
    ...limpiar(datos),
    historial: [], // fechas 'AAAA-MM-DD' en que se cumplió
    fechaCreacion: hoyISO(),
    activo: true,
    remoteId: null, // id en la API, se llena al sincronizar
    actualizado: Date.now(),
  };
  const lista = await obtenerHabitos(usuarioId);
  await guardarHabitos(usuarioId, [...lista, habito]);
  return habito;
}

// UPDATE (datos del formulario)
export async function actualizarHabito(usuarioId, id, datos) {
  const lista = await obtenerHabitos(usuarioId);
  const nueva = lista.map((h) => (h.id === id ? { ...h, ...limpiar(datos), actualizado: Date.now() } : h));
  await guardarHabitos(usuarioId, nueva);
  return nueva.find((h) => h.id === id);
}

// UPDATE (marcar / desmarcar como cumplido en una fecha)
export async function alternarCumplido(usuarioId, id, iso = hoyISO()) {
  const lista = await obtenerHabitos(usuarioId);
  const nueva = lista.map((h) => {
    if (h.id !== id) return h;
    const historial = h.historial.includes(iso)
      ? h.historial.filter((d) => d !== iso)
      : [...h.historial, iso].sort();
    return { ...h, historial, actualizado: Date.now() };
  });
  await guardarHabitos(usuarioId, nueva);
  return nueva.find((h) => h.id === id);
}

// DELETE
export async function eliminarHabito(usuarioId, id) {
  const lista = await obtenerHabitos(usuarioId);
  const habito = lista.find((h) => h.id === id);
  await guardarHabitos(usuarioId, lista.filter((h) => h.id !== id));
  return habito;
}
