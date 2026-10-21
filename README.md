# HabitZen

Gestor de hábitos y bienestar. Es una app multiplataforma (Android, iOS y web/PWA) hecha con **React Native + Expo SDK 57** y **Expo Router**, con **Firebase** (Authentication + Cloud Firestore) como base de datos.

Proyecto integrador de Aplicaciones Web Progresivas, Equipo 1, IDGS-10A.

## Cómo correrlo

```bash
npm install          # instalar dependencias (después de cada git pull que cambie package.json)
npm run web          # abrir en el navegador: http://localhost:8081
npm start            # abrir en el celular con Expo Go (escanear el QR)
```

## Generar la PWA (versión instalable)

```bash
npm run build:web    # exporta a dist/ y genera el service worker (dist/sw.js)
npm run serve:web    # sirve dist/ en http://localhost:3000 para probarla
```

Para comprobar que la PWA funciona, abre las DevTools de Chrome y revisa:

- **Application → Manifest**: nombre, íconos y colores sin errores.
- **Application → Service workers**: `sw.js` activo.
- **Network → Offline** y recargar: la app abre sin internet.

> El service worker **no** se registra en `npm run web` (puerto 8081), para no guardar en caché código de desarrollo. Solo se registra en el build.

## Despliegue (Netlify)

1. Corre `npm run build:web`.
2. Entra a <https://app.netlify.com/drop> y arrastra la carpeta `dist/`.
3. Netlify te da una URL con HTTPS. Desde el celular, abre esa URL y elige "Agregar a pantalla de inicio".

El archivo `public/_redirects` hace que rutas como `/habito/123` funcionen al recargar la página.

## Estructura

```
src/
├── app/                  Rutas (Expo Router): cada archivo es una pantalla
│   ├── _layout.js        Proveedores globales y navegación raíz
│   ├── (auth)/           login, registro (sin sesión)
│   └── (app)/            zona con sesión
│       ├── (tabs)/       Hábitos, Estadísticas, Perfil
│       └── habito/       nuevo, [id] (detalle), editar/[id]
├── screens/              Interfaz de cada pantalla
├── components/           Componentes reutilizables (Boton, Campo, Calendario, GraficaBarras…)
├── context/              Estado global: AuthContext, HabitosContext
├── services/             Firebase, almacenamiento local, auth, base de datos, sincronización, clima, notificaciones, conexión
├── utils/                Fechas, rachas, estadísticas, validaciones
└── constants/tema.js     Colores, categorías y frecuencias
public/                   manifest.json, íconos e index.html de la PWA
workbox-config.js         Configuración del service worker
```

Los archivos `*.web.js` (por ejemplo `notificaciones.web.js`) son la versión para navegador. Expo elige el archivo correcto según la plataforma.

## Cómo funciona

| Funcionalidad | Dónde | Notas |
|---|---|---|
| Registro e inicio de sesión | `services/auth.js` | **Firebase Authentication** con correo y contraseña. La sesión se mantiene al cerrar la app. |
| CRUD de hábitos | `services/habitos.js`, `context/HabitosContext.js` | Cada usuario ve solo sus hábitos. |
| Base de datos | `services/api.js` | **Cloud Firestore**: cada hábito en `usuarios/{uid}/habitos/{id}`. Las reglas de seguridad solo permiten a cada usuario leer y escribir sus propios datos. |
| Cumplimiento y rachas | `utils/rachas.js` | Si hoy aún está pendiente, la racha no se rompe. Soporta frecuencia diaria, semanal o días específicos. |
| Estadísticas | `utils/estadisticas.js`, `components/GraficaBarras.js` | Gráficas semanal (por día) y mensual (por semana). |
| Clima | `services/clima.js` | Open-Meteo con la ubicación del dispositivo. Sin permiso usa Aguascalientes; sin internet usa el último clima guardado. |
| Recordatorios | `services/notificaciones.js` | En el celular se programan con `expo-notifications` y se cancelan al marcar el hábito. En web avisan mientras la app está abierta. |
| Sin conexión | `services/almacenamiento.js`, `services/sincronizacion.js` | Todo se guarda primero en el dispositivo y se sube a Firestore con una cola. Al iniciar sesión o recuperar internet, se descarga lo de la nube y se combina con lo local (gana el cambio más reciente). |

## Firebase

- La configuración del proyecto está en `src/services/firebaseConfig.js`. Esos datos no son secretos: la seguridad la dan las reglas de Firestore.
- La conexión está en `src/services/firebase.js` (celular, guarda la sesión con AsyncStorage) y `src/services/firebase.web.js` (navegador).
- Reglas de Firestore (consola de Firebase → Firestore Database → Reglas):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid}/{documento=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Notas

- **Expo Go en Android**: las notificaciones locales funcionan; las push remotas no (desde el SDK 53).
- **Iniciar o crear sesión requiere internet** (Firebase); después, la app funciona sin conexión.
- **Antes de instalar paquetes**, usa `npx expo install nombre-paquete` (no `npm install`) y avisa al equipo.
