import { getLang, subscribeLang, type Lang } from "../lib/lang"
import { androidGrades, androidTopics } from "./androidCurriculum"
import { categoriesEn, gradesEn, topicsEn } from "./english"
import type {
  Category,
  Grade,
  Lesson,
  QuizQuestion,
  SourceQuestion,
  SourceTopic,
  Topic,
  VocabularyTerm,
} from "./types"
import { webLessons, webQuizzes } from "./webAdditions"

export type {
  Category,
  Grade,
  Lesson,
  QuizQuestion,
  Topic,
  VocabularyTerm,
  ImageKey,
} from "./types"

export const MAX_QUIZ_QUESTIONS = 10
export const DEFAULT_GRADE_ID = "grade-7"
/** Category keys stay in Tagalog (they appear in URLs); use `categoryLabel` for display. */
export const CATEGORIES: Category[] = [
  "Kasaysayan",
  "Kultura",
  "Heograpiya",
  "Ekonomiks",
  "Lipunan",
]

export function categoryLabel(c: Category): string {
  return getLang() === "en" ? categoriesEn[c] : c
}

function hash(text: string): number {
  let h = 5381
  for (let i = 0; i < text.length; i++)
    h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
  return h
}

/** Places `correct` among `distractors` at a deterministic position so saved quizzes stay stable. */
function arrange(id: string, correct: string, distractors: string[]) {
  const correctIndex = hash(id) % 4
  const options = [...distractors.slice(0, 3)]
  options.splice(correctIndex, 0, correct)
  return { options, correctIndex }
}

function pickDistractors(
  correct: VocabularyTerm,
  pool: VocabularyTerm[],
  field: "term" | "definition",
  offset: number,
) {
  const sameTerm = (v: VocabularyTerm) =>
    v.term.trim().toLowerCase() === correct.term.trim().toLowerCase()
  const seen = new Set<string>([correct[field]])
  const result: string[] = []
  for (let i = 0; i < pool.length && result.length < 3; i++) {
    const candidate = pool[(i + offset) % pool.length]
    if (sameTerm(candidate) || seen.has(candidate[field])) continue
    seen.add(candidate[field])
    result.push(candidate[field])
  }
  return result
}

/**
 * Builds vocabulary questions from a lesson's glossary. Distractors come from the same lesson first,
 * then from other lessons in the same grade, so every option is real course content.
 * Both languages use parallel vocabulary lists, so question IDs and answer positions match.
 */
function vocabularyQuestions(
  lang: Lang,
  topicId: string,
  vocab: VocabularyTerm[],
  gradePool: VocabularyTerm[],
): QuizQuestion[] {
  const pool = [...vocab, ...gradePool.filter((v) => !vocab.includes(v))]
  const make = (
    kind: "def" | "term",
    v: VocabularyTerm,
    i: number,
  ): QuizQuestion | null => {
    const id = `${topicId}:v-${kind}-${i}`
    const field = kind === "def" ? "definition" : "term"
    const distractors = pickDistractors(v, pool, field, i + 1)
    if (distractors.length < 3) return null
    const { options, correctIndex } = arrange(id, v[field], distractors)
    const en = lang === "en"
    return {
      id,
      kind: "vocabulary",
      question:
        kind === "def"
          ? en
            ? `What does “${v.term}” mean?`
            : `Ano ang kahulugan ng “${v.term}”?`
          : en
            ? `Which term matches this description: “${v.definition}”`
            : `Anong salita ang tinutukoy ng paglalarawang ito: “${v.definition}”`,
      options,
      correctIndex,
      explanation: en
        ? `According to the lesson, “${v.term}” means: ${v.definition}`
        : `Ayon sa aralin, ang “${v.term}” ay: ${v.definition}`,
    }
  }
  const defs = vocab.map((v, i) => make("def", v, i))
  const terms = vocab.map((v, i) => make("term", v, i))
  return [...defs, ...terms].filter((q): q is QuizQuestion => q !== null)
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as string[]).includes(value)
}

const same = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase()

/** Lesson and authored quiz for a topic in the requested language. */
function localize(
  lang: Lang,
  topic: SourceTopic,
): { title: string; description: string; lesson: Lesson; quiz: SourceQuestion[] } {
  const lessonTl = topic.lesson ?? webLessons[topic.id]
  if (!lessonTl) throw new Error(`Topic "${topic.id}" has no lesson content.`)
  const quizTl = topic.quiz.length > 0 ? topic.quiz : (webQuizzes[topic.id] ?? [])
  const en = topicsEn[topic.id]

  // Each term carries its equivalent in the other language so both can be shown.
  const vocabulary = lessonTl.vocabulary.map((v, i) => {
    const e = en?.lesson.vocabulary[i]
    if (lang === "en" && e)
      return { term: e.term, definition: e.definition, alt: same(e.term, v.term) ? undefined : v.term }
    return { ...v, alt: e && !same(e.term, v.term) ? e.term : undefined }
  })

  if (lang === "tl" || !en)
    return { title: topic.title, description: topic.description, lesson: { ...lessonTl, vocabulary }, quiz: quizTl }

  return {
    title: en.title,
    description: en.description,
    lesson: {
      ...lessonTl,
      title: en.title,
      gradeLabel: en.lesson.gradeLabel,
      content: en.lesson.content,
      summary: en.lesson.summary,
      vocabulary,
    },
    quiz: quizTl.map((q, i) => {
      const e = en.quiz?.[i]
      return e ? { ...q, question: e.question, options: e.options, explanation: e.explanation } : q
    }),
  }
}

export interface GlossaryEntry {
  term: string
  /** The same term in the other language, when it differs. */
  alt?: string
  definition: string
  topic: Topic
}

function build(lang: Lang) {
  const grades: Grade[] = [...androidGrades]
    .sort((a, b) => a.number - b.number)
    .map((g) => (lang === "en" && gradesEn[g.id] ? { ...g, ...gradesEn[g.id] } : g))

  const localized = androidTopics.map((t) => ({ topic: t, ...localize(lang, t) }))

  const topics: Topic[] = localized.map(({ topic, title, description, lesson, quiz }) => {
    if (!isCategory(topic.category))
      throw new Error(`Topic "${topic.id}" has unknown category "${topic.category}".`)
    const gradePool = localized
      .filter((x) => x.topic.gradeId === topic.gradeId)
      .flatMap((x) => x.lesson.vocabulary)
    const questions: QuizQuestion[] = [
      ...quiz.map((q, i) => ({ ...q, id: `${topic.id}:a-${i}`, kind: "authored" as const })),
      ...vocabularyQuestions(lang, topic.id, lesson.vocabulary, gradePool),
    ].slice(0, MAX_QUIZ_QUESTIONS)
    return {
      id: topic.id,
      gradeId: topic.gradeId,
      title,
      description,
      category: topic.category,
      image: topic.image,
      lesson,
      questions,
    }
  })

  const glossary: GlossaryEntry[] = topics
    .flatMap((topic) =>
      topic.lesson.vocabulary.map((v) => ({
        term: v.term.trim(),
        alt: v.alt,
        definition: v.definition,
        topic,
      })),
    )
    .sort((a, b) => a.term.localeCompare(b.term, lang === "en" ? "en" : "fil", { sensitivity: "base" }))

  return { grades, topics, glossary }
}

const built = { tl: build("tl"), en: build("en") }

// Live bindings: reassigned when the language changes, and the app re-renders.
export let grades = built[getLang()].grades
export let topics = built[getLang()].topics
/** Every lesson vocabulary term, alphabetised, with the lesson it comes from. */
export let glossary = built[getLang()].glossary
let topicById = new Map(topics.map((t) => [t.id, t]))
let gradeById = new Map(grades.map((g) => [g.id, g]))

subscribeLang(() => {
  const b = built[getLang()]
  grades = b.grades
  topics = b.topics
  glossary = b.glossary
  topicById = new Map(topics.map((t) => [t.id, t]))
  gradeById = new Map(grades.map((g) => [g.id, g]))
})

export function getTopic(id: string | null | undefined): Topic | undefined {
  return id ? topicById.get(id) : undefined
}

export function getGrade(id: string | null | undefined): Grade | undefined {
  return id ? gradeById.get(id) : undefined
}

export function getTopicsByGrade(gradeId: string): Topic[] {
  return topics.filter((t) => t.gradeId === gradeId)
}

export function getQuestion(
  topic: Topic,
  questionId: string,
): QuizQuestion | undefined {
  return topic.questions.find((q) => q.id === questionId)
}

export function quizMinutes(topic: Topic): number {
  return Math.max(1, Math.round(topic.questions.length * 0.5))
}

/** Splits lesson text into paragraphs. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export const contentStats = {
  grades: built.tl.grades.length,
  topics: built.tl.topics.length,
  lessons: built.tl.topics.length,
  questions: built.tl.topics.reduce((sum, t) => sum + t.questions.length, 0),
  vocabulary: built.tl.topics.reduce((sum, t) => sum + t.lesson.vocabulary.length, 0),
}

/**
 * The daily challenge rotates through history topics, one per calendar day,
 * so every learner sees the same challenge on the same day.
 */
export function getDailyChallengeTopic(dayKey: string): Topic {
  const pool = topics.filter((t) => t.category === "Kasaysayan")
  const [y, m, d] = dayKey.split("-").map(Number)
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
  return pool[dayNumber % pool.length]
}

export function getGradeByNumber(n: string | number | null | undefined) {
  return grades.find((g) => String(g.number) === String(n))
}

/** Public URL of a grade's overview page. */
export function gradePath(grade: Grade): string {
  return `/baitang/${grade.number}`
}
