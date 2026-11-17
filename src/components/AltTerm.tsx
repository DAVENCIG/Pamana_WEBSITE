import { getLang } from "../lib/lang"
import { usePreferences } from "../lib/preferences"
import { cx } from "./ui"

/** Shows a vocabulary term's equivalent in the other language, e.g. "EN · Southwest Monsoon". */
export function AltTerm({ term, className }: { term: string; className?: string }) {
  const { showAltTerms } = usePreferences()
  if (!showAltTerms) return null
  const other = getLang() === "en" ? "tl" : "en"
  return (
    <span
      lang={other}
      className={cx(
        "inline-flex items-baseline gap-1 rounded-full bg-cream px-2 py-0.5 align-middle text-[0.7rem] font-semibold text-gold-ink",
        className,
      )}
    >
      <span className="font-bold tracking-wide opacity-70">{other === "en" ? "EN" : "TL"}</span>
      {term}
    </span>
  )
}
