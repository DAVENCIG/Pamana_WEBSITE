import { cx } from "./ui"

interface ProgressBarProps {
  value: number
  label: string
  tone?: "gold" | "brown" | "onDark"
  size?: "sm" | "md"
  className?: string
}

export function ProgressBar({
  value,
  label,
  tone = "gold",
  size = "md",
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cx(
        "w-full overflow-hidden rounded-full",
        size === "sm" ? "h-1.5" : "h-2",
        tone === "onDark" ? "bg-on-dark/15" : "bg-track",
        className,
      )}
    >
      <div
        className={cx(
          "h-full rounded-full transition-[width] duration-500",
          tone === "brown" ? "bg-espresso" : "bg-gold",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
