// Detecta si hay conexión (Android / iOS) con NetInfo.
// En web se usa conexion.web.js.
import NetInfo from '@react-native-community/netinfo';

// callback(conectado: boolean). Devuelve una función para dejar de escuchar.
export function escucharConexion(callback) {
  return NetInfo.addEventListener((estado) => callback(estado.isConnected !== false));
}
