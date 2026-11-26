// Uppställningar – offline-stöd. Byt VERSION när filerna ändras (bygg.py gör det automatiskt).
const VERSION = 'upst-3812431e';
const FILER = ['./', 'index.html', 'stil.css?v=363ebe9b', 'uppstallning.js?v=3812431e', 'manifest.webmanifest',
  'bilder/kompass.png', 'bilder/ikon-192.png', 'bilder/ikon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILER)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSION).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
// Nätet först (alltid senaste versionen), cachen om eleven är offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) {
      const kopia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, kopia));
    }
    return r;
  }).catch(() => caches.match(e.request, {ignoreSearch: false}).then(r => r || caches.match('index.html'))));
});
