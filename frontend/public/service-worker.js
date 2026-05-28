/* TradeCafe minimal service worker — offline app-shell cache.
   Strategy:
   - Precache the install-time shell assets so the app boots offline.
   - Runtime: HTML navigation requests use network-first with a cache
     fallback (so users still see a shell when offline). Hashed static
     assets (JS / CSS / fonts) are cache-first. Everything else
     bypasses (e.g. external APIs). */

const VERSION = "tc-shell-v2";
const SHELL = ["/", "/index.html", "/manifest.json", "/tradecafe-logo.png", "/tradecafe-logo.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // bypass third-party (CDN logos, RPC, etc.)

  // HTML navigation: network-first, fall back to cached shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/index.html")))
    );
    return;
  }

  // Hashed static assets: cache-first.
  if (/\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|gif|webp|svg|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          }).catch(() => cached)
      )
    );
  }
});
