import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import Campo from '../components/Campo';
import Pantalla from '../components/Pantalla';
import { colores } from '../constants/tema';
import { useAuth } from '../context/AuthContext';
import { validarLogin } from '../utils/validacion';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined })); // se quita el error al corregir
  };

  async function enviar() {
    const e = validarLogin(form);
    setErrores(e);
    setErrorGeneral('');
    if (Object.keys(e).length) return;
    setEnviando(true);
    try {
      await iniciarSesion(form); // el layout redirige al entrar
    } catch (err) {
      setErrorGeneral(err.message);
      setEnviando(false);
    }
  }

  return (
    <Pantalla>
      <View style={styles.marca}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} accessibilityLabel="Logo de HabitZen" />
        <Text style={styles.nombre}>HabitZen</Text>
        <Text style={styles.lema}>Pequeños hábitos, grandes cambios</Text>
      </View>

      <View>
        <Campo etiqueta="Correo electrónico" value={form.correo} onChangeText={cambiar('correo')} error={errores.correo}
          placeholder="usuario@correo.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Campo etiqueta="Contraseña" value={form.contrasena} onChangeText={cambiar('contrasena')} error={errores.contrasena}
          placeholder="Tu contraseña" secureTextEntry autoComplete="password" onSubmitEditing={enviar} />
        {errorGeneral ? <Text style={styles.error}>{errorGeneral}</Text> : null}
      </View>

      <Boton titulo="Iniciar sesión" onPress={enviar} cargando={enviando} />
      <Boton titulo="Crear cuenta" variante="secundario" onPress={() => router.replace('/registro')} />
      <Text style={styles.nota}>Funciona sin conexión · Instalable</Text>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  marca: { alignItems: 'center', marginTop: 32, marginBottom: 8 },
  logo: { width: 96, height: 96, borderRadius: 22 },
  nombre: { fontSize: 30, fontWeight: '800', color: colores.texto, marginTop: 12 },
  lema: { fontSize: 15, color: colores.textoSuave, marginTop: 4 },
  error: { color: colores.peligro, textAlign: 'center', fontWeight: '600' },
  nota: { textAlign: 'center', color: colores.textoSuave, fontSize: 13, marginTop: 8 },
});
