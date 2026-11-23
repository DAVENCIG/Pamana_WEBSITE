import { useSyncExternalStore } from "react"
import {
  DEFAULT_GRADE_ID,
  getDailyChallengeTopic,
  getGrade,
  getTopic,
  getTopicsByGrade,
  type Topic,
} from "../data"
import { evaluateBadges } from "./achievements"
import { todayKey } from "./date"
import { sanitizeProgress } from "./progressSchema"

export const INITIAL_POINTS = 50
export const POINTS_PER_CORRECT = 10
export const CHALLENGE_BONUS = 20

const STORAGE_KEY = "pamana.progress.v1"
const MAX_ATTEMPTS = 100
const MAX_ACTIVE_DAYS = 120

export type QuizMode = "normal" | "practice"

export interface AnswerRecord {
  questionId: string
  /** Index into the question's original (unshuffled) options. */
  selectedIndex: number
  correct: boolean
}

export interface ActiveQuiz {
  topicId: string
  questionIds: string[]
  index: number
  selectedIndex: number | null
  submitted: boolean
  answers: AnswerRecord[]
  startedAt: string
  /** Missing on quizzes saved before modes existed; treat as "normal". */
  mode?: QuizMode
  /** Display order per question: position -> original option index. */
  optionOrder?: Record<string, number[]>
  /** Active time spent answering, excluding time the tab was hidden or closed. */
  elapsedMs?: number
}

export interface QuizAttempt {
  id: string
  topicId: string
  correct: number
  total: number
  percent: number
  pointsAwarded: number
  bonusAwarded: number
  previousBestCorrect: number
  completedAt: string
  answers: AnswerRecord[]
  mode?: QuizMode
  durationMs?: number
  pointsBefore?: number
  unlockedBadges?: string[]
}

export interface TopicProgress {
  lessonRead: boolean
  bestCorrect: number
  bestPercent: number
  attempts: number
}

export interface ProgressState {
  version: 1
  selectedGradeId: string | null
  onboardingCompleted: boolean
  points: number
  recentTopicId: string | null
  topics: Record<string, TopicProgress>
  attempts: QuizAttempt[]
  activeQuizzes: Record<string, ActiveQuiz>
  challengeCompletedOn: string | null
  rating: number | null
  /** Number of daily challenges completed. */
  challengeCount: number
  /** Local dates (YYYY-MM-DD) on which at least one quiz was finished, newest first. */
  activeDays: string[]
  quizSettings: QuizSettings
}

export interface QuizSettings {
  /** Shuffle question and option order on every new attempt. */
  shuffle: boolean
}

const EMPTY_TOPIC: TopicProgress = {
  lessonRead: false,
  bestCorrect: 0,
  bestPercent: 0,
  attempts: 0,
}

function defaults(): ProgressState {
  return {
    version: 1,
    selectedGradeId: null,
    onboardingCompleted: false,
    points: INITIAL_POINTS,
    recentTopicId: null,
    topics: {},
    attempts: [],
    activeQuizzes: {},
    challengeCompletedOn: null,
    rating: null,
    challengeCount: 0,
    activeDays: [],
    quizSettings: { shuffle: true },
  }
}

/** Parses saved progress JSON; returns null when it is not a valid version-1 save. */
function parse(raw: string, importing = false): ProgressState | null {
  try {
    return sanitizeProgress(JSON.parse(raw), defaults(), importing ? (id) => !!getTopic(id) : undefined)
  } catch {
    return null
  }
}

const CORRUPT_KEY = "pamana.progress.v1.corrupt"

function load(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults()
    const parsed = parse(raw)
    if (parsed) return parsed
    // Unreadable save: keep a copy before the next write replaces it, so it can be recovered.
    if (!window.localStorage.getItem(CORRUPT_KEY)) window.localStorage.setItem(CORRUPT_KEY, raw)
    return defaults()
  } catch {
    return defaults()
  }
}

let state: ProgressState = typeof window === "undefined" ? defaults() : load()
let persistent = true
const listeners = new Set<() => void>()

function commit(next: ProgressState) {
  state = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    persistent = true
  } catch {
    // Storage can be unavailable (private mode, quota). Keep working in memory.
    persistent = false
  }
  listeners.forEach((listener) => listener())
}

function update(fn: (s: ProgressState) => ProgressState) {
  commit(fn(state))
}

if (typeof window !== "undefined") {
  // Keep multiple open tabs in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return
    state = load()
    listeners.forEach((listener) => listener())
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  )
}

export function isProgressPersistent(): boolean {
  return persistent
}

export function getTopicProgress(
  s: ProgressState,
  topicId: string,
): TopicProgress {
  return s.topics[topicId] ?? EMPTY_TOPIC
}

export function getActiveQuiz(
  s: ProgressState,
  topic: Topic,
): ActiveQuiz | undefined {
  const active = s.activeQuizzes[topic.id]
  if (!active) return undefined
  // Discard saved quizzes whose questions no longer exist after a content update.
  const valid = active.questionIds.every((id) =>
    topic.questions.some((q) => q.id === id),
  )
  return valid ? active : undefined
}

export function quizMode(quiz: { mode?: QuizMode }): QuizMode {
  return quiz.mode ?? "normal"
}

/** Display order of a question's options: position -> original option index. */
export function getOptionOrder(
  quiz: ActiveQuiz,
  questionId: string,
  optionCount: number,
): number[] {
  const order = quiz.optionOrder?.[questionId]
  const identity = Array.from({ length: optionCount }, (_, i) => i)
  // Fall back to the authored order if the saved order no longer matches the content.
  if (!order || order.length !== optionCount) return identity
  const valid = [...order].sort((a, b) => a - b).every((v, i) => v === i)
  return valid ? order : identity
}

export function getTopicAttempts(
  s: ProgressState,
  topicId: string,
): QuizAttempt[] {
  return s.attempts.filter((a) => a.topicId === topicId)
}

export function useCurrentGrade() {
  const s = useProgress()
  return getGrade(s.selectedGradeId) ?? getGrade(DEFAULT_GRADE_ID)!
}

/** The topic to resume: the last opened topic in this grade, else the first unfinished one. */
export function getResumeTopic(
  s: ProgressState,
  gradeId: string,
): Topic | undefined {
  const recent = getTopic(s.recentTopicId)
  if (recent && recent.gradeId === gradeId) return recent
  const list = getTopicsByGrade(gradeId)
  return (
    list.find((t) => getTopicProgress(s, t.id).bestPercent < 100) ?? list[0]
  )
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuiz(
  topic: Topic,
  questionIds: string[],
  mode: QuizMode,
  shuffle: boolean,
): ActiveQuiz {
  const optionOrder: Record<string, number[]> = {}
  if (shuffle) {
    for (const id of questionIds) {
      const q = topic.questions.find((x) => x.id === id)
      if (q) optionOrder[id] = shuffled(q.options.map((_, i) => i))
    }
  }
  return {
    topicId: topic.id,
    questionIds: shuffle ? shuffled(questionIds) : questionIds,
    index: 0,
    selectedIndex: null,
    submitted: false,
    answers: [],
    startedAt: new Date().toISOString(),
    mode,
    optionOrder,
    elapsedMs: 0,
  }
}

function patchTopic(
  s: ProgressState,
  topicId: string,
  patch: Partial<TopicProgress>,
): ProgressState {
  return {
    ...s,
    topics: {
      ...s.topics,
      [topicId]: { ...getTopicProgress(s, topicId), ...patch },
    },
  }
}

export const progress = {
  selectGrade(gradeId: string) {
    update((s) => ({
      ...s,
      selectedGradeId: gradeId,
      onboardingCompleted: true,
    }))
  },

  setRecentTopic(topicId: string) {
    if (state.recentTopicId === topicId) return
    update((s) => ({ ...s, recentTopicId: topicId }))
  },

  markLessonRead(topicId: string) {
    if (getTopicProgress(state, topicId).lessonRead) return
    update((s) => patchTopic(s, topicId, { lessonRead: true }))
  },

  /** Starts a quiz, or keeps the saved one unless `restart` is true. */
  startQuiz(topic: Topic, restart = false) {
    if (!restart && getActiveQuiz(state, topic)) return
    const quiz = buildQuiz(
      topic,
      topic.questions.map((q) => q.id),
      "normal",
      state.quizSettings.shuffle,
    )
    update((s) => ({
      ...s,
      activeQuizzes: { ...s.activeQuizzes, [topic.id]: quiz },
    }))
  },

  /**
   * Starts a practice round with only the given questions (typically the ones answered wrong).
   * Practice rounds never change points or best scores. Returns false if nothing can be practised.
   */
  startPractice(topic: Topic, questionIds: string[]): boolean {
    const ids = questionIds.filter((id) =>
      topic.questions.some((q) => q.id === id),
    )
    if (ids.length === 0) return false
    const quiz = buildQuiz(topic, ids, "practice", true)
    update((s) => ({
      ...s,
      activeQuizzes: { ...s.activeQuizzes, [topic.id]: quiz },
    }))
    return true
  },

  /** Adds active answering time to the saved quiz. */
  addQuizTime(topicId: string, ms: number) {
    const current = state.activeQuizzes[topicId]
    if (!current || ms <= 0) return
    // Cap a single slice so a sleeping device does not inflate the timer.
    const delta = Math.min(ms, 5 * 60_000)
    update((s) => ({
      ...s,
      activeQuizzes: {
        ...s.activeQuizzes,
        [topicId]: { ...current, elapsedMs: (current.elapsedMs ?? 0) + delta },
      },
    }))
  },

  setShuffle(shuffle: boolean) {
    update((s) => ({ ...s, quizSettings: { ...s.quizSettings, shuffle } }))
  },

  saveQuiz(topicId: string, patch: Partial<ActiveQuiz>) {
    const current = state.activeQuizzes[topicId]
    if (!current) return
    update((s) => ({
      ...s,
      activeQuizzes: {
        ...s.activeQuizzes,
        [topicId]: { ...current, ...patch },
      },
    }))
  },

  /**
   * Finalises the saved quiz exactly once. Points are earned only for correct answers beyond the
   * learner's previous best on this topic, so retaking a quiz cannot farm points. Practice rounds
   * are recorded for review but never change points or best scores.
   */
  completeQuiz(topicId: string): QuizAttempt | null {
    const active = state.activeQuizzes[topicId]
    if (!active || active.answers.length < active.questionIds.length)
      return null

    const mode = quizMode(active)
    const practice = mode === "practice"
    const correct = active.answers.filter((a) => a.correct).length
    const total = active.questionIds.length
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0
    const previous = getTopicProgress(state, topicId)
    const today = todayKey()
    const isChallenge = getDailyChallengeTopic(today).id === topicId
    const bonusAwarded =
      !practice && isChallenge && state.challengeCompletedOn !== today
        ? CHALLENGE_BONUS
        : 0
    const pointsAwarded = practice
      ? 0
      : Math.max(0, correct - previous.bestCorrect) * POINTS_PER_CORRECT

    const attempt: QuizAttempt = {
      id: newId(),
      topicId,
      correct,
      total,
      percent,
      pointsAwarded,
      bonusAwarded,
      previousBestCorrect: previous.bestCorrect,
      completedAt: new Date().toISOString(),
      answers: active.answers,
      mode,
      durationMs: active.elapsedMs ?? 0,
      pointsBefore: state.points,
      unlockedBadges: [],
    }

    const before = new Set(evaluateBadges(state))
    update((s) => {
      const { [topicId]: _finished, ...remaining } = s.activeQuizzes
      const withTopic = practice
        ? s
        : patchTopic(s, topicId, {
            bestCorrect: Math.max(previous.bestCorrect, correct),
            bestPercent: Math.max(previous.bestPercent, percent),
            attempts: previous.attempts + 1,
          })
      const next: ProgressState = {
        ...withTopic,
        activeQuizzes: remaining,
        attempts: [attempt, ...s.attempts].slice(0, MAX_ATTEMPTS),
        points: s.points + pointsAwarded + bonusAwarded,
        challengeCompletedOn: bonusAwarded > 0 ? today : s.challengeCompletedOn,
        challengeCount: s.challengeCount + (bonusAwarded > 0 ? 1 : 0),
        activeDays: s.activeDays.includes(today)
          ? s.activeDays
          : [today, ...s.activeDays].slice(0, MAX_ACTIVE_DAYS),
      }
      // Record which badges this attempt unlocked so the result page can celebrate them later.
      attempt.unlockedBadges = evaluateBadges(next).filter(
        (id) => !before.has(id),
      )
      return next
    })
    return attempt
  },

  setRating(rating: number) {
    update((s) => ({ ...s, rating }))
  },

  reset() {
    commit(defaults())
  },

  /** Progress as a JSON backup that can be restored with `importBackup`. */
  exportBackup(): string {
    return JSON.stringify(state, null, 2)
  },

  /** Validates a backup without applying it; returns what it contains, or null if invalid. */
  previewBackup(raw: string): { points: number; lessonsRead: number; attempts: number } | null {
    const next = parse(raw, true)
    if (!next) return null
    return {
      points: next.points,
      lessonsRead: Object.values(next.topics).filter((t) => t.lessonRead).length,
      attempts: next.attempts.length,
    }
  },

  /** Replaces progress with a backup. Returns false if the file is not a PAMANA backup. */
  importBackup(raw: string): boolean {
    const next = parse(raw, true)
    if (!next) return false
    commit(next)
    return true
  },
}
