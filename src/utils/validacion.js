// Validaciones de formularios. Cada función devuelve un objeto { campo: 'mensaje' }.
import { esHoraValida } from './fechas';

export const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

export function validarRegistro({ nombre, correo, contrasena, confirmar }) {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'Escribe tu nombre.';
  if (!esCorreoValido(correo)) errores.correo = 'Escribe un correo válido.';
  if (contrasena.length < 6) errores.contrasena = 'Mínimo 6 caracteres.';
  if (confirmar !== contrasena) errores.confirmar = 'Las contraseñas no coinciden.';
  return errores;
}

export function validarLogin({ correo, contrasena }) {
  const errores = {};
  if (!esCorreoValido(correo)) errores.correo = 'Escribe un correo válido.';
  if (!contrasena) errores.contrasena = 'Escribe tu contraseña.';
  return errores;
}

export function validarHabito(h) {
  const errores = {};
  if (!h.nombre.trim()) errores.nombre = 'Ponle un nombre al hábito.';
  if (h.nombre.trim().length > 40) errores.nombre = 'Máximo 40 caracteres.';
  if (h.frecuencia === 'dias' && h.diasSemana.length === 0) errores.diasSemana = 'Elige al menos un día.';
  const meta = Number(h.metaDiaria);
  if (!Number.isFinite(meta) || meta <= 0) errores.metaDiaria = 'Escribe un número mayor a 0.';
  if (h.recordatorioActivo && !esHoraValida(h.horaRecordatorio)) errores.horaRecordatorio = 'Usa el formato HH:MM (24 h).';
  return errores;
}
