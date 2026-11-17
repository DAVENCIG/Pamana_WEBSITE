import type { ReactNode } from "react"
import { cx, eyebrow } from "./ui"

interface SectionHeadingProps {
  id?: string
  kicker?: string
  title: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({
  id,
  kicker,
  title,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx("flex items-end justify-between gap-4", className)}>
      <div>
        {kicker && <p className={cx(eyebrow, "text-gold-ink")}>{kicker}</p>}
        <h2
          id={id}
          className="mt-1 font-display text-2xl font-semibold text-brown sm:text-[1.75rem]"
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
