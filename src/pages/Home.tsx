import { ContinueLearning } from "../components/ContinueLearning"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  ClipboardCheck,
  GraduationCap,
  Search,
  UsersRound,
  WifiOff,
  type LucideIcon,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { AltTerm } from "../components/AltTerm"
import { CategoryChip } from "../components/CategoryChip"
import { GradeCard } from "../components/GradeCard"
import { Mascot } from "../components/Logo"
import { Photo, PhotoCredit } from "../components/Photo"
import { SectionHeading } from "../components/SectionHeading"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import {
  CATEGORIES,
  categoryLabel,
  contentStats,
  getDailyChallengeTopic,
  getGrade,
  getTopicsByGrade,
  glossary,
  gradePath,
  grades,
  paragraphs,
  topics,
} from "../data"
import { todayKey } from "../lib/date"
import { usePageTitle } from "../lib/usePageTitle"
import { tr } from "../lib/i18n"

const steps = () => [
  {
    word: tr("Alamin", "Learn"),
    icon: Search,
    title: tr("Hanapin ang paksa", "Find a topic"),
    body: tr(
      "Pumili ayon sa baitang o kategorya, o hanapin ang mismong salitang kailangan mo.",
      "Browse by grade or category, or search for the exact term you need.",
    ),
  },
  {
    word: tr("Aralin", "Study"),
    icon: BookOpenText,
    title: tr("Basahin ang aralin", "Read the lesson"),
    body: tr(
      "Maikli at malinaw na teksto, mahahalagang salita sa gilid, at buod sa dulo para madaling balikan.",
      "Short, clear text, key terms on the side, and a summary at the end for easy review.",
    ),
  },
  {
    word: tr("Tandaan", "Remember"),
    icon: ClipboardCheck,
    title: tr("Subukin ang sarili", "Test yourself"),
    body: tr(
      "Sagutin ang pagsusulit sa bawat aralin at basahin ang paliwanag sa bawat sagot.",
      "Answer each lesson's quiz and read the explanation for every answer.",
    ),
  },
]

const audiences = (): Array<{ icon: LucideIcon; title: string; body: string }> => [
  {
    icon: GraduationCap,
    title: tr("Para sa mag-aaral", "For students"),
    body: tr(
      "Pang-review bago ang pagsusulit, o pagbabasa sa sariling oras. Walang kailangang account.",
      "Review before an exam, or read at your own pace. No account needed.",
    ),
  },
  {
    icon: UsersRound,
    title: tr("Para sa guro", "For teachers"),
    body: tr(
      "Ibahagi ang link ng isang aralin o ng buong baitang bilang dagdag na babasahin sa klase.",
      "Share a link to a lesson or a whole grade as extra reading for class.",
    ),
  },
  {
    icon: WifiOff,
    title: tr("Para sa may mahinang signal", "For weak connections"),
    body: tr(
      "Pagkatapos ng unang pagbisita, mababasa ang mga aralin kahit walang internet.",
      "After your first visit, lessons can be read even without internet.",
    ),
  },
]

/** Picks one vocabulary entry per calendar day so the featured word changes daily. */
function wordOfTheDay(dayKey: string) {
  const n = Number(dayKey.replace(/-/g, ""))
  return glossary[n % glossary.length]
}

export default function Home() {
  usePageTitle("")
  const day = todayKey()
  const featured = getDailyChallengeTopic(day)
  const featuredGrade = getGrade(featured.gradeId)!
  const more = grades
    .map((g) => getTopicsByGrade(g.id).find((t) => t.id !== featured.id))
    .filter((t) => t !== undefined)
  const word = wordOfTheDay(day)

  return (
    <>
      <Hero />
      <ContinueLearning />

      <section
        aria-label={tr("PAMANA sa bilang", "PAMANA in numbers")}
        className="border-y border-stroke bg-card"
      >
        <dl
          className={cx(
            container,
            "grid grid-cols-2 divide-stroke md:grid-cols-4 md:divide-x",
          )}
        >
          {[
            [contentStats.grades, tr("Baitang", "Grades"), tr("Grade 7 hanggang 10", "Grades 7 to 10")],
            [contentStats.lessons, tr("Aralin", "Lessons"), tr("Buong teksto at buod", "Full text and summary")],
            [contentStats.vocabulary, tr("Salita", "Terms"), tr("Sa talahuluganan", "In the glossary")],
            [contentStats.questions, tr("Tanong", "Questions"), tr("May paliwanag bawat isa", "Each with an explanation")],
          ].map(([value, label, hint]) => (
            <div key={label} className="px-2 py-7 md:px-8 md:first:pl-0">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="font-display text-4xl font-semibold text-brown">
                  {value}
                </span>{" "}
                <span className="text-sm font-bold text-brown">{label}</span>
                <span className="mt-1 block text-xs text-muted">{hint}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        id="mga-baitang"
        aria-labelledby="mga-baitang-title"
        className={cx(container, "scroll-mt-20 pt-20")}
      >
        <SectionHeading
          id="mga-baitang-title"
          kicker={tr("Mag-aral ayon sa baitang", "Study by grade")}
          title={tr("Mga Baitang", "Grade Levels")}
          action={
            <Link
              to="/topics"
              className="hidden items-center gap-1 text-sm font-semibold text-brown hover:underline sm:inline-flex"
            >
              {tr("Lahat ng aralin", "All lessons")}{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {grades.map((g) => (
            <li key={g.id}>
              <GradeCard grade={g} topics={getTopicsByGrade(g.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="tampok-title"
        className={cx(container, "pt-24")}
      >
        <SectionHeading
          id="tampok-title"
          kicker={tr("Pinili para ngayong araw", "Picked for today")}
          title={tr("Aralin ng Araw", "Lesson of the Day")}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <article className="group relative">
            <Link to={`/topics/${featured.id}`} className="block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                <Photo
                  image={featured.image}
                  alt=""
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
                <CategoryChip category={featured.category} />
                <span>{featuredGrade.title}</span>
                <span aria-hidden="true">·</span>
                <span>{tr(`${featured.lesson.durationMinutes} minutong basahin`, `${featured.lesson.durationMinutes} min read`)}</span>
              </div>
              <h3 className="mt-3 font-display text-3xl leading-tight font-semibold text-brown group-hover:underline group-hover:decoration-gold group-hover:decoration-2 group-hover:underline-offset-4 sm:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-3 line-clamp-3 max-w-2xl leading-relaxed text-ink/80">
                {paragraphs(featured.lesson.content)[0]}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-gold-ink">
                {tr("Basahin ang aralin", "Read the lesson")}{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
            <PhotoCredit
              image={featured.image}
              className="mt-4 block text-muted"
            />
          </article>

          <div>
            <h3
              className={cx(eyebrow, "border-b border-stroke pb-3 text-muted")}
            >
              {tr("Basahin din", "Also read")}
            </h3>
            <ul className="divide-y divide-stroke">
              {more.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/topics/${t.id}`}
                    className="group flex gap-4 py-5"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                      <Photo image={t.image} alt="" sizes="80px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gold-ink">
                        {getGrade(t.gradeId)!.title} · {categoryLabel(t.category)}
                      </p>
                      <p className="mt-1 font-display text-lg leading-snug font-semibold text-brown group-hover:underline">
                        {t.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {t.lesson.durationMinutes} min
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="kategorya-title"
        className={cx(container, "pt-24")}
      >
        <SectionHeading
          id="kategorya-title"
          kicker={tr("Mag-aral ayon sa paksa", "Study by subject")}
          title={tr("Mga Kategorya", "Categories")}
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const list = topics.filter((t) => t.category === c)
            return (
              <li key={c}>
                <Link
                  to={`/topics?kategorya=${encodeURIComponent(c)}`}
                  className="group flex h-full flex-col rounded-2xl border border-stroke bg-card p-5 transition hover:border-gold/60 hover:bg-surface"
                >
                  <div className="flex items-center justify-between">
                    <CategoryChip category={c} />
                    <ArrowUpRight
                      className="size-4 text-muted transition group-hover:text-brown"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-6 font-display text-3xl font-semibold text-brown">
                    {list.length}
                  </p>
                  <p className="text-xs text-muted">
                    {tr(list.length === 1 ? "aralin" : "na aralin", list.length === 1 ? "lesson" : "lessons")}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-ink/80">
                    {list[0]?.title}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="paano-title" className={cx(container, "pt-24")}>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <p className={cx(eyebrow, "text-gold-ink")}>
              {tr("Alamin. Aralin. Tandaan.", "Learn. Study. Remember.")}
            </p>
            <h2
              id="paano-title"
              className="mt-2 font-display text-3xl font-semibold text-brown sm:text-4xl"
            >
              {tr("Paano gamitin ang PAMANA", "How to use PAMANA")}
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">
              {tr(
                "Bawat aralin ay sumusunod sa parehong ayos, kaya alam mo agad kung saan titingin.",
                "Every lesson follows the same layout, so you always know where to look.",
              )}
            </p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-stroke bg-stroke md:grid-cols-3">
            {steps().map((step, i) => (
              <li key={step.word} className="bg-card p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full bg-espresso text-on-dark">
                    <step.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    className="font-display text-4xl font-semibold text-stroke"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                </div>
                <p className={cx(eyebrow, "mt-6 text-gold-ink")}>{step.word}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-brown">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="salita-title"
        className={cx(container, "pt-24")}
      >
        <div className="banig grid overflow-hidden rounded-3xl bg-espresso text-on-dark lg:grid-cols-[1fr_1.2fr]">
          <div className="p-8 sm:p-12">
            <p className={cx(eyebrow, "text-gold")}>{tr("Salita ng Araw", "Word of the Day")}</p>
            <h2
              id="salita-title"
              className="mt-4 font-display text-5xl font-semibold sm:text-6xl"
            >
              {word.term}
            </h2>
            {word.alt && <AltTerm term={word.alt} className="mt-3 bg-on-dark/10 text-sm text-gold" />}
            <p className="mt-5 max-w-md text-lg leading-relaxed text-on-dark/85">
              {word.definition}
            </p>
            <p className="mt-5 text-sm text-on-dark/60">
              {tr("Mula sa aralin:", "From the lesson:")}{" "}
              <Link
                to={`/topics/${word.topic.id}`}
                className="font-semibold text-on-dark underline-offset-2 hover:underline"
              >
                {word.topic.title}
              </Link>
            </p>
          </div>
          <div className="flex flex-col justify-center gap-6 border-t border-on-dark/10 bg-brown-dark/40 p-8 sm:p-12 lg:border-t-0 lg:border-l">
            <p className="font-display text-2xl leading-snug">
              {tr(
                `${contentStats.vocabulary} mahahalagang salita mula sa lahat ng aralin, nakaayos mula A hanggang Z, may katumbas sa Ingles.`,
                `${contentStats.vocabulary} key terms from every lesson, sorted A to Z, with their original Tagalog.`,
              )}
            </p>
            <Link
              to="/talahuluganan"
              className={buttonClass("gold", "lg", "self-start")}
            >
              {tr("Buksan ang Talahuluganan", "Open the Glossary")}{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="kanino-title"
        className={cx(container, "pt-24")}
      >
        <SectionHeading
          id="kanino-title"
          kicker={tr("Libre at bukas para sa lahat", "Free and open to everyone")}
          title={tr("Para kanino ang PAMANA?", "Who is PAMANA for?")}
        />
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {audiences().map((a) => (
            <li key={a.title} className="border-t-2 border-gold pt-5">
              <a.icon className="size-6 text-gold-ink" aria-hidden="true" />
              <h3 className="mt-3 font-display text-xl font-semibold text-brown">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {a.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="simula-title"
        className={cx(container, "pt-24")}
      >
        <div className="relative overflow-hidden rounded-3xl border border-stroke bg-gold-light px-8 py-12 sm:px-12">
          <Mascot className="absolute -right-4 -bottom-10 hidden w-48 md:block lg:w-56" />
          <h2
            id="simula-title"
            className="max-w-xl font-display text-3xl font-semibold text-brown sm:text-4xl"
          >
            {tr("Simulan sa iyong baitang.", "Start with your grade.")}
          </h2>
          <p className="mt-3 max-w-lg text-ink/80">
            {tr(
              "Pumili ng baitang para makita ang lahat ng aralin nito, mula una hanggang huli.",
              "Choose a grade to see all of its lessons, from first to last.",
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {grades.map((g) => (
              <Link
                key={g.id}
                to={gradePath(g)}
                className={buttonClass("primary", "md")}
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/topics?q=${encodeURIComponent(q)}` : "/topics")
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 size-[34rem] rounded-full bg-gold/10 blur-3xl"
      />
      <div
        className={cx(
          container,
          "relative grid items-center gap-12 pt-10 pb-16 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24",
        )}
      >
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full bg-gold-light px-3.5 py-1.5 text-xs font-bold tracking-[0.14em] text-gold-ink">
            <span
              className="size-1.5 rounded-full bg-gold"
              aria-hidden="true"
            />
            {tr("ARALING PANLIPUNAN · BAITANG 7–10", "SOCIAL STUDIES · GRADES 7–10")}
          </p>
          <h1 className="mt-6 font-display text-[2.9rem] leading-[0.98] font-semibold tracking-tight text-brown sm:text-6xl lg:text-[4.5rem]">
            {tr("Ang ating kasaysayan,", "Our history,")}{" "}
            <span className="text-gold-ink italic">{tr("isang aralin", "one lesson")}</span>{" "}
            {tr("sa bawat pahina.", "on every page.")}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
            {tr(
              "Libreng mga aralin tungkol sa kasaysayan, kultura, heograpiya, at ekonomiks ng Pilipinas at Asya, may talahuluganan at pagsusulit.",
              "Free lessons on the history, culture, geography, and economics of the Philippines and Asia, with a glossary and quizzes.",
            )}
          </p>

          <form
            role="search"
            onSubmit={submit}
            className="mt-8 flex max-w-lg gap-2 rounded-full border border-stroke bg-surface p-1.5 shadow-sm focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30"
          >
            <label className="relative flex-1">
              <span className="sr-only">{tr("Maghanap ng aralin", "Search lessons")}</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr("Hal. Kolonyalismo, Habagat, kakapusan...", "E.g. Colonialism, monsoon, scarcity...")}
                className="h-11 w-full rounded-full bg-transparent pr-3 pl-11 text-sm text-ink outline-none placeholder:text-muted/80"
              />
            </label>
            <button type="submit" className={buttonClass("primary", "md")}>
              {tr("Hanapin", "Search")}
            </button>
          </form>

          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>{tr("O magsimula sa:", "Or start with:")}</span>
            {grades.map((g) => (
              <Link
                key={g.id}
                to={gradePath(g)}
                className="font-semibold text-brown underline decoration-gold/50 decoration-2 underline-offset-4 hover:decoration-gold"
              >
                {g.title}
              </Link>
            ))}
          </p>
        </div>

        <HeroCollage />
      </div>
    </section>
  )
}

function HeroCollage() {
  return (
    <div className="relative mx-auto aspect-[5/6] w-full max-w-md animate-rise [animation-delay:120ms] lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute top-[8%] right-[6%] size-40 rounded-full border-[14px] border-gold/30"
      />
      <div className="absolute top-0 right-0 h-[76%] w-[74%] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(61_42_30/0.6)]">
        <Photo
          image="banaue"
          priority
          sizes="(min-width: 1024px) 420px, 74vw"
        />
      </div>
      <div className="absolute bottom-0 left-0 h-[46%] w-[54%] overflow-hidden rounded-[1.5rem] border-[6px] border-cream shadow-[0_24px_50px_-24px_rgb(61_42_30/0.6)]">
        <Photo image="festival" sizes="(min-width: 1024px) 300px, 54vw" />
      </div>
      <Mascot
        priority
        alt={tr("Ang maskot ng PAMANA, isang batang Philippine Eagle", "The PAMANA mascot, a young Philippine Eagle")}
        className="absolute top-[22%] left-[1%] z-10 w-[38%] drop-shadow-[0_18px_22px_rgb(61_42_30/0.35)] sm:top-[19%]"
      />
      <div className="absolute top-[2%] left-0 z-20 w-[60%] rounded-2xl border border-stroke bg-card px-3.5 py-2.5 shadow-xl sm:w-[46%] sm:px-5 sm:py-4">
        <p className="font-display text-base leading-tight font-semibold text-brown sm:text-xl">
          {tr("Tara, aral tayo!", "Let's learn together!")}
        </p>
        <p className="mt-0.5 text-[0.7rem] text-muted sm:mt-1 sm:text-xs">
          {tr("Grade 7–10 · Araling Panlipunan", "Grades 7–10 · Social Studies")}
        </p>
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-10 size-3 rotate-45 border-r border-b border-stroke bg-card"
        />
      </div>
      <div className="absolute right-[4%] bottom-[8%] rounded-2xl bg-espresso px-4 py-3 text-on-dark shadow-xl">
        <p className="font-display text-2xl leading-none font-semibold">
          {contentStats.questions}
        </p>
        <p className="mt-1 text-[0.65rem] font-bold tracking-[0.14em] text-gold uppercase">
          {tr("Tanong sa Quiz", "Quiz Questions")}
        </p>
      </div>
    </div>
  )
}
