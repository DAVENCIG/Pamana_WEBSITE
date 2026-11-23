import {
  ChevronRight,
  FileText,
  Mail,
  RotateCcw,
  Share2,
  ShieldCheck,
  Star,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { ConfirmDialog, Dialog } from "../components/Dialog"
import { FullLogo } from "../components/Logo"
import { useToast } from "../components/Toast"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import { contentStats, topics, type ImageKey } from "../data"
import { photoAlt, photos } from "../data/images"
import { isProgressPersistent, progress, useProgress } from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"
import { tr } from "../lib/i18n"

const FEEDBACK_EMAIL = "team.owli@pamana.edu.ph"
const shareText = () =>
  tr(
    "Mag-aral ng Araling Panlipunan kahit offline gamit ang PAMANA: libreng aralin para sa Grade 7–10! Alamin. Aralin. Tandaan.",
    "Study Social Studies even offline with PAMANA: free lessons for Grades 7–10! Learn. Study. Remember.",
  )

type Panel = "privacy" | "terms" | "rate" | "reset" | null

export default function About() {
  usePageTitle(tr("Tungkol sa PAMANA", "About PAMANA"))
  const s = useProgress()
  const toast = useToast()
  const [panel, setPanel] = useState<Panel>(null)
  const [stars, setStars] = useState(s.rating ?? 0)
  const persistent = isProgressPersistent()
  const lessonsRead = Object.values(s.topics).filter((t) => t.lessonRead).length
  const quizzesTaken = Object.values(s.topics).filter(
    (t) => t.attempts > 0,
  ).length

  const share = async () => {
    const url = window.location.origin + import.meta.env.BASE_URL
    if (navigator.share) {
      try {
        await navigator.share({
          title: tr("Subukan ang PAMANA!", "Try PAMANA!"),
          text: shareText(),
          url,
        })
      } catch {
        // The learner closed the share sheet.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(`${shareText()} ${url}`)
      toast(tr("Nakopya ang link. I-paste ito para ibahagi sa mga kaibigan!", "Link copied. Paste it to share with friends!"))
    } catch {
      toast(tr(`Ibahagi ang link na ito: ${url}`, `Share this link: ${url}`), "info")
    }
  }

  const openRating = () => {
    setStars(s.rating ?? 0)
    setPanel("rate")
  }

  return (
    <div className={cx(container, "py-10 sm:py-14")}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <header>
            <FullLogo className="w-36 sm:w-44" />
            <p className={cx(eyebrow, "mt-6 text-gold-ink")}>
              {tr("Bersyon", "Version")} 1.0.0 · 100% Offline Edition
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-brown sm:text-5xl">
              {tr("Tungkol sa PAMANA", "About PAMANA")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">
              {tr(
                "Ang PAMANA ay isang libreng educational app para sa mga mag-aaral ng Pilipinas. Tuklasin ang yaman ng ating kultura, kasaysayan, at panitikan sa pamamagitan ng mga masasayang aralin at pagsusulit.",
                "PAMANA is a free educational app for Filipino students. Discover the richness of our culture, history, and literature through engaging lessons and quizzes.",
              )}
            </p>
            <p className="mt-3 max-w-xl text-muted">
              {tr("Para sa Araling Panlipunan ng Baitang 7 hanggang 10.", "For Social Studies (Araling Panlipunan), Grades 7 to 10.")}
            </p>
          </header>

          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [contentStats.lessons, tr("Aralin", "Lessons")],
              [contentStats.questions, tr("Quiz", "Questions")],
              [contentStats.vocabulary, tr("Salita", "Terms")],
              [contentStats.grades, tr("Grade", "Grades")],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-stroke bg-card px-4 py-5 text-center"
              >
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-semibold text-brown">
                    {value}
                  </span>
                  <span
                    className={cx(eyebrow, "text-muted")}
                    aria-hidden="true"
                  >
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <section
            aria-labelledby="iyong-progreso"
            className="mt-10 rounded-3xl border border-stroke bg-card p-6"
          >
            <h2
              id="iyong-progreso"
              className="font-display text-lg font-semibold text-brown"
            >
              {tr("Ang iyong progreso sa app na ito", "Your progress in this app")}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {tr(
                `${s.points.toLocaleString("fil-PH")} puntos · ${lessonsRead} sa ${topics.length} na aralin ang nabasa · ${quizzesTaken} na quiz ang natapos`,
                `${s.points.toLocaleString("fil-PH")} points · ${lessonsRead} of ${topics.length} lessons read · ${quizzesTaken} quizzes completed`,
              )}
            </p>
            {!persistent && (
              <p className="mt-4 flex gap-2 rounded-xl bg-error-light p-3 text-sm text-error">
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                {tr(
                  "Hindi ma-save ng PAMANA ang iyong progreso (maaaring naka-private mode). Mawawala ito kapag isinara ang app.",
                  "PAMANA can't save your progress (the app may be in private mode). It will be lost when you close the app.",
                )}
              </p>
            )}
            <button
              type="button"
              className={buttonClass("dangerOutline", "sm", "mt-5")}
              onClick={() => setPanel("reset")}
            >
              <RotateCcw className="size-4" aria-hidden="true" />{" "}
              {tr("I-reset ang Progreso", "Reset Progress")}
            </button>
          </section>
        </div>

        <div>
          <nav
            aria-label={tr("Mga opsyon", "Options")}
            className="overflow-hidden rounded-3xl border border-stroke bg-card"
          >
            <ul className="divide-y divide-stroke">
              <ActionRow
                icon={ShieldCheck}
                label="Privacy Policy"
                onClick={() => setPanel("privacy")}
              />
              <ActionRow
                icon={FileText}
                label="Terms of Service"
                onClick={() => setPanel("terms")}
              />
              <ActionRow
                icon={Star}
                label={tr("I-rate ang PAMANA", "Rate PAMANA")}
                hint={s.rating ? tr(`${s.rating} sa 5 bituin`, `${s.rating} of 5 stars`) : undefined}
                onClick={openRating}
              />
              <ActionRow
                icon={Mail}
                label={tr("Magpadala ng Feedback", "Send Feedback")}
                hint={FEEDBACK_EMAIL}
                href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("Feedback sa PAMANA")}`}
              />
              <ActionRow
                icon={Share2}
                label={tr("Ibahagi sa mga Kaibigan", "Share with Friends")}
                onClick={share}
              />
            </ul>
          </nav>

          <section
            id="mga-larawan"
            aria-labelledby="larawan-title"
            className="mt-8 rounded-3xl border border-stroke bg-card p-6"
          >
            <h2
              id="larawan-title"
              className="font-display text-lg font-semibold text-brown"
            >
              {tr("Mga Larawan", "Photos")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {tr("Mula sa Unsplash. Maraming salamat sa mga potograpo.", "From Unsplash. Many thanks to the photographers.")}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {(Object.keys(photos) as ImageKey[]).map((key) => (
                <li
                  key={key}
                  className="flex flex-wrap justify-between gap-x-3"
                >
                  <span className="text-ink/85">{photoAlt(key)}</span>
                  <a
                    href={photos[key].creditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-gold-ink hover:underline"
                  >
                    {photos[key].credit}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-center text-[0.7rem] font-bold tracking-[0.2em] text-muted">
            {tr("PAMANA PARA SA MGA MAG-AARAL", "PAMANA FOR STUDENTS")}
          </p>
          <p className="mt-1 text-center text-xs text-muted">
            {tr("Binuo ng Team OWLI", "Built by Team OWLI")}
          </p>
        </div>
      </div>

      <Dialog
        open={panel === "privacy"}
        onClose={() => setPanel(null)}
        title="Privacy Policy"
        icon={<ShieldCheck className="size-5" aria-hidden="true" />}
      >
        <div className="space-y-3">
          <p>
            {tr(
              "Ang PAMANA ay isang offline-first na educational app. Hindi kami nangongolekta ng anumang personal na impormasyon o lokasyon mula sa iyong device.",
              "PAMANA is an offline-first educational app. We do not collect personal information or location from your device.",
            )}
          </p>
          <p>
            {tr(
              "Lahat ng iyong progreso sa pag-aaral (napiling grade, wika, puntos, at resulta ng quiz) ay nakaimbak lamang sa app na ito sa device na ito at hindi ipinapadala sa server. Kapag gumamit ka ng AI Buddy, ipinapadala ang mga tanong mo sa PAMANA server at OpenAI para makabuo ng sagot. Maaaring hindi lumabas sa ibang device o kopya ng app ang iyong progreso. Maaari mo itong burahin anumang oras gamit ang “I-reset ang Progreso.”",
              "Your learning progress (selected grade, language, points, and quiz results) is stored only in this app on this device and is never sent to a server. If you use AI Buddy, your questions are sent to PAMANA's server and OpenAI to generate replies. Your progress may not appear on another device or app installation. You can erase it anytime with “Reset Progress.”",
            )}
          </p>
          <p className="text-muted">
            {tr(
              "Ang mga larawan at font ay kinukuha mula sa Unsplash at Google Fonts sa unang pagbisita, at pagkatapos ay itinatago para magamit offline.",
              "Photos and fonts are loaded from Unsplash and Google Fonts on your first visit, then stored for offline use.",
            )}
          </p>
        </div>
      </Dialog>

      <Dialog
        open={panel === "terms"}
        onClose={() => setPanel(null)}
        title="Terms of Service"
        icon={<FileText className="size-5" aria-hidden="true" />}
      >
        <p>
          {tr(
            "Ang app na ito ay dinisenyo at binuo para sa mga mag-aaral ng Baitang 7 hanggang 10 sa ilalim ng kurikulum ng Araling Panlipunan ng Kagawaran ng Edukasyon (DepEd). Ang nilalaman ay libreng magagamit para sa pansariling pag-aaral at edukasyon nang walang kinakailangang koneksyon sa internet.",
            "This app was designed and built for Grade 7 to 10 students under the Araling Panlipunan (Social Studies) curriculum of the Department of Education (DepEd). The content is free to use for personal study and education, with no internet connection required.",
          )}
        </p>
      </Dialog>

      <Dialog
        open={panel === "rate"}
        onClose={() => setPanel(null)}
        title={tr("I-rate ang PAMANA", "Rate PAMANA")}
        icon={<Star className="size-5" aria-hidden="true" />}
        actions={
          <>
            <button
              type="button"
              className={buttonClass("outline")}
              onClick={() => setPanel(null)}
            >
              {tr("Mamaya na", "Later")}
            </button>
            <button
              type="button"
              className={buttonClass("primary")}
              disabled={stars === 0}
              onClick={() => {
                progress.setRating(stars)
                setPanel(null)
                toast(tr("Salamat sa pagsuporta at pagmamahal sa PAMANA!", "Thank you for supporting PAMANA!"))
              }}
            >
              {tr("Isumite", "Submit")}
            </button>
          </>
        }
      >
        <p>
          {tr(
            "Gaano mo kagusto ang PAMANA? Ang iyong rating ay nakatago lamang sa device na ito.",
            "How much do you like PAMANA? Your rating is stored only on this device.",
          )}
        </p>
        <div
          role="radiogroup"
          aria-label="Rating"
          className="mt-5 flex justify-center gap-1"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} ${tr("bituin", n === 1 ? "star" : "stars")}`}
              onClick={() => setStars(n)}
              className="rounded-full p-1.5 transition hover:scale-110"
            >
              <Star
                className={cx(
                  "size-9",
                  n <= stars ? "fill-gold text-gold" : "text-stroke",
                )}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </Dialog>

      <ConfirmDialog
        open={panel === "reset"}
        onClose={() => setPanel(null)}
        onConfirm={() => {
          progress.reset()
          toast(tr("Na-reset na ang iyong progreso.", "Your progress has been reset."), "info")
        }}
        destructive
        icon={<TriangleAlert className="size-5" aria-hidden="true" />}
        title={tr("I-reset ang progreso?", "Reset progress?")}
        message={tr(
          "Mabubura ang iyong puntos, napiling grade, mga nabasang aralin, at lahat ng resulta ng quiz sa app na ito. Hindi na ito maibabalik.",
          "Your points, selected grade, lessons read, and all quiz results in this app will be erased. This can't be undone.",
        )}
        cancelLabel={tr("Huwag", "Cancel")}
        confirmLabel={tr("I-reset", "Reset")}
      />
    </div>
  )
}

interface ActionRowProps {
  icon: LucideIcon
  label: string
  hint?: string
  onClick?: () => void
  href?: string
}

function ActionRow({ icon: Icon, label, hint, onClick, href }: ActionRowProps) {
  const inner = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-light text-gold-ink">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-brown">{label}</span>
        {hint && (
          <span className="block truncate text-xs text-muted">{hint}</span>
        )}
      </span>
      <ChevronRight className="size-5 text-muted" aria-hidden="true" />
    </>
  )
  const cls =
    "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
  return (
    <li>
      {href ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </li>
  )
}
