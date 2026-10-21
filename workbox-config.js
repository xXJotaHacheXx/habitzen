// Configuración de Workbox: genera dist/sw.js después de "expo export -p web".
// El service worker guarda en caché todos los archivos de la app para que abra sin internet.
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,svg,ico,json,ttf,woff,woff2}'],
  // Por defecto Workbox ignora carpetas node_modules, pero Expo exporta ahí las fuentes de íconos
  globIgnores: ['**/*.map', 'metadata.json'],
  swDest: 'dist/sw.js',
  maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
  // Es una SPA: cualquier ruta (/habito/123) abre index.html desde la caché
  navigateFallback: '/index.html',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Clima: se intenta la red y, sin conexión, se usa la última respuesta
      urlPattern: /^https:\/\/api\.open-meteo\.com\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'clima',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 5, maxAgeSeconds: 6 * 60 * 60 },
      },
    },
  ],
};
