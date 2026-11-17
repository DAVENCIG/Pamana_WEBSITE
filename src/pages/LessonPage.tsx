import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  CircleCheck,
  Clock,
  ClipboardCheck,
  PlayCircle,
} from "lucide-react"
import { useEffect, useRef } from "react"
import { Link, useParams } from "react-router"
import { AltTerm } from "../components/AltTerm"
import { CategoryChip } from "../components/CategoryChip"
import { Photo, PhotoCredit } from "../components/Photo"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import {
  getGrade,
  getTopic,
  getTopicsByGrade,
  gradePath,
  paragraphs,
  quizMinutes,
  type Topic,
} from "../data"
import {
  getActiveQuiz,
  getTopicProgress,
  progress,
  useProgress,
} from "../lib/progress"
import { usePreferences } from "../lib/preferences"
import { usePageTitle } from "../lib/usePageTitle"
import NotFound from "./NotFound"
import { tr } from "../lib/i18n"

export default function LessonPage() {
  const { topicId } = useParams()
  const topic = getTopic(topicId)
  if (!topic)
    return (
      <NotFound
        title={tr("Hindi mahanap ang aralin", "Lesson not found")}
        message={tr("Wala ang paksang ito sa PAMANA. Tingnan ang listahan ng mga paksa.", "This topic isn't on PAMANA. See the list of lessons.")}
      />
    )
  // Keyed so per-topic effects and scroll observers reset when moving between lessons.
  return <Lesson key={topic.id} topic={topic} />
}

function Lesson({ topic }: { topic: Topic }) {
  usePageTitle(topic.title)
  const { showAltTerms } = usePreferences()
  const s = useProgress()
  const grade = getGrade(topic.gradeId)!
  const tp = getTopicProgress(s, topic.id)
  const active = getActiveQuiz(s, topic)
  const summaryRef = useRef<HTMLElement>(null)
  const { lesson } = topic
  const body = paragraphs(lesson.content)
  const siblings = getTopicsByGrade(topic.gradeId)
  const index = siblings.findIndex((t) => t.id === topic.id)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]

  useEffect(() => {
    progress.setRecentTopic(topic.id)
  }, [topic.id])

  // Reaching the summary counts as having read the lesson.
  useEffect(() => {
    const el = summaryRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          progress.markLessonRead(topic.id)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [topic.id])

  const quizLabel = active
    ? `${tr("Ituloy ang Quiz", "Continue Quiz")} (${active.answers.length}/${active.questionIds.length})`
    : tr("Subukan ang Pagsusulit", "Take the Quiz")

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-brown-dark text-on-dark">
        <div className="absolute inset-0 -z-10">
          <Photo image={topic.image} alt="" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-dark via-brown-dark/75 to-brown-dark/30" />
        </div>
        <div className={cx(container, "pt-8 pb-10 sm:pt-12 sm:pb-14")}>
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
                  to={gradePath(grade)}
                  className="hover:text-on-dark hover:underline"
                >
                  {grade.title}
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li aria-current="page" className="line-clamp-1">
                {topic.title}
              </li>
            </ol>
          </nav>
          <div className="mt-16 max-w-3xl sm:mt-24">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={topic.category} />
              {tp.lessonRead && (
                <span className="inline-flex items-center gap-1 rounded-full bg-on-dark/15 px-2.5 py-1 text-[0.7rem] font-semibold backdrop-blur">
                  <CircleCheck
                    className="size-3.5 text-gold"
                    aria-hidden="true"
                  />{" "}
                  {tr("Nabasa na", "Already read")}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              {lesson.title}
            </h1>
            <p className="mt-4 max-w-2xl text-on-dark/80">
              {topic.description}
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-on-dark/85">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-gold" aria-hidden="true" />{" "}
                {lesson.gradeLabel} • {lesson.durationMinutes} {tr("Min Aralin", "Min Lesson")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClipboardCheck
                  className="size-4 text-gold"
                  aria-hidden="true"
                />{" "}
                {topic.questions.length} {tr("tanong", "questions")}
              </span>
            </p>
          </div>
          <PhotoCredit
            image={topic.image}
            className="mt-8 inline-block text-on-dark/60"
          />
        </div>
      </header>

      <div
        className={cx(
          container,
          "grid gap-x-12 gap-y-10 py-12 lg:grid-cols-[minmax(0,1fr)_20rem]",
        )}
      >
        <section
          aria-labelledby="nilalaman-aralin"
          className="min-w-0 lg:col-start-1"
        >
          <h2 id="nilalaman-aralin" className={cx(eyebrow, "text-gold-ink")}>
            {tr("Nilalaman ng Aralin", "Lesson Content")}
          </h2>
          <div className="mt-5 max-w-[68ch] space-y-5 text-[1.05rem] leading-[1.8] text-ink/90">
            {body.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-display text-xl leading-relaxed text-brown first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-semibold first-letter:text-gold-ink"
                    : undefined
                }
              >
                {p}
              </p>
            ))}
          </div>
        </section>

        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="space-y-6 lg:sticky lg:top-24">
            <section
              aria-labelledby="bokabularyo"
              className="rounded-3xl border border-stroke bg-card p-6"
            >
              <h2
                id="bokabularyo"
                className="font-display text-lg font-semibold text-brown"
              >
                {tr("Mahahalagang Salita", "Key Vocabulary")}
              </h2>
              {showAltTerms && (
                <p className="text-xs text-muted">
                  {tr("May katumbas sa Ingles", "With the original Tagalog terms")}
                </p>
              )}
              <dl className="mt-4 space-y-4">
                {lesson.vocabulary.map((v) => (
                  <div key={v.term} className="border-l-2 border-gold pl-3">
                    <dt className="text-sm font-bold text-brown">
                      {v.term}
                      {v.alt && (
                        <span className="mt-1 block font-normal">
                          <AltTerm term={v.alt} />
                        </span>
                      )}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted">
                      {v.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <QuizCta
              topic={topic}
              label={quizLabel}
              best={tp.bestPercent}
              hasActive={!!active}
              className="hidden lg:block"
            />
          </div>
        </aside>

        <section
          ref={summaryRef}
          aria-labelledby="buod"
          className="min-w-0 lg:col-start-1"
        >
          <div className="max-w-[68ch] rounded-3xl bg-gold-light p-6 sm:p-8">
            <h2
              id="buod"
              className="flex items-center gap-2 font-display text-xl font-semibold text-brown"
            >
              <BookOpenCheck
                className="size-5 text-gold-ink"
                aria-hidden="true"
              />{" "}
              {tr("Buod ng Aralin", "Lesson Summary")}
            </h2>
            <p className="mt-3 leading-relaxed text-ink/90">{lesson.summary}</p>
          </div>
          <QuizCta
            topic={topic}
            label={quizLabel}
            best={tp.bestPercent}
            hasActive={!!active}
            className="mt-6 lg:hidden"
          />

          <nav
            aria-label={tr("Iba pang aralin", "More lessons")}
            className="mt-12 grid max-w-[68ch] gap-3 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                to={`/topics/${prev.id}`}
                className="group rounded-2xl border border-stroke bg-card p-4 transition hover:border-gold/60"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-ink">
                  <ArrowLeft className="size-3.5" aria-hidden="true" /> {tr("Nakaraan", "Previous")}
                </span>
                <span className="mt-1 block text-sm font-semibold text-brown group-hover:underline">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <Link
                to={gradePath(grade)}
                className="group rounded-2xl border border-stroke bg-card p-4 transition hover:border-gold/60"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-ink">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />{" "}
                  {grade.title}
                </span>
                <span className="mt-1 block text-sm font-semibold text-brown group-hover:underline">
                  {tr("Talaan ng nilalaman", "Table of contents")}
                </span>
              </Link>
            )}
            {next ? (
              <Link
                to={`/topics/${next.id}`}
                className="group rounded-2xl border border-stroke bg-card p-4 text-right transition hover:border-gold/60"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-ink">
                  {tr("Susunod", "Next")} <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm font-semibold text-brown group-hover:underline">
                  {next.title}
                </span>
              </Link>
            ) : (
              <Link
                to="/topics"
                className="group rounded-2xl border border-stroke bg-card p-4 text-right transition hover:border-gold/60"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-ink">
                  {tr("Lahat ng Aralin", "All Lessons")}{" "}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm font-semibold text-brown group-hover:underline">
                  {tr("Pumili ng ibang aralin", "Choose another lesson")}
                </span>
              </Link>
            )}
          </nav>
        </section>
      </div>
    </article>
  )
}

function QuizCta({
  topic,
  label,
  best,
  hasActive,
  className,
}: {
  topic: Topic
  label: string
  best: number
  hasActive: boolean
  className?: string
}) {
  return (
    <section
      className={cx("banig rounded-3xl bg-espresso p-6 text-on-dark", className)}
      aria-label={tr("Pagsusulit", "Quiz")}
    >
      <p className={cx(eyebrow, "text-gold")}>{tr("Handa ka na?", "Ready?")}</p>
      <p className="mt-2 font-display text-xl font-semibold">
        {tr("Subukin ang iyong natutunan", "Test what you learned")}
      </p>
      <p className="mt-2 text-sm text-on-dark/75">
        {tr(
          `${topic.questions.length} tanong · mga ${quizMinutes(topic)} minuto`,
          `${topic.questions.length} questions · about ${quizMinutes(topic)} minutes`,
        )}
        {best > 0 && ` · ${tr("Pinakamataas", "Best")}: ${best}%`}
      </p>
      <Link
        to={`/quiz/${topic.id}`}
        className={buttonClass("gold", "md", "mt-5 w-full")}
      >
        {hasActive ? (
          <PlayCircle className="size-4" aria-hidden="true" />
        ) : (
          <ClipboardCheck className="size-4" aria-hidden="true" />
        )}
        {label}
      </Link>
    </section>
  )
}
