/* ============================================================
 * Service Worker — Absensi MGMP Bahasa Inggris Kab. Probolinggo
 * Strategi:
 *   - precache shell (HTML, manifest, icons)
 *   - Apps Script iframe: network-first (selalu ambil terbaru)
 *   - static assets (cached): cache-first
 *   - navigasi: network-first fallback ke cache
 * ============================================================ */

const CACHE_VERSION = "v1.0.1";  // ← naikkan ke v1.0.1 untuk fix chrome-extension error
const STATIC_CACHE  = `mgmp-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mgmp-runtime-${CACHE_VERSION}`;

// ⚠ GANTI dengan URL deployment Apps Script MGMP Anda
// Cara dapatkan: di Apps Script editor → Deploy → Manage deployments → copy URL /exec
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzHhagqHeRuPz-4cRerSHmEmX3mbamcOlEzIFLSwkIcUIxhDgQnFQQWMW5l1MDuWOz8JQ/exec";

// Shell yang di-precache saat install
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png"
];

/* ---------- INSTALL: precache shell ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] precache failed:", err))
  );
});

/* ---------- ACTIVATE: bersihkan cache lama ---------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- FETCH: routing strategi ---------- */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Abaikan non-GET (POST ke Apps Script tidak di-cache)
  if (req.method !== "GET") return;

  // ⚠ Skip request non-http(s): chrome-extension://, data:, blob:, file:, dll
  // Cache API hanya support http/https scheme.
  // Request dari Chrome extension (Grammarly, Adblock, dll) akan dilewatkan tanpa cache.
  try {
    const url = new URL(req.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return; // skip — biarkan browser handle sendiri
    }
  } catch (e) {
    return; // URL invalid, skip
  }

  const url = new URL(req.url);

  // 1) Apps Script & googleusercontent → Network-first (data harus segar)
  if (
    url.hostname.includes("script.google.com") ||
    url.hostname.includes("script.googleusercontent.com") ||
    url.hostname.includes("googleusercontent.com") ||
    url.hostname.includes("drive.google.com") ||
    url.hostname.includes("lh3.googleusercontent.com") ||
    url.hostname.includes("api.qrserver.com")
  ) {
    event.respondWith(networkFirst(req));
    return;
  }

  // 2) Navigasi (HTML page request) → Network-first, fallback offline page
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }

  // 3) Static assets → Cache-first
  if (["style", "script", "image", "font"].includes(req.destination)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // 4) Default → Stale-while-revalidate
  event.respondWith(staleWhileRevalidate(req));
});

/* ---------- Strategi caching ---------- */
async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(req);
    // Hanya cache response OK & same-origin atau yang diizinkan
    if (fresh && fresh.status === 200) {
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Fallback untuk navigasi
    if (req.mode === "navigate") {
      const offline = await caches.match("./index.html");
      if (offline) return offline;
    }
    throw err;
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (err) {
    // Tidak ada cache, tidak ada network → response kosong
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((fresh) => {
      if (fresh && fresh.status === 200) {
        cache.put(req, fresh.clone());
      }
      return fresh;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

/* ---------- Pesan dari klien (skipWaiting trigger) ---------- */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* ---------- Periodic Sync (opsional, untuk update background) ---------- */
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "refresh-absensi") {
    event.waitUntil(refreshCache());
  }
});

async function refreshCache() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.add(APPS_SCRIPT_URL);
  } catch (e) {
    console.warn("[SW] refresh failed:", e);
  }
}
