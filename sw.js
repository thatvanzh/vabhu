const CACHE_NAME = 'vabhu-chat-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/client.js',
    '/chatlogo2.png'
];

// 1. Install Service Worker and Cache UI Files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Intercept network requests
self.addEventListener('fetch', (event) => {
    // IMPORTANT: Ignore socket.io requests so live chat doesn't get blocked
    if (event.request.url.includes('/socket.io/')) {
        return;
    }

    // Serve cached files if available, otherwise fetch from network
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
