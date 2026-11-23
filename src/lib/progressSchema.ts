import type {
  ActiveQuiz,
  AnswerRecord,
  ProgressState,
  QuizAttempt,
  QuizMode,
  TopicProgress,
} from "./progress"

/** Pure validation for saved progress and imported backups (no browser APIs, so it is unit-tested). */

const DAY = /^\d{4}-\d{2}-\d{2}$/
const MAX_ATTEMPTS = 100
const MAX_ACTIVE_DAYS = 120
const MAX_POINTS = 10_000_000

type Rec = Record<string, unknown>
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v)
const str = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length < 200
const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v)
const int = (v: unknown, min = 0, max = 1_000_000): v is number =>
  num(v) && Number.isInteger(v) && v >= min && v <= max
const date = (v: unknown): v is string => str(v) && !Number.isNaN(Date.parse(v))
const mode = (v: unknown): QuizMode | undefined =>
  v === "normal" || v === "practice" ? v : undefined

function answers(v: unknown): AnswerRecord[] | null {
  if (!Array.isArray(v) || v.length > 500) return null
  const out: AnswerRecord[] = []
  for (const a of v) {
    if (!isRec(a) || !str(a.questionId) || !int(a.selectedIndex, 0, 50) || typeof a.correct !== "boolean")
      return null
    out.push({ questionId: a.questionId, selectedIndex: a.selectedIndex, correct: a.correct })
  }
  return out
}

function attempt(v: unknown, known?: (id: string) => boolean): QuizAttempt | null {
  if (!isRec(v)) return null
  if (!str(v.id) || !str(v.topicId) || (known && !known(v.topicId))) return null
  if (!int(v.correct) || !int(v.total, 1) || v.correct > v.total) return null
  if (!num(v.percent) || v.percent < 0 || v.percent > 100) return null
  if (!int(v.pointsAwarded, 0, MAX_POINTS) || !int(v.bonusAwarded, 0, MAX_POINTS)) return null
  if (!int(v.previousBestCorrect) || !date(v.completedAt)) return null
  const a = answers(v.answers)
  if (!a) return null
  const out: QuizAttempt = {
    id: v.id,
    topicId: v.topicId,
    correct: v.correct,
    total: v.total,
    percent: v.percent,
    pointsAwarded: v.pointsAwarded,
    bonusAwarded: v.bonusAwarded,
    previousBestCorrect: v.previousBestCorrect,
    completedAt: v.completedAt,
    answers: a,
  }
  const m = mode(v.mode)
  if (m) out.mode = m
  if (int(v.durationMs, 0, 86_400_000)) out.durationMs = v.durationMs as number
  if (int(v.pointsBefore, 0, MAX_POINTS)) out.pointsBefore = v.pointsBefore as number
  if (Array.isArray(v.unlockedBadges) && v.unlockedBadges.every(str))
    out.unlockedBadges = v.unlockedBadges as string[]
  return out
}

function activeQuiz(v: unknown, known?: (id: string) => boolean): ActiveQuiz | null {
  if (!isRec(v) || !str(v.topicId) || (known && !known(v.topicId))) return null
  if (!Array.isArray(v.questionIds) || v.questionIds.length > 200 || !v.questionIds.every(str)) return null
  if (!int(v.index, 0, 200) || typeof v.submitted !== "boolean" || !date(v.startedAt)) return null
  if (!(v.selectedIndex === null || int(v.selectedIndex, 0, 50))) return null
  const a = answers(v.answers)
  if (!a) return null
  const out: ActiveQuiz = {
    topicId: v.topicId,
    questionIds: v.questionIds as string[],
    index: v.index,
    selectedIndex: v.selectedIndex as number | null,
    submitted: v.submitted,
    answers: a,
    startedAt: v.startedAt,
  }
  const m = mode(v.mode)
  if (m) out.mode = m
  if (isRec(v.optionOrder)) {
    const order: Record<string, number[]> = {}
    for (const [k, list] of Object.entries(v.optionOrder)) {
      if (Array.isArray(list) && list.length <= 20 && list.every((n) => int(n, 0, 50))) order[k] = list as number[]
    }
    out.optionOrder = order
  }
  if (int(v.elapsedMs, 0, 86_400_000)) out.elapsedMs = v.elapsedMs as number
  return out
}

function topicProgress(v: unknown): TopicProgress | null {
  if (!isRec(v)) return null
  return {
    lessonRead: v.lessonRead === true,
    bestCorrect: int(v.bestCorrect) ? v.bestCorrect : 0,
    bestPercent: num(v.bestPercent) ? Math.min(100, Math.max(0, v.bestPercent)) : 0,
    attempts: int(v.attempts) ? v.attempts : 0,
  }
}

/**
 * Validates a parsed version-1 save field by field. Malformed entries are dropped rather than
 * trusted; a document that is not a version-1 save at all returns null. `known` (used when
 * importing) additionally drops entries for lessons this version of PAMANA does not have.
 */
export function sanitizeProgress(
  parsed: unknown,
  base: ProgressState,
  known?: (topicId: string) => boolean,
): ProgressState | null {
  if (!isRec(parsed) || parsed.version !== 1) return null

  const topics: Record<string, TopicProgress> = {}
  if (isRec(parsed.topics)) {
    for (const [id, t] of Object.entries(parsed.topics)) {
      const tp = topicProgress(t)
      if (tp && str(id) && (!known || known(id))) topics[id] = tp
    }
  }
  const attempts = (Array.isArray(parsed.attempts) ? parsed.attempts : [])
    .map((a) => attempt(a, known))
    .filter((a): a is QuizAttempt => a !== null)
    .slice(0, MAX_ATTEMPTS)
  const activeQuizzes: Record<string, ActiveQuiz> = {}
  if (isRec(parsed.activeQuizzes)) {
    for (const [id, q] of Object.entries(parsed.activeQuizzes)) {
      const aq = activeQuiz(q, known)
      if (aq && aq.topicId === id) activeQuizzes[id] = aq
    }
  }
  const challengeCompletedOn =
    typeof parsed.challengeCompletedOn === "string" && DAY.test(parsed.challengeCompletedOn)
      ? parsed.challengeCompletedOn
      : null
  const q = isRec(parsed.quizSettings) ? parsed.quizSettings : {}

  return {
    version: 1,
    selectedGradeId: str(parsed.selectedGradeId) ? parsed.selectedGradeId : null,
    onboardingCompleted: parsed.onboardingCompleted === true,
    points: int(parsed.points, 0, MAX_POINTS) ? parsed.points : base.points,
    recentTopicId: str(parsed.recentTopicId) && (!known || known(parsed.recentTopicId)) ? parsed.recentTopicId : null,
    topics,
    attempts,
    activeQuizzes,
    challengeCompletedOn,
    rating: int(parsed.rating, 1, 5) ? parsed.rating : null,
    // Learners from before the counter existed still get credit for a finished challenge.
    challengeCount: int(parsed.challengeCount) ? parsed.challengeCount : challengeCompletedOn ? 1 : 0,
    activeDays: (Array.isArray(parsed.activeDays) ? parsed.activeDays : [])
      .filter((d): d is string => typeof d === "string" && DAY.test(d))
      .slice(0, MAX_ACTIVE_DAYS),
    quizSettings: { shuffle: typeof q.shuffle === "boolean" ? q.shuffle : base.quizSettings.shuffle },
  }
}
