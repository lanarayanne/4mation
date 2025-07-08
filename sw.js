const CACHE_NAME = 'v1';
const STATIC_CACHE_URLS = [
    './',
    './scripts/app.js',
    './scripts/amation.js',
    './scripts/Cell.js',
    './scripts/CellState.js',
    './scripts/Interface.js',
    './scripts/Player.js',
    './scripts/Winner.js',
    './manifest.webmanifest',
    './logo.jpg',
    './styles.css',
    './index.html'
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
