// Botón "Instalar app" para la versión web (PWA).
// Chrome/Edge lanzan el evento beforeinstallprompt cuando la app es instalable.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export default function useInstalarPWA() {
  const [evento, setEvento] = useState(null);
  const [instalada, setInstalada] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    setInstalada(window.matchMedia?.('(display-mode: standalone)').matches ?? false);
    const guardarEvento = (e) => {
      e.preventDefault(); // evita el aviso automático; lo mostramos con nuestro botón
      setEvento(e);
    };
    const alInstalar = () => {
      setInstalada(true);
      setEvento(null);
    };
    window.addEventListener('beforeinstallprompt', guardarEvento);
    window.addEventListener('appinstalled', alInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', guardarEvento);
      window.removeEventListener('appinstalled', alInstalar);
    };
  }, []);

  async function instalar() {
    if (!evento) return;
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  }

  return { esWeb: Platform.OS === 'web', disponible: !!evento, instalada, instalar };
}
