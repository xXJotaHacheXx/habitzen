// Estado global de los hábitos del usuario: CRUD, cumplimiento, sincronización y recordatorios.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { escucharConexion } from '../services/conexion';
import * as servicio from '../services/habitos';
import { reprogramarRecordatorios } from '../services/notificaciones';
import { descargar, encolar, pendientes, procesarCola } from '../services/sincronizacion';
import { useAuth } from './AuthContext';

const HabitosContext = createContext(null);

export function HabitosProvider({ children }) {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [habitos, setHabitos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enLinea, setEnLinea] = useState(true);
  const [porSincronizar, setPorSincronizar] = useState(0);

  const recargar = useCallback(async () => {
    if (!usuarioId) return;
    setHabitos(await servicio.obtenerHabitos(usuarioId));
    setPorSincronizar(await pendientes(usuarioId));
  }, [usuarioId]);

  // Envía la cola a Firestore y, si se pide, trae lo que hay en la nube
  const sincronizar = useCallback(
    async ({ traer = false } = {}) => {
      if (!usuarioId) return null;
      const r = await procesarCola(usuarioId); // primero se sube lo pendiente
      if (traer && !r.sinConexion) {
        try {
          await descargar(usuarioId);
        } catch (e) {
          console.warn('No se pudo descargar:', e.message);
        }
      }
      await recargar();
      return r;
    },
    [usuarioId, recargar]
  );

  // Cargar hábitos al iniciar sesión
  useEffect(() => {
    setHabitos([]);
    if (!usuarioId) return;
    setCargando(true);
    recargar().finally(() => setCargando(false));
    sincronizar({ traer: true });
  }, [usuarioId, recargar, sincronizar]);

  // Detectar conexión: al recuperarla se sincroniza lo pendiente
  useEffect(() => {
    return escucharConexion((conectado) => {
      setEnLinea(conectado);
      if (conectado) sincronizar({ traer: true });
    });
  }, [sincronizar]);

  // Reprogramar recordatorios cada vez que cambian los hábitos
  useEffect(() => {
    if (usuarioId) reprogramarRecordatorios(habitos).catch((e) => console.warn('Recordatorios:', e));
  }, [habitos, usuarioId]);

  // Guarda local -> encola para la API -> intenta enviar
  async function trasCambio(tipo, habito) {
    await encolar(usuarioId, tipo, habito);
    await recargar();
    sincronizar();
  }

  const valor = {
    habitos,
    cargando,
    enLinea,
    porSincronizar,
    sincronizar,
    obtener: (id) => habitos.find((h) => h.id === id),
    crear: async (datos) => {
      const h = await servicio.crearHabito(usuarioId, datos);
      await trasCambio('crear', h);
      return h;
    },
    actualizar: async (id, datos) => {
      const h = await servicio.actualizarHabito(usuarioId, id, datos);
      await trasCambio('actualizar', h);
      return h;
    },
    eliminar: async (id) => {
      const h = await servicio.eliminarHabito(usuarioId, id);
      if (h) await trasCambio('eliminar', h);
    },
    alternarHoy: async (id) => {
      const h = await servicio.alternarCumplido(usuarioId, id);
      await trasCambio('actualizar', h);
    },
  };
  return <HabitosContext.Provider value={valor}>{children}</HabitosContext.Provider>;
}

export const useHabitos = () => useContext(HabitosContext);
