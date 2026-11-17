import { X } from "lucide-react"
import { useEffect, useId, useRef, type ReactNode } from "react"
import { buttonClass } from "./ui"
import { tr } from "../lib/i18n"

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  actions?: ReactNode
  icon?: ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  icon,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className="m-auto w-[min(92vw,30rem)] rounded-3xl border border-stroke bg-card p-0 text-ink shadow-2xl"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-light text-gold-ink">
              {icon}
            </div>
          )}
          <h2
            id={titleId}
            className="flex-1 pt-1.5 font-display text-xl font-semibold text-brown"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-2 rounded-full p-2 text-muted hover:bg-brown/5 hover:text-brown"
            aria-label={tr("Isara", "Close")}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 text-sm leading-relaxed text-ink/85">
          {children}
        </div>
        {actions && (
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </dialog>
  )
}

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  destructive?: boolean
  icon?: ReactNode
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  icon,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      icon={icon}
      actions={
        <>
          <button
            type="button"
            className={buttonClass("outline")}
            onClick={onClose}
          >
            {cancelLabel ?? tr("Magpatuloy", "Continue")}
          </button>
          <button
            type="button"
            className={buttonClass(destructive ? "danger" : "primary")}
            onClick={() => {
              onClose()
              onConfirm()
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Dialog>
  )
}
