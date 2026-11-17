import { Flame, Lock, Star } from "lucide-react"
import {
  BADGES,
  currentStreak,
  getLevel,
  isUnlocked,
  longestStreak,
  type Badge,
} from "../lib/achievements"
import type { ProgressState } from "../lib/progress"
import { ProgressBar } from "./ProgressBar"
import { cx, eyebrow } from "./ui"
import { tr } from "../lib/i18n"

/** Level, points to the next level, and the daily quiz streak. */
export function LevelCard({
  s,
  className,
}: {
  s: ProgressState
  className?: string
}) {
  const info = getLevel(s.points)
  const streak = currentStreak(s.activeDays)
  const best = longestStreak(s.activeDays)
  const unlocked = BADGES.filter((b) => isUnlocked(b, s)).length
  return (
    <div
      className={cx(
        "banig relative overflow-hidden rounded-3xl bg-espresso p-6 text-on-dark sm:p-7",
        className,
      )}
    >
      <p className={cx(eyebrow, "text-gold")}>
        {tr("Antas", "Level")} {info.level.index + 1} {tr("sa", "of")} 6
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">
        {info.level.name}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-on-dark/80">
        <Star className="size-4 fill-gold text-gold" aria-hidden="true" />
        {s.points.toLocaleString("fil-PH")} {tr("puntos", "points")}
      </p>
      <ProgressBar
        value={info.percent}
        label={tr("Progreso sa susunod na antas", "Progress to the next level")}
        tone="onDark"
        className="mt-5"
      />
      <p className="mt-2 text-xs text-on-dark/70">
        {info.next
          ? tr(
              `${info.toNext} puntos pa para maging ${info.next.name}`,
              `${info.toNext} more points to become ${info.next.name}`,
            )
          : tr("Naabot mo na ang pinakamataas na antas!", "You've reached the highest level!")}
      </p>
      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-on-dark/15 pt-5 text-center">
        <div>
          <dt className="text-[0.7rem] text-on-dark/70">Streak</dt>
          <dd className="mt-1 inline-flex items-center gap-1 font-display text-xl font-semibold">
            <Flame
              className={cx(
                "size-4",
                streak > 0 ? "text-gold" : "text-on-dark/40",
              )}
              aria-hidden="true"
            />
            {streak}
            <span className="sr-only">{tr("araw", "days")}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.7rem] text-on-dark/70">{tr("Pinakamahaba", "Longest")}</dt>
          <dd className="mt-1 font-display text-xl font-semibold">
            {best}{" "}
            <span className="text-xs font-sans text-on-dark/70">{tr("araw", "days")}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.7rem] text-on-dark/70">Badge</dt>
          <dd className="mt-1 font-display text-xl font-semibold">
            {unlocked}/{BADGES.length}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export function BadgeTile({
  badge,
  s,
  highlight = false,
}: {
  badge: Badge
  s: ProgressState
  highlight?: boolean
}) {
  const [value, goal] = badge.progress(s)
  const unlocked = value >= goal
  const Icon = badge.icon
  return (
    <div
      className={cx(
        "flex h-full gap-3 rounded-2xl border p-4",
        unlocked ? "border-gold/50 bg-gold-light/50" : "border-stroke bg-card",
        highlight && "ring-2 ring-gold",
      )}
    >
      <span
        className={cx(
          "relative grid size-11 shrink-0 place-items-center rounded-full",
          unlocked ? "bg-gold text-brown-dark" : "bg-track text-brown/45",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
        {!unlocked && (
          <span className="absolute -right-0.5 -bottom-0.5 grid size-4.5 place-items-center rounded-full border-2 border-card bg-muted text-white">
            <Lock className="size-2.5" aria-hidden="true" />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cx(
            "text-sm font-bold",
            unlocked ? "text-brown" : "text-ink/80",
          )}
        >
          {badge.title}
          <span className="sr-only">
            {unlocked ? tr(" (nakuha na)", " (earned)") : tr(" (hindi pa nakukuha)", " (not yet earned)")}
          </span>
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          {badge.description}
        </p>
        {!unlocked && goal > 1 && (
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar
              value={(value / goal) * 100}
              label={tr(`Progreso sa badge na ${badge.title}`, `Progress toward the ${badge.title} badge`)}
              size="sm"
              className="flex-1"
            />
            <span className="text-[0.68rem] font-bold text-muted">
              {value}/{goal}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function BadgeGrid({ s }: { s: ProgressState }) {
  // Earned badges first so progress is visible at a glance.
  const sorted = [...BADGES].sort(
    (a, b) => Number(isUnlocked(b, s)) - Number(isUnlocked(a, s)),
  )
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((b) => (
        <li key={b.id}>
          <BadgeTile badge={b} s={s} />
        </li>
      ))}
    </ul>
  )
}
