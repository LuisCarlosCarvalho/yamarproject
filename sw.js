const CACHE_NAME = 'yamar-v1.0.0';
const STATIC_CACHE = 'yamar-static-v1.0.0';
const DYNAMIC_CACHE = 'yamar-dynamic-v1.0.0';

// Recursos estáticos para cache imediato
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/storage.js',
  '/js/ui.js',
  '/manifest.json',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

// Recursos dinâmicos comuns
const DYNAMIC_ASSETS = [
  '/sobre.html',
  '/servicos.html',
  '/workshops.html',
  '/produtos.html',
  '/contacto.html',
  '/blog.html',
  '/portfolio.html'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network First with Cache Fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;

  // Network First strategy for HTML pages
  if (request.destination === 'document' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response for caching
          const responseClone = response.clone();

          // Cache successful responses
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }

          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page if available
              return caches.match('/index.html');
            });
        })
    );
  }

  // Cache First strategy for static assets
  else if (request.destination === 'style' ||
           request.destination === 'script' ||
           request.destination === 'image' ||
           request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then(response => {
              const responseClone = response.clone();

              if (response.status === 200) {
                caches.open(STATIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }

              return response;
            });
        })
    );
  }

  // Default network first for other requests
  else {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();

          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }

          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});

// Message event for update notifications
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions (future implementation)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Placeholder for future background sync implementation
  console.log('[SW] Background sync triggered');
  return Promise.resolve();
}

// Push notifications (future implementation)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/icon-192.png',
      badge: '/assets/images/icon-96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});