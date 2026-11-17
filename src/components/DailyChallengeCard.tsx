import { ArrowRight, CircleCheck, Sparkles } from "lucide-react"
import { useId } from "react"
import { Link } from "react-router"
import { getDailyChallengeTopic, getGrade } from "../data"
import { todayKey } from "../lib/date"
import { CHALLENGE_BONUS, useProgress } from "../lib/progress"
import { Photo } from "./Photo"
import { buttonClass, cx, eyebrow } from "./ui"
import { tr } from "../lib/i18n"

export function DailyChallengeCard({ compact = false }: { compact?: boolean }) {
  const s = useProgress()
  const titleId = useId()
  const today = todayKey()
  const topic = getDailyChallengeTopic(today)
  const done = s.challengeCompletedOn === today
  const grade = getGrade(topic.gradeId)

  return (
    <section
      aria-labelledby={titleId}
      className={cx(
        "banig relative overflow-hidden rounded-3xl bg-espresso text-on-dark",
        compact ? "p-6" : "grid md:grid-cols-[1.4fr_1fr]",
      )}
    >
      <div className={cx("relative z-10", !compact && "p-7 sm:p-9")}>
        <p
          className={cx(eyebrow, "inline-flex items-center gap-1.5 text-gold")}
        >
          <Sparkles className="size-3.5" aria-hidden="true" /> {tr("Hamon ng Araw", "Daily Challenge")}
        </p>
        <h2
          id={titleId}
          className={cx(
            "mt-3 font-display font-semibold",
            compact ? "text-xl" : "text-3xl sm:text-4xl",
          )}
        >
          {tr("Balikan ang ating Kasaysayan", "Revisit Our History")}
        </h2>
        <p className="mt-2 text-sm text-on-dark/80">
          {grade?.title} ·{" "}
          <span className="font-semibold text-on-dark">{topic.title}</span>
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-on-dark/75">
          {done
            ? tr(
                "Natapos mo na ang hamon ngayong araw. Bumalik bukas para sa bagong hamon!",
                "You've finished today's challenge. Come back tomorrow for a new one!",
              )
            : tr(
                `Tapusin ang pagsusulit ngayon para makakuha ng +${CHALLENGE_BONUS} bonus points!`,
                `Finish the quiz today to earn +${CHALLENGE_BONUS} bonus points!`,
              )}
        </p>
        <div className="mt-6">
          {done ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-on-dark/10 px-4 py-2 text-sm font-semibold">
              <CircleCheck className="size-4 text-gold" aria-hidden="true" />{" "}
              {tr("Natapos ngayong araw", "Completed today")}
            </span>
          ) : (
            <Link
              to={`/quiz/${topic.id}`}
              className={buttonClass("gold", compact ? "md" : "lg")}
            >
              {tr("Simulan Na", "Start Now")} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      {!compact && (
        <div className="relative hidden md:block">
          <div className="absolute inset-0">
            <Photo image={topic.image} alt="" sizes="400px" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/30 to-transparent" />
        </div>
      )}
    </section>
  )
}
