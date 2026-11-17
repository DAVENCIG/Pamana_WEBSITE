import { useSyncExternalStore } from "react"
import { getLang, setLang, subscribeLang, tr } from "./lang"

export { tr, setLang, getLang, type Lang } from "./lang"

export function useLang() {
  const lang = useSyncExternalStore(subscribeLang, getLang, getLang)
  return { lang, setLang, t: tr }
}
