import { Menu, Search, Settings, X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router"
import { BottomNav } from "../components/BottomNav"
import { Wordmark } from "../components/Logo"
import { PointsBadge } from "../components/PointsBadge"
import { PwaStatus } from "../components/PwaStatus"
import { AiBuddy } from "../components/AiBuddy"
import { ToastProvider } from "../components/Toast"
import { container, cx, eyebrow } from "../components/ui"
import { CATEGORIES, categoryLabel, gradePath, grades } from "../data"
import { tr, useLang } from "../lib/i18n"

interface NavItem {
  to: string
  label: string
  match: (path: string) => boolean
}

const nav = (): NavItem[] => [
  {
    to: "/topics",
    label: tr("Mga Aralin", "Lessons"),
    match: (p) => p.startsWith("/topics") || p.startsWith("/baitang"),
  },
  {
    to: "/talahuluganan",
    label: tr("Talahuluganan", "Glossary"),
    match: (p) => p.startsWith("/talahuluganan"),
  },
  {
    to: "/quiz",
    label: tr("Pagsusulit", "Quizzes"),
    match: (p) => p.startsWith("/quiz") || p.startsWith("/results"),
  },
  { to: "/about", label: tr("Tungkol", "About"), match: (p) => p === "/about" },
]

export default function Root() {
  // Keyed by language so every page re-reads the translated content when it changes.
  const { lang } = useLang()
  return (
    <ToastProvider>
      <div key={lang} className="flex min-h-dvh flex-col">
        <a
          href="#nilalaman"
          className="sr-only text-sm font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-espresso focus:px-4 focus:py-2 focus:text-on-dark"
        >
          {tr("Lumaktaw sa nilalaman", "Skip to content")}
        </a>
        <SiteHeader />
        <PwaStatus />
        <main id="nilalaman" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
        <SiteFooter />
        {/* Spacer so the fixed bottom navigation never covers the footer. */}
        <div className="h-[calc(3.5rem+1px+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
      </div>
      <BottomNav />
      <AiBuddy />
      <ScrollRestoration />
    </ToastProvider>
  )
}

function SiteHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-stroke/80 bg-cream/90 backdrop-blur-md">
      <div className={cx(container, "flex h-16 items-center gap-4")}>
        <Link to="/" className="rounded-full" aria-label={tr("PAMANA, unang pahina", "PAMANA, home page")}>
          <Wordmark />
        </Link>
        <nav
          aria-label={tr("Pangunahing nabigasyon", "Main navigation")}
          className="ml-8 hidden lg:block"
        >
          <ul className="flex items-center gap-1">
            {nav().map((item) => {
              const active = item.match(pathname)
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative px-3 py-2 text-sm font-semibold transition-colors",
                      "after:absolute after:inset-x-3 after:-bottom-[1.15rem] after:h-0.5 after:rounded-full after:transition-colors",
                      active
                        ? "text-brown after:bg-gold"
                        : "text-brown/70 after:bg-transparent hover:text-brown",
                    )}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/topics"
            className="hidden size-9 place-items-center rounded-full text-brown hover:bg-brown/5 sm:grid"
            aria-label={tr("Maghanap ng aralin", "Search lessons")}
          >
            <Search className="size-[1.1rem]" aria-hidden="true" />
          </Link>
          <Link
            to="/progreso"
            aria-current={pathname === "/progreso" ? "page" : undefined}
            className="hidden text-sm font-semibold text-brown/70 hover:text-brown sm:inline lg:hidden xl:inline"
          >
            {tr("Aking Progreso", "My Progress")}
          </Link>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cx(
                "grid size-9 place-items-center rounded-full hover:bg-brown/5",
                isActive ? "bg-brown/5 text-gold-ink" : "text-brown",
              )
            }
            aria-label={tr("Mga Setting", "Settings")}
            title={tr("Mga Setting", "Settings")}
          >
            <Settings className="size-[1.1rem]" aria-hidden="true" />
          </NavLink>
          <PointsBadge to="/progreso" className="hidden sm:inline-flex" />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-brown hover:bg-brown/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {open ? tr("Isara ang menu", "Close menu") : tr("Buksan ang menu", "Open menu")}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-stroke bg-cream lg:hidden"
        >
          <nav aria-label="Menu" className={cx(container, "py-6")}>
            <ul className="divide-y divide-stroke border-y border-stroke">
              {[
                ...nav(),
                {
                  to: "/progreso",
                  label: tr("Aking Progreso", "My Progress"),
                  match: (p: string) => p === "/progreso",
                },
                {
                  to: "/settings",
                  label: tr("Mga Setting", "Settings"),
                  match: (p: string) => p === "/settings",
                },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    aria-current={item.match(pathname) ? "page" : undefined}
                    className={cx(
                      "flex items-center justify-between py-4 font-display text-xl font-semibold",
                      item.match(pathname) ? "text-gold-ink" : "text-brown",
                    )}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <p className={cx(eyebrow, "mt-6 text-muted")}>{tr("Mga Baitang", "Grade Levels")}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {grades.map((g) => (
                <li key={g.id}>
                  <Link
                    to={gradePath(g)}
                    className="block rounded-xl border border-stroke bg-card px-4 py-3 text-sm font-semibold text-brown"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: Array<{ to: string; label: string }>
}) {
  return (
    <div>
      <h2 className={cx(eyebrow, "text-gold")}>{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-on-dark/75 transition-colors hover:text-on-dark hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="banig mt-24 bg-brown-dark text-on-dark">
      <div className={cx(container, "pt-16 pb-10")}>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark light />
            <p className="mt-6 text-xs font-bold tracking-[0.2em] text-gold">
              {tr("ALAMIN. ARALIN. TANDAAN.", "LEARN. STUDY. REMEMBER.")}
            </p>
          </div>
          <FooterColumn
            title={tr("Mga Baitang", "Grade Levels")}
            links={grades.map((g) => ({
              to: gradePath(g),
              label: g.title,
            }))}
          />
          <FooterColumn
            title={tr("Galugarin", "Explore")}
            links={[
              { to: "/topics", label: tr("Lahat ng aralin", "All lessons") },
              ...CATEGORIES.slice(0, 3).map((c) => ({
                to: `/topics?kategorya=${c}`,
                label: categoryLabel(c),
              })),
              { to: "/talahuluganan", label: tr("Talahuluganan", "Glossary") },
              { to: "/quiz", label: tr("Pagsusulit", "Quizzes") },
            ]}
          />
          <FooterColumn
            title="PAMANA"
            links={[
              { to: "/about", label: tr("Tungkol sa PAMANA", "About PAMANA") },
              { to: "/progreso", label: tr("Aking Progreso", "My Progress") },
              { to: "/settings", label: tr("Mga Setting", "Settings") },
              { to: "/about#mga-larawan", label: tr("Mga larawan", "Photo credits") },
            ]}
          />
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-on-dark/15 pt-6 text-xs text-on-dark/55 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} PAMANA · Team OWLI, BSIT 2C</span>
        </div>
      </div>
    </footer>
  )
}
