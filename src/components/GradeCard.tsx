import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router"
import { gradePath, type Grade, type Topic } from "../data"
import { Photo } from "./Photo"
import { tr } from "../lib/i18n"

interface GradeCardProps {
  grade: Grade
  topics: Topic[]
}

/** Links to a grade's overview page and previews the first few lessons in it. */
export function GradeCard({ grade, topics }: GradeCardProps) {
  return (
    <Link
      to={gradePath(grade)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stroke bg-card transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_12px_30px_-12px_rgb(61_42_30/0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo
          image={grade.image}
          alt=""
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/85 via-brown-dark/20 to-transparent" />
        <span className="absolute bottom-3 left-4 font-display text-3xl font-semibold text-on-dark sm:text-4xl">
          {grade.title}
        </span>
        <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-cream/90 text-brown transition group-hover:bg-gold">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-semibold leading-snug text-ink">{grade.subtitle}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          {topics.slice(0, 3).map((t) => (
            <li key={t.id} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
              <span className="line-clamp-1">{t.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-4 text-xs font-bold tracking-[0.14em] text-gold-ink uppercase">
          {topics.length} {tr("aralin", topics.length === 1 ? "lesson" : "lessons")}
        </p>
      </div>
    </Link>
  )
}
