# HabitZen: tablero de tareas

Cómo usarlo: cuando alguien tome una tarea, la mueve de *Por hacer* a *En progreso* y le agrega su nombre al final. Al abrir su Pull Request pasa a *En revisión*, y cuando se fusiona en `main` queda en *Hecho*. Marquen la casilla `[x]` al terminar.

Reglas rápidas:
- Una rama por tarea (`feature/nombre-de-la-tarea`).
- `git pull origin main` antes de empezar cada día.
- Pull Request hacia `main`, sin subir directo a `main`.
- Si dos personas necesitan editar el mismo archivo (por ejemplo `App.js`), avisen en el grupo antes.

Las tareas están agrupadas según la Tabla 2 del documento (Funcionalidades propuestas de HabitZen).

---

## POR HACER

### Acuerdos y preparación
- [ ] Restaurar en `main` el commit que se revirtió ("Integra ícono HabitZen y pantalla Mis hábitos con API"). Lo hace solo una persona.
- [ ] Confirmar cuál es la API del proyecto: URL base y endpoints de usuarios y hábitos.
- [ ] Definir el modelo de datos del Hábito: `id`, `nombre`, `categoria`, `frecuencia`, `metaDiaria`, `horaRecordatorio`, `rachaActual`, `fechaCreacion`, `activo` e historial de días cumplidos.
- [ ] Acordar la estructura de carpetas: `screens/`, `components/`, `services/`, `utils/`.
- [ ] Confirmar que todos tienen el proyecto corriendo (`npm ci` y `npm run web`).
- [ ] Base del proyecto: navegación entre pantallas y tema visual (colores del ícono).

### 1. Gestión de hábitos (CRUD)
- [ ] Pantalla "Mis hábitos": lista de tarjetas.
- [ ] Crear hábito (nombre, categoría, frecuencia, meta diaria y hora de recordatorio).
- [ ] Consultar el detalle de un hábito.
- [ ] Editar hábito.
- [ ] Eliminar hábito.

### 2. Registro diario de cumplimiento
- [ ] Marcar un hábito como cumplido hoy con un toque.
- [ ] Actualizar el progreso diario en pantalla al marcarlo.

### 3. Rachas y estadísticas
- [ ] Cálculo de la racha de días consecutivos.
- [ ] Gráfica de cumplimiento semanal.
- [ ] Gráfica de cumplimiento mensual.

### 4. Recordatorios con notificaciones
- [ ] Pedir permiso de notificaciones al usuario.
- [ ] Programar la notificación a la hora configurada de cada hábito.
- [ ] Enviar la notificación solo si el hábito sigue pendiente ese día.

### 5. Sugerencia según el clima
- [ ] Obtener la ubicación del dispositivo (con permiso del usuario).
- [ ] Consumir la API Open-Meteo para el clima actual.
- [ ] Mensaje que sugiere si conviene hacer actividad al aire libre.

### 6. Funcionamiento sin conexión
- [ ] Servicio de almacenamiento local compartido (guardar y leer hábitos con AsyncStorage).
- [ ] Guardar los registros de cumplimiento localmente cuando no hay conexión.
- [ ] Sincronizar los registros con la API al recuperar la conexión.
- [ ] Pruebas del modo sin conexión.

### 7. Inicio de sesión
- [ ] Pantalla de registro con correo y contraseña.
- [ ] Pantalla de inicio de sesión.
- [ ] Asociar los hábitos a cada usuario.

### PWA
- [ ] Manifest (`public/manifest.json`) con nombre, íconos y colores.
- [ ] Service worker y registro en `public/index.html`.
- [ ] Exportar para web (`npx expo export -p web`) y probar el build.
- [ ] Auditoría con Lighthouse.
- [ ] Despliegue de la PWA.

### Cierre del proyecto
- [ ] Integrar todo en `main` y probar en celular y navegador.
- [ ] Corregir errores encontrados.
- [ ] Documentación del proyecto.
- [ ] Presentación final.

---

## EN PROGRESO

*(Nada todavía. Muevan aquí sus tareas al empezar.)*

---

## EN REVISIÓN

- [ ] Íconos de la app (icon, splash y favicon). Rama `feature/icono` ya subida. Falta abrir el Pull Request hacia `main` y decidir cuál ícono se queda si hay conflicto.

---

## HECHO

- [x] Repositorio creado y clonado en las computadoras del equipo.
- [x] Íconos de la app subidos a la rama `feature/icono`.
