// Cola de sincronización: cada cambio se guarda primero en el dispositivo
// y se envía a la API cuando hay conexión.
import { CLAVES, guardar, leer } from './almacenamiento';
import { api, ErrorDeRed } from './api';
import { guardarHabitos, obtenerHabitos } from './habitos';

const leerCola = (usuarioId) => leer(CLAVES.cola(usuarioId), []);
const guardarCola = (usuarioId, cola) => guardar(CLAVES.cola(usuarioId), cola);

export async function pendientes(usuarioId) {
  return (await leerCola(usuarioId)).length;
}

// Agrega una operación evitando trabajo repetido
export async function encolar(usuarioId, tipo, habito) {
  let cola = await leerCola(usuarioId);
  const delHabito = (op) => op.habitoId === habito.id;

  if (tipo === 'actualizar' && cola.some((op) => delHabito(op) && op.tipo !== 'eliminar')) {
    return; // ya hay un crear/actualizar pendiente que enviará los datos más recientes
  }
  if (tipo === 'eliminar') {
    const nuncaSeEnvio = !habito.remoteId;
    cola = cola.filter((op) => !delHabito(op));
    if (nuncaSeEnvio) return guardarCola(usuarioId, cola); // no existe en la API: nada que borrar
  }
  cola.push({ tipo, habitoId: habito.id, remoteId: habito.remoteId ?? null, fecha: Date.now() });
  await guardarCola(usuarioId, cola);
}

let enProceso = false;

// Envía la cola en orden. Devuelve { enviados, pendientes, sinConexion }
export async function procesarCola(usuarioId) {
  if (enProceso) return { enviados: 0, pendientes: await pendientes(usuarioId), sinConexion: false };
  enProceso = true;
  let enviados = 0;
  let sinConexion = false;
  try {
    let cola = await leerCola(usuarioId);
    while (cola.length > 0) {
      const op = cola[0];
      try {
        await enviar(usuarioId, op);
        enviados += 1;
      } catch (e) {
        if (e instanceof ErrorDeRed) {
          sinConexion = true;
          break; // se reintenta al volver la conexión
        }
        // Error del servidor: JSONPlaceholder no conoce los ids que "crea", así que
        // un PUT/DELETE a esos ids responde error. Se descarta para no ciclar.
        console.warn('Operación descartada por la API:', op.tipo, e.message);
      }
      cola = cola.slice(1);
      await guardarCola(usuarioId, cola);
    }
    return { enviados, pendientes: cola.length, sinConexion };
  } finally {
    enProceso = false;
  }
}

async function enviar(usuarioId, op) {
  if (op.tipo === 'eliminar') {
    if (op.remoteId) await api.eliminarHabito(usuarioId, op.habitoId);
    return;
  }

  const habito = (await obtenerHabitos(usuarioId)).find((h) => h.id === op.habitoId);
  if (!habito) return; // se borró antes de enviarse

  await api.guardarHabito(usuarioId, habito);

  // La primera vez que sube, se marca como "sincronizado"
  if (!habito.remoteId) {
    const actualizada = (await obtenerHabitos(usuarioId)).map((h) =>
      h.id === habito.id ? { ...h, remoteId: habito.id } : h
    );
    await guardarHabitos(usuarioId, actualizada);
  }
}

export async function descargar(usuarioId) {
  const remotos = await api.listarHabitos(usuarioId); // sin internet lanza ErrorDeRed
  const locales = await obtenerHabitos(usuarioId);
  const cola = await leerCola(usuarioId);
  const pendiente = (id) => cola.some((op) => op.habitoId === id);

  // Se parte de lo que hay en la nube
  const porId = new Map(remotos.map((h) => [h.id, { ...h, remoteId: h.id }]));

  for (const local of locales) {
    const remoto = porId.get(local.id);
    if (remoto) {
      // Gana el más reciente, o el local si tiene cambios sin subir
      if (pendiente(local.id) || local.actualizado > remoto.actualizado) porId.set(local.id, local);
    } else if (!local.remoteId || pendiente(local.id)) {
      porId.set(local.id, local); // nuevo en este dispositivo, aún no se sube
    }
    // Si tenía remoteId y ya no está en la nube, se borró en otro dispositivo: se descarta
  }

  // Lo que borraste aquí sin internet no debe "revivir"
  cola.filter((op) => op.tipo === 'eliminar').forEach((op) => porId.delete(op.habitoId));

  await guardarHabitos(usuarioId, [...porId.values()]);
}
