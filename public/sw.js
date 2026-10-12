// PrepTrack Progressive Web App Service Worker (v3.0)
const STATIC_CACHE = 'preptrack-static-v3';
const RUNTIME_CACHE = 'preptrack-runtime-v3';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
  '/icons/favicon-16.png',
  '/icons/icon.svg'
];

// Install Event: pre-cache application shell and core icons
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[PrepTrack SW] Pre-cache skipped for:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: clean up obsolete cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => {
            console.log('[PrepTrack SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Listen for skip waiting messages from the application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // 1. Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 2. Ignore non-HTTP(S) schemes (e.g. chrome-extension://, file://)
  if (!url.protocol.startsWith('http')) return;

  // 3. Bypass external APIs, databases, authentication, and AI services
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('generativelanguage.googleapis.com') ||
    url.hostname.includes('vercel.com') ||
    url.pathname.includes('/sso-api') ||
    url.pathname.includes('/auth/v1')
  ) {
    return;
  }

  // 4. HTML Navigation Requests (SPA client-side routes)
  // Network-First with fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached =
            (await caches.match(event.request)) ||
            (await caches.match('/index.html')) ||
            (await caches.match('/'));

          if (cached) return cached;

          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>PrepTrack — Offline</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
                .card { background: white; border-radius: 16px; padding: 32px; max-width: 440px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
                h1 { font-size: 20px; margin: 0 0 8px; color: #0f172a; }
                p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 20px; }
                button { background: #2563eb; color: white; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; cursor: pointer; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>You are currently offline</h1>
                <p>PrepTrack will restore full functionality once your network connection is re-established. Previously cached syllabus and quizzes remain accessible.</p>
                <button onclick="window.location.reload()">Retry Connection</button>
              </div>
            </body>
            </html>`,
            {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            }
          );
        })
    );
    return;
  }

  // 5. Static Assets (Scripts, Stylesheets, Web Fonts, Images, Audio, Icons)
  // Stale-While-Revalidate caching strategy with dynamic runtime cache
  const isStaticAsset =
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|webp|woff|woff2|ttf|eot)$/i) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Fetch from network in background or as fallback
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              (networkResponse.type === 'basic' || networkResponse.type === 'cors')
            ) {
              const clone = networkResponse.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, if nothing cached return empty or placeholder
            return cachedResponse;
          });

        // If cached asset exists, return immediately (fast load) and revalidate in background
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 6. Default Fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
      );
    })
  );
});
