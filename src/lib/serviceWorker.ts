import { markUpdateReady } from "./pwa"

let registration: ServiceWorkerRegistration | null = null
let reloading = false

/**
 * Registers the offline cache for production-mode builds only, so the dev server and cached
 * previews (built with `--mode development`) are never cached. MODE follows `--mode`, unlike
 * PROD, which also depends on NODE_ENV.
 *
 * A new worker never takes over silently mid-lesson: it waits until the learner taps "Update"
 * (see `applyUpdate`), then the page reloads once.
 */
export function registerServiceWorker() {
  if (
    import.meta.env.MODE !== "production" ||
    import.meta.hot ||
    !("serviceWorker" in navigator)
  )
    return
  const base = import.meta.env.BASE_URL

  // The first install also fires controllerchange (the worker claims the page). Only an
  // update, where a worker was already in control, should reload.
  const hadController = !!navigator.serviceWorker.controller
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading || !hadController) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .then((reg) => {
        registration = reg
        // A worker may already be waiting from an earlier visit.
        if (reg.waiting && navigator.serviceWorker.controller) markUpdateReady(true)
        reg.addEventListener("updatefound", () => {
          const incoming = reg.installing
          incoming?.addEventListener("statechange", () => {
            if (incoming.state === "installed" && navigator.serviceWorker.controller)
              markUpdateReady(true)
          })
        })
        // Long-lived installed apps rarely reload, so look for updates when they come back.
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") void reg.update().catch(() => undefined)
        })
      })
      .catch(() => {
        // Offline support is an enhancement; the site works without it.
      })
  })
}

/** Activates the waiting worker; the controllerchange listener above reloads the page. */
export function applyUpdate() {
  registration?.waiting?.postMessage({ type: "SKIP_WAITING" })
}
