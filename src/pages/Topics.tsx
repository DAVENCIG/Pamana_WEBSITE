import { Search, X } from "lucide-react"
import { useSearchParams } from "react-router"
import { TopicCard } from "../components/TopicCard"
import { GradeTabs } from "../components/GradeTabs"
import { Mascot } from "../components/Logo"
import { buttonClass, container, cx } from "../components/ui"
import { CATEGORIES, categoryLabel, getTopicsByGrade, topics, type Category } from "../data"
import { getTopicProgress, useProgress } from "../lib/progress"
import { useGradeParam } from "../lib/useGradeParam"
import { usePageTitle } from "../lib/usePageTitle"
import { tr } from "../lib/i18n"

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export default function Topics() {
  usePageTitle(tr("Mga Aralin", "Lessons"))
  const s = useProgress()
  const [grade, setGrade] = useGradeParam()
  const [params, setParams] = useSearchParams()
  const query = params.get("q") ?? ""
  const list = grade ? getTopicsByGrade(grade.id) : topics
  const available = CATEGORIES.filter((c) => list.some((t) => t.category === c))
  const rawCategory = params.get("kategorya") as Category | null
  // Ignore a category from the URL that does not exist in the currently selected grade.
  const category =
    rawCategory && available.includes(rawCategory) ? rawCategory : null
  const needle = normalize(query.trim())
  const results = list.filter((t) => {
    if (category && t.category !== category) return false
    if (!needle) return true
    const haystack = normalize(
      [
        t.title,
        t.description,
        t.lesson.title,
        ...t.lesson.vocabulary.flatMap((v) => [v.term, v.alt ?? ""]),
      ].join(" "),
    )
    return haystack.includes(needle)
  })

  const setParam = (key: string, value: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  return (
    <div className={cx(container, "py-10 sm:py-12")}>
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold text-brown sm:text-5xl">
            {tr("Mga Aralin", "Lessons")}
          </h1>
          <p className="mt-2 text-muted">
            {grade ? grade.title : tr("Lahat ng baitang", "All grades")} · {list.length}{" "}
            {tr(list.length === 1 ? "aralin" : "na aralin", list.length === 1 ? "lesson" : "lessons")}
          </p>
        </div>
        <GradeTabs
          value={grade}
          onChange={setGrade}
          allowAll
          className="self-start md:self-auto"
        />
      </header>

      <div className="sticky top-16 z-30 -mx-5 mt-8 bg-cream/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <label className="relative block">
          <span className="sr-only">{tr("Maghanap ng aralin o paksa", "Search lessons or topics")}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder={tr("Maghanap ng aralin o paksa...", "Search lessons or topics...")}
            className="h-12 w-full rounded-full border border-stroke bg-surface pr-12 pl-12 text-sm text-ink shadow-sm outline-none placeholder:text-muted/80 focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setParam("q", null)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-brown/5 hover:text-brown"
              aria-label={tr("Burahin ang hinahanap", "Clear search")}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </label>
        <div
          role="group"
          aria-label={tr("Salain ayon sa kategorya", "Filter by category")}
          className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          <Chip
            active={!category}
            onClick={() => setParam("kategorya", null)}
            label={tr("Lahat", "All")}
            count={list.length}
          />
          {available.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setParam("kategorya", category === c ? null : c)}
              label={categoryLabel(c)}
              count={list.filter((t) => t.category === c).length}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {tr("na resulta", "results")}
      </p>

      {results.length > 0 ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <li key={t.id}>
              <TopicCard topic={t} progress={getTopicProgress(s, t.id)} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-stroke bg-card px-6 py-14 text-center">
          <Mascot className="mx-auto w-24" />
          <p className="mx-auto mt-4 max-w-sm text-muted">
            {tr("Walang nahanap na paksang tumutugma sa iyong hinahanap.", "No topics match your search.")}
          </p>
          <button
            type="button"
            className={buttonClass("outline", "md", "mt-6")}
            onClick={() => setParams({}, { replace: true })}
          >
            {tr("I-clear ang filter", "Clear filters")}
          </button>
        </div>
      )}
    </div>
  )
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-espresso bg-espresso text-on-dark"
          : "border-stroke bg-surface text-brown hover:border-gold/60",
      )}
    >
      {label}
      <span
        className={cx("text-xs", active ? "text-on-dark/70" : "text-muted")}
      >
        {count}
      </span>
    </button>
  )
}
