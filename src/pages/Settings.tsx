import {
  Check,
  Download,
  HardDrive,
  Languages,
  ListChecks,
  Monitor,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  Trash2,
  TriangleAlert,
  Type,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { useRef, useState, type ReactNode } from "react"
import { Link } from "react-router"
import { ConfirmDialog } from "../components/Dialog"
import { Switch } from "../components/Switch"
import { useToast } from "../components/Toast"
import { buttonClass, container, cx, eyebrow } from "../components/ui"
import { todayKey } from "../lib/date"
import { setLang, tr, useLang, type Lang } from "../lib/i18n"
import {
  resetPreferences,
  setPreference,
  usePreferences,
  type TextSize,
  type Theme,
} from "../lib/preferences"
import { isProgressPersistent, progress, useProgress } from "../lib/progress"
import { usePageTitle } from "../lib/usePageTitle"

type Confirm = "progress" | "everything" | "cache" | null

const SECTIONS = () => [
  { id: "wika", label: tr("Wika", "Language") },
  { id: "hitsura", label: tr("Hitsura", "Appearance") },
  { id: "pagsusulit", label: tr("Pagsusulit", "Quizzes") },
  { id: "datos", label: tr("Datos at Privacy", "Data & Privacy") },
]

export default function Settings() {
  usePageTitle(tr("Mga Setting", "Settings"))
  const { lang } = useLang()
  const prefs = usePreferences()
  const s = useProgress()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const persistent = isProgressPersistent()
  const attempts = s.attempts.length
  const lessonsRead = Object.values(s.topics).filter((t) => t.lessonRead).length

  const downloadBackup = () => {
    const blob = new Blob([progress.exportBackup()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pamana-progreso-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast(tr("Na-download ang backup ng iyong progreso.", "Your progress backup was downloaded."))
  }

  const restoreBackup = async (file: File) => {
    const ok = progress.importBackup(await file.text())
    toast(
      ok
        ? tr("Naibalik ang iyong progreso mula sa backup.", "Your progress was restored from the backup.")
        : tr("Hindi ito wastong backup file ng PAMANA.", "That isn't a valid PAMANA backup file."),
      ok ? "success" : "info",
    )
  }

  const clearOfflineFiles = async () => {
    try {
      if ("caches" in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
      const regs = (await navigator.serviceWorker?.getRegistrations()) ?? []
      await Promise.all(regs.map((r) => r.unregister()))
      toast(
        tr(
          "Nabura ang mga offline file. Muling ise-save ang mga ito sa susunod na pagbisita.",
          "Offline files cleared. They'll be saved again on your next visit.",
        ),
        "info",
      )
    } catch {
      toast(tr("Hindi mabura ang mga offline file sa browser na ito.", "Offline files couldn't be cleared in this browser."), "info")
    }
  }

  const resetEverything = () => {
    progress.reset()
    resetPreferences()
    setLang("tl")
    toast(tr("Nabura ang lahat ng datos at setting.", "All data and settings were erased."), "info")
  }

  return (
    <div className={cx(container, "py-12 sm:py-16")}>
      <header className="max-w-2xl">
        <p className={cx(eyebrow, "text-gold-ink")}>PAMANA</p>
        <h1 className="mt-2 font-display text-[2.6rem] font-semibold text-brown sm:text-6xl">
          {tr("Mga Setting", "Settings")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          {tr(
            "Iangkop ang PAMANA sa paraang pinakakomportable sa iyo. Awtomatikong nase-save ang mga pagbabago sa browser na ito.",
            "Make PAMANA work the way that's most comfortable for you. Changes are saved automatically in this browser.",
          )}
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label={tr("Mga seksyon", "Sections")} className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-stroke">
            {SECTIONS().map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm font-semibold text-muted hover:border-gold hover:text-brown"
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-14">
          <Section
            id="wika"
            icon={Languages}
            title={tr("Wika", "Language")}
            description={tr(
              "Nagbabago ang buong website, kasama ang mga aralin, pagsusulit, at talahuluganan.",
              "Changes the whole website, including lessons, quizzes, and the glossary.",
            )}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { value: "tl", title: "Tagalog", hint: tr("Orihinal na wika ng mga aralin", "The lessons' original language") },
                  { value: "en", title: "English", hint: tr("Isinalin sa Ingles", "Translated into English") },
                ] as Array<{ value: Lang; title: string; hint: string }>
              ).map((o) => (
                <OptionCard
                  key={o.value}
                  selected={lang === o.value}
                  onSelect={() => setLang(o.value)}
                  title={o.title}
                  hint={o.hint}
                  lang={o.value}
                  name="wika"
                />
              ))}
            </div>
            <Row>
              <Switch
                checked={prefs.showAltTerms}
                onChange={(v) => setPreference("showAltTerms", v)}
                label={tr("Ipakita ang katumbas na termino", "Show term equivalents")}
                description={tr(
                  "Ipinapakita ang katumbas sa Ingles ng bawat mahalagang salita, hal. Habagat · Southwest Monsoon.",
                  "Shows the original Tagalog of each key term, e.g. Southwest Monsoon · Habagat.",
                )}
              />
            </Row>
          </Section>

          <Section
            id="hitsura"
            icon={Sun}
            title={tr("Hitsura", "Appearance")}
            description={tr("Kulay ng website, laki ng teksto, at galaw.", "Website colors, text size, and motion.")}
          >
            <Field label={tr("Tema", "Theme")} icon={Moon}>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "system", icon: Monitor, title: tr("Sistema", "System") },
                    { value: "light", icon: Sun, title: tr("Maliwanag", "Light") },
                    { value: "dark", icon: Moon, title: tr("Madilim", "Dark") },
                  ] as Array<{ value: Theme; icon: LucideIcon; title: string }>
                ).map((o) => (
                  <OptionCard
                    key={o.value}
                    selected={prefs.theme === o.value}
                    onSelect={() => setPreference("theme", o.value)}
                    title={o.title}
                    icon={o.icon}
                    name="tema"
                    compact
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                {tr(
                  "Sinusunod ng “Sistema” ang setting ng iyong device.",
                  "“System” follows your device's setting.",
                )}
              </p>
            </Field>

            <Field label={tr("Laki ng teksto", "Text size")} icon={Type}>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "normal", title: tr("Karaniwan", "Default"), sample: "text-base" },
                    { value: "large", title: tr("Malaki", "Large"), sample: "text-lg" },
                    { value: "xlarge", title: tr("Mas malaki", "Larger"), sample: "text-xl" },
                  ] as Array<{ value: TextSize; title: string; sample: string }>
                ).map((o) => (
                  <OptionCard
                    key={o.value}
                    selected={prefs.textSize === o.value}
                    onSelect={() => setPreference("textSize", o.value)}
                    title={o.title}
                    name="laki"
                    compact
                    leading={<span className={cx("font-display font-semibold text-brown", o.sample)}>Aa</span>}
                  />
                ))}
              </div>
            </Field>

            <Row>
              <Switch
                checked={prefs.reduceMotion}
                onChange={(v) => setPreference("reduceMotion", v)}
                label={tr("Bawasan ang galaw", "Reduce motion")}
                description={tr(
                  "Tinatanggal ang mga animation at transition sa buong website.",
                  "Turns off animations and transitions across the website.",
                )}
              />
            </Row>
          </Section>

          <Section
            id="pagsusulit"
            icon={ListChecks}
            title={tr("Pagsusulit", "Quizzes")}
            description={tr("Kung paano ipinapakita ang mga tanong.", "How questions are presented.")}
          >
            <Row>
              <Switch
                checked={s.quizSettings.shuffle}
                onChange={(v) => progress.setShuffle(v)}
                label={tr("Haluin ang mga tanong at pagpipilian", "Shuffle questions and choices")}
                description={tr(
                  "Iba ang pagkakasunod-sunod bawat subok para hindi lang maalala ang puwesto ng sagot.",
                  "The order changes every attempt so you don't just memorize where the answer is.",
                )}
              />
            </Row>
          </Section>

          <Section
            id="datos"
            icon={ShieldCheck}
            title={tr("Datos at Privacy", "Data & Privacy")}
            description={tr(
              "Walang account at walang ipinapadala sa server. Lahat ng datos ay nasa browser na ito lamang.",
              "No account and nothing is sent to a server. All data stays in this browser only.",
            )}
          >
            <div className="rounded-2xl border border-stroke bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <HardDrive className="size-4 text-gold-ink" aria-hidden="true" />
                {tr("Nakatagong datos", "Stored data")}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  [s.points.toLocaleString("fil-PH"), tr("puntos", "points")],
                  [lessonsRead, tr("aralin na nabasa", "lessons read")],
                  [attempts, tr("subok sa quiz", "quiz attempts")],
                ].map(([v, l]) => (
                  <div key={String(l)} className="rounded-xl bg-cream px-2 py-3">
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="block font-display text-2xl font-semibold text-brown">{v}</span>
                      <span className="text-xs text-muted">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              {!persistent && (
                <p className="mt-4 flex gap-2 rounded-xl bg-error-light p-3 text-sm text-error">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {tr(
                    "Hindi ma-save ng browser ang iyong progreso (maaaring naka-private mode). Mag-download ng backup bago isara ang tab.",
                    "Your browser can't save your progress (it may be in private mode). Download a backup before closing the tab.",
                  )}
                </p>
              )}
            </div>

            <ul className="divide-y divide-stroke overflow-hidden rounded-2xl border border-stroke">
              <ActionRow
                icon={Download}
                title={tr("I-download ang backup", "Download a backup")}
                description={tr(
                  "I-save ang iyong progreso bilang file para mailipat sa ibang device o browser.",
                  "Save your progress as a file to move it to another device or browser.",
                )}
                action={
                  <button type="button" className={buttonClass("outline", "sm")} onClick={downloadBackup}>
                    {tr("I-download", "Download")}
                  </button>
                }
              />
              <ActionRow
                icon={Upload}
                title={tr("Ibalik mula sa backup", "Restore from a backup")}
                description={tr(
                  "Papalitan ng file ang kasalukuyang progreso sa browser na ito.",
                  "The file replaces the current progress in this browser.",
                )}
                action={
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/json,.json"
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden="true"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) void restoreBackup(file)
                        e.target.value = ""
                      }}
                    />
                    <button type="button" className={buttonClass("outline", "sm")} onClick={() => fileRef.current?.click()}>
                      {tr("Pumili ng file", "Choose file")}
                    </button>
                  </>
                }
              />
              <ActionRow
                icon={HardDrive}
                title={tr("Burahin ang mga offline file", "Clear offline files")}
                description={tr(
                  "Tinatanggal ang naka-save na mga larawan at pahina para sa offline. Hindi nito binubura ang progreso.",
                  "Removes saved photos and pages used offline. This doesn't erase your progress.",
                )}
                action={
                  <button type="button" className={buttonClass("outline", "sm")} onClick={() => setConfirm("cache")}>
                    {tr("Burahin", "Clear")}
                  </button>
                }
              />
              <ActionRow
                icon={RotateCcw}
                title={tr("I-reset ang progreso", "Reset progress")}
                description={tr(
                  "Binubura ang puntos, badge, nabasang aralin, at resulta ng quiz. Mananatili ang mga setting.",
                  "Erases points, badges, lessons read, and quiz results. Your settings stay.",
                )}
                action={
                  <button type="button" className={buttonClass("dangerOutline", "sm")} onClick={() => setConfirm("progress")}>
                    {tr("I-reset", "Reset")}
                  </button>
                }
              />
              <ActionRow
                icon={Trash2}
                title={tr("Burahin ang lahat ng datos", "Erase all data")}
                description={tr(
                  "Binubura ang progreso at ibinabalik sa orihinal ang lahat ng setting, kasama ang wika at tema.",
                  "Erases progress and restores every setting to its default, including language and theme.",
                )}
                action={
                  <button type="button" className={buttonClass("danger", "sm")} onClick={() => setConfirm("everything")}>
                    {tr("Burahin lahat", "Erase all")}
                  </button>
                }
              />
            </ul>
            <p className="text-xs text-muted">
              {tr("Basahin ang ", "Read the ")}
              <Link to="/about" className="font-semibold text-gold-ink hover:underline">
                {tr("Privacy Policy sa Tungkol sa PAMANA", "Privacy Policy on About PAMANA")}
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "cache"}
        onClose={() => setConfirm(null)}
        onConfirm={() => void clearOfflineFiles()}
        icon={<HardDrive className="size-5" aria-hidden="true" />}
        title={tr("Burahin ang mga offline file?", "Clear offline files?")}
        message={tr(
          "Kakailanganin ng internet para muling mabuksan ang mga larawan at pahina.",
          "You'll need internet to load photos and pages again.",
        )}
        cancelLabel={tr("Huwag", "Cancel")}
        confirmLabel={tr("Burahin", "Clear")}
      />
      <ConfirmDialog
        open={confirm === "progress"}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          progress.reset()
          toast(tr("Na-reset na ang iyong progreso.", "Your progress has been reset."), "info")
        }}
        destructive
        icon={<TriangleAlert className="size-5" aria-hidden="true" />}
        title={tr("I-reset ang progreso?", "Reset progress?")}
        message={tr(
          "Mabubura ang iyong puntos, badge, mga nabasang aralin, at lahat ng resulta ng quiz. Hindi na ito maibabalik.",
          "Your points, badges, lessons read, and all quiz results will be erased. This can't be undone.",
        )}
        cancelLabel={tr("Huwag", "Cancel")}
        confirmLabel={tr("I-reset", "Reset")}
      />
      <ConfirmDialog
        open={confirm === "everything"}
        onClose={() => setConfirm(null)}
        onConfirm={resetEverything}
        destructive
        icon={<Trash2 className="size-5" aria-hidden="true" />}
        title={tr("Burahin ang lahat ng datos?", "Erase all data?")}
        message={tr(
          "Mabubura ang lahat ng progreso at babalik sa orihinal ang lahat ng setting. Hindi na ito maibabalik.",
          "All progress will be erased and every setting restored to its default. This can't be undone.",
        )}
        cancelLabel={tr("Huwag", "Cancel")}
        confirmLabel={tr("Burahin lahat", "Erase all")}
      />
    </div>
  )
}

function Section({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="flex items-start gap-4 border-b border-stroke pb-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-light text-gold-ink">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id={`${id}-title`} className="font-display text-2xl font-semibold text-brown">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  )
}

function Field({ label, icon: Icon, children }: { label: string; icon?: LucideIcon; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        {Icon && <Icon className="size-4 text-muted" aria-hidden="true" />}
        {label}
      </legend>
      {children}
    </fieldset>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-stroke bg-card p-5">{children}</div>
}

function OptionCard({
  selected,
  onSelect,
  title,
  hint,
  icon: Icon,
  leading,
  lang,
  name,
  compact = false,
}: {
  selected: boolean
  onSelect: () => void
  title: string
  hint?: string
  icon?: LucideIcon
  leading?: ReactNode
  lang?: string
  name: string
  compact?: boolean
}) {
  return (
    <label
      className={cx(
        "relative flex cursor-pointer rounded-2xl border bg-card transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold",
        compact ? "flex-col items-center gap-2 px-3 py-4 text-center" : "items-center gap-4 p-5",
        selected ? "border-gold ring-1 ring-gold" : "border-stroke hover:border-gold/60",
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      {Icon && <Icon className={cx("size-5", selected ? "text-gold-ink" : "text-muted")} aria-hidden="true" />}
      {leading}
      <span className="min-w-0 flex-1" lang={lang}>
        <span className="block text-sm font-bold text-brown">{title}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
      {selected && !compact && (
        <span className="grid size-6 place-items-center rounded-full bg-gold text-brown-dark">
          <Check className="size-3.5" aria-hidden="true" />
        </span>
      )}
    </label>
  )
}

function ActionRow({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <li className="flex flex-col gap-4 bg-card p-5 sm:flex-row sm:items-center">
      <Icon className="hidden size-5 shrink-0 text-gold-ink sm:block" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </li>
  )
}
