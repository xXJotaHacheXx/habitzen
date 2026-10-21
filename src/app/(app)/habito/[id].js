import { useLocalSearchParams } from 'expo-router';
import Cargando from '../../../components/Cargando';
import { useHabitos } from '../../../context/HabitosContext';
import DetalleHabitoScreen from '../../../screens/DetalleHabitoScreen';

export default function DetalleHabito() {
  const { id } = useLocalSearchParams();
  const { cargando } = useHabitos();
  return cargando ? <Cargando /> : <DetalleHabitoScreen id={id} />;
}
