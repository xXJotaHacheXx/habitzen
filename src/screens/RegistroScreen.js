import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import Campo from '../components/Campo';
import Pantalla from '../components/Pantalla';
import { colores } from '../constants/tema';
import { useAuth } from '../context/AuthContext';
import { validarRegistro } from '../utils/validacion';

export default function RegistroScreen() {
  const { registrar } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined })); // se quita el error al corregir
  };

  async function enviar() {
    const e = validarRegistro(form);
    setErrores(e);
    setErrorGeneral('');
    if (Object.keys(e).length) return;
    setEnviando(true);
    try {
      await registrar(form);
    } catch (err) {
      setErrorGeneral(err.message);
      setEnviando(false);
    }
  }

  return (
    <Pantalla>
      <View style={{ marginTop: 24 }}>
        <Text style={styles.titulo}>Crea tu cuenta</Text>
        <Text style={styles.subtitulo}>Tus hábitos se guardan en este dispositivo.</Text>
      </View>
      <View>
        <Campo etiqueta="Nombre" value={form.nombre} onChangeText={cambiar('nombre')} error={errores.nombre} placeholder="¿Cómo te llamas?" autoComplete="name" />
        <Campo etiqueta="Correo electrónico" value={form.correo} onChangeText={cambiar('correo')} error={errores.correo}
          placeholder="usuario@correo.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Campo etiqueta="Contraseña" value={form.contrasena} onChangeText={cambiar('contrasena')} error={errores.contrasena}
          placeholder="Mínimo 6 caracteres" secureTextEntry autoComplete="new-password" />
        <Campo etiqueta="Confirmar contraseña" value={form.confirmar} onChangeText={cambiar('confirmar')} error={errores.confirmar}
          secureTextEntry autoComplete="new-password" onSubmitEditing={enviar} />
        {errorGeneral ? <Text style={styles.error}>{errorGeneral}</Text> : null}
      </View>
      <Boton titulo="Crear cuenta" onPress={enviar} cargando={enviando} />
      <Boton titulo="Ya tengo cuenta" variante="texto" onPress={() => router.replace('/login')} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 26, fontWeight: '800', color: colores.texto },
  subtitulo: { fontSize: 15, color: colores.textoSuave, marginTop: 4 },
  error: { color: colores.peligro, textAlign: 'center', fontWeight: '600' },
});
