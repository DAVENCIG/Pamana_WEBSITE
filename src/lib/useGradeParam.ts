import { useSearchParams } from "react-router"
import { getGradeByNumber, type Grade } from "../data"
import { progress } from "./progress"

/**
 * Grade filter stored in the `?baitang=` query string so filtered pages are linkable.
 * Choosing a grade also remembers it as the visitor's preferred grade.
 */
export function useGradeParam(): [Grade | undefined, (
  grade: Grade | null,
) => void] {
  const [params, setParams] = useSearchParams()
  const grade = getGradeByNumber(params.get("baitang"))
  const setGrade = (next: Grade | null) => {
    if (next) progress.selectGrade(next.id)
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        if (next) p.set("baitang", String(next.number))
        else p.delete("baitang")
        return p
      },
      { replace: true },
    )
  }
  return [grade, setGrade]
}
