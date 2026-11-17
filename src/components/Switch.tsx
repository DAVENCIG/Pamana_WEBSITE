import { useId } from "react"
import { cx } from "./ui"

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  className?: string
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  className,
}: SwitchProps) {
  const labelId = useId()
  const descId = useId()
  return (
    <div className={cx("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <p id={labelId} className="text-sm font-semibold text-ink">
          {label}
        </p>
        {description && (
          <p id={descId} className="mt-0.5 text-xs leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-gold-dark" : "bg-track",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  )
}
