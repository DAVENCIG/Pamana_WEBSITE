/**
 * Registers the offline cache for production-mode builds only, so the dev server and cached
 * previews (built with `--mode development`) are never cached. MODE follows `--mode`, unlike
 * PROD, which also depends on NODE_ENV.
 */
export function registerServiceWorker() {
  if (
    import.meta.env.MODE !== "production" ||
    import.meta.hot ||
    !("serviceWorker" in navigator)
  )
    return
  const base = import.meta.env.BASE_URL
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .catch(() => {
        // Offline support is an enhancement; the site works without it.
      })
  })
}
