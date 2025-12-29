/**
 * SERVICE WORKER - Yemar Makeup Artist PWA
 * Versão: 1.0.0
 */

const CACHE_NAME = 'yemar-makeup-v1.0.0';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/servicos.html',
    '/servico.html',
    '/workshops.html',
    '/workshop.html',
    '/eventos.html',
    '/evento.html',
    '/produtos.html',
    '/produto.html',
    '/blog.html',
    '/post.html',
    '/conta.html',
    '/contacto.html',
    '/sobre.html',
    '/carrinho.html',
    '/portfolio.html',
    '/css/styles.css',
    '/js/storage.js',
    '/js/ui.js',
    '/js/app.js',
    '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cache aberto');
                // Cachear apenas os arquivos essenciais
                return cache.addAll(CACHE_ASSETS.slice(0, 5));
            })
            .then(() => {
                console.log('[Service Worker] Instalado com sucesso');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Erro na instalação:', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Ativado com sucesso');
                return self.clients.claim();
            })
    );
});

// Estratégia de cache: Network First, fallback para Cache
self.addEventListener('fetch', (event) => {
    // Ignorar requisições não-GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Ignorar requisições externas (exceto Google Fonts)
    const url = new URL(event.request.url);
    if (url.origin !== location.origin && !url.origin.includes('googleapis.com') && !url.origin.includes('gstatic.com')) {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Se a resposta é válida, clonar e cachear
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                }
                
                return response;
            })
            .catch(() => {
                // Se falhar, tentar buscar do cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Se não houver cache, retornar página offline personalizada
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    }
});

// Sincronização em background (para futuras funcionalidades)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Sincronização em background:', event.tag);
    
    if (event.tag === 'sync-bookings') {
        event.waitUntil(syncBookings());
    }
});

// Função auxiliar para sincronizar marcações (placeholder)
async function syncBookings() {
    console.log('[Service Worker] Sincronizando marcações...');
    // Implementar lógica de sincronização quando houver backend
    return Promise.resolve();
}

// Push notifications (para futuras funcionalidades)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push recebido:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'Nova notificação',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'yemar-notification',
        requireInteraction: false
    };
    
    event.waitUntil(
        self.registration.showNotification('Yemar Makeup Artist', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notificação clicada:', event);
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
