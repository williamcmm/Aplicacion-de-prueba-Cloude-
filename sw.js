// ========================================
// LecturaVeloz - Service Worker
// Permite funcionamiento offline y PWA
// ========================================

const CACHE_NAME = 'lecturaveloz-v1';
const BASE_PATH = '/Aplicacion-de-prueba-Cloude-/';

const ASSETS_TO_CACHE = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'css/styles.css',
    BASE_PATH + 'js/app.js',
    BASE_PATH + 'js/exercises.js',
    BASE_PATH + 'js/storage.js',
    BASE_PATH + 'data/gospels-mateo.js',
    BASE_PATH + 'data/gospels-marcos.js',
    BASE_PATH + 'data/gospels-lucas.js',
    BASE_PATH + 'data/gospels-juan.js',
    BASE_PATH + 'data/comprehension-questions.js',
    BASE_PATH + 'manifest.json',
    BASE_PATH + 'img/icon-192.png',
    BASE_PATH + 'img/icon-512.png'
];

// Install - Cache all essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version and update in background
                    event.waitUntil(
                        fetch(event.request)
                            .then((networkResponse) => {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME)
                                        .then((cache) => cache.put(event.request, networkResponse));
                                }
                            })
                            .catch(() => {}) // Ignore network errors during background update
                    );
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => cache.put(event.request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Offline fallback for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(BASE_PATH + 'index.html');
                        }
                    });
            })
    );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
