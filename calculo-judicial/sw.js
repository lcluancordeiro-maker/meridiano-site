const CACHE_VERSION = 'calc-judicial-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache){ return cache.addAll(APP_SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_VERSION; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  var req = event.request;
  if(req.method !== 'GET') return;

  var url = new URL(req.url);

  // Never cache calls to the Banco Central API — correction indices must always be fresh.
  if(url.hostname === 'api.bcb.gov.br'){
    return; // let the browser handle it normally (online) / fail naturally (offline)
  }

  // Google Fonts: stale-while-revalidate so the UI keeps its type offline after first load.
  if(url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    event.respondWith(
      caches.open(CACHE_VERSION).then(function(cache){
        return cache.match(req).then(function(cached){
          var fetchPromise = fetch(req).then(function(res){
            cache.put(req, res.clone());
            return res;
          }).catch(function(){ return cached; });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // App shell / same-origin assets: cache-first, falling back to network, updating cache silently.
  if(url.origin === self.location.origin){
    event.respondWith(
      caches.match(req).then(function(cached){
        var fetchPromise = fetch(req).then(function(res){
          if(res && res.ok){
            var resClone = res.clone();
            caches.open(CACHE_VERSION).then(function(cache){ cache.put(req, resClone); });
          }
          return res;
        }).catch(function(){ return cached; });
        return cached || fetchPromise;
      })
    );
  }
});
