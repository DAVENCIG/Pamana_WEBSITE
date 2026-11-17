import { categoryLabel, type Category } from "../data"
import { cx } from "./ui"

const tones: Record<Category, string> = {
  Kasaysayan: "bg-[#f3e4d6] text-[#6b3a1c]",
  Kultura: "bg-gold-light text-gold-ink",
  Heograpiya: "bg-[#e1ecdf] text-[#2f5a37]",
  Ekonomiks: "bg-[#dfe9f1] text-[#25506e]",
  Lipunan: "bg-[#f5e0dc] text-[#86352a]",
}

export function CategoryChip({
  category,
  className,
}: {
  category: Category
  className?: string
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide",
        tones[category],
        className,
      )}
    >
      {categoryLabel(category)}
    </span>
  )
}
