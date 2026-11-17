import { useEffect } from "react"
import { tr } from "./lang"

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
      ? `${title} · PAMANA`
      : tr("PAMANA · Alamin. Aralin. Tandaan.", "PAMANA · Learn. Study. Remember.")
  }, [title])
}
