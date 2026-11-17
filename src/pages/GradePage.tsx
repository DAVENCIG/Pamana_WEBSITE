import {
  ArrowRight,
  BookOpenText,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
} from "lucide-react"
import { Link, useParams } from "react-router"
import { CategoryChip } from "../components/CategoryChip"
import { Photo, PhotoCredit } from "../components/Photo"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import {
  CATEGORIES,
  getGradeByNumber,
  getTopicsByGrade,
  gradePath,
  grades,
  type Grade,
} from "../data"
import { getTopicProgress, useProgress } from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"
import NotFound from "./NotFound"
import { tr } from "../lib/i18n"

export default function GradePage() {
  const { gradeNumber } = useParams()
  const grade = getGradeByNumber(gradeNumber)
  if (!grade)
    return (
      <NotFound
        title={tr("Hindi mahanap ang baitang", "Grade not found")}
        message={tr("Grade 7 hanggang 10 lamang ang nasa PAMANA.", "PAMANA only covers Grades 7 to 10.")}
      />
    )
  return <GradeOverview grade={grade} />
}

function GradeOverview({ grade }: { grade: Grade }) {
  usePageTitle(grade.title)
  const s = useProgress()
  const list = getTopicsByGrade(grade.id)
  const minutes = list.reduce((n, t) => n + t.lesson.durationMinutes, 0)
  const questions = list.reduce((n, t) => n + t.questions.length, 0)
  const vocab = list.reduce((n, t) => n + t.lesson.vocabulary.length, 0)
  const categories = CATEGORIES.filter((c) =>
    list.some((t) => t.category === c),
  )
  const read = list.filter((t) => getTopicProgress(s, t.id).lessonRead).length

  return (
    <>
      <header className="relative isolate overflow-hidden bg-brown-dark text-on-dark">
        <div className="absolute inset-0 -z-10">
          <Photo image={grade.image} alt="" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-brown-dark via-brown-dark/85 to-brown-dark/30" />
        </div>
        <div className={cx(container, "pt-8 pb-12 sm:pt-12 sm:pb-16")}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-on-dark/75">
              <li>
                <Link to="/" className="hover:text-on-dark hover:underline">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li>
                <Link
                  to="/topics"
                  className="hover:text-on-dark hover:underline"
                >
                  {tr("Mga Aralin", "Lessons")}
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li aria-current="page">{grade.title}</li>
            </ol>
          </nav>
          <div className="mt-14 max-w-2xl sm:mt-20">
            <p className={cx(eyebrow, "text-gold")}>
              {tr("Araling Panlipunan · Baitang", "Social Studies · Grade")} {grade.number}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.02] font-semibold sm:text-6xl">
              {grade.subtitle}
            </h1>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {[
                [list.length, tr("aralin", "lessons")],
                [`${minutes} min`, tr("kabuuang basa", "total reading")],
                [vocab, tr("salita", "terms")],
                [questions, tr("tanong", "questions")],
              ].map(([v, l]) => (
                <div key={l} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="font-display text-2xl font-semibold text-on-dark">
                      {v}
                    </span>{" "}
                    <span className="text-on-dark/70">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
            {list[0] && (
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to={`/topics/${list[0].id}`}
                  className={buttonClass("gold", "lg")}
                >
                  {tr("Simulan sa unang aralin", "Start with the first lesson")}{" "}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to={`/quiz?baitang=${grade.number}`}
                  className={buttonClass("light", "lg")}
                >
                  {tr("Mga pagsusulit", "Quizzes")}
                </Link>
              </div>
            )}
          </div>
          <PhotoCredit
            image={grade.image}
            className="mt-10 inline-block text-on-dark/60"
          />
        </div>
      </header>

      <div
        className={cx(
          container,
          "grid gap-12 pt-14 lg:grid-cols-[minmax(0,1fr)_18rem]",
        )}
      >
        <section aria-labelledby="nilalaman-title" className="min-w-0">
          <div className="flex items-end justify-between gap-4 border-b border-stroke pb-4">
            <h2
              id="nilalaman-title"
              className="font-display text-2xl font-semibold text-brown sm:text-3xl"
            >
              {tr("Talaan ng Nilalaman", "Table of Contents")}
            </h2>
            <p className="text-sm text-muted">
              {read}/{list.length} {tr("nabasa", "read")}
            </p>
          </div>
          <ol className="divide-y divide-stroke">
            {list.map((t, i) => {
              const tp = getTopicProgress(s, t.id)
              return (
                <li key={t.id} className="group relative flex gap-5 py-7">
                  <span
                    className="w-10 shrink-0 font-display text-3xl font-semibold text-gold-ink/50 tabular-nums"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryChip category={t.category} />
                      {tp.lessonRead && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                          <Check className="size-3.5" aria-hidden="true" />{" "}
                          {tr("Nabasa", "Read")}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-brown sm:text-2xl">
                      <Link
                        to={`/topics/${t.id}`}
                        className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-gold group-hover:decoration-2 group-hover:underline-offset-4"
                      >
                        {t.title}
                      </Link>
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {t.description}
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden="true" />{" "}
                        {t.lesson.durationMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpenText className="size-3.5" aria-hidden="true" />{" "}
                        {t.lesson.vocabulary.length} {tr("salita", "terms")}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ClipboardCheck
                          className="size-3.5"
                          aria-hidden="true"
                        />{" "}
                        {t.questions.length} {tr("tanong", "questions")}
                        {tp.attempts > 0 && ` · ${tr("Pinakamataas", "Best")} ${tp.bestPercent}%`}
                      </span>
                    </p>
                  </div>
                  <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-xl sm:block">
                    <Photo image={t.image} alt="" sizes="96px" />
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="space-y-8 lg:pt-2">
          <div className="lg:sticky lg:top-24 lg:space-y-8">
            <section aria-labelledby="sakop-title">
              <h2 id="sakop-title" className={cx(eyebrow, "text-muted")}>
                {tr("Sakop na kategorya", "Categories covered")}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/topics?baitang=${grade.number}&kategorya=${encodeURIComponent(c)}`}
                      className="inline-flex rounded-full transition hover:opacity-80"
                    >
                      <CategoryChip category={c} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="salita-title"
              className="mt-8 rounded-2xl border border-stroke bg-card p-5 lg:mt-0"
            >
              <h2
                id="salita-title"
                className="font-display text-lg font-semibold text-brown"
              >
                {tr(`Talahuluganan ng ${grade.title}`, `${grade.title} Glossary`)}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {tr(`Lahat ng ${vocab} mahahalagang salita sa baitang na ito.`, `All ${vocab} key terms in this grade.`)}
              </p>
              <Link
                to={`/talahuluganan?baitang=${grade.number}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gold-ink hover:underline"
              >
                {tr("Tingnan", "View")} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </section>
            <nav aria-labelledby="iba-title" className="mt-8 lg:mt-0">
              <h2 id="iba-title" className={cx(eyebrow, "text-muted")}>
                {tr("Iba pang baitang", "Other grades")}
              </h2>
              <ul className="mt-3 divide-y divide-stroke border-y border-stroke">
                {grades
                  .filter((g) => g.id !== grade.id)
                  .map((g) => (
                    <li key={g.id}>
                      <Link
                        to={gradePath(g)}
                        className="group flex items-center justify-between gap-3 py-3"
                      >
                        <span>
                          <span className="block text-sm font-bold text-brown">
                            {g.title}
                          </span>
                          <span className="block text-xs text-muted">
                            {g.subtitle}
                          </span>
                        </span>
                        <ChevronRight
                          className="size-4 text-muted transition group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </>
  )
}
