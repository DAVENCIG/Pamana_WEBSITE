import { Link } from "react-router"
import { Mascot } from "../components/Logo"
import { buttonClass, container, cx } from "../components/ui"
import { usePageTitle } from "../lib/usePageTitle"
import { tr } from "../lib/i18n"

interface NotFoundProps {
  title?: string
  message?: string
}

export default function NotFound({
  title,
  message,
}: NotFoundProps) {
  title ??= tr("Hindi mahanap ang pahina", "Page not found")
  message ??= tr(
    "Maaaring nabago o nawala na ang link na ito. Bumalik sa Home o tingnan ang mga aralin.",
    "This link may have changed or no longer exists. Go back home or browse the lessons.",
  )
  usePageTitle(title)
  return (
    <section
      className={cx(
        container,
        "grid min-h-[60vh] place-items-center py-16 text-center",
      )}
    >
      <div className="max-w-md">
        <Mascot priority className="mx-auto w-32" />
        <h1 className="mt-6 font-display text-3xl font-semibold text-brown">
          {title}
        </h1>
        <p className="mt-3 text-muted">{message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={buttonClass("primary")}>
            {tr("Bumalik sa Home", "Back to Home")}
          </Link>
          <Link to="/topics" className={buttonClass("outline")}>
            {tr("Tingnan ang mga Aralin", "Browse Lessons")}
          </Link>
        </div>
      </div>
    </section>
  )
}
