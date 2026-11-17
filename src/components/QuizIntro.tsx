import {
  ArrowRight,
  BookOpen,
  CircleAlert,
  Clock,
  ListChecks,
  RefreshCcw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react"
import { Link } from "react-router"
import {
  getDailyChallengeTopic,
  getGrade,
  quizMinutes,
  type Topic,
} from "../data"
import { todayKey } from "../lib/date"
import {
  CHALLENGE_BONUS,
  POINTS_PER_CORRECT,
  getTopicAttempts,
  getTopicProgress,
  progress,
  quizMode,
  useProgress,
} from "../lib/progress"
import { AttemptHistory } from "./AttemptHistory"
import { CategoryChip } from "./CategoryChip"
import { Photo } from "./Photo"
import { Switch } from "./Switch"
import { buttonClass, container, cx, eyebrow } from "./ui"
import { tr } from "../lib/i18n"

/** Shown before a new attempt: what to expect, how points work, settings, and past results. */
export function QuizIntro({ topic }: { topic: Topic }) {
  const s = useProgress()
  const grade = getGrade(topic.gradeId)
  const tp = getTopicProgress(s, topic.id)
  const history = getTopicAttempts(s, topic.id)
  const total = topic.questions.length
  const today = todayKey()
  const challengeOpen =
    getDailyChallengeTopic(today).id === topic.id &&
    s.challengeCompletedOn !== today
  const maxNewPoints =
    (total - Math.min(tp.bestCorrect, total)) * POINTS_PER_CORRECT

  // Wrong answers from the latest scored attempt that still exist in the content.
  const lastScored = history.find((a) => quizMode(a) === "normal")
  const wrongIds = (lastScored?.answers ?? [])
    .filter((a) => !a.correct)
    .map((a) => a.questionId)
    .filter((id) => topic.questions.some((q) => q.id === id))

  return (
    <div className={cx(container, "max-w-4xl py-8 sm:py-12")}>
      <section
        aria-labelledby="intro-title"
        className="overflow-hidden rounded-3xl border border-stroke bg-card"
      >
        <div className="relative aspect-[21/8] min-h-40">
          <div className="absolute inset-0">
            <Photo
              image={topic.image}
              alt=""
              sizes="(min-width: 896px) 896px, 100vw"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={topic.category} />
              <span className="rounded-full bg-on-dark/15 px-2.5 py-1 text-[0.7rem] font-bold text-on-dark backdrop-blur">
                {grade?.title}
              </span>
            </div>
            <p className={cx(eyebrow, "mt-4 text-gold")}>{tr("Pagsusulit", "Quiz")}</p>
            <h1
              id="intro-title"
              className="mt-1 font-display text-3xl leading-tight font-semibold text-on-dark sm:text-4xl"
            >
              {topic.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon={ListChecks} label={tr("Mga tanong", "Questions")} value={String(total)} />
            <Fact
              icon={Clock}
              label={tr("Tinatayang oras", "Estimated time")}
              value={`${quizMinutes(topic)} min`}
            />
            <Fact
              icon={Trophy}
              label={tr("Pinakamataas", "Best score")}
              value={tp.attempts > 0 ? `${tp.bestPercent}%` : "—"}
            />
            <Fact
              icon={RefreshCcw}
              label={tr("Mga subok", "Attempts")}
              value={String(tp.attempts)}
            />
          </dl>

          {!tp.lessonRead && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gold/40 bg-gold-light/60 p-4 sm:flex-row sm:items-center">
              <CircleAlert
                className="size-5 shrink-0 text-gold-ink"
                aria-hidden="true"
              />
              <p className="flex-1 text-sm text-ink/85">
                {tr(
                  "Hindi mo pa natatapos basahin ang aralin. Mas madaling sumagot kapag binasa mo muna ito.",
                  "You haven't finished reading the lesson yet. It's easier to answer after reading it first.",
                )}
              </p>
              <Link
                to={`/topics/${topic.id}`}
                className={buttonClass("outline", "sm")}
              >
                <BookOpen className="size-4" aria-hidden="true" /> {tr("Basahin muna", "Read first")}
              </Link>
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-cream p-5">
              <h2 className="text-sm font-bold text-brown">
                {tr("Paano kumita ng puntos", "How to earn points")}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-ink/85">
                <li className="flex gap-2">
                  <Star
                    className="mt-0.5 size-4 shrink-0 fill-gold text-gold"
                    aria-hidden="true"
                  />
                  <span>
                    {tr(
                      `+${POINTS_PER_CORRECT} puntos bawat tamang sagot na lampas sa iyong pinakamataas na iskor`,
                      `+${POINTS_PER_CORRECT} points for each correct answer beyond your best score`,
                    )}
                    {tp.attempts > 0 && ` (${tp.bestCorrect}/${total})`}.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Trophy
                    className="mt-0.5 size-4 shrink-0 text-gold-ink"
                    aria-hidden="true"
                  />
                  <span>
                    {maxNewPoints > 0
                      ? tr(
                          `Hanggang ${maxNewPoints} bagong puntos ang makukuha mo rito.`,
                          `You can earn up to ${maxNewPoints} new points here.`,
                        )
                      : tr(
                          "Perpekto na ang iskor mo rito. Mag-ensayo para sa kasanayan!",
                          "Your score here is already perfect. Practice to sharpen your skills!",
                        )}
                  </span>
                </li>
                {challengeOpen && (
                  <li className="flex gap-2 font-semibold text-gold-ink">
                    <Sparkles
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      {tr(
                        `Hamon ng Araw ito: +${CHALLENGE_BONUS} bonus kapag natapos!`,
                        `This is the Daily Challenge: +${CHALLENGE_BONUS} bonus when you finish!`,
                      )}
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-2xl border border-stroke p-5">
              <h2 className="text-sm font-bold text-brown">{tr("Mga setting", "Settings")}</h2>
              <Switch
                className="mt-3"
                checked={s.quizSettings.shuffle}
                onChange={(v) => progress.setShuffle(v)}
                label={tr("Haluin ang mga tanong at pagpipilian", "Shuffle questions and choices")}
                description={tr(
                  "Iba ang pagkakasunod-sunod bawat subok para hindi lang maalala ang puwesto ng sagot.",
                  "The order changes every attempt so you don't just memorize where the answer is.",
                )}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className={buttonClass("gold", "lg", "w-full sm:w-auto")}
              onClick={() => progress.startQuiz(topic, true)}
              autoFocus
            >
              {tp.attempts > 0 ? tr("Subukang Muli", "Try Again") : tr("Simulan ang Quiz", "Start Quiz")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            {wrongIds.length > 0 && (
              <button
                type="button"
                className={buttonClass("outline", "lg", "w-full sm:w-auto")}
                onClick={() => progress.startPractice(topic, wrongIds)}
              >
                <RefreshCcw className="size-4" aria-hidden="true" />
                {tr(`Sanayin ang ${wrongIds.length} maling sagot`, `Practice ${wrongIds.length} wrong ${wrongIds.length === 1 ? "answer" : "answers"}`)}
              </button>
            )}
            <Link
              to={`/topics/${topic.id}`}
              className={buttonClass("ghost", "lg", "w-full sm:w-auto")}
            >
              <BookOpen className="size-4" aria-hidden="true" /> {tr("Aralin", "Lesson")}
            </Link>
          </div>
          {wrongIds.length > 0 && (
            <p className="mt-3 text-xs text-muted">
              {tr(
                "Ang pagsasanay ay hindi nagbabago ng iyong puntos o pinakamataas na iskor.",
                "Practice doesn't change your points or best score.",
              )}
            </p>
          )}
        </div>
      </section>

      {history.length > 0 && (
        <section aria-labelledby="mga-subok" className="mt-10">
          <h2
            id="mga-subok"
            className="font-display text-xl font-semibold text-brown"
          >
            {tr("Mga Nakaraang Subok", "Previous Attempts")}
          </h2>
          <AttemptHistory attempts={history} className="mt-3" />
        </section>
      )}
    </div>
  )
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-stroke bg-surface/60 p-4">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <Icon className="size-3.5" aria-hidden="true" /> {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold text-brown">
        {value}
      </dd>
    </div>
  )
}
