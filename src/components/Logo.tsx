import { cx } from "./ui"

const base = import.meta.env.BASE_URL

/** Brand artwork lives in public/brand so the service worker can precache it by name. */
export const brandAssets = {
  emblem: `${base}brand/pamana-emblem.webp`,
  logo: `${base}brand/pamana-logo.webp`,
  mascot: `${base}brand/pamana-mascot.webp`,
}

/** The PAMANA emblem: the eagle mascot holding the "P" monogram. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={brandAssets.emblem}
      alt=""
      width={192}
      height={192}
      decoding="async"
      className={cx("shrink-0 object-contain", className)}
    />
  )
}

/** Full lockup: emblem above the PAMANA wordmark. */
export function FullLogo({ className }: { className?: string }) {
  return (
    <img
      src={brandAssets.logo}
      alt="PAMANA"
      width={560}
      height={709}
      decoding="async"
      className={cx("h-auto object-contain", className)}
    />
  )
}

interface MascotProps {
  className?: string
  /** Decorative by default; pass text when the mascot carries meaning. */
  alt?: string
  priority?: boolean
}

/** The PAMANA mascot, a young Philippine eagle. */
export function Mascot({ className, alt = "", priority = false }: MascotProps) {
  return (
    <img
      src={brandAssets.mascot}
      alt={alt}
      width={720}
      height={944}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cx("h-auto object-contain", className)}
    />
  )
}

export function Wordmark({
  className,
  light = false,
}: {
  className?: string
  light?: boolean
}) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-11" />
      <span
        className={cx(
          "font-display text-xl font-semibold tracking-[0.08em]",
          light ? "text-on-dark" : "text-brown",
        )}
      >
        PAMANA
      </span>
    </span>
  )
}
