// Tema visual de HabitZen: colores tomados del ícono de la app.
// "marca" es el teal del ícono; "primario" es un tono más oscuro para que el texto
// blanco sobre los botones tenga buen contraste (accesibilidad WCAG AA).
export const colores = {
  marca: '#14968C',
  primario: '#0D7A72',
  primarioOscuro: '#0A5F59',
  primarioClaro: '#E6F4F2',
  acento: '#22C55E',
  fondo: '#F4F6F5',
  superficie: '#FFFFFF',
  texto: '#1F2933',
  textoSuave: '#5B6472',
  borde: '#E2E8F0',
  peligro: '#C62828',
  peligroClaro: '#FDECEC',
  aviso: '#B45309',
  avisoClaro: '#FEF3C7',
};

export const espacio = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radio = { sm: 8, md: 12, lg: 20, pill: 999 };

export const texto = {
  titulo: { fontSize: 24, fontWeight: '700', color: colores.texto },
  subtitulo: { fontSize: 18, fontWeight: '700', color: colores.texto },
  cuerpo: { fontSize: 15, color: colores.texto },
  pequeno: { fontSize: 13, color: colores.textoSuave },
};

// Categorías disponibles para un hábito (nombre del ícono de Ionicons)
export const CATEGORIAS = [
  { id: 'Salud', icono: 'water-outline', color: '#0EA5E9' },
  { id: 'Ejercicio', icono: 'barbell-outline', color: '#F97316' },
  { id: 'Sueño', icono: 'moon-outline', color: '#6366F1' },
  { id: 'Mente', icono: 'book-outline', color: '#A855F7' },
  { id: 'Productividad', icono: 'checkmark-done-outline', color: '#14968C' },
];

export const FRECUENCIAS = [
  { id: 'diaria', etiqueta: 'Diaria' },
  { id: 'semanal', etiqueta: 'Semanal' },
  { id: 'dias', etiqueta: 'Días específicos' },
];

export function infoCategoria(id) {
  return CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[0];
}
