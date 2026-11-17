import { CircleCheck, Info } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"

type Tone = "success" | "info"
interface ToastItem {
  id: number
  message: string
  tone: Tone
}

const ToastContext = createContext<(message: string, tone?: Tone) => void>(
  () => {},
)

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const push = useCallback((message: string, tone: Tone = "success") => {
    const id = nextId.current++
    setItems((current) => [...current.slice(-2), { id, message, tone }])
    window.setTimeout(
      () => setItems((current) => current.filter((t) => t.id !== id)),
      3800,
    )
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 px-4 md:bottom-8"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-md animate-toast items-center gap-2.5 rounded-2xl bg-brown-dark px-4 py-3 text-sm font-medium text-on-dark shadow-xl"
          >
            {t.tone === "success" ? (
              <CircleCheck
                className="size-4 shrink-0 text-gold"
                aria-hidden="true"
              />
            ) : (
              <Info className="size-4 shrink-0 text-gold" aria-hidden="true" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
