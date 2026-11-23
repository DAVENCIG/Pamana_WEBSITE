import {
  Check,
  Download,
  HardDrive,
  Smartphone,
  Wifi,
  Languages,
  ListChecks,
  Monitor,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  Sparkles,
  Trash2,
  TriangleAlert,
  Type,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router"
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
import { detectPlatform, promptInstall, usePwa } from "../lib/pwa"
import { usePageTitle } from "../lib/usePageTitle"
import { clearLegacyAiConfig } from "../lib/aiBuddy"

type Confirm = "progress" | "everything" | "cache" | null

const SECTIONS = () => [
  { id: "wika", label: tr("Wika", "Language") },
  { id: "hitsura", label: tr("Hitsura", "Appearance") },
  { id: "pagsusulit", label: tr("Pagsusulit", "Quizzes") },
  { id: "ai-buddy", label: tr("AI Buddy", "AI Buddy") },
  { id: "app", label: tr("App at Offline", "App & Offline") },
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
  const [pendingBackup, setPendingBackup] = useState<{
    raw: string
    points: number
    lessonsRead: number
    attempts: number
  } | null>(null)
  const pwa = usePwa()
  const { hash } = useLocation()
  // Lazy-loaded pages mount after the browser's own anchor scroll, so scroll to #section here.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    el?.scrollIntoView({ block: "start" })
  }, [hash])
  const [storage, setStorage] = useState<string | null>(null)
  useEffect(() => {
    void navigator.storage?.estimate?.().then(({ usage, quota }) => {
      if (usage === undefined) return
      const mb = (n: number) => (n / 1048576).toFixed(n >= 10485760 ? 0 : 1)
      setStorage(quota ? `${mb(usage)} MB / ${mb(quota)} MB` : `${mb(usage)} MB`)
    }).catch(() => undefined)
  }, [])
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

  const MAX_BACKUP_BYTES = 5 * 1024 * 1024

  // Step 1: read and validate the file without touching current progress.
  const chooseBackup = async (file: File) => {
    const invalid = () =>
      toast(tr("Hindi ito wastong backup file ng PAMANA.", "That isn't a valid PAMANA backup file."), "info")
    if (file.size > MAX_BACKUP_BYTES) return invalid()
    const raw = await file.text()
    const summary = progress.previewBackup(raw)
    if (!summary) return invalid()
    setPendingBackup({ raw, ...summary })
  }

  // Step 2: only after the learner confirms is the current progress replaced.
  const restoreBackup = () => {
    if (!pendingBackup) return
    const ok = progress.importBackup(pendingBackup.raw)
    setPendingBackup(null)
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
    clearLegacyAiConfig()
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
            "Iangkop ang PAMANA sa paraang pinakakomportable sa iyo. Awtomatikong nase-save ang mga pagbabago sa app na ito sa device na ito.",
            "Make PAMANA work the way that's most comfortable for you. Changes are saved automatically in this app on this device.",
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
              "Nagbabago ang buong app, kasama ang mga aralin, pagsusulit, at talahuluganan.",
              "Changes the whole app, including lessons, quizzes, and the glossary.",
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
            id="ai-buddy"
            icon={Sparkles}
            title={tr("PAMANA AI Buddy", "PAMANA AI Buddy")}
            description={tr(
              "Magtanong tungkol sa Araling Panlipunan nang hindi naglalagay ng sariling API key.",
              "Ask about Araling Panlipunan without entering your own API key.",
            )}
          >
            <p className="rounded-2xl border border-stroke bg-card p-5 text-sm leading-relaxed text-ink">
              {tr(
                "Awtomatikong ikinokonekta ng PAMANA ang AI Buddy gamit ang ligtas na server setting. Kapag nagtanong ka, ipinapadala ang mensahe sa PAMANA server at OpenAI para makabuo ng sagot. Huwag magpadala ng sensitibong impormasyon.",
                "PAMANA connects the AI Buddy using a secure server setting. When you ask a question, your message is sent to PAMANA's server and OpenAI to generate a reply. Do not send sensitive information.",
              )}
            </p>
          </Section>

          <Section
            id="app"
            icon={Smartphone}
            title={tr("App at Offline", "App & Offline")}
            description={tr(
              "I-install ang PAMANA at gamitin kahit walang internet.",
              "Install PAMANA and keep learning without internet.",
            )}
          >
            <div className="rounded-2xl border border-stroke bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Smartphone className="size-4 text-gold-ink" aria-hidden="true" />
                {pwa.installed
                  ? tr("Naka-install ang PAMANA sa device na ito.", "PAMANA is installed on this device.")
                  : tr("I-install ang PAMANA", "Install PAMANA")}
              </p>
              {!pwa.installed && (
                <>
                  {pwa.canInstall ? (
                    <button
                      type="button"
                      className={buttonClass("gold", "md", "mt-4")}
                      onClick={() => void promptInstall()}
                    >
                      <Download className="size-4" aria-hidden="true" />
                      {tr("I-install ang PAMANA", "Install PAMANA")}
                    </button>
                  ) : (
                    <InstallSteps />
                  )}
                </>
              )}
            </div>
            <ul className="divide-y divide-stroke overflow-hidden rounded-2xl border border-stroke">
              <ActionRow
                icon={Wifi}
                title={tr("Koneksyon", "Connection")}
                description={
                  pwa.online
                    ? tr("Online. Naka-save sa device ang progreso mo.", "Online. Your progress is saved on this device.")
                    : tr(
                        "Offline. Gumagana ang mga aralin at quiz na na-save na.",
                        "Offline. Lessons and quizzes that were already saved still work.",
                      )
                }
                action={
                  <span
                    className={cx(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      pwa.online ? "bg-success-light text-success" : "bg-gold-light text-gold-ink",
                    )}
                  >
                    {pwa.online ? "Online" : "Offline"}
                  </span>
                }
              />
              <ActionRow
                icon={HardDrive}
                title={tr("Gamit na storage", "Storage used")}
                description={
                  storage ?? tr("Hindi ito maipakita ng app na ito.", "This app can't report storage use.")
                }
                action={<span className="text-xs font-semibold text-muted">v{__APP_VERSION__}</span>}
              />
            </ul>
            <p className="text-xs leading-relaxed text-muted">
              {tr(
                "Nase-save ang mga aralin at quiz para sa offline pagkatapos ng unang matagumpay na pagbisita online. Maaaring kailanganin ng internet ang ilang larawan hanggang mabuksan mo ang mga ito nang isang beses.",
                "Lessons and quizzes are saved for offline use after your first successful visit online. Some photos may need internet until you've opened them once.",
              )}
            </p>
          </Section>

          <Section
            id="datos"
            icon={ShieldCheck}
            title={tr("Datos at Privacy", "Data & Privacy")}
            description={tr(
              "Walang account. Nananatili sa device ang progreso mo; ipinapadala lamang sa AI provider ang mga tanong sa AI Buddy.",
              "No account. Your progress stays on this device; only AI Buddy questions are sent to the AI provider.",
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
                    "Hindi ma-save ng PAMANA ang iyong progreso (maaaring naka-private mode). Mag-download ng backup bago isara ang app.",
                    "PAMANA can't save your progress (the app may be in private mode). Download a backup before closing the app.",
                  )}
                </p>
              )}
            </div>

            <p className="rounded-2xl border border-stroke bg-card p-5 text-sm leading-relaxed text-muted">
              {tr(
                "Kapag gumamit ka ng AI Buddy, ipinapadala ang mensahe mo sa PAMANA server at OpenAI para makabuo ng sagot. Huwag maglagay ng password o sensitibong personal na impormasyon.",
                "When you use AI Buddy, your message is sent to PAMANA's server and OpenAI to generate a reply. Do not include passwords or sensitive personal information.",
              )}
            </p>

            <ul className="divide-y divide-stroke overflow-hidden rounded-2xl border border-stroke">
              <ActionRow
                icon={Download}
                title={tr("I-download ang backup", "Download a backup")}
                description={tr(
                  "I-save ang iyong progreso bilang file para mailipat sa ibang device o kopya ng app.",
                  "Save your progress as a file to move it to another device or app installation.",
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
                  "Papalitan ng file ang kasalukuyang progreso sa app na ito.",
                  "The file replaces the current progress in this app.",
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
                        if (file) void chooseBackup(file)
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
        open={pendingBackup !== null}
        onClose={() => setPendingBackup(null)}
        onConfirm={restoreBackup}
        destructive
        icon={<Upload className="size-5" aria-hidden="true" />}
        title={tr("Palitan ang kasalukuyang progreso?", "Replace your current progress?")}
        message={tr(
          `Ang backup ay may ${pendingBackup?.points ?? 0} puntos, ${pendingBackup?.lessonsRead ?? 0} nabasang aralin, at ${pendingBackup?.attempts ?? 0} subok sa quiz. Papalitan nito ang progreso sa app na ito.`,
          `The backup has ${pendingBackup?.points ?? 0} points, ${pendingBackup?.lessonsRead ?? 0} lessons read, and ${pendingBackup?.attempts ?? 0} quiz attempts. It will replace the progress in this app.`,
        )}
        cancelLabel={tr("Huwag", "Cancel")}
        confirmLabel={tr("Ibalik", "Restore")}
      />
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

function InstallSteps() {
  const platform = detectPlatform()
  const steps =
    platform === "ios"
      ? [
          tr("Buksan ang PAMANA sa Safari.", "Open PAMANA in Safari."),
          tr("I-tap ang Share (ang parisukat na may arrow paitaas).", "Tap Share (the square with an upward arrow)."),
          tr("Piliin ang “Add to Home Screen”, pagkatapos ay “Add”.", "Choose “Add to Home Screen”, then “Add”."),
        ]
      : platform === "android"
        ? [
            tr("Buksan ang menu ng browser (⋮).", "Open the browser menu (⋮)."),
            tr("Piliin ang “Install app” o “Add to Home screen”.", "Choose “Install app” or “Add to Home screen”."),
          ]
        : [
            tr(
              "Sa Chrome o Edge, hanapin ang install icon sa address bar, o buksan ang menu at piliin ang “Install PAMANA”.",
              "In Chrome or Edge, look for the install icon in the address bar, or open the menu and choose “Install PAMANA”.",
            ),
          ]
  return (
    <div className="mt-3 text-sm text-ink/80">
      <p>
        {tr(
          "Hindi nagbibigay ang browser na ito ng install button. Ganito:",
          "This browser doesn't offer an install button. Here's how:",
        )}
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )
}
