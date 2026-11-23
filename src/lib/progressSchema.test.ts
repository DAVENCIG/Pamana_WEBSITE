import { describe, expect, it } from "vitest"
import { sanitizeProgress } from "./progressSchema"
import type { ProgressState } from "./progress"

const base: ProgressState = {
  version: 1,
  selectedGradeId: null,
  onboardingCompleted: false,
  points: 50,
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

const attempt = {
  id: "a1",
  topicId: "t1",
  correct: 3,
  total: 5,
  percent: 60,
  pointsAwarded: 30,
  bonusAwarded: 0,
  previousBestCorrect: 0,
  completedAt: "2026-11-01T10:00:00.000Z",
  answers: [{ questionId: "q1", selectedIndex: 1, correct: true }],
}

describe("sanitizeProgress", () => {
  it("rejects documents that are not version-1 saves", () => {
    expect(sanitizeProgress(null, base)).toBeNull()
    expect(sanitizeProgress([], base)).toBeNull()
    expect(sanitizeProgress("x", base)).toBeNull()
    expect(sanitizeProgress({ version: 2 }, base)).toBeNull()
    expect(sanitizeProgress({}, base)).toBeNull()
  })

  it("round-trips a valid save unchanged", () => {
    const save: ProgressState = {
      ...base,
      points: 120,
      selectedGradeId: "grade-7",
      topics: { t1: { lessonRead: true, bestCorrect: 3, bestPercent: 60, attempts: 1 } },
      attempts: [attempt],
      activeDays: ["2026-11-01"],
      challengeCount: 2,
    }
    expect(sanitizeProgress(JSON.parse(JSON.stringify(save)), base)).toEqual(save)
  })

  it("falls back to defaults for wrong-typed fields instead of trusting them", () => {
    const out = sanitizeProgress(
      { version: 1, points: "lots", topics: "nope", attempts: 5, activeDays: ["bad", "2026-11-02"], quizSettings: { shuffle: "yes" } },
      base,
    )!
    expect(out.points).toBe(50)
    expect(out.topics).toEqual({})
    expect(out.attempts).toEqual([])
    expect(out.activeDays).toEqual(["2026-11-02"])
    expect(out.quizSettings.shuffle).toBe(true)
  })

  it("drops impossible attempts (more correct than total, bad percent, negative points)", () => {
    const out = sanitizeProgress(
      {
        version: 1,
        attempts: [
          { ...attempt, id: "ok" },
          { ...attempt, id: "bad1", correct: 9 },
          { ...attempt, id: "bad2", percent: 140 },
          { ...attempt, id: "bad3", pointsAwarded: -5 },
          { ...attempt, id: "bad4", completedAt: "not a date" },
        ],
      },
      base,
    )!
    expect(out.attempts.map((a) => a.id)).toEqual(["ok"])
  })

  it("only keeps active quizzes stored under their own topic id", () => {
    const quiz = {
      topicId: "t1",
      questionIds: ["q1", "q2"],
      index: 1,
      selectedIndex: null,
      submitted: false,
      answers: [],
      startedAt: "2026-11-01T10:00:00.000Z",
    }
    const out = sanitizeProgress({ version: 1, activeQuizzes: { t1: quiz, t2: quiz } }, base)!
    expect(Object.keys(out.activeQuizzes)).toEqual(["t1"])
  })

  it("on import, drops entries for lessons that do not exist", () => {
    const known = (id: string) => id === "t1"
    const out = sanitizeProgress(
      {
        version: 1,
        recentTopicId: "ghost",
        topics: {
          t1: { lessonRead: true, bestCorrect: 1, bestPercent: 20, attempts: 1 },
          ghost: { lessonRead: true, bestCorrect: 1, bestPercent: 20, attempts: 1 },
        },
        attempts: [attempt, { ...attempt, id: "a2", topicId: "ghost" }],
      },
      base,
      known,
    )!
    expect(Object.keys(out.topics)).toEqual(["t1"])
    expect(out.attempts.map((a) => a.id)).toEqual(["a1"])
    expect(out.recentTopicId).toBeNull()
  })

  it("ignores prototype-pollution style keys without polluting objects", () => {
    const out = sanitizeProgress(JSON.parse('{"version":1,"__proto__":{"polluted":true},"topics":{"__proto__":{"lessonRead":true}}}'), base)!
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(Object.keys(out.topics)).not.toContain("polluted")
  })

  it("keeps the daily-challenge credit for saves from before the counter existed", () => {
    const out = sanitizeProgress({ version: 1, challengeCompletedOn: "2026-11-01" }, base)!
    expect(out.challengeCount).toBe(1)
  })
})
