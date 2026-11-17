import { getLang } from "./lang"

/** Local calendar day as YYYY-MM-DD. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const formats = {
  tl: new Intl.DateTimeFormat("fil-PH", { dateStyle: "medium", timeStyle: "short" }),
  en: new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }),
}

export function formatDateTime(iso: string): string {
  return formats[getLang()].format(new Date(iso))
}
