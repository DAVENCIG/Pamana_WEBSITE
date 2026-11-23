import { BookOpen, ChartNoAxesColumn, House, ListChecks, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { NavLink, useLocation } from "react-router"
import { cx } from "./ui"
import { tr } from "../lib/i18n"

interface Tab {
  to: string
  label: string
  icon: LucideIcon
  match: (path: string) => boolean
}

const tabs = (): Tab[] => [
  { to: "/", label: tr("Home", "Home"), icon: House, match: (p) => p === "/" },
  {
    to: "/topics",
    label: tr("Aralin", "Lessons"),
    icon: BookOpen,
    match: (p) =>
      p.startsWith("/topics") || p.startsWith("/baitang") || p.startsWith("/talahuluganan"),
  },
  {
    to: "/quiz",
    label: tr("Quiz", "Quiz"),
    icon: ListChecks,
    match: (p) => p.startsWith("/quiz") || p.startsWith("/results"),
  },
  {
    to: "/progreso",
    label: tr("Progreso", "Progress"),
    icon: ChartNoAxesColumn,
    match: (p) => p.startsWith("/progreso"),
  },
  {
    to: "/settings",
    label: tr("Settings", "Settings"),
    icon: Settings,
    match: (p) => p.startsWith("/settings"),
  },
]

/** App-style bottom navigation, shown below the `lg` breakpoint (desktop keeps the header nav). */
export function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav
      aria-label={tr("Nabigasyon sa ibaba", "Bottom navigation")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stroke bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl">
        {tabs().map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === "/"}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[0.7rem] font-semibold transition-colors",
                  active ? "text-gold-ink" : "text-muted hover:text-brown",
                )}
              >
                <span
                  className={cx(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-gold-light",
                  )}
                >
                  <Icon className="size-[1.2rem]" aria-hidden="true" />
                </span>
                {label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
