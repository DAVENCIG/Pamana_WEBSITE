import {
  BookOpenCheck,
  CalendarCheck,
  Flame,
  Footprints,
  GraduationCap,
  Medal,
  RefreshCcw,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { grades, getTopicsByGrade } from "../data"
import { todayKey } from "./date"
import { tr } from "./lang"
import type { ProgressState, QuizAttempt } from "./progress"

// ---------- Levels ----------

export interface Level {
  index: number
  name: string
  min: number
}

const LEVEL_TABLE: Array<Omit<Level, "index">> = [
  { get name() { return tr("Baguhan", "Beginner") }, min: 0 },
  { get name() { return tr("Mag-aaral", "Student") }, min: 150 },
  { get name() { return tr("Iskolar", "Scholar") }, min: 350 },
  { get name() { return tr("Pantas", "Sage") }, min: 650 },
  { get name() { return tr("Dalubhasa", "Master") }, min: 1000 },
  { get name() { return tr("Bayani ng Kaalaman", "Hero of Knowledge") }, min: 1500 },
]

// Object.assign onto the original keeps the translated `name` getter live.
export const LEVELS: Level[] = LEVEL_TABLE.map((l, index) => Object.assign(l, { index }))

export interface LevelInfo {
  level: Level
  next: Level | undefined
  /** 0–100 progress from the current level's threshold to the next one. */
  percent: number
  toNext: number
}

export function getLevel(points: number): LevelInfo {
  let level = LEVELS[0]
  for (const l of LEVELS) if (points >= l.min) level = l
  const next = LEVELS[level.index + 1]
  if (!next) return { level, next, percent: 100, toNext: 0 }
  const span = next.min - level.min
  return {
    level,
    next,
    percent: Math.round(((points - level.min) / span) * 100),
    toNext: next.min - points,
  }
}

// ---------- Streaks ----------

function dayNumber(key: string): number {
  const [y, m, d] = key.split("-").map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
}

function uniqueDays(days: string[]): number[] {
  return [...new Set(days.map(dayNumber))].sort((a, b) => b - a)
}

/** Consecutive active days ending today, or ending yesterday if today has no quiz yet. */
export function currentStreak(days: string[], today = todayKey()): number {
  const list = uniqueDays(days)
  const t = dayNumber(today)
  if (list[0] !== t && list[0] !== t - 1) return 0
  let streak = 1
  for (let i = 1; i < list.length && list[i] === list[i - 1] - 1; i++) streak++
  return streak
}

export function longestStreak(days: string[]): number {
  const list = uniqueDays(days)
  let best = list.length > 0 ? 1 : 0
  let run = 1
  for (let i = 1; i < list.length; i++) {
    run = list[i] === list[i - 1] - 1 ? run + 1 : 1
    best = Math.max(best, run)
  }
  return best
}

// ---------- Badges ----------

export interface Badge {
  id: string
  title: string
  description: string
  icon: LucideIcon
  /** Current value and goal, used to show progress toward locked badges. */
  progress: (s: ProgressState) => [number, number]
}

const isNormal = (a: QuizAttempt) => (a.mode ?? "normal") === "normal"
const topicValues = (s: ProgressState) => Object.values(s.topics)
const count = (n: number, goal: number): [number, number] => [
  Math.min(n, goal),
  goal,
]

/** Seconds per question that counts as answering quickly. */
export const FAST_SECONDS_PER_QUESTION = 15

export const BADGES: Badge[] = [
  {
    id: "unang-hakbang",
    get title() {
      return tr("Unang Hakbang", "First Step")
    },
    get description() {
      return tr("Tapusin ang iyong unang quiz.", "Finish your first quiz.")
    },
    icon: Footprints,
    progress: (s) => count(s.attempts.filter(isNormal).length, 1),
  },
  {
    id: "mambabasa",
    get title() {
      return tr("Masipag na Mambabasa", "Avid Reader")
    },
    get description() {
      return tr("Basahin hanggang dulo ang 5 aralin.", "Read 5 lessons to the end.")
    },
    icon: BookOpenCheck,
    progress: (s) =>
      count(topicValues(s).filter((t) => t.lessonRead).length, 5),
  },
  {
    id: "perpekto",
    get title() {
      return tr("Perpekto", "Perfect")
    },
    get description() {
      return tr("Makakuha ng 100% sa isang quiz.", "Score 100% on a quiz.")
    },
    icon: Star,
    progress: (s) =>
      count(topicValues(s).filter((t) => t.bestPercent === 100).length, 1),
  },
  {
    id: "bihasa",
    get title() {
      return tr("Bihasa", "Expert")
    },
    get description() {
      return tr("Makakuha ng 100% sa 5 magkakaibang paksa.", "Score 100% on 5 different topics.")
    },
    icon: Medal,
    progress: (s) =>
      count(topicValues(s).filter((t) => t.bestPercent === 100).length, 5),
  },
  {
    id: "kidlat",
    get title() {
      return tr("Mabilis na Isip", "Quick Thinker")
    },
    get description() {
      return tr(
        `Makakuha ng 80% pataas na hindi lalampas sa ${FAST_SECONDS_PER_QUESTION} segundo bawat tanong.`,
        `Score 80% or higher in no more than ${FAST_SECONDS_PER_QUESTION} seconds per question.`,
      )
    },
    icon: Zap,
    progress: (s) =>
      count(
        s.attempts.some(
          (a) =>
            isNormal(a) &&
            a.percent >= 80 &&
            !!a.durationMs &&
            a.durationMs <= a.total * FAST_SECONDS_PER_QUESTION * 1000,
        )
          ? 1
          : 0,
        1,
      ),
  },
  {
    id: "matiyaga",
    get title() {
      return tr("Matiyaga", "Persistent")
    },
    get description() {
      return tr("Tapusin ang isang practice round ng mga maling sagot.", "Finish a practice round of your wrong answers.")
    },
    icon: RefreshCcw,
    progress: (s) =>
      count(s.attempts.filter((a) => a.mode === "practice").length, 1),
  },
  {
    id: "hamon",
    get title() {
      return tr("Hamon Tinanggap", "Challenge Accepted")
    },
    get description() {
      return tr("Tapusin ang 3 Hamon ng Araw.", "Complete 3 Daily Challenges.")
    },
    icon: Sparkles,
    progress: (s) => count(s.challengeCount, 3),
  },
  {
    id: "tuloy-tuloy",
    get title() {
      return tr("Tuloy-tuloy", "On a Roll")
    },
    get description() {
      return tr("Mag-quiz nang 3 magkakasunod na araw.", "Take a quiz 3 days in a row.")
    },
    icon: Flame,
    progress: (s) => count(longestStreak(s.activeDays), 3),
  },
  {
    id: "isang-linggo",
    get title() {
      return tr("Isang Linggong Sipag", "Week of Effort")
    },
    get description() {
      return tr("Mag-quiz nang 7 magkakasunod na araw.", "Take a quiz 7 days in a row.")
    },
    icon: CalendarCheck,
    progress: (s) => count(longestStreak(s.activeDays), 7),
  },
  {
    id: "tapos-baitang",
    get title() {
      return tr("Tapos ang Baitang", "Grade Complete")
    },
    get description() {
      return tr("Tapusin ang lahat ng quiz sa isang grade.", "Finish every quiz in one grade.")
    },
    icon: GraduationCap,
    progress: (s) => {
      // Report the grade closest to completion.
      let best: [number, number] = [0, 1]
      for (const g of grades) {
        const list = getTopicsByGrade(g.id)
        const done = list.filter(
          (t) => (s.topics[t.id]?.attempts ?? 0) > 0,
        ).length
        if (list.length > 0 && done / list.length >= best[0] / best[1])
          best = [done, list.length]
      }
      return best
    },
  },
]

const badgeById = new Map(BADGES.map((b) => [b.id, b]))

export function getBadge(id: string): Badge | undefined {
  return badgeById.get(id)
}

export function isUnlocked(badge: Badge, s: ProgressState): boolean {
  const [value, goal] = badge.progress(s)
  return value >= goal
}

/** IDs of every badge the learner has earned. */
export function evaluateBadges(s: ProgressState): string[] {
  return BADGES.filter((b) => isUnlocked(b, s)).map((b) => b.id)
}

// ---------- Formatting ----------

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(total / 60)
  const sec = total % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}

/** Longest run of consecutive correct answers. */
export function bestRun(answers: Array<{ correct: boolean }>): number {
  let best = 0
  let run = 0
  for (const a of answers) {
    run = a.correct ? run + 1 : 0
    best = Math.max(best, run)
  }
  return best
}
