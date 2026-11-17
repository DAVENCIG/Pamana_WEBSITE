import { ChevronRight, Clock, RefreshCcw } from "lucide-react"
import { Link } from "react-router"
import { formatDuration } from "../lib/achievements"
import { formatDateTime } from "../lib/date"
import type { QuizAttempt } from "../lib/progress"
import { cx } from "./ui"
import { tr } from "../lib/i18n"

interface AttemptHistoryProps {
  attempts: QuizAttempt[]
  currentId?: string
  limit?: number
  className?: string
}

/** Past attempts on one topic, newest first, each linking to its full result. */
export function AttemptHistory({
  attempts,
  currentId,
  limit = 6,
  className,
}: AttemptHistoryProps) {
  const shown = attempts.slice(0, limit)
  return (
    <ul className={cx("divide-y divide-stroke", className)}>
      {shown.map((a) => {
        const practice = a.mode === "practice"
        const current = a.id === currentId
        return (
          <li key={a.id}>
            <Link
              to={`/results/${a.id}`}
              aria-current={current ? "page" : undefined}
              className={cx(
                "group -mx-3 flex items-center gap-3 rounded-xl px-3 py-3",
                current ? "bg-gold-light/60" : "hover:bg-brown/5",
              )}
            >
              <span
                className={cx(
                  "grid size-11 shrink-0 place-items-center rounded-full text-xs font-bold",
                  a.percent >= 70
                    ? "bg-success-light text-success"
                    : "bg-gold-light text-gold-ink",
                )}
              >
                {a.percent}%
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink">
                  {a.correct}/{a.total} {tr("tama", "correct")}
                  {practice && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[0.68rem] font-bold text-brown">
                      <RefreshCcw className="size-3" aria-hidden="true" />
                      {tr("Pagsasanay", "Practice")}
                    </span>
                  )}
                  {current && (
                    <span className="text-[0.68rem] font-bold text-gold-ink">
                      {tr("(ito)", "(this one)")}
                    </span>
                  )}
                </span>
                <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
                  {formatDateTime(a.completedAt)}
                  {!!a.durationMs && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" aria-hidden="true" />
                      {formatDuration(a.durationMs)}
                    </span>
                  )}
                </span>
              </span>
              <ChevronRight
                className="size-4 text-muted group-hover:text-brown"
                aria-hidden="true"
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
