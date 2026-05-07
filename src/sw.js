import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'

self.skipWaiting()

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

registerRoute(
  ({ url }) => /^https:\/\/apis\.google\.com\//.test(url.href),
  new NetworkFirst({ cacheName: 'google-api-cache' })
)

// When a new SW activates, claim all open tabs and force-reload them
// so users never see a stale cached version after a deploy.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim().then(() =>
      clients.matchAll({ type: 'window', includeUncontrolled: true })
    ).then((clientList) =>
      Promise.all(clientList.map((c) => c.navigate(c.url).catch(() => null)))
    )
  );
});
