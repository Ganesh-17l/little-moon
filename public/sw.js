/* Little Moon Service Worker */
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `little-moon-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Install: pre-cache critical app shell without calling skipWaiting()
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SW] Pre-caching asset failed:', asset, err);
          })
        )
      );
    })
  );
  // Intentionally NOT calling self.skipWaiting() here.
  // This allows the app to detect the 'waiting' state and show the "Update available" UI.
});

// Activate: clean up outdated caches and claim existing clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('little-moon-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Safe network-first with offline fallback for navigation, and cache-first/stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests and http/https schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // Skip Vite dev server internal requests, HMR, and virtual modules
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules') ||
    url.pathname.includes('__vite') ||
    url.search.includes('t=') ||
    url.search.includes('import')
  ) {
    return;
  }

  // Security & Privacy: Never cache Supabase API, Auth, Realtime, or Edge Function requests
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/rest/v1') ||
    url.pathname.startsWith('/auth/v1') ||
    url.pathname.startsWith('/functions/v1') ||
    url.pathname.startsWith('/realtime/v1')
  ) {
    return;
  }

  // 1. Navigation requests (HTML documents for SPA routes like /memories, /levels, /home)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone()).catch(() => {});
          }
          return networkResponse;
        } catch (err) {
          // Network failed (offline / disconnected)
          // 1. Check if the exact requested URL was cached
          const cachedRequest = await caches.match(request);
          if (cachedRequest) return cachedRequest;

          // 2. Check for cached index.html / app shell
          const cachedIndex =
            (await caches.match('./index.html')) ||
            (await caches.match('/index.html')) ||
            (await caches.match('./')) ||
            (await caches.match('/'));

          if (cachedIndex) return cachedIndex;

          // 3. Fallback: Always return a valid Response, NEVER undefined
          return new Response(
            '<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Little Moon - Offline</title></head><body style="font-family:sans-serif;text-align:center;padding:40px;"><h2>You are offline</h2><p>Please check your connection and reload.</p></body></html>',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }
          );
        }
      })()
    );
    return;
  }

  // 2. Static assets & other GET requests
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Revalidate in background (stale-while-revalidate)
        fetch(request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const cache = await caches.open(CACHE_NAME);
              cache.put(request, networkResponse.clone()).catch(() => {});
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache: fetch from network
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone()).catch(() => {});
        }
        return networkResponse;
      } catch (err) {
        // Guarantee a valid Response is returned, never undefined
        return new Response('Asset unavailable offline', {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// Listen for message from client to activate the waiting service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING signal received. Activating immediately.');
    self.skipWaiting();
  }
});
