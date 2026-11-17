// PAMANA offline cache: network-first for pages, stale-while-revalidate for assets,
// fonts, and photos. After one visit the site keeps working without a connection.
const CACHE = "pamana-v2"
const SCOPE = self.registration.scope
// Brand artwork is referenced from JavaScript rather than index.html, so precache it by name.
const BRAND_ASSETS = [
  "brand/pamana-emblem.webp",
  "brand/pamana-logo.webp",
  "brand/pamana-mascot.webp",
  "brand/pamana-favicon.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      try {
        const response = await fetch(SCOPE, { cache: "no-cache" })
        if (response.ok) {
          await cache.put(SCOPE, response.clone())
          // Precache the app shell assets referenced by index.html.
          const html = await response.text()
          const assets = [
            ...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|svg|png|ico))"/g),
          ]
            .map((match) => new URL(match[1], SCOPE).toString())
            .filter((url) => url.startsWith(self.location.origin))
          assets.push(
            ...BRAND_ASSETS.map((path) => new URL(path, SCOPE).toString()),
          )
          await Promise.all(
            assets.map((url) => cache.add(url).catch(() => undefined)),
          )
        }
      } catch {
        // Offline during install: runtime caching will fill the cache later.
      }
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
      )
      await self.clients.claim()
    })(),
  )
})

const CACHEABLE_HOSTS = [
  "images.unsplash.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]

self.addEventListener("fetch", (event) => {
  const request = event.request
  if (request.method !== "GET") return
  const url = new URL(request.url)

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE)
        try {
          const response = await fetch(request)
          if (response.ok) cache.put(SCOPE, response.clone())
          return response
        } catch {
          // Every route is served by the same single-page shell.
          return (await cache.match(SCOPE)) ?? Response.error()
        }
      })(),
    )
    return
  }

  if (
    url.origin !== self.location.origin &&
    !CACHEABLE_HOSTS.includes(url.hostname)
  )
    return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      const cached = await cache.match(request)
      const network = fetch(request)
        .then((response) => {
          if (response.ok || response.type === "opaque")
            cache.put(request, response.clone())
          return response
        })
        .catch(() => undefined)
      if (cached) {
        event.waitUntil(network)
        return cached
      }
      return (await network) ?? Response.error()
    })(),
  )
})
