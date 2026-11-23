import { ArrowRight, BookOpen, Flame, ListChecks, Star } from "lucide-react"
import { Link } from "react-router"
import { getDailyChallengeTopic, getTopic, topics } from "../data"
import { currentStreak, getLevel } from "../lib/achievements"
import { todayKey } from "../lib/date"
import { tr } from "../lib/i18n"
import { CHALLENGE_BONUS, getActiveQuiz, getTopicProgress, useProgress } from "../lib/progress"
import { buttonClass, container, cx, eyebrow } from "./ui"

/**
 * Returning-learner dashboard strip on Home. Everything shown is read from saved progress;
 * a first-time visitor (no activity yet) sees nothing here rather than empty or made-up numbers.
 */
export function ContinueLearning() {
  const s = useProgress()
  const today = todayKey()

  const readCount = topics.filter((t) => getTopicProgress(s, t.id).lessonRead).length
  const hasActivity = readCount > 0 || s.attempts.length > 0 || Object.keys(s.activeQuizzes).length > 0
  if (!hasActivity) return null

  const unfinished = topics
    .map((t) => ({ topic: t, quiz: getActiveQuiz(s, t) }))
    .filter((x) => x.quiz)
  const recent = getTopic(s.recentTopicId)
  const quizzed = topics.filter((t) => getTopicProgress(s, t.id).attempts > 0)
  const average = quizzed.length
    ? Math.round(quizzed.reduce((sum, t) => sum + getTopicProgress(s, t.id).bestPercent, 0) / quizzed.length)
    : null
  const level = getLevel(s.points)
  const streak = currentStreak(s.activeDays)
  const challenge = getDailyChallengeTopic(today)
  const challengeDone = s.challengeCompletedOn === today

  const stats: Array<[string, string]> = [
    [s.points.toLocaleString("fil-PH"), tr("Puntos", "Points")],
    [`${level.level.index + 1}`, tr("Antas", "Level")],
    [`${readCount}`, tr("Nabasang aralin", "Lessons read")],
    [`${s.attempts.length}`, tr("Subok sa quiz", "Quiz attempts")],
    [average === null ? "—" : `${average}%`, tr("Karaniwang iskor", "Average score")],
  ]

  return (
    <section aria-labelledby="magpatuloy-title" className={cx(container, "pt-10")}>
      <p className={cx(eyebrow, "text-gold-ink")}>{tr("Maligayang pagbabalik", "Welcome back")}</p>
      <h2 id="magpatuloy-title" className="mt-1 font-display text-2xl font-semibold text-brown sm:text-3xl">
        {tr("Magpatuloy sa pag-aaral", "Continue learning")}
      </h2>

      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {unfinished.slice(0, 2).map(({ topic, quiz }) => (
          <li key={topic.id}>
            <Link
              to={`/quiz/${topic.id}`}
              className="flex h-full items-center gap-4 rounded-2xl border border-gold/50 bg-gold-light p-4 transition hover:border-gold"
            >
              <ListChecks className="size-6 shrink-0 text-gold-ink" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-gold-ink">
                  {tr("Ituloy ang quiz", "Resume quiz")} · {quiz!.index + 1}/{quiz!.questionIds.length}
                </span>
                <span className="block truncate font-semibold text-brown">{topic.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-brown" aria-hidden="true" />
            </Link>
          </li>
        ))}
        {recent && (
          <li>
            <Link
              to={`/topics/${recent.id}`}
              className="flex h-full items-center gap-4 rounded-2xl border border-stroke bg-card p-4 transition hover:border-gold/60"
            >
              <BookOpen className="size-6 shrink-0 text-gold-ink" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-muted">{tr("Huling binuksan", "Last opened")}</span>
                <span className="block truncate font-semibold text-brown">{recent.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-brown" aria-hidden="true" />
            </Link>
          </li>
        )}
      </ul>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stroke bg-stroke sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-card px-4 py-4">
            <dd className="font-display text-2xl font-semibold text-brown">{value}</dd>
            <dt className="text-xs text-muted">{label}</dt>
          </div>
        ))}
        <div className="bg-card px-4 py-4">
          <dd className="inline-flex items-center gap-1 font-display text-2xl font-semibold text-brown">
            <Flame className={cx("size-5", streak > 0 ? "text-gold" : "text-muted/50")} aria-hidden="true" />
            {streak}
          </dd>
          <dt className="text-xs text-muted">{tr("Araw na sunod-sunod", "Day streak")}</dt>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-stroke bg-card p-4">
        <Star className="size-5 text-gold-ink" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm text-ink">
          <span className="font-semibold text-brown">{tr("Hamon ng Araw", "Daily Challenge")}:</span>{" "}
          {challengeDone
            ? tr("Tapos na ngayon. Magaling!", "Completed today. Well done!")
            : tr(`${challenge.title} · +${CHALLENGE_BONUS} bonus na puntos`, `${challenge.title} · +${CHALLENGE_BONUS} bonus points`)}
        </p>
        {!challengeDone && (
          <Link to={`/quiz/${challenge.id}`} className={buttonClass("gold", "sm")}>
            {tr("Simulan", "Start")}
          </Link>
        )}
      </div>
    </section>
  )
}
