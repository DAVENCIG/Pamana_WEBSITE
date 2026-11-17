import { grades, type Grade } from "../data"
import { tr } from "../lib/i18n"
import { cx } from "./ui"

interface GradeTabsProps {
  value: Grade | undefined
  onChange: (grade: Grade | null) => void
  /** Adds a "Lahat" option that clears the grade filter. */
  allowAll?: boolean
  className?: string
}

export function GradeTabs({
  value,
  onChange,
  allowAll = false,
  className,
}: GradeTabsProps) {
  const options: Array<{ key: string; label: string; grade: Grade | null }> = [
    ...(allowAll ? [{ key: "all", label: tr("Lahat", "All"), grade: null }] : []),
    ...grades.map((g) => ({ key: g.id, label: g.title, grade: g })),
  ]
  return (
    <div
      role="group"
      aria-label={tr("Piliin ang grade", "Choose a grade")}
      className={cx(
        "inline-flex max-w-full overflow-x-auto rounded-full border border-stroke bg-card p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = (o.grade?.id ?? null) === (value?.id ?? null)
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.grade)}
            className={cx(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors sm:px-4 sm:text-sm",
              active
                ? "bg-espresso text-on-dark"
                : "text-brown/75 hover:bg-brown/5 hover:text-brown",
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
