import { ActivityIndicator, View } from 'react-native';
import { colores } from '../constants/tema';

export default function Cargando() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colores.fondo }}>
      <ActivityIndicator size="large" color={colores.primario} />
    </View>
  );
}
