import {
  ArrowRight,
  CircleCheck,
  CircleX,
  Clock,
  Flame,
  Lightbulb,
  RefreshCcw,
  RotateCcw,
  X,
} from "lucide-react"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { ConfirmDialog } from "../components/Dialog"
import { ProgressBar } from "../components/ProgressBar"
import { QuizIntro } from "../components/QuizIntro"
import { useToast } from "../components/Toast"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import { getQuestion, getTopic, type Topic } from "../data"
import { formatDuration } from "../lib/achievements"
import {
  getActiveQuiz,
  getOptionOrder,
  progress,
  quizMode,
  useProgress,
  type ActiveQuiz,
} from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"
import NotFound from "./NotFound"
import { tr } from "../lib/i18n"

const LETTERS = ["A", "B", "C", "D", "E", "F"]

export default function QuizRunner() {
  const { topicId } = useParams()
  const topic = getTopic(topicId)
  if (!topic)
    return (
      <NotFound
        title={tr("Hindi mahanap ang quiz", "Quiz not found")}
        message={tr("Wala ang paksang ito sa PAMANA. Pumili ng ibang quiz.", "This topic isn't on PAMANA. Choose another quiz.")}
      />
    )
  if (topic.questions.length === 0) {
    return (
      <NotFound
        title={tr("Wala pang tanong", "No questions yet")}
        message={tr("Wala pang pagsusulit para sa paksang ito. Basahin muna ang aralin.", "There's no quiz for this topic yet. Read the lesson first.")}
      />
    )
  }
  return <Runner key={topic.id} topic={topic} />
}

function Runner({ topic }: { topic: Topic }) {
  usePageTitle(`Quiz: ${topic.title}`)
  const s = useProgress()
  const [params, setParams] = useSearchParams()
  const restartRequested = params.get("ulitin") === "1"
  const [finishing, setFinishing] = useState(false)
  const active = getActiveQuiz(s, topic)

  // "?ulitin=1" always starts a fresh attempt (used by older links and bookmarks).
  useEffect(() => {
    if (!restartRequested) return
    progress.startQuiz(topic, true)
    setParams({}, { replace: true })
  }, [topic, restartRequested, setParams])

  if (finishing || restartRequested) {
    return (
      <div className={cx(container, "py-24 text-center text-muted")}>
        {tr("Inihahanda ang pagsusulit…", "Preparing the quiz…")}
      </div>
    )
  }
  if (!active) return <QuizIntro topic={topic} />
  return (
    <ActiveRunner
      topic={topic}
      active={active}
      onFinishing={() => setFinishing(true)}
    />
  )
}

/** Tracks whether the page is visible so the timer pauses in background tabs. */
function usePageVisible() {
  const [visible, setVisible] = useState(
    () =>
      typeof document === "undefined" || document.visibilityState === "visible",
  )
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", onChange)
    return () => document.removeEventListener("visibilitychange", onChange)
  }, [])
  return visible
}

interface ActiveRunnerProps {
  topic: Topic
  active: ActiveQuiz
  onFinishing: () => void
}

function ActiveRunner({ topic, active, onFinishing }: ActiveRunnerProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [warning, setWarning] = useState(false)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const practice = quizMode(active) === "practice"

  const question = getQuestion(topic, active.questionIds[active.index])
  const total = active.questionIds.length
  const answer = active.submitted ? active.answers[active.index] : undefined
  const isLast = active.index === total - 1
  const order = question
    ? getOptionOrder(active, question.id, question.options.length)
    : []

  // Timer: counts only while answering (not on the feedback screen) and while the tab is visible.
  const visible = usePageVisible()
  const running = visible && !active.submitted
  const sliceStart = useRef(Date.now())
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    sliceStart.current = Date.now()
    setNow(sliceStart.current)
    const tick = window.setInterval(() => setNow(Date.now()), 1000)
    return () => {
      window.clearInterval(tick)
      progress.addQuizTime(topic.id, Date.now() - sliceStart.current)
    }
  }, [running, topic.id])
  const elapsed =
    (active.elapsedMs ?? 0) +
    (running ? Math.max(0, now - sliceStart.current) : 0)

  useEffect(() => {
    setWarning(false)
  }, [active.index])

  const select = (original: number) => {
    if (active.submitted) return
    setWarning(false)
    progress.saveQuiz(topic.id, { selectedIndex: original })
  }

  // Number (1–4) and letter (A–D) shortcuts work anywhere on the page, not just inside the quiz.
  useEffect(() => {
    if (!question || active.submitted) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented
      )
        return
      const target = event.target instanceof HTMLElement ? event.target : null
      if (
        target?.closest('input, textarea, select, [contenteditable="true"]') ||
        document.querySelector("dialog[open]")
      )
        return
      const key = event.key.toUpperCase()
      const count = question.options.length
      const numeric = /^[1-9]$/.test(key) ? Number(key) - 1 : -1
      const letter = key.length === 1 ? LETTERS.indexOf(key) : -1
      const position =
        numeric >= 0 && numeric < count
          ? numeric
          : letter >= 0 && letter < count
            ? letter
            : -1
      if (position < 0) return
      event.preventDefault()
      setWarning(false)
      progress.saveQuiz(topic.id, { selectedIndex: order[position] })
      optionRefs.current[position]?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active.submitted, question, order, topic.id])

  if (!question) {
    return (
      <div className={cx(container, "py-24 text-center text-muted")}>
        {tr("Inihahanda ang pagsusulit…", "Preparing the quiz…")}
      </div>
    )
  }

  const submit = () => {
    if (active.submitted) return
    if (active.selectedIndex === null) {
      setWarning(true)
      return
    }
    const record = {
      questionId: question.id,
      selectedIndex: active.selectedIndex,
      correct: active.selectedIndex === question.correctIndex,
    }
    progress.saveQuiz(topic.id, {
      submitted: true,
      answers: [...active.answers.slice(0, active.index), record],
    })
  }

  const advance = () => {
    if (!active.submitted) return
    if (isLast) {
      onFinishing()
      const attempt = progress.completeQuiz(topic.id)
      if (attempt) navigate(`/results/${attempt.id}`, { replace: true })
      return
    }
    progress.saveQuiz(topic.id, {
      index: active.index + 1,
      selectedIndex: null,
      submitted: false,
    })
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const restart = () => {
    // Discard the time already counted in this slice so it isn't added to the new attempt.
    sliceStart.current = Date.now()
    if (practice) progress.startPractice(topic, active.questionIds)
    else progress.startQuiz(topic, true)
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const onRadioKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    position: number,
  ) => {
    const original = order[position]
    if (event.key === "Enter" && !active.submitted) {
      // Enter on the chosen option submits it; on another option it selects that option first.
      event.preventDefault()
      if (active.selectedIndex === original) submit()
      else select(original)
      return
    }
    const count = order.length
    let target = -1
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      target = (position + 1) % count
    if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      target = (position - 1 + count) % count
    if (target < 0 || active.submitted) return
    event.preventDefault()
    select(order[target])
    optionRefs.current[target]?.focus()
  }

  const answeredCount = active.answers.length
  const correctSoFar = active.answers.filter((a) => a.correct).length
  // Current run of consecutive correct answers, counting back from the latest answer.
  let streak = 0
  for (
    let i = active.answers.length - 1;
    i >= 0 && active.answers[i].correct;
    i--
  )
    streak++
  const selectedPosition =
    active.selectedIndex === null ? -1 : order.indexOf(active.selectedIndex)
  const focusPosition = selectedPosition >= 0 ? selectedPosition : 0

  return (
    <div className={cx(container, "max-w-3xl py-8 sm:py-12")}>
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/topics/${topic.id}`}
          className={buttonClass("ghost", "sm", "-ml-3")}
          onClick={() => {
            if (answeredCount > 0)
              toast(
                tr("Naka-save ang iyong progreso. Ituloy anumang oras.", "Your progress is saved. Continue anytime."),
                "info",
              )
          }}
        >
          <X className="size-4" aria-hidden="true" /> {tr("Lumabas", "Exit")}
        </Link>
        <button
          type="button"
          className={buttonClass("ghost", "sm", "-mr-3")}
          onClick={() => setConfirmRestart(true)}
          disabled={answeredCount === 0 && !active.submitted}
        >
          <RotateCcw className="size-4" aria-hidden="true" /> {tr("Ulitin", "Restart")}
        </button>
      </div>

      <div className="mt-4 rounded-3xl border border-stroke bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-semibold text-brown">
            {topic.title}
          </p>
          {practice && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-espresso px-2.5 py-1 text-[0.68rem] font-bold text-on-dark">
              <RefreshCcw className="size-3" aria-hidden="true" /> {tr("Pagsasanay", "Practice")}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-bold">
          <span className={cx(eyebrow, "text-muted")}>{tr("Progress mo", "Your progress")}</span>
          <span className="text-brown">
            {tr("Tanong", "Question")} {active.index + 1} {tr("sa", "of")} {total}
          </span>
        </div>
        <ProgressBar
          value={(answeredCount / total) * 100}
          label={tr("Progreso sa pagsusulit", "Quiz progress")}
          className="mt-2"
        />
        <ol
          className="mt-3 flex flex-wrap gap-1.5"
          aria-label={tr("Mapa ng mga tanong", "Question map")}
        >
          {active.questionIds.map((id, i) => {
            const a = active.answers[i]
            const current = i === active.index
            return (
              <li
                key={id}
                className={cx(
                  "size-2.5 rounded-full",
                  a ? (a.correct ? "bg-success" : "bg-error") : "bg-track",
                  current && "ring-2 ring-gold ring-offset-2 ring-offset-card",
                )}
              >
                <span className="sr-only">
                  {tr("Tanong", "Question")} {i + 1}:{" "}
                  {a
                    ? a.correct
                      ? tr("tama", "correct")
                      : tr("mali", "wrong")
                    : current
                      ? tr("kasalukuyan", "current")
                      : tr("hindi pa nasasagot", "not answered yet")}
                </span>
              </li>
            )
          })}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted">
          <span
            className="inline-flex items-center gap-1.5"
            title={tr("Oras sa pagsagot", "Time spent answering")}
          >
            <Clock className="size-3.5" aria-hidden="true" />
            <span className="sr-only">{tr("Oras:", "Time:")}</span>
            <span className="tabular-nums" role="timer" aria-live="off">
              {formatDuration(elapsed)}
            </span>
            {active.submitted && (
              <span className="font-normal">{tr("(naka-pause)", "(paused)")}</span>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CircleCheck className="size-3.5 text-success" aria-hidden="true" />
            {correctSoFar} {tr("tama", "correct")}
          </span>
          {streak >= 2 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-light px-2 py-0.5 text-gold-ink">
              <Flame className="size-3.5" aria-hidden="true" />
              {tr(`${streak} sunod-sunod na tama!`, `${streak} correct in a row!`)}
            </span>
          )}
          <span className="ml-auto">{tr("Awtomatikong naka-save", "Saved automatically")}</span>
        </div>
      </div>

      <section aria-labelledby="tanong" className="mt-8">
        <p className={cx(eyebrow, "text-gold-ink")}>
          {tr("Tanong", "Question")} {active.index + 1}
        </p>
        <h1
          id="tanong"
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 font-display text-2xl leading-snug font-semibold text-brown outline-none sm:text-3xl"
        >
          {question.question}
        </h1>
        <p id="tagubilin" className="mt-3 text-sm text-muted">
          {tr("Piliin ang tamang sagot sa mga options sa ibaba.", "Choose the correct answer from the options below.")}{" "}
          <span className="hidden sm:inline">
            ({tr("Pindutin ang", "Press")} 1–{order.length} {tr("o", "or")} A–{LETTERS[order.length - 1]})
          </span>
        </p>

        <div
          role="radiogroup"
          aria-labelledby="tanong"
          aria-describedby="tagubilin"
          className="mt-6 space-y-3"
        >
          {order.map((original, position) => {
            const option = question.options[original]
            const selected = active.selectedIndex === original
            const isCorrect =
              active.submitted && original === question.correctIndex
            const isWrong =
              active.submitted && selected && original !== question.correctIndex
            return (
              <button
                key={original}
                ref={(el) => {
                  optionRefs.current[position] = el
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={active.submitted}
                tabIndex={position === focusPosition ? 0 : -1}
                onClick={() => select(original)}
                onKeyDown={(e) => onRadioKey(e, position)}
                className={cx(
                  "flex w-full items-center gap-4 rounded-2xl border-2 bg-surface p-4 text-left transition-colors sm:p-5",
                  !active.submitted &&
                    (selected
                      ? "border-gold bg-option-selected"
                      : "border-option hover:border-gold/50"),
                  isCorrect && "border-success bg-success-light",
                  isWrong && "border-error bg-error-light",
                  active.submitted &&
                    !isCorrect &&
                    !isWrong &&
                    "border-option opacity-60",
                  active.submitted && "cursor-default",
                )}
              >
                <span
                  className={cx(
                    "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold",
                    isCorrect
                      ? "bg-success text-white"
                      : isWrong
                        ? "bg-error text-white"
                        : selected
                          ? "bg-gold text-brown-dark"
                          : "bg-cream text-brown",
                  )}
                  aria-hidden="true"
                >
                  {isCorrect ? (
                    <CircleCheck className="size-5" />
                  ) : isWrong ? (
                    <CircleX className="size-5" />
                  ) : (
                    LETTERS[position]
                  )}
                </span>
                <span className="flex-1 text-[0.95rem] font-medium text-ink">
                  {option}
                </span>
                {isCorrect && <span className="sr-only">(tamang sagot)</span>}
                {isWrong && (
                  <span className="sr-only">(iyong sagot, mali)</span>
                )}
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className="mt-6">
          {warning && (
            <p className="rounded-xl bg-error-light px-4 py-3 text-sm font-semibold text-error">
              {tr("Mangyaring pumili muna ng sagot bago magpatuloy.", "Please choose an answer before continuing.")}
            </p>
          )}
          {answer && (
            <div
              className={cx(
                "rounded-2xl border p-5",
                answer.correct
                  ? "border-success/30 bg-success-light"
                  : "border-error/30 bg-error-light",
              )}
            >
              <p
                className={cx(
                  "flex items-center gap-2 font-bold",
                  answer.correct ? "text-success" : "text-error",
                )}
              >
                {answer.correct ? (
                  <CircleCheck className="size-5" aria-hidden="true" />
                ) : (
                  <CircleX className="size-5" aria-hidden="true" />
                )}
                {answer.correct
                  ? tr("Tama ang iyong sagot! Mahusay!", "Correct! Great job!")
                  : tr("Mali ang sagot. Tingnan ang tamang sagot.", "That's wrong. See the correct answer.")}
              </p>
              {!answer.correct && (
                <p className="mt-2 text-sm text-ink/85">
                  {tr("Tamang sagot:", "Correct answer:")}{" "}
                  <span className="font-semibold text-success">
                    {question.options[question.correctIndex]}
                  </span>
                </p>
              )}
              {question.explanation && (
                <p className="mt-2 flex gap-2 text-sm leading-relaxed text-ink/85">
                  <Lightbulb
                    className="mt-0.5 size-4 shrink-0 text-gold-ink"
                    aria-hidden="true"
                  />
                  {question.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          {active.submitted ? (
            <button
              type="button"
              className={buttonClass("primary", "lg", "w-full sm:w-auto")}
              onClick={advance}
              autoFocus
            >
              {isLast ? tr("Tingnan ang Resulta", "See Results") : tr("Susunod na Tanong", "Next Question")}{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className={buttonClass("gold", "lg", "w-full sm:w-auto")}
              onClick={submit}
            >
              {tr("Isumite ang Sagot", "Submit Answer")}{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={confirmRestart}
        onClose={() => setConfirmRestart(false)}
        onConfirm={restart}
        icon={<RotateCcw className="size-5" aria-hidden="true" />}
        title={practice ? tr("Ulitin ang pagsasanay?", "Restart practice?") : tr("Ulitin ang quiz?", "Restart quiz?")}
        message={
          practice
            ? tr("Magsisimula muli ang pagsasanay sa parehong mga tanong.", "Practice will start over with the same questions.")
            : tr(
                "Mabubura ang iyong mga sagot sa kasalukuyang subok at magsisimula ka sa unang tanong. Hindi maaapektuhan ang iyong pinakamataas na iskor.",
                "Your answers in this attempt will be cleared and you'll start from the first question. Your best score won't be affected.",
              )
        }
        confirmLabel={tr("Ulitin", "Restart")}
      />
    </div>
  )
}
