import {
  ClipboardCheck,
  PlayCircle,
  RefreshCcw,
  SearchX,
  Sparkles,
  Trophy,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { BadgeGrid, LevelCard } from "../components/Achievements"
import { CategoryChip } from "../components/CategoryChip"
import { GradeTabs } from "../components/GradeTabs"
import { Photo } from "../components/Photo"
import { ProgressBar } from "../components/ProgressBar"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import { getTopicsByGrade, quizMinutes, type Topic } from "../data"
import {
  getActiveQuiz,
  getTopicProgress,
  quizMode,
  useProgress,
  type ProgressState,
} from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"
import { useCurrentGrade } from "../lib/progress"
import { useGradeParam } from "../lib/useGradeParam"
import { tr } from "../lib/i18n"

/** Unfinished quiz first, then a topic never attempted, then the lowest best score. */
function recommend(s: ProgressState, list: Topic[]): Topic | undefined {
  return (
    list.find((t) => getActiveQuiz(s, t)) ??
    list.find((t) => getTopicProgress(s, t.id).attempts === 0) ??
    [...list].sort(
      (a, b) =>
        getTopicProgress(s, a.id).bestPercent -
        getTopicProgress(s, b.id).bestPercent,
    )[0]
  )
}

type Filter = "lahat" | "bago" | "kasalukuyan" | "ensayo" | "perpekto"

/** Below this best score a topic is flagged as needing more practice. */
const MASTERY_PERCENT = 70

const FILTERS: Array<{
  id: Filter
  readonly label: string
  test: (s: ProgressState, t: Topic) => boolean
}> = [
  {
    id: "lahat",
    get label() {
      return tr("Lahat", "All")
    },
    test: () => true,
  },
  {
    id: "bago",
    get label() {
      return tr("Hindi pa nasusubukan", "Not tried yet")
    },
    test: (s, t) =>
      !getActiveQuiz(s, t) && getTopicProgress(s, t.id).attempts === 0,
  },
  {
    id: "kasalukuyan",
    get label() {
      return tr("Hindi pa tapos", "Unfinished")
    },
    test: (s, t) => !!getActiveQuiz(s, t),
  },
  {
    id: "ensayo",
    get label() {
      return tr(`Kailangan ng ensayo (<${MASTERY_PERCENT}%)`, `Needs practice (<${MASTERY_PERCENT}%)`)
    },
    test: (s, t) => {
      const tp = getTopicProgress(s, t.id)
      return tp.attempts > 0 && tp.bestPercent < MASTERY_PERCENT
    },
  },
  {
    id: "perpekto",
    get label() {
      return tr("Perpekto", "Perfect")
    },
    test: (s, t) => getTopicProgress(s, t.id).bestPercent === 100,
  },
]

export default function QuizSelection() {
  usePageTitle(tr("Pagsusulit", "Quizzes"))
  const s = useProgress()
  const fallbackGrade = useCurrentGrade()
  const [paramGrade, setGrade] = useGradeParam()
  const grade = paramGrade ?? fallbackGrade
  const list = getTopicsByGrade(grade.id)
  const pick = recommend(s, list)
  const [filter, setFilter] = useState<Filter>("lahat")
  const activeFilter = FILTERS.find((f) => f.id === filter) ?? FILTERS[0]
  const shown = list.filter((t) => activeFilter.test(s, t))

  return (
    <div className={cx(container, "py-10 sm:py-12")}>
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold text-brown sm:text-5xl">
            {tr("Pagsusulit", "Quizzes")}
          </h1>
          <p className="mt-2 text-muted">
            {tr(`Pumili ng paksa para simulan ang quiz sa ${grade.title}.`, `Choose a topic to start a quiz in ${grade.title}.`)}
          </p>
        </div>
        <GradeTabs
          value={grade}
          onChange={setGrade}
          className="self-start md:self-auto"
        />
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {pick && <Recommended topic={pick} s={s} />}
        <LevelCard s={s} />
      </div>

      <section aria-labelledby="lahat-quiz" className="mt-12">
        <h2
          id="lahat-quiz"
          className="font-display text-2xl font-semibold text-brown"
        >
          {tr(`Lahat ng Quiz sa ${grade.title}`, `All Quizzes in ${grade.title}`)}
        </h2>
        <div
          role="group"
          aria-label={tr("Salain ang mga quiz", "Filter quizzes")}
          className="mt-4 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {FILTERS.map((f) => {
            const count = list.filter((t) => f.test(s, t)).length
            const selected = f.id === filter
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(f.id)}
                className={cx(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  selected
                    ? "border-espresso bg-espresso text-on-dark"
                    : "border-stroke bg-card text-brown hover:border-brown/40",
                )}
              >
                {f.label}
                <span
                  className={cx(
                    "rounded-full px-1.5 text-xs",
                    selected ? "bg-on-dark/15" : "bg-track text-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        {shown.length > 0 ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {shown.map((t) => (
              <li key={t.id}>
                <QuizRow topic={t} s={s} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-stroke p-10 text-center">
            <SearchX className="size-8 text-muted" aria-hidden="true" />
            <p className="mt-3 text-sm text-muted">
              {tr(`Walang quiz sa “${activeFilter.label}” para sa ${grade.title}.`, `No quizzes under “${activeFilter.label}” for ${grade.title}.`)}
            </p>
            <button
              type="button"
              className={buttonClass("outline", "sm", "mt-4")}
              onClick={() => setFilter("lahat")}
            >
              {tr("Ipakita lahat", "Show all")}
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="mga-badge" className="mt-14">
        <h2
          id="mga-badge"
          className="font-display text-2xl font-semibold text-brown"
        >
          {tr("Mga Badge", "Badges")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {tr("Kumpletuhin ang mga hamon sa ibaba para makuha ang lahat ng badge.", "Complete the challenges below to earn every badge.")}
        </p>
        <div className="mt-6">
          <BadgeGrid s={s} />
        </div>
      </section>
    </div>
  )
}

interface TopicStateProps {
  topic: Topic
  s: ProgressState
}

function Recommended({ topic, s }: TopicStateProps) {
  const active = getActiveQuiz(s, topic)
  const tp = getTopicProgress(s, topic.id)
  return (
    <section
      aria-labelledby="inirerekomenda"
      className="grid overflow-hidden rounded-3xl bg-espresso text-on-dark md:grid-cols-[1.1fr_1fr]"
    >
      <div className="banig flex flex-col p-7 sm:p-9">
        <p
          className={cx(eyebrow, "inline-flex items-center gap-1.5 text-gold")}
        >
          <Sparkles className="size-3.5" aria-hidden="true" />{" "}
          {active
            ? quizMode(active) === "practice"
              ? tr("Pagsasanay na hindi pa tapos", "Unfinished practice")
              : tr("Hindi pa tapos", "Unfinished")
            : tr("Inirerekomenda para sa iyo", "Recommended for you")}
        </p>
        <h2
          id="inirerekomenda"
          className="mt-3 font-display text-3xl leading-tight font-semibold"
        >
          {topic.title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-on-dark/75">
          {topic.description}
        </p>
        <p className="mt-4 text-sm text-on-dark/85">
          {tr(
            `${topic.questions.length} tanong · mga ${quizMinutes(topic)} minuto`,
            `${topic.questions.length} questions · about ${quizMinutes(topic)} minutes`,
          )}
          {tp.attempts > 0 && ` · ${tr("Pinakamataas", "Best")}: ${tp.bestPercent}%`}
        </p>
        {active && (
          <ProgressBar
            value={(active.answers.length / active.questionIds.length) * 100}
            label={tr("Progreso sa kasalukuyang quiz", "Progress in the current quiz")}
            tone="onDark"
            className="mt-4 max-w-sm"
          />
        )}
        <div className="mt-7">
          <Link to={`/quiz/${topic.id}`} className={buttonClass("gold", "lg")}>
            {active ? (
              <PlayCircle className="size-4" aria-hidden="true" />
            ) : (
              <ClipboardCheck className="size-4" aria-hidden="true" />
            )}
            {active
              ? `${tr("Ituloy", "Continue")} (${active.answers.length}/${active.questionIds.length})`
              : tr("Simulan ang Quiz", "Start Quiz")}
          </Link>
        </div>
      </div>
      <div className="relative hidden min-h-64 md:block">
        <div className="absolute inset-0">
          <Photo image={topic.image} alt="" sizes="480px" />
        </div>
      </div>
    </section>
  )
}

function QuizRow({ topic, s }: TopicStateProps) {
  const active = getActiveQuiz(s, topic)
  const tp = getTopicProgress(s, topic.id)
  const status = active
    ? {
        icon: quizMode(active) === "practice" ? RefreshCcw : PlayCircle,
        text: `${
          quizMode(active) === "practice" ? tr("Pagsasanay", "Practice") : tr("Kasalukuyan", "In progress")
        }: ${active.answers.length}/${active.questionIds.length} ${tr("nasagot", "answered")}`,
        tone: "text-gold-ink",
      }
    : tp.attempts > 0
      ? {
          icon: Trophy,
          text: tr(`Pinakamataas: ${tp.bestPercent}% · ${tp.attempts} subok`, `Best: ${tp.bestPercent}% · ${tp.attempts} ${tp.attempts === 1 ? "attempt" : "attempts"}`),
          tone: "text-success",
        }
      : {
          icon: ClipboardCheck,
          text: tr("Hindi pa nasusubukan", "Not tried yet"),
          tone: "text-muted",
        }
  const StatusIcon = status.icon

  return (
    <div className="flex h-full gap-4 rounded-2xl border border-stroke bg-card p-4 transition hover:border-gold/60">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
        <Photo image={topic.image} alt="" sizes="112px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <CategoryChip category={topic.category} className="self-start" />
        <h3 className="mt-2 font-display text-base leading-snug font-semibold text-brown sm:text-lg">
          {topic.title}
        </h3>
        <p
          className={cx(
            "mt-1 inline-flex items-center gap-1.5 text-xs font-semibold",
            status.tone,
          )}
        >
          <StatusIcon className="size-3.5" aria-hidden="true" /> {status.text}
        </p>
        <div className="mt-auto pt-3">
          <Link
            to={`/quiz/${topic.id}`}
            className={buttonClass(active ? "gold" : "primary", "sm")}
          >
            {active
              ? tr("Ituloy", "Continue")
              : tp.attempts > 0
                ? tr("Subukang Muli", "Try Again")
                : tr("Simulan ang Quiz", "Start Quiz")}
            <span className="sr-only">: {topic.title}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
