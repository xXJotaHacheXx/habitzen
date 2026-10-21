// Base de datos en la nube: Cloud Firestore.
// Cada hábito se guarda en usuarios/{uid}/habitos/{idDelHabito}.
import { collection, deleteDoc, doc, getDocsFromServer, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Error de red (sin conexión): la operación se reintenta después
export class ErrorDeRed extends Error {}

// Sin internet, Firestore no marca error: deja la operación esperando.
// Para que la app se entere, si tarda más de 10 s lo tratamos como "sin conexión".
function conTiempoLimite(promesa, ms = 10000) {
  const limite = new Promise((_, rechazar) =>
    setTimeout(() => rechazar(new ErrorDeRed('Sin conexión - Por favor revisa tu conexión a Internet')), ms)
  );
  return Promise.race([promesa, limite]).catch((e) => {
    if (e.code === 'unavailable') throw new ErrorDeRed(e.message);
    throw e;
  });
}

const refHabito = (usuarioId, id) => doc(db, 'usuarios', usuarioId, 'habitos', id);

export const api = {
  // READ: todos los hábitos del usuario
  listarHabitos: async (usuarioId) => {
    const snap = await conTiempoLimite(getDocsFromServer(collection(db, 'usuarios', usuarioId, 'habitos')));
    return snap.docs.map((d) => d.data());
  },

  // CREATE y UPDATE: setDoc guarda el documento completo (si ya existe, lo reemplaza)
  guardarHabito: async (usuarioId, habito) => {
    const { remoteId, ...datos } = habito; // remoteId solo sirve en el dispositivo
    await conTiempoLimite(setDoc(refHabito(usuarioId, habito.id), datos));
    return { id: habito.id };
  },

  // DELETE
  eliminarHabito: (usuarioId, id) => conTiempoLimite(deleteDoc(refHabito(usuarioId, id))),
};