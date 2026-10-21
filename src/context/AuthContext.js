// Estado global de la sesión del usuario.
import { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Firebase avisa si hay sesión guardada al abrir la app y en cada login/logout
  useEffect(() => {
    return auth.escucharSesion((u) => {
      // Al registrarse, el aviso llega antes de guardar el nombre: no lo sobrescribimos
      setUsuario((actual) => (u && actual?.id === u.id && !u.nombre ? actual : u));
      setCargando(false);
    });
  }, []);

  const valor = {
    usuario,
    cargando,
    registrar: async (datos) => setUsuario(await auth.registrar(datos)),
    iniciarSesion: async (datos) => setUsuario(await auth.iniciarSesion(datos)),
    cerrarSesion: () => auth.cerrarSesion(), // el listener pone usuario en null
  };
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
