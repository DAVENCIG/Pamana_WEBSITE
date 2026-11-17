import { Star } from "lucide-react"
import { Link } from "react-router"
import { getLevel } from "../lib/achievements"
import { useProgress } from "../lib/progress"
import { cx } from "./ui"
import { tr } from "../lib/i18n"

export function PointsBadge({
  className,
  to = "/quiz#mga-badge",
}: {
  className?: string
  to?: string
}) {
  const { points } = useProgress()
  const { level } = getLevel(points)
  return (
    <Link
      to={to}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border border-stroke bg-surface px-3 py-1.5 text-xs font-bold text-brown shadow-sm transition-colors hover:border-gold/60",
        className,
      )}
      aria-label={tr(`${points} puntos, antas ${level.name}. Tingnan ang iyong progreso.`, `${points} points, level ${level.name}. View your progress.`)}
      title={`${tr("Antas", "Level")}: ${level.name}`}
    >
      <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
      {points.toLocaleString("fil-PH")} Pts
    </Link>
  )
}
