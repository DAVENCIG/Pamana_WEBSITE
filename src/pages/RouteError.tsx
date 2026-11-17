import { isRouteErrorResponse, useRouteError } from "react-router"
import { Wordmark } from "../components/Logo"
import { buttonClass } from "../components/ui"
import { tr } from "../lib/i18n"

export default function RouteError() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : null

  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-6 text-center">
      <div className="max-w-md">
        <Wordmark className="justify-center" />
        <h1 className="mt-8 font-display text-3xl font-semibold text-brown">
          {tr("May nangyaring mali", "Something went wrong")}
        </h1>
        <p className="mt-3 text-muted">
          {tr(
            "Paumanhin, nagkaroon ng problema sa pahinang ito. Ligtas pa rin ang iyong progreso.",
            "Sorry, there was a problem with this page. Your progress is still safe.",
          )}
        </p>
        {detail && (
          <p className="mt-4 rounded-xl bg-card px-4 py-3 font-mono text-xs text-muted">
            {detail}
          </p>
        )}
        <a
          href={import.meta.env.BASE_URL}
          className={buttonClass("primary", "md", "mt-8")}
        >
          {tr("I-reload ang PAMANA", "Reload PAMANA")}
        </a>
      </div>
    </div>
  )
}
