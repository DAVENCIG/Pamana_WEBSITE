import {
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  ClipboardCheck,
  PlayCircle,
  Target,
} from "lucide-react"
import { Link } from "react-router"
import { BadgeGrid } from "../components/Achievements"
import { GradeTabs } from "../components/GradeTabs"
import { CategoryChip } from "../components/CategoryChip"
import { DailyChallengeCard } from "../components/DailyChallengeCard"
import { Photo } from "../components/Photo"
import { ProgressBar } from "../components/ProgressBar"
import { SectionHeading } from "../components/SectionHeading"
import { TopicCard } from "../components/TopicCard"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import { getTopic, getTopicsByGrade } from "../data"
import { currentStreak, getLevel } from "../lib/achievements"
import { formatDateTime } from "../lib/date"
import {
  getActiveQuiz,
  getResumeTopic,
  getTopicProgress,
  useProgress,
} from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"
import { useCurrentGrade } from "../lib/progress"
import { useGradeParam } from "../lib/useGradeParam"
import { tr } from "../lib/i18n"

function greeting(hour: number): string {
  if (hour < 11) return tr("Magandang umaga", "Good morning")
  if (hour < 13) return tr("Magandang tanghali", "Good day")
  if (hour < 18) return tr("Magandang hapon", "Good afternoon")
  return tr("Magandang gabi", "Good evening")
}

export default function Progress() {
  usePageTitle(tr("Aking Progreso", "My Progress"))
  const s = useProgress()
  const fallbackGrade = useCurrentGrade()
  const [paramGrade, setGrade] = useGradeParam()
  const grade = paramGrade ?? fallbackGrade
  const list = getTopicsByGrade(grade.id)
  const resume = getResumeTopic(s, grade.id)
  const resumeProgress = resume ? getTopicProgress(s, resume.id) : undefined
  const resumeQuiz = resume ? getActiveQuiz(s, resume) : undefined

  const read = list.filter((t) => getTopicProgress(s, t.id).lessonRead).length
  const quizzed = list.filter((t) => getTopicProgress(s, t.id).attempts > 0)
  const average = quizzed.length
    ? Math.round(
        quizzed.reduce(
          (sum, t) => sum + getTopicProgress(s, t.id).bestPercent,
          0,
        ) / quizzed.length,
      )
    : 0
  const featured = list.filter((t) => t.id !== resume?.id).slice(0, 6)
  const recent = s.attempts.filter((a) => getTopic(a.topicId)).slice(0, 5)
  const level = getLevel(s.points).level
  const streak = currentStreak(s.activeDays)

  return (
    <div className={cx(container, "py-10 sm:py-12")}>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={cx(eyebrow, "text-gold-ink")}>
            {s.points.toLocaleString("fil-PH")} {tr("Puntos", "Points")} • {level.name}
            {streak > 0 && ` • ${tr(`${streak}-araw na streak`, `${streak}-day streak`)}`} • {grade.title}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brown sm:text-5xl">
            {greeting(new Date().getHours())}, {tr("Mag-aaral", "Learner")}!
          </h1>
          <p className="mt-2 text-muted">
            {tr("Ang iyong progreso ay naka-save sa app na ito sa device na ito lamang.", "Your progress is saved only in this app on this device.")}
          </p>
        </div>
        <GradeTabs value={grade} onChange={setGrade} />
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-12">
          {resume && resumeProgress && (
            <section aria-labelledby="magpatuloy">
              <h2 id="magpatuloy" className="sr-only">
                {tr("Magpatuloy sa Pag-aaral", "Continue Learning")}
              </h2>
              <div className="grid overflow-hidden rounded-3xl border border-stroke bg-card sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-64">
                  {/* Absolutely positioned so the photo fills the card without dictating its height. */}
                  <div className="absolute inset-0">
                    <Photo
                      image={resume.image}
                      alt=""
                      sizes="(min-width: 640px) 360px, 100vw"
                      priority
                    />
                  </div>
                  <CategoryChip
                    category={resume.category}
                    className="absolute top-4 left-4"
                  />
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <p className={cx(eyebrow, "text-gold-ink")}>
                    {s.recentTopicId === resume.id
                      ? tr("Kamakailang Paksa", "Recent Topic")
                      : tr("Magpatuloy sa Pag-aaral", "Continue Learning")}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-snug font-semibold text-brown">
                    {resume.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {resume.description}
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs font-semibold text-muted">
                      <span>
                        {resumeQuiz
                          ? tr(
                              `Quiz: tanong ${resumeQuiz.index + 1} sa ${resumeQuiz.questionIds.length}`,
                              `Quiz: question ${resumeQuiz.index + 1} of ${resumeQuiz.questionIds.length}`,
                            )
                          : tr("Pinakamataas na iskor", "Best score")}
                      </span>
                      <span className="text-brown">
                        {resumeQuiz
                          ? Math.round(
                              (resumeQuiz.answers.length /
                                resumeQuiz.questionIds.length) *
                                100,
                            )
                          : resumeProgress.bestPercent}
                        %
                      </span>
                    </div>
                    <ProgressBar
                      value={
                        resumeQuiz
                          ? (resumeQuiz.answers.length /
                              resumeQuiz.questionIds.length) *
                            100
                          : resumeProgress.bestPercent
                      }
                      label={tr(`Progreso sa ${resume.title}`, `Progress in ${resume.title}`)}
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 sm:mt-auto sm:pt-6">
                    {resumeQuiz ? (
                      <>
                        <Link
                          to={`/quiz/${resume.id}`}
                          className={buttonClass("primary")}
                        >
                          <PlayCircle className="size-4" aria-hidden="true" />{" "}
                          {tr("Ituloy ang Quiz", "Continue Quiz")}
                        </Link>
                        <Link
                          to={`/topics/${resume.id}`}
                          className={buttonClass("outline")}
                        >
                          {tr("Aralin", "Lesson")}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/topics/${resume.id}`}
                          className={buttonClass("primary")}
                        >
                          {tr("Ipagpatuloy", "Continue")}{" "}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to={`/quiz/${resume.id}`}
                          className={buttonClass("outline")}
                        >
                          Quiz
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section aria-labelledby="tampok">
            <SectionHeading
              id="tampok"
              title={tr(`Mga Aralin sa ${grade.title}`, `Lessons in ${grade.title}`)}
              action={
                <Link
                  to={`/baitang/${grade.number}`}
                  className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.14em] text-gold-ink hover:underline"
                >
                  {tr("TINGNAN LAHAT", "VIEW ALL")}{" "}
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            {featured.length > 0 ? (
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {featured.map((t) => (
                  <li key={t.id}>
                    <TopicCard topic={t} progress={getTopicProgress(s, t.id)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-stroke p-6 text-sm text-muted">
                {tr(
                  `Ito pa lamang ang paksa sa ${grade.title}. Subukan ang ibang grade para sa mas maraming aralin.`,
                  `This is the only topic in ${grade.title} so far. Try another grade for more lessons.`,
                )}
              </p>
            )}
          </section>

          <section aria-labelledby="mga-badge">
            <SectionHeading id="mga-badge" title={tr("Mga Badge", "Badges")} />
            <div className="mt-6">
              <BadgeGrid s={s} />
            </div>
          </section>
        </div>

        <aside className="space-y-6" aria-label={tr("Iyong progreso", "Your progress")}>
          <section
            aria-labelledby="progreso"
            className="rounded-3xl border border-stroke bg-card p-6"
          >
            <h2
              id="progreso"
              className="font-display text-lg font-semibold text-brown"
            >
              {tr(`Progreso sa ${grade.title}`, `Progress in ${grade.title}`)}
            </h2>
            <ul className="mt-5 space-y-4">
              <ProgressStat
                icon={BookOpenCheck}
                label={tr("Mga aralin na nabasa", "Lessons read")}
                value={`${read}/${list.length}`}
                pct={(read / Math.max(1, list.length)) * 100}
              />
              <ProgressStat
                icon={ClipboardCheck}
                label={tr("Mga quiz na natapos", "Quizzes completed")}
                value={`${quizzed.length}/${list.length}`}
                pct={(quizzed.length / Math.max(1, list.length)) * 100}
              />
              <ProgressStat
                icon={Target}
                label={tr("Average na pinakamataas na iskor", "Average best score")}
                value={`${average}%`}
                pct={average}
              />
            </ul>
          </section>

          <DailyChallengeCard compact />

          <section
            aria-labelledby="kamakailan"
            className="rounded-3xl border border-stroke bg-card p-6"
          >
            <h2
              id="kamakailan"
              className="font-display text-lg font-semibold text-brown"
            >
              {tr("Kamakailang Pagsusulit", "Recent Quizzes")}
            </h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                {tr(
                  "Wala ka pang natapos na quiz. Ang iyong mga resulta ay lalabas dito.",
                  "You haven't finished a quiz yet. Your results will appear here.",
                )}
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-stroke">
                {recent.map((a) => (
                  <li key={a.id}>
                    <Link
                      to={`/results/${a.id}`}
                      className="group flex items-center gap-3 py-3"
                    >
                      <span
                        className={cx(
                          "grid size-11 shrink-0 place-items-center rounded-full text-xs font-bold",
                          a.percent >= 70
                            ? "bg-success-light text-success"
                            : "bg-gold-light text-gold-ink",
                        )}
                      >
                        {a.percent}%
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-brown group-hover:underline">
                          {getTopic(a.topicId)!.title}
                        </span>
                        <span className="block text-xs text-muted">
                          {a.mode === "practice" && tr("Pagsasanay · ", "Practice · ")}
                          {formatDateTime(a.completedAt)}
                        </span>
                      </span>
                      <ChevronRight
                        className="size-4 text-muted"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}

function ProgressStat({
  icon: Icon,
  label,
  value,
  pct,
}: {
  icon: typeof Target
  label: string
  value: string
  pct: number
}) {
  return (
    <li>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-gold-light text-gold-ink">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="flex-1 text-sm text-muted">{label}</span>
        <span className="font-display text-lg font-semibold text-brown">
          {value}
        </span>
      </div>
      <ProgressBar
        value={pct}
        label={label}
        tone="brown"
        size="sm"
        className="mt-2.5"
      />
    </li>
  )
}
