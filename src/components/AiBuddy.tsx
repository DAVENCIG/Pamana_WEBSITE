import { ChevronDown, Send, Trash2 } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import { askAi, clearLegacyAiConfig, type AiMessage } from "../lib/aiBuddy"
import { Mascot } from "./Logo"
import { tr, useLang } from "../lib/i18n"
import { buttonClass, cx } from "./ui"

export function AiBuddy() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => clearLegacyAiConfig(), [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages, loading, open])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const next = [...messages, { role: "user" as const, content: text }]
    setMessages(next)
    setInput("")
    setLoading(true)
    setError("")
    try {
      const reply = await askAi(next.slice(-12), lang)
      setMessages([...next, { role: "assistant", content: reply }])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : tr(
        "Hindi makausap ang AI sa ngayon.",
        "The AI is unavailable right now.",
      ))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-20 z-50 grid size-14 place-items-center rounded-full bg-gold text-brown-dark shadow-xl ring-4 ring-cream/80 transition-transform hover:scale-105 lg:right-6 lg:bottom-6"
          aria-label={tr("Buksan ang PAMANA Buddy", "Open PAMANA Buddy")}
          title={tr("PAMANA Buddy", "PAMANA Buddy")}
        >
          <Mascot className="size-11" />
        </button>
      )}

      {open && (
        <aside
          role="dialog"
          aria-label={tr("PAMANA AI Buddy", "PAMANA AI Buddy")}
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[min(38rem,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-stroke bg-card shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem] lg:bottom-6"
        >
          <header className="flex items-center gap-3 border-b border-stroke px-4 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-gold-light text-gold-ink">
              <Mascot className="size-8" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-semibold text-brown">PAMANA Buddy</h2>
              <p className="text-xs text-muted">
                {tr("AI gabay sa Araling Panlipunan", "AI Araling Panlipunan guide")}
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                className="grid size-9 place-items-center rounded-full text-muted hover:bg-brown/5 hover:text-brown"
                onClick={() => setMessages([])}
                aria-label={tr("Burahin ang chat", "Clear chat")}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-muted hover:bg-brown/5 hover:text-brown"
              onClick={() => setOpen(false)}
              aria-label={tr("Itago ang buddy", "Hide buddy")}
            >
              <ChevronDown className="size-5" aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-52 flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="rounded-xl bg-gold-light/60 p-4 text-sm leading-relaxed text-ink">
                {tr(
                  "Kumusta! Magtanong tungkol sa aralin, konsepto, o quiz sa Araling Panlipunan.",
                  "Hi! Ask me about an Araling Panlipunan lesson, concept, or quiz.",
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={cx(
                      "max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "ml-auto rounded-br-md bg-brown text-on-dark"
                        : "rounded-bl-md border border-stroke bg-cream text-ink",
                    )}
                  >
                    {message.content}
                  </div>
                ))}
                {loading && (
                  <div className="w-fit rounded-2xl rounded-bl-md border border-stroke bg-cream px-3 py-2 text-sm text-muted">
                    {tr("Nag-iisip...", "Thinking...")}
                  </div>
                )}
                {error && (
                  <div className="rounded-xl bg-error-light p-3 text-sm text-error">
                    {error}
                  </div>
                )}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <form onSubmit={submit} className="border-t border-stroke p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder={tr("Magtanong...", "Ask a question...")}
                className="min-h-11 max-h-28 flex-1 resize-none rounded-xl border border-stroke bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={buttonClass("gold", "sm", "size-11 px-0")}
                aria-label={tr("Ipadala", "Send")}
              >
                <Send className="size-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        </aside>
      )}
    </>
  )
}
