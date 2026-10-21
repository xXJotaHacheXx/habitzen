// Detecta si hay conexión en el navegador con los eventos online / offline.
export function escucharConexion(callback) {
  const avisar = () => callback(navigator.onLine);
  window.addEventListener('online', avisar);
  window.addEventListener('offline', avisar);
  avisar(); // estado inicial
  return () => {
    window.removeEventListener('online', avisar);
    window.removeEventListener('offline', avisar);
  };
}
