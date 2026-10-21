// Servicio de almacenamiento local compartido (AsyncStorage).
// En web AsyncStorage usa localStorage, así que los datos funcionan sin conexión.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CLAVES = {
  usuarios: 'hz:usuarios',
  sesion: 'hz:sesion',
  habitos: (usuarioId) => `hz:habitos:${usuarioId}`,
  cola: (usuarioId) => `hz:cola:${usuarioId}`,
  clima: 'hz:clima',
  avisosWeb: 'hz:avisos-web',
};

export async function leer(clave, valorPorDefecto = null) {
  try {
    const texto = await AsyncStorage.getItem(clave);
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch (e) {
    console.warn('No se pudo leer', clave, e);
    return valorPorDefecto;
  }
}

export async function guardar(clave, valor) {
  await AsyncStorage.setItem(clave, JSON.stringify(valor));
}

export async function borrar(clave) {
  await AsyncStorage.removeItem(clave);
}
