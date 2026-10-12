const CACHE = 'bitacora-fe-explorer-v3.4.0';
const CORE = ['./', './index.html', './cloud-config.js', './cloud-sync.js', './cloud-sync.css', './style.css', './app.js', './leer.html', './leer.js', './leer.css', './mis-libros.js', './lector-personal.html', './lector-personal.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './estudios/indice.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))), self.clients.claim()]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => {const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));return res}).catch(() => caches.match(req).then(r => r || caches.match(new URL('./index.html',self.registration.scope)))));
    return;
  }
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res})));
});
