self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // El service worker simplemente existe para cumplir el requisito de instalación
});
