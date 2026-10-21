// Conexión con Firebase (versión web / PWA)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);       // en web la sesión se guarda sola
export const db = getFirestore(app);