import {
  BookOpen,
  CircleCheck,
  CircleX,
  Clock,
  Flame,
  House,
  Layers,
  Lightbulb,
  RefreshCcw,
  RotateCcw,
  Star,
  Timer,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { BadgeTile } from "../components/Achievements"
import { AttemptHistory } from "../components/AttemptHistory"
import { ConfirmDialog } from "../components/Dialog"
import { Mascot } from "../components/Logo"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import { getQuestion, getTopic, type Topic } from "../data"
import {
  bestRun,
  formatDuration,
  getBadge,
  getLevel,
} from "../lib/achievements"
import { formatDateTime } from "../lib/date"
import {
  getActiveQuiz,
  getTopicAttempts,
  progress,
  quizMode,
  useProgress,
  type QuizAttempt,
} from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"
import NotFound from "./NotFound"
import { tr } from "../lib/i18n"

function verdict(percent: number, practice: boolean): string {
  if (practice) {
    if (percent === 100) return tr("Naitama mo na lahat!", "You got them all right!")
    if (percent >= 50) return tr("Umuunlad ka!", "You're improving!")
    return tr("Ituloy ang pagsasanay!", "Keep practicing!")
  }
  if (percent >= 90) return tr("Napakagaling!", "Outstanding!")
  if (percent >= 70) return tr("Magaling!", "Great job!")
  if (percent >= 50) return tr("Mabuti! Kaunting ensayo pa.", "Good! A little more practice.")
  return tr("Huwag sumuko! Balikan ang aralin.", "Don't give up! Review the lesson.")
}

interface RetryAction {
  kind: "retry"
}
interface PracticeAction {
  kind: "practice"
  ids: string[]
}
type PendingAction = RetryAction | PracticeAction

export default function QuizResult() {
  usePageTitle(tr("Resulta ng Pagsusulit", "Quiz Results"))
  const { attemptId } = useParams()
  const s = useProgress()
  const navigate = useNavigate()
  const [onlyWrong, setOnlyWrong] = useState(false)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const attempt = s.attempts.find((a) => a.id === attemptId)
  const topic = getTopic(attempt?.topicId)
  if (!attempt || !topic) {
    return (
      <NotFound
        title={tr("Hindi mahanap ang resulta", "Result not found")}
        message={tr(
          "Maaaring na-reset ang iyong progreso o galing ito sa ibang device o browser.",
          "Your progress may have been reset, or this came from another device or browser.",
        )}
      />
    )
  }

  const practice = quizMode(attempt) === "practice"
  const earned = attempt.pointsAwarded + attempt.bonusAwarded
  const newBest =
    !practice &&
    attempt.correct > attempt.previousBestCorrect &&
    attempt.previousBestCorrect > 0
  const circumference = 2 * Math.PI * 52
  const levelBefore =
    attempt.pointsBefore !== undefined
      ? getLevel(attempt.pointsBefore)
      : undefined
  const levelAfter =
    attempt.pointsBefore !== undefined
      ? getLevel(attempt.pointsBefore + earned)
      : undefined
  const leveledUp =
    !!levelBefore &&
    !!levelAfter &&
    levelAfter.level.index > levelBefore.level.index
  const newBadges = (attempt.unlockedBadges ?? [])
    .map(getBadge)
    .filter((b) => b !== undefined)
  const wrongIds = attempt.answers
    .filter((a) => !a.correct)
    .map((a) => a.questionId)
    .filter((id) => !!getQuestion(topic, id))
  const history = getTopicAttempts(s, topic.id)
  const duration = attempt.durationMs ?? 0
  const run = bestRun(attempt.answers)
  const reviewed = attempt.answers
    .map((a, i) => ({ a, i }))
    .filter(({ a }) => !onlyWrong || !a.correct)

  const runAction = (action: PendingAction) => {
    if (action.kind === "retry") progress.startQuiz(topic, true)
    else progress.startPractice(topic, action.ids)
    navigate(`/quiz/${topic.id}`)
  }
  // Starting a new round replaces any unfinished quiz on this topic, so confirm first.
  const request = (action: PendingAction) => {
    const unfinished = getActiveQuiz(s, topic)
    if (unfinished && unfinished.answers.length > 0) setPending(action)
    else runAction(action)
  }

  return (
    <div className={cx(container, "max-w-4xl py-10 sm:py-14")}>
      <section
        aria-labelledby="resulta"
        className="banig relative overflow-hidden rounded-3xl bg-espresso p-7 text-center text-on-dark sm:p-10"
      >
        <p className={cx(eyebrow, "text-gold")}>
          {practice ? tr("Resulta ng Pagsasanay", "Practice Results") : tr("Resulta ng Pagsusulit", "Quiz Results")}
        </p>
        <h1
          id="resulta"
          className="mt-2 font-display text-3xl font-semibold sm:text-4xl"
        >
          {verdict(attempt.percent, practice)}
        </h1>
        <p className="mt-2 text-sm text-on-dark/75">
          {practice
            ? tr(
                `Sinanay mo ang ${attempt.total} tanong na dati mong namali sa ${topic.title}.`,
                `You practiced ${attempt.total} questions you previously missed in ${topic.title}.`,
              )
            : tr(`Natapos mo ang pagsusulit sa ${topic.title}.`, `You finished the quiz on ${topic.title}.`)}
        </p>

        <div className="relative mx-auto mt-8 size-40">
          <svg
            viewBox="0 0 120 120"
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgb(250 245 236 / 0.15)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#D6952E"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - attempt.percent / 100)}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <p className="font-display text-4xl font-semibold">
                {attempt.correct} / {attempt.total}
              </p>
              <p className="text-xs font-semibold text-on-dark/75">
                {attempt.percent}% {tr("Katumpakan", "Accuracy")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {practice ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-on-dark/10 px-4 py-2 text-sm font-semibold">
              <RefreshCcw className="size-4 text-gold" aria-hidden="true" />{" "}
              {tr("Pagsasanay: hindi nagbabago ang puntos at iskor", "Practice: points and score don't change")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-on-dark/10 px-4 py-2 text-sm font-semibold">
              <Star className="size-4 fill-gold text-gold" aria-hidden="true" />{" "}
              +{earned} {tr("puntos", "points")}
            </span>
          )}
          {leveledUp && levelAfter && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-brown-dark">
              <TrendingUp className="size-4" aria-hidden="true" /> {tr("Bagong antas:", "New level:")}{" "}
              {levelAfter.level.name}
            </span>
          )}
          {attempt.bonusAwarded > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-brown-dark">
              {tr("Hamon ng Araw", "Daily Challenge")}: +{attempt.bonusAwarded}
            </span>
          )}
          {newBest && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-on-dark/10 px-4 py-2 text-sm font-semibold">
              <Trophy className="size-4 text-gold" aria-hidden="true" />{" "}
              {tr("Bagong pinakamataas na iskor!", "New best score!")}
            </span>
          )}
        </div>
        {!practice &&
          attempt.pointsAwarded === 0 &&
          attempt.previousBestCorrect > 0 && (
            <p className="mx-auto mt-4 max-w-md text-xs text-on-dark/70">
              {tr(
                `Nakakakuha lamang ng puntos ang mga tamang sagot na lampas sa iyong dating pinakamataas na iskor (${attempt.previousBestCorrect}/${attempt.total}).`,
                `Only correct answers beyond your previous best score (${attempt.previousBestCorrect}/${attempt.total}) earn points.`,
              )}
            </p>
          )}
        <p className="mt-6 text-xs text-on-dark/60">
          {formatDateTime(attempt.completedAt)}
        </p>
        <Mascot className="pointer-events-none absolute -bottom-12 -left-3 hidden w-32 sm:block lg:w-40" />
      </section>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={Clock}
          label={tr("Kabuuang oras", "Total time")}
          value={duration ? formatDuration(duration) : "—"}
        />
        <Stat
          icon={Timer}
          label={tr("Bawat tanong", "Per question")}
          value={
            duration
              ? `${Math.round(duration / 1000 / attempt.total) || "<1"} ${tr("seg", "sec")}`
              : "—"
          }
        />
        <Stat
          icon={Flame}
          label={tr("Pinakamahabang sunod na tama", "Longest correct streak")}
          value={String(run)}
        />
        <Stat
          icon={CircleX}
          label={tr("Mga mali", "Wrong answers")}
          value={String(attempt.total - attempt.correct)}
        />
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {wrongIds.length > 0 && (
          <button
            type="button"
            className={buttonClass("gold", "md", "w-full sm:w-auto")}
            onClick={() => request({ kind: "practice", ids: wrongIds })}
          >
            <RefreshCcw className="size-4" aria-hidden="true" />{" "}
            {tr(`Sanayin ang ${wrongIds.length} mali`, `Practice ${wrongIds.length} wrong`)}
          </button>
        )}
        <button
          type="button"
          className={buttonClass(
            wrongIds.length > 0 ? "primary" : "gold",
            "md",
            "w-full sm:w-auto",
          )}
          onClick={() => request({ kind: "retry" })}
        >
          <RotateCcw className="size-4" aria-hidden="true" />{" "}
          {practice ? tr("Buong Quiz", "Full Quiz") : tr("Subukang Muli", "Try Again")}
        </button>
        <div className="grid grid-cols-3 gap-3 sm:ml-auto sm:flex">
          <Link
            to={`/topics/${topic.id}`}
            className={buttonClass("outline", "md", "w-full sm:w-auto")}
          >
            <BookOpen className="size-4" aria-hidden="true" /> {tr("Aralin", "Lesson")}
          </Link>
          <Link
            to="/quiz"
            className={buttonClass("outline", "md", "w-full sm:w-auto")}
          >
            <Layers className="size-4" aria-hidden="true" />{" "}
            <span className="sm:hidden">{tr("Iba pa", "More")}</span>
            <span className="hidden sm:inline">{tr("Iba pang Paksa", "Other Topics")}</span>
          </Link>
          <Link
            to="/progreso"
            className={buttonClass("outline", "md", "w-full sm:w-auto")}
          >
            <House className="size-4" aria-hidden="true" /> {tr("Progreso", "Progress")}
          </Link>
        </div>
      </div>

      {newBadges.length > 0 && (
        <section aria-labelledby="bagong-badge" className="mt-12">
          <h2
            id="bagong-badge"
            className="font-display text-2xl font-semibold text-brown"
          >
            {tr("Bagong Badge!", "New Badge!")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {tr("Nakuha mo ang mga ito sa subok na ito.", "You earned these in this attempt.")}
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {newBadges.map((b) => (
              <li key={b.id}>
                <BadgeTile badge={b} s={s} highlight />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="balikan" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="balikan"
            className="font-display text-2xl font-semibold text-brown"
          >
            {tr("Balikan ang mga Sagot", "Review Your Answers")}
          </h2>
          <div
            role="group"
            aria-label={tr("Salain ang mga sagot", "Filter answers")}
            className="inline-flex rounded-full border border-stroke bg-card p-1 text-sm font-semibold"
          >
            {[
              { value: false, label: `${tr("Lahat", "All")} (${attempt.total})` },
              {
                value: true,
                label: `${tr("Mali lamang", "Wrong only")} (${attempt.total - attempt.correct})`,
              },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={onlyWrong === f.value}
                onClick={() => setOnlyWrong(f.value)}
                className={cx(
                  "rounded-full px-4 py-1.5 transition-colors",
                  onlyWrong === f.value
                    ? "bg-espresso text-on-dark"
                    : "text-brown hover:bg-brown/5",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {reviewed.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-stroke p-6 text-center text-sm text-muted">
            {tr("Walang maling sagot sa subok na ito. Perpekto!", "No wrong answers in this attempt. Perfect!")}
          </p>
        )}
        <ol className="mt-6 space-y-4">
          {reviewed.map(({ a, i }) => {
            const q = getQuestion(topic, a.questionId)
            if (!q) {
              return (
                <li
                  key={a.questionId}
                  className="rounded-2xl border border-dashed border-stroke p-5 text-sm text-muted"
                >
                  {tr("Tanong", "Question")} {i + 1}:{" "}
                  {tr("Na-update na ang tanong na ito mula nang sagutin mo.", "This question has been updated since you answered it.")}
                </li>
              )
            }
            return (
              <li
                key={a.questionId}
                className="rounded-2xl border border-stroke bg-card p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  {a.correct ? (
                    <CircleCheck
                      className="mt-0.5 size-5 shrink-0 text-success"
                      aria-label={tr("Tama", "Correct")}
                    />
                  ) : (
                    <CircleX
                      className="mt-0.5 size-5 shrink-0 text-error"
                      aria-label={tr("Mali", "Wrong")}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-muted">
                      {tr("Tanong", "Question")} {i + 1}
                    </p>
                    <p className="mt-1 font-semibold text-ink">{q.question}</p>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted">{tr("Iyong sagot:", "Your answer:")}</dt>
                        <dd
                          className={cx(
                            "font-semibold",
                            a.correct ? "text-success" : "text-error",
                          )}
                        >
                          {q.options[a.selectedIndex]}
                        </dd>
                      </div>
                      {!a.correct && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-muted">{tr("Tamang sagot:", "Correct answer:")}</dt>
                          <dd className="font-semibold text-success">
                            {q.options[q.correctIndex]}
                          </dd>
                        </div>
                      )}
                    </dl>
                    {q.explanation && (
                      <p className="mt-3 flex gap-2 rounded-xl bg-cream p-3 text-sm leading-relaxed text-ink/85">
                        <Lightbulb
                          className="mt-0.5 size-4 shrink-0 text-gold-ink"
                          aria-hidden="true"
                        />
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {history.length > 1 && (
        <section aria-labelledby="kasaysayan" className="mt-14">
          <h2
            id="kasaysayan"
            className="font-display text-2xl font-semibold text-brown"
          >
            {tr("Mga Subok sa Paksang Ito", "Attempts on This Topic")}
          </h2>
          <ScoreTrend topic={topic} attempts={history} currentId={attempt.id} />
          <AttemptHistory
            attempts={history}
            currentId={attempt.id}
            className="mt-4"
          />
        </section>
      )}

      <ConfirmDialog
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={() => pending && runAction(pending)}
        icon={<RotateCcw className="size-5" aria-hidden="true" />}
        title={tr("Palitan ang hindi pa tapos na quiz?", "Replace your unfinished quiz?")}
        message={tr(
          "May hindi ka pa natatapos na quiz sa paksang ito. Mabubura ang mga sagot doon kapag nagsimula ka ng bago.",
          "You have an unfinished quiz on this topic. Its answers will be cleared if you start a new one.",
        )}
        confirmLabel={tr("Magsimula ng bago", "Start new")}
        cancelLabel={tr("Huwag muna", "Not now")}
      />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-stroke bg-card p-4">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <Icon className="size-3.5 shrink-0" aria-hidden="true" /> {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold text-brown">
        {value}
      </dd>
    </div>
  )
}

/** Bar chart of scored attempts on a topic, oldest to newest, so improvement is visible. */
function ScoreTrend({
  topic,
  attempts,
  currentId,
}: {
  topic: Topic
  attempts: QuizAttempt[]
  currentId: string
}) {
  const scored = attempts
    .filter((a) => (a.mode ?? "normal") === "normal")
    .slice(0, 10)
    .reverse()
  if (scored.length < 2) return null
  return (
    <figure className="mt-5 rounded-2xl border border-stroke bg-card p-5">
      <figcaption className="text-xs font-semibold text-muted">
        {tr(`Iskor sa huling ${scored.length} subok sa ${topic.title}`, `Scores from the last ${scored.length} attempts on ${topic.title}`)}
      </figcaption>
      <ol className="mt-4 flex h-28 items-end gap-2">
        {scored.map((a, i) => (
          <li
            key={a.id}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <span className="text-[0.65rem] font-bold text-brown">
              {a.percent}%
            </span>
            <span
              className={cx(
                "w-full max-w-10 rounded-t-md",
                a.id === currentId ? "bg-gold" : "bg-espresso/70",
              )}
              style={{ height: `${Math.max(4, a.percent)}%` }}
            />
            <span className="sr-only">
              {tr("Subok", "Attempt")} {i + 1}: {a.percent}%{a.id === currentId ? tr(" (ito)", " (this one)") : ""}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
