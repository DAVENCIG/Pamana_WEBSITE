import { useSyncExternalStore } from "react"

/** Chrome/Edge/Android install prompt event (not in lib.dom). */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "pamana.install-dismissed"
const DISMISS_DAYS = 30

export interface PwaState {
  /** A browser install prompt is available right now. */
  canInstall: boolean
  /** Running as an installed app (standalone / fullscreen / iOS home-screen). */
  installed: boolean
  online: boolean
  /** A new service worker is installed and waiting to take over. */
  updateReady: boolean
  /** The install banner was dismissed recently. */
  bannerDismissed: boolean
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false
  return (
    matchMedia("(display-mode: standalone)").matches ||
    matchMedia("(display-mode: fullscreen)").matches ||
    matchMedia("(display-mode: minimal-ui)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function readDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY))
    return !!at && Date.now() - at < DISMISS_DAYS * 86_400_000
  } catch {
    return false
  }
}

let deferred: BeforeInstallPromptEvent | null = null
let state: PwaState = {
  canInstall: false,
  installed: isStandalone(),
  online: typeof navigator === "undefined" ? true : navigator.onLine,
  updateReady: false,
  bannerDismissed: typeof window === "undefined" ? false : readDismissed(),
}
const listeners = new Set<() => void>()

function set(patch: Partial<PwaState>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

if (typeof window !== "undefined") {
  // Attached at module load (imported from main.tsx) so the event is never missed.
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
    set({ canInstall: true })
  })
  window.addEventListener("appinstalled", () => {
    deferred = null
    set({ canInstall: false, installed: true })
  })
  window.addEventListener("online", () => set({ online: true }))
  window.addEventListener("offline", () => set({ online: false }))
  matchMedia("(display-mode: standalone)").addEventListener("change", () =>
    set({ installed: isStandalone() }),
  )
}

export function markUpdateReady(ready: boolean) {
  set({ updateReady: ready })
}

/** Shows the browser's install prompt. Resolves to the user's choice, or null if unavailable. */
export async function promptInstall(): Promise<"accepted" | "dismissed" | null> {
  if (!deferred) return null
  const event = deferred
  deferred = null // a prompt event can only be used once
  set({ canInstall: false })
  await event.prompt()
  const { outcome } = await event.userChoice
  if (outcome === "dismissed") dismissInstallBanner()
  return outcome
}

export function dismissInstallBanner() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // Dismissal lasts for this visit only.
  }
  set({ bannerDismissed: true })
}

export type Platform = "ios" | "android" | "desktop"

export function detectPlatform(): Platform {
  const ua = navigator.userAgent
  // iPadOS 13+ reports itself as a Mac with touch support.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1))
    return "ios"
  if (/Android/.test(ua)) return "android"
  return "desktop"
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function usePwa(): PwaState {
  return useSyncExternalStore(subscribe, () => state, () => state)
}
