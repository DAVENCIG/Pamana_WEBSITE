import { BookOpen, Check, Clock } from "lucide-react"
import { Link } from "react-router"
import { getGrade, type Topic } from "../data"
import type { TopicProgress } from "../lib/progress"
import { CategoryChip } from "./CategoryChip"
import { Photo } from "./Photo"
import { ProgressBar } from "./ProgressBar"
import { tr } from "../lib/i18n"

interface TopicCardProps {
  topic: Topic
  progress: TopicProgress
  /** Use "h2" on pages where the cards sit directly under the page's h1. */
  headingLevel?: "h2" | "h3"
}

export function TopicCard({ topic, progress, headingLevel: Heading = "h3" }: TopicCardProps) {
  return (
    <Link
      to={`/topics/${topic.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stroke bg-card shadow-[0_1px_2px_rgb(61_42_30/0.06)] transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_12px_30px_-12px_rgb(61_42_30/0.35)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Photo
          image={topic.image}
          alt=""
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <CategoryChip
          category={topic.category}
          className="absolute top-3 left-3 shadow-sm"
        />
        {progress.lessonRead && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-espresso/85 px-2.5 py-1 text-[0.7rem] font-semibold text-on-dark backdrop-blur">
            <Check className="size-3" aria-hidden="true" /> {tr("Nabasa", "Read")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-gold-ink">
          {getGrade(topic.gradeId)?.title}
        </p>
        <Heading className="mt-1 font-display text-lg leading-snug font-semibold text-brown group-hover:text-gold-ink">
          {topic.title}
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {topic.description}
        </p>
        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span className="inline-flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3.5" aria-hidden="true" /> {tr("1 aralin", "1 lesson")}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />{" "}
                {topic.lesson.durationMinutes} min
              </span>
            </span>
            <span className="font-bold text-brown">
              {progress.bestPercent}%
            </span>
          </div>
          <ProgressBar
            value={progress.bestPercent}
            label={tr(`Progreso sa ${topic.title}`, `Progress in ${topic.title}`)}
          />
        </div>
      </div>
    </Link>
  )
}
