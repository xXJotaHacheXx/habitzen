// Cálculo de rachas y de qué días le toca a cada hábito.
import { deISO, hoyISO, inicioSemana, sumarDias } from './fechas';

// ¿Al hábito le toca ese día? (los semanales pueden hacerse cualquier día)
export function tocaElDia(habito, iso) {
  if (habito.frecuencia === 'dias') {
    return (habito.diasSemana ?? []).includes(deISO(iso).getDay());
  }
  return true;
}

export const cumplidoEn = (habito, iso) => habito.historial.includes(iso);

// Semanal: ¿se cumplió al menos una vez en la semana de esa fecha?
export function cumplidoEnSemana(habito, iso) {
  const lunes = inicioSemana(iso);
  const domingo = sumarDias(lunes, 6);
  return habito.historial.some((d) => d >= lunes && d <= domingo);
}

// ¿Sigue pendiente hoy? (se usa para la lista y para las notificaciones)
export function estaPendienteHoy(habito, iso = hoyISO()) {
  if (!habito.activo) return false;
  if (habito.frecuencia === 'semanal') return !cumplidoEnSemana(habito, iso);
  return tocaElDia(habito, iso) && !cumplidoEn(habito, iso);
}

// Racha actual. Hoy pendiente NO rompe la racha: se cuenta desde ayer.
export function rachaActual(habito, iso = hoyISO()) {
  const inicio = habito.fechaCreacion;

  if (habito.frecuencia === 'semanal') {
    let semana = inicioSemana(iso);
    if (!cumplidoEnSemana(habito, semana)) semana = sumarDias(semana, -7);
    let racha = 0;
    while (sumarDias(semana, 6) >= inicio && cumplidoEnSemana(habito, semana)) {
      racha += 1;
      semana = sumarDias(semana, -7);
    }
    return racha;
  }

  let dia = iso;
  if (tocaElDia(habito, dia) && !cumplidoEn(habito, dia)) dia = sumarDias(dia, -1);
  let racha = 0;
  for (let i = 0; i < 3650 && dia >= inicio; i += 1) {
    if (tocaElDia(habito, dia)) {
      if (!cumplidoEn(habito, dia)) break;
      racha += 1;
    }
    dia = sumarDias(dia, -1);
  }
  return racha;
}

// Mejor racha histórica desde que se creó el hábito
export function mejorRacha(habito, iso = hoyISO()) {
  let mejor = 0;
  let actual = 0;
  if (habito.frecuencia === 'semanal') {
    for (let s = inicioSemana(habito.fechaCreacion); s <= iso; s = sumarDias(s, 7)) {
      actual = cumplidoEnSemana(habito, s) ? actual + 1 : 0;
      mejor = Math.max(mejor, actual);
    }
    return mejor;
  }
  for (let d = habito.fechaCreacion; d <= iso; d = sumarDias(d, 1)) {
    if (!tocaElDia(habito, d)) continue;
    if (cumplidoEn(habito, d)) actual += 1;
    else if (d !== iso) actual = 0; // hoy pendiente no rompe
    mejor = Math.max(mejor, actual);
  }
  return mejor;
}

export const unidadRacha = (habito, n) =>
  habito.frecuencia === 'semanal' ? (n === 1 ? 'semana' : 'semanas') : (n === 1 ? 'día' : 'días');
