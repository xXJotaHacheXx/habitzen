import { useLocalSearchParams } from 'expo-router';
import Cargando from '../../../../components/Cargando';
import { useHabitos } from '../../../../context/HabitosContext';
import FormHabitoScreen from '../../../../screens/FormHabitoScreen';

export default function EditarHabito() {
  const { id } = useLocalSearchParams();
  const { cargando } = useHabitos();
  // Se espera a que carguen los hábitos para llenar el formulario con sus datos
  return cargando ? <Cargando /> : <FormHabitoScreen id={id} />;
}
