/* ─────────────────────────────────────────────────────────────
 * Service worker — app-shell caching for "Beyond the Plaza".
 *
 * Bump CACHE_VERSION whenever the precached shell changes so old
 * caches are cleared on activate. Only same-origin GETs are handled;
 * cross-origin requests (Google Fonts, React/Babel, ConvertKit CDNs)
 * pass straight through to the network.
 * ───────────────────────────────────────────────────────────── */
const CACHE_VERSION = 'v2';
const CACHE_NAME = 'btp-shell-' + CACHE_VERSION;

/* Same-origin files that make up the installable app shell. */
const PRECACHE = [
  './',
  'index.html',
  'app.html',
  'Splash-draftv3-parrot.html',
  'manifest.webmanifest',
  'styles/main.css',
  'styles/popups.css',
  'styles/voice-widget.css',
  'js/app.js',
  'js/voice-widget.js',
  'js/popups.js',
  'js/register-sw.js',
  'tweaks-panel.jsx',
  'data/modules.js',
  'modules/m0-sound-like-spanish.html',
  'modules/m1-who-are-you.html',
  'modules/popups/m0-complete.html',
  'modules/popups/m1-complete.html',
  'assets/favicon.svg',
  'assets/favicon-16.png',
  'assets/favicon-32.png',
  'assets/favicon-48.png',
  'assets/favicon-192.png',
  'assets/favicon-512.png',
  'assets/maskable-192.png',
  'assets/maskable-512.png',
  'assets/apple-touch-icon.png'
];

/* Install: precache the shell. Individual misses are tolerated so one
   bad URL can't block the whole install. */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      PRECACHE.map((url) => cache.add(url).catch((err) => console.warn('[sw] precache miss:', url, err)))
    );
    await self.skipWaiting();
  })());
});

/* Activate: drop any caches from older versions. */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* Fetch routing. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // CDN fonts/React/etc. → straight to network

  // Page navigations: network-first (fresh when online), cache fallback (works offline).
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
        return res;
      } catch (err) {
        const cached = await caches.match(req);
        return cached || (await caches.match('app.html')) || (await caches.match('index.html'));
      }
    })());
    return;
  }

  // Same-origin assets: cache-first, fall back to network (and cache what we fetch).
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
      return res;
    } catch (err) {
      return cached;   // nothing we can do offline for an uncached asset
    }
  })());
});
