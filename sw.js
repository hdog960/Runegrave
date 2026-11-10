/* RUNEGRAVE offline shell v0.07. New builds wait for player-approved refresh. */
const CACHE_NAME = 'runegrave-shell-v0.07.0';
const ASSETS = [
  './', './index.html', './styles.css', './js/main.js',
  './js/core/version.js', './js/core/rng.js', './js/core/ids.js', './js/content/realmCatalog.js',
  './js/scene/stage.js', './js/combat/soulbolts.js', './js/health/mortalHearts.js', './js/health/emberTrial.js', './js/health/healthArt.js', './js/combat/combatArt.js', './js/physics/world.js', './js/physics/fixedStep.js', './js/scene/sanctuaryArt.js', './js/platform/pwa.js', './js/input/vector.js', './js/input/twinStick.js',
  './art/world-tree.svg', './manifest.webmanifest',
  './icons/runegrave-180.png', './icons/runegrave-192.png', './icons/runegrave-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS.map((file) => new URL(file, self.registration.scope)))));
  // Intentional: never force an open game tab to reload during a future run.
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('runegrave-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response.ok && response.type !== 'opaque') await cache.put(req, response.clone());
      return response;
    } catch (error) {
      if (req.mode === 'navigate') {
        const offline = await cache.match(new URL('./index.html', scope));
        if (offline) return offline;
      }
      throw error;
    }
  })());
});
