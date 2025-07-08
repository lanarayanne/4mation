const CACHE_NAME = 'v1';
const STATIC_CACHE_URLS = [
    './4mation/',
    './4mation/app.js',
    './4mation/scripts/4mation.js',
    './4mation/scripts/Cell.js',
    './4mation/scripts/CellState.js',
    './4mation/scripts/Interface.js',
    './4mation/scripts/Player.js',
    './4mation/scripts/Winner.js',
    './4mation/manifest.webmanifest',
    './4mation/logo192.png',
    './4mation/logo512.png',
    './4mation/logo.png',
    './4mation/styles.css',
    './4mation/index.html'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(STATIC_CACHE_URLS);
        })
    );
});

self.addEventListener('activate', function (event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (!cacheWhitelist.includes(key)) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (resp) {
            return resp || fetch(event.request).then(function (response) {
                return caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
