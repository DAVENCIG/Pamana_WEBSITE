import { CloudOff, Download, RefreshCw, Wifi, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { buttonClass, cx } from "./ui"
import { tr } from "../lib/i18n"
import { dismissInstallBanner, promptInstall, usePwa } from "../lib/pwa"
import { applyUpdate } from "../lib/serviceWorker"

/** Offline notice, brief "back online" confirmation, update prompt and install suggestion. */
export function PwaStatus() {
  const { online, updateReady, canInstall, installed, bannerDismissed } = usePwa()
  const [backOnline, setBackOnline] = useState(false)
  const wasOffline = useRef(!online)

  useEffect(() => {
    if (!online) {
      wasOffline.current = true
      setBackOnline(false)
      return
    }
    if (!wasOffline.current) return
    wasOffline.current = false
    setBackOnline(true)
    const t = setTimeout(() => setBackOnline(false), 3000)
    return () => clearTimeout(t)
  }, [online])

  const showInstall = canInstall && !installed && !bannerDismissed

  return (
    <>
      <div role="status" aria-live="polite">
        {!online && (
          <p className="flex items-center justify-center gap-2 bg-brown-dark px-4 py-2 text-center text-xs font-semibold text-on-dark">
            <CloudOff className="size-4 shrink-0" aria-hidden="true" />
            {tr(
              "Offline ka. Gumagana pa rin ang mga na-save na aralin at quiz; mase-save sa device mo ang progreso.",
              "You're offline. Saved lessons and quizzes still work, and your progress is saved on this device.",
            )}
          </p>
        )}
        {online && backOnline && (
          <p className="flex items-center justify-center gap-2 bg-success-light px-4 py-2 text-center text-xs font-semibold text-success">
            <Wifi className="size-4 shrink-0" aria-hidden="true" />
            {tr("Online ka na ulit.", "You're back online.")}
          </p>
        )}
      </div>

      {(updateReady || showInstall) && (
        <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md space-y-2 lg:inset-x-auto lg:right-6 lg:bottom-6 lg:mx-0">
          {updateReady && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-2xl border border-stroke bg-surface p-3 pl-4 shadow-lg"
            >
              <RefreshCw className="size-5 shrink-0 text-gold-ink" aria-hidden="true" />
              <p className="flex-1 text-sm font-semibold text-brown">
                {tr("May bagong bersyon ng PAMANA.", "A new version of PAMANA is ready.")}
              </p>
              <button type="button" className={buttonClass("primary", "sm")} onClick={applyUpdate}>
                {tr("I-update", "Update")}
              </button>
            </div>
          )}
          {showInstall && (
            <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-surface p-3 pl-4 shadow-lg">
              <Download className="size-5 shrink-0 text-gold-ink" aria-hidden="true" />
              <p className="flex-1 text-sm font-semibold text-brown">
                {tr("I-install ang PAMANA sa device mo.", "Install PAMANA on your device.")}
              </p>
              <button
                type="button"
                className={buttonClass("gold", "sm")}
                onClick={() => void promptInstall()}
              >
                {tr("I-install", "Install")}
              </button>
              <button
                type="button"
                className={cx("grid size-9 place-items-center rounded-full text-brown hover:bg-brown/5")}
                onClick={dismissInstallBanner}
              >
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">{tr("Itago", "Dismiss")}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

/** Small text link used by Settings to point at install help. */
export function InstallHelpLink() {
  return (
    <Link to="/settings#app" className="font-semibold text-gold-ink hover:underline">
      {tr("Paano mag-install", "How to install")}
    </Link>
  )
}
