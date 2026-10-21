// Estadísticas de cumplimiento para las gráficas semanal y mensual.
import { DIAS_NOMBRE, deISO, hoyISO, inicioSemana, sumarDias } from './fechas';
import { cumplidoEn, cumplidoEnSemana, tocaElDia } from './rachas';

const activosEn = (habitos, iso) => habitos.filter((h) => h.activo && h.fechaCreacion <= iso);

// % de hábitos diarios / de días específicos cumplidos en un día
export function porcentajeDia(habitos, iso) {
  const tocan = activosEn(habitos, iso).filter((h) => h.frecuencia !== 'semanal' && tocaElDia(h, iso));
  if (tocan.length === 0) return null;
  const hechos = tocan.filter((h) => cumplidoEn(h, iso)).length;
  return Math.round((hechos / tocan.length) * 100);
}

// Cumplimientos esperados vs. realizados en un rango [desde, hasta]
export function resumenRango(habitos, desde, hasta) {
  let esperados = 0;
  let hechos = 0;
  for (const h of habitos.filter((x) => x.activo)) {
    if (h.frecuencia === 'semanal') {
      for (let s = inicioSemana(desde); s <= hasta; s = sumarDias(s, 7)) {
        if (sumarDias(s, 6) < h.fechaCreacion) continue;
        esperados += 1;
        if (cumplidoEnSemana(h, s)) hechos += 1;
      }
    } else {
      for (let d = desde; d <= hasta; d = sumarDias(d, 1)) {
        if (d < h.fechaCreacion || !tocaElDia(h, d)) continue;
        esperados += 1;
        if (cumplidoEn(h, d)) hechos += 1;
      }
    }
  }
  return { esperados, hechos, porcentaje: esperados ? Math.round((hechos / esperados) * 100) : null };
}

// Gráfica semanal: lunes a domingo de la semana actual
export function datosSemana(habitos, hoy = hoyISO()) {
  const lunes = inicioSemana(hoy);
  return Array.from({ length: 7 }, (_, i) => {
    const iso = sumarDias(lunes, i);
    return {
      etiqueta: DIAS_NOMBRE[deISO(iso).getDay()],
      valor: iso > hoy ? null : porcentajeDia(habitos, iso),
      resaltar: iso === hoy,
    };
  });
}

// Gráfica mensual: las últimas 4 semanas (la actual al final)
export function datosMes(habitos, hoy = hoyISO()) {
  const lunesActual = inicioSemana(hoy);
  return Array.from({ length: 4 }, (_, i) => {
    const lunes = sumarDias(lunesActual, (i - 3) * 7);
    const domingo = sumarDias(lunes, 6);
    const r = resumenRango(habitos, lunes, domingo > hoy ? hoy : domingo);
    const d = deISO(lunes);
    return { etiqueta: `${d.getDate()}/${d.getMonth() + 1}`, valor: r.porcentaje, resaltar: i === 3 };
  });
}
