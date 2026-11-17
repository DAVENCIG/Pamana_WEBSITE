export function cx(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ")
}

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8"

type Variant = "primary" | "gold" | "outline" | "ghost" | "light" | "danger" | "dangerOutline"
type Size = "sm" | "md" | "lg"

const variants: Record<Variant, string> = {
  primary:
    "bg-espresso text-on-dark hover:bg-brown-dark disabled:bg-track disabled:text-muted",
  gold: "bg-gold text-brown-dark hover:bg-[#e2a548] disabled:bg-track disabled:text-muted",
  outline:
    "border border-brown/25 bg-transparent text-brown hover:border-brown/50 hover:bg-brown/5",
  ghost: "text-brown hover:bg-brown/5",
  light: "border border-on-dark/30 text-on-dark hover:bg-on-dark/10",
  danger: "bg-error text-white hover:bg-[#a51f1f]",
  dangerOutline:
    "border border-error/40 bg-transparent text-error hover:border-error hover:bg-error-light",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
}

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  extra?: string,
): string {
  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    extra,
  )
}

export const eyebrow = "text-[0.7rem] font-bold uppercase tracking-[0.16em]"
