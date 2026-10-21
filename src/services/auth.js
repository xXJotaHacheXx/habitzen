// Registro e inicio de sesión con Firebase Authentication.
// Firebase guarda las contraseñas de forma segura: nosotros nunca las vemos.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

// Usuario de Firebase -> lo que usa la app
export const aUsuario = (u) => (u ? { id: u.uid, nombre: u.displayName ?? '', correo: u.email } : null);

// Traduce los códigos de error de Firebase a mensajes para el usuario
const MENSAJES = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  'auth/network-request-failed': 'Sin conexión. Necesitas internet para iniciar sesión.',
};
const traducir = (e) => new Error(MENSAJES[e.code] ?? 'Ocurrió un error. Intenta de nuevo.');

export async function registrar({ nombre, correo, contrasena }) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
    await updateProfile(user, { displayName: nombre.trim() }); // guarda el nombre en la cuenta
    return aUsuario(user);
  } catch (e) {
    throw traducir(e);
  }
}

export async function iniciarSesion({ correo, contrasena }) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
    return aUsuario(user);
  } catch (e) {
    throw traducir(e);
  }
}

export const cerrarSesion = () => signOut(auth);

// Avisa cada vez que alguien inicia o cierra sesión (también al abrir la app)
export const escucharSesion = (callback) => onAuthStateChanged(auth, (u) => callback(aUsuario(u)));