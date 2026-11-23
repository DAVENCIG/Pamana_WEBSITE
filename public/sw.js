// PAMANA service worker.
// - The app shell and every built file are precached at install (list injected at build time),
//   so lessons and quizzes open offline after the first successful visit.
// - Navigations: network first (3 s timeout), falling back to the cached single-page shell.
// - Hashed build files: cache first. Other same-origin files: stale-while-revalidate.
// - Photos and fonts from a few known hosts: stale-while-revalidate in a size-limited cache.
// - A new version waits until the page sends SKIP_WAITING (the in-app "Update" button).
const BUILD_ID = "__BUILD_ID__"
const PRECACHE = /*__PRECACHE__*/ []
const SHELL_CACHE = `pamana-shell-${BUILD_ID}`
const RUNTIME_CACHE = "pamana-runtime-v1"
const MAX_RUNTIME_ENTRIES = 150
const SCOPE = self.registration.scope
const CACHEABLE_HOSTS = [
  "images.unsplash.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE)
      const urls = [SCOPE, ...PRECACHE.map((p) => new URL(p, SCOPE).toString())]
      // addAll is all-or-nothing, so a half-cached shell never gets activated.
      await cache.addAll(urls.map((u) => new Request(u, { cache: "reload" })))
    })(),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter(
            (k) =>
              k !== SHELL_CACHE &&
              k !== RUNTIME_CACHE &&
              (k.startsWith("pamana-shell-") || k.startsWith("pamana-v")),
          )
          .map((k) => caches.delete(k)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

async function trim(cache) {
  const keys = await cache.keys()
  for (let i = 0; i < keys.length - MAX_RUNTIME_ENTRIES; i++) await cache.delete(keys[i])
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms)
    promise.then(
      (v) => (clearTimeout(t), resolve(v)),
      (e) => (clearTimeout(t), reject(e)),
    )
  })
}

self.addEventListener("fetch", (event) => {
  const request = event.request
  if (request.method !== "GET") return
  const url = new URL(request.url)
  const sameOrigin = url.origin === self.location.origin

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const shell = await caches.open(SHELL_CACHE)
        try {
          const response = await withTimeout(fetch(request), 3000)
          // Only refresh the shell from a real HTML page.
          if (response.ok && (response.headers.get("content-type") || "").includes("text/html"))
            shell.put(SCOPE, response.clone())
          return response
        } catch {
          // Every route is served by the same single-page shell.
          return (await shell.match(SCOPE)) ?? Response.error()
        }
      })(),
    )
    return
  }

  if (!sameOrigin && !CACHEABLE_HOSTS.includes(url.hostname)) return

  // Hashed build output never changes under the same name.
  if (sameOrigin && url.pathname.includes("/assets/")) {
    event.respondWith(
      (async () => {
        const hit = await caches.match(request)
        if (hit) return hit
        const response = await fetch(request)
        if (response.ok) (await caches.open(SHELL_CACHE)).put(request, response.clone())
        return response
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(sameOrigin ? SHELL_CACHE : RUNTIME_CACHE)
      const cached = await cache.match(request)
      const network = fetch(request)
        .then((response) => {
          if (response.ok || response.type === "opaque") {
            cache.put(request, response.clone()).then(() => !sameOrigin && trim(cache))
          }
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
