// Formulario para crear (sin id) o editar (con id) un hábito.
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Boton from '../components/Boton';
import Campo from '../components/Campo';
import Chips from '../components/Chips';
import Pantalla from '../components/Pantalla';
import { CATEGORIAS, colores, FRECUENCIAS } from '../constants/tema';
import { useHabitos } from '../context/HabitosContext';
import { pedirPermiso } from '../services/notificaciones';
import { DIAS_NOMBRE } from '../utils/fechas';
import { validarHabito } from '../utils/validacion';

const VACIO = {
  nombre: '',
  categoria: 'Salud',
  frecuencia: 'diaria',
  diasSemana: [1, 2, 3, 4, 5],
  metaDiaria: '1',
  unidad: 'vez',
  recordatorioActivo: false,
  horaRecordatorio: '08:00',
};

// Lunes a domingo (getDay: 1..6, 0)
const OPCIONES_DIAS = [1, 2, 3, 4, 5, 6, 0].map((d) => ({ id: d, etiqueta: DIAS_NOMBRE[d] }));

export default function FormHabitoScreen({ id }) {
  const router = useRouter();
  const { obtener, crear, actualizar } = useHabitos();
  const existente = id ? obtener(id) : null;

  const [form, setForm] = useState(() =>
    existente ? { ...VACIO, ...existente, metaDiaria: String(existente.metaDiaria) } : VACIO
  );
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [avisoPermiso, setAvisoPermiso] = useState('');

  const cambiar = (campo) => (valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined })); // se quita el error al corregir
  };

  if (id && !existente) {
    return (
      <Pantalla>
        <Text style={styles.ayuda}>No se encontró el hábito.</Text>
      </Pantalla>
    );
  }

  async function activarRecordatorio(valor) {
    cambiar('recordatorioActivo')(valor);
    setAvisoPermiso('');
    if (valor && !(await pedirPermiso())) {
      setAvisoPermiso('Sin permiso de notificaciones el recordatorio no sonará. Puedes activarlo en Perfil.');
    }
  }

  async function guardar() {
    const e = validarHabito(form);
    setErrores(e);
    if (Object.keys(e).length) return;
    setGuardando(true);
    if (existente) {
      await actualizar(id, form);
      router.back();
    } else {
      const nuevo = await crear(form);
      router.replace(`/habito/${nuevo.id}`);
    }
  }

  return (
    <Pantalla>
      <Stack.Screen options={{ title: existente ? 'Editar hábito' : 'Nuevo hábito' }} />

      <Campo etiqueta="Nombre del hábito" value={form.nombre} onChangeText={cambiar('nombre')} error={errores.nombre}
        placeholder="Ej. Tomar agua, Leer, Meditar" maxLength={40} />

      <View>
        <Text style={styles.etiqueta}>Categoría</Text>
        <Chips opciones={CATEGORIAS.map((c) => ({ id: c.id, etiqueta: c.id, icono: c.icono }))} valor={form.categoria} onCambiar={cambiar('categoria')} />
      </View>

      <View>
        <Text style={styles.etiqueta}>Frecuencia</Text>
        <Chips opciones={FRECUENCIAS} valor={form.frecuencia} onCambiar={cambiar('frecuencia')} />
        {form.frecuencia === 'semanal' && <Text style={styles.ayuda}>Basta con cumplirlo una vez por semana.</Text>}
        {form.frecuencia === 'dias' && (
          <View style={{ marginTop: 12 }}>
            <Chips multiple opciones={OPCIONES_DIAS} valor={form.diasSemana} onCambiar={cambiar('diasSemana')} />
            {errores.diasSemana && <Text style={styles.error}>{errores.diasSemana}</Text>}
          </View>
        )}
      </View>

      <View style={styles.fila}>
        <Campo etiqueta="Meta diaria" value={form.metaDiaria} onChangeText={cambiar('metaDiaria')} error={errores.metaDiaria}
          keyboardType="numeric" estilo={{ flex: 1 }} />
        <Campo etiqueta="Unidad" value={form.unidad} onChangeText={cambiar('unidad')} placeholder="vasos, min, páginas" estilo={{ flex: 1 }} />
      </View>

      <View style={styles.recordatorio}>
        <View style={{ flex: 1 }}>
          <Text style={styles.etiqueta}>Recordatorio</Text>
          <Text style={styles.ayuda}>Te avisamos si el hábito sigue pendiente.</Text>
        </View>
        <Switch
          value={form.recordatorioActivo}
          onValueChange={activarRecordatorio}
          trackColor={{ true: colores.primario }}
          thumbColor="#fff"
          accessibilityLabel="Activar recordatorio"
        />
      </View>
      {form.recordatorioActivo && (
        <Campo etiqueta="Hora del recordatorio (24 h)" value={form.horaRecordatorio} onChangeText={cambiar('horaRecordatorio')}
          error={errores.horaRecordatorio} placeholder="08:00" maxLength={5} keyboardType="numbers-and-punctuation" />
      )}
      {avisoPermiso ? <Text style={styles.aviso}>{avisoPermiso}</Text> : null}

      <Boton titulo={existente ? 'Guardar cambios' : 'Guardar hábito'} onPress={guardar} cargando={guardando} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto, marginBottom: 8 },
  ayuda: { fontSize: 13, color: colores.textoSuave, marginTop: 6 },
  error: { color: colores.peligro, fontSize: 13, marginTop: 6 },
  aviso: { color: colores.aviso, fontSize: 13 },
  fila: { flexDirection: 'row', gap: 12 },
  recordatorio: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
