// Force Service Worker Update
// Este arquivo força a atualização do Service Worker quando há uma nova versão

const CACHE_VERSION = 'v1.60.0'; // Atualizar a cada deploy

self.addEventListener('install', (event) => {
  console.log('[SW] Nova versão instalando...', CACHE_VERSION);
  // skipWaiting força a ativação imediata
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando nova versão...', CACHE_VERSION);

  event.waitUntil(
    // Limpar TODOS os caches antigos
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Deletando cache antigo:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Tomar controle de todas as páginas abertas imediatamente
      return clients.claim();
    }).then(() => {
      // Recarregar todas as páginas abertas
      return clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          console.log('[SW] Recarregando cliente:', client.url);
          client.navigate(client.url);
        });
      });
    })
  );
});

// Fetch - Sempre buscar da rede, sem cache
self.addEventListener('fetch', (event) => {
  // Para requisições da API, NUNCA cachear
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    );
    return;
  }

  // Para outras requisições, tentar rede primeiro
  event.respondWith(
    fetch(event.request, {
      cache: 'no-cache'
    }).catch(() => {
      // Se falhar, tentar cache como fallback
      return caches.match(event.request);
    })
  );
});

// Message handler para forçar update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service Worker carregado - Versão:', CACHE_VERSION);
