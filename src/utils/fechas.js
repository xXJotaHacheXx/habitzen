// Utilidades de fechas. Las fechas se guardan como texto 'AAAA-MM-DD' en hora local.

export const DIAS_CORTOS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // índice = getDay()
export const DIAS_NOMBRE = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const dos = (n) => String(n).padStart(2, '0');

// Date -> 'AAAA-MM-DD' (hora local, no UTC)
export function aISO(fecha) {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

// 'AAAA-MM-DD' -> Date a medianoche local
export function deISO(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

export const hoyISO = () => aISO(new Date());

export function sumarDias(iso, dias) {
  const f = deISO(iso);
  f.setDate(f.getDate() + dias);
  return aISO(f);
}

// Lunes de la semana a la que pertenece la fecha
export function inicioSemana(iso) {
  const f = deISO(iso);
  const desplazamiento = (f.getDay() + 6) % 7; // lunes = 0
  f.setDate(f.getDate() - desplazamiento);
  return aISO(f);
}

export function diasEntre(desdeISO, hastaISO) {
  return Math.round((deISO(hastaISO) - deISO(desdeISO)) / 86400000);
}

export function fechaLarga(iso = hoyISO()) {
  const f = deISO(iso);
  const dia = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][f.getDay()];
  return `${dia} ${f.getDate()} de ${MESES[f.getMonth()]}`;
}

// 'HH:MM' válido de 00:00 a 23:59
export const esHoraValida = (texto) => /^([01]\d|2[0-3]):[0-5]\d$/.test(texto);
