// Service Worker para Inquisidor-chat
const CACHE_NAME = 'clarence-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalación: Carga los archivos base en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Fuerza la activación inmediata del SW
  self.skipWaiting();
});

// Activación: Limpia cachés antiguas si fuera necesario
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch: Intercepta las peticiones de red para servir desde caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devuelve; si no, lo busca en red
      return response || fetch(event.request);
    })
  );
});
