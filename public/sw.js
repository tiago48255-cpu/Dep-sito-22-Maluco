// Service worker mínimo do 22 Maluco — habilita instalação do PWA (Android/Chrome)
// e um fallback básico de rede. Sem cache agressivo pra não atrapalhar atualizações.
const CACHE = "22maluco-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(["/", "/icons/icon-192.png", "/icons/icon-512.png"]).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first; cai pro cache só se offline (não cacheia API/Supabase)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((r) => r || Response.error()))
  );
});
