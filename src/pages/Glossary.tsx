import { Search, X } from "lucide-react"
import { useSearchParams } from "react-router"
import { Link } from "react-router"
import { AltTerm } from "../components/AltTerm"
import { GradeTabs } from "../components/GradeTabs"
import { container, cx, eyebrow } from "../components/ui"
import { getGrade, glossary, type GlossaryEntry } from "../data"
import { useGradeParam } from "../lib/useGradeParam"
import { usePageTitle } from "../lib/usePageTitle"
import { tr } from "../lib/i18n"

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function initial(term: string): string {
  const c = normalize(term).charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : "#"
}

export default function Glossary() {
  usePageTitle(tr("Talahuluganan", "Glossary"))
  const [grade, setGrade] = useGradeParam()
  const [params, setParams] = useSearchParams()
  const query = params.get("q") ?? ""
  const needle = normalize(query.trim())

  const entries = glossary.filter((e) => {
    if (grade && e.topic.gradeId !== grade.id) return false
    if (!needle) return true
    return normalize(`${e.term} ${e.alt ?? ""} ${e.definition}`).includes(needle)
  })

  const groups = new Map<string, GlossaryEntry[]>()
  for (const e of entries) {
    const k = initial(e.term)
    groups.set(k, [...(groups.get(k) ?? []), e])
  }
  const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]

  const setQuery = (value: string) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        if (value) p.set("q", value)
        else p.delete("q")
        return p
      },
      { replace: true },
    )

  return (
    <div className={cx(container, "py-12 sm:py-16")}>
      <header className="max-w-3xl">
        <p className={cx(eyebrow, "text-gold-ink")}>{tr("Sanggunian", "Reference")}</p>
        <h1 className="mt-2 font-display text-[2.6rem] font-semibold text-brown sm:text-6xl">
          {tr("Talahuluganan", "Glossary")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          {tr(
            "Ang mahahalagang salita mula sa bawat aralin ng PAMANA, nakaayos mula A hanggang Z, kasama ang katumbas nito sa Ingles. Pindutin ang pangalan ng aralin para mabasa ito nang buo.",
            "Key terms from every PAMANA lesson, sorted from A to Z, with the original Tagalog term beside each one. Select a lesson name to read it in full.",
          )}
        </p>
      </header>

      <div className="sticky top-16 z-30 -mx-5 mt-10 border-b border-stroke bg-cream/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">{tr("Maghanap ng salita", "Search terms")}</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("Maghanap ng salita o kahulugan (Tagalog o Ingles)...", "Search a term or meaning (English or Tagalog)...")}
              className="h-11 w-full rounded-full border border-stroke bg-surface pr-12 pl-12 text-sm text-ink outline-none placeholder:text-muted/80 focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-brown/5 hover:text-brown"
                aria-label={tr("Burahin ang hinahanap", "Clear search")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </label>
          <GradeTabs value={grade} onChange={setGrade} allowAll />
        </div>
        <nav aria-label={tr("Mga titik", "Letters")} className="mt-3 -mx-1 overflow-x-auto px-1">
          <ul className="flex gap-0.5">
            {letters.map((l) =>
              groups.has(l) ? (
                <li key={l}>
                  <a
                    href={`#titik-${l}`}
                    className="grid size-8 place-items-center rounded-md text-sm font-bold text-brown hover:bg-gold-light"
                  >
                    {l}
                  </a>
                </li>
              ) : (
                <li
                  key={l}
                  aria-hidden="true"
                  className="grid size-8 place-items-center text-sm text-muted/40"
                >
                  {l}
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {entries.length} {tr("na salita", "terms")}
        {grade && ` ${tr("sa", "in")} ${grade.title}`}
      </p>

      {entries.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-stroke p-10 text-center text-muted">
          {tr(`Walang salitang tumutugma sa “${query}”.`, `No terms match “${query}”.`)}
        </p>
      ) : (
        <div className="mt-4 space-y-12">
          {[...groups.entries()].map(([letter, list]) => (
            <section
              key={letter}
              id={`titik-${letter}`}
              aria-labelledby={`titik-${letter}-h`}
              className="scroll-mt-48 grid gap-4 md:grid-cols-[5rem_1fr]"
            >
              <h2
                id={`titik-${letter}-h`}
                className="font-display text-5xl font-semibold text-gold-ink/60"
              >
                {letter}
              </h2>
              <dl className="divide-y divide-stroke border-t border-stroke">
                {list.map((e) => (
                  <div
                    key={`${e.topic.id}-${e.term}`}
                    className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8"
                  >
                    <dt className="font-display text-lg font-semibold text-brown">
                      {e.term}
                      {e.alt && (
                        <span className="mt-1 block font-sans">
                          <AltTerm term={e.alt} />
                        </span>
                      )}
                    </dt>
                    <dd>
                      <p className="leading-relaxed text-ink/85">
                        {e.definition}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {getGrade(e.topic.gradeId)!.title} ·{" "}
                        <Link
                          to={`/topics/${e.topic.id}`}
                          className="font-semibold text-gold-ink hover:underline"
                        >
                          {e.topic.title}
                        </Link>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
