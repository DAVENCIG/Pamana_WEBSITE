export type Category = "Kasaysayan" | "Kultura" | "Heograpiya" | "Ekonomiks" | "Lipunan"

export type ImageKey =
  | "banaue"
  | "intramuros"
  | "manilaCathedral"
  | "festival"
  | "rizalMonument"
  | "angkor"
  | "greatWall"
  | "pottery"
  | "monks"
  | "floatingMarket"
  | "palawan"
  | "cityCrowd"
  | "pyramids"
  | "market"
  | "flood"

export interface Grade {
  id: string
  number: number
  title: string
  subtitle: string
  image: ImageKey
}

export interface VocabularyTerm {
  term: string
  definition: string
  /** The term in the other site language, shown alongside it when it differs. */
  alt?: string
}

export interface Lesson {
  title: string
  gradeLabel: string
  durationMinutes: number
  content: string
  summary: string
  vocabulary: VocabularyTerm[]
}

export interface SourceQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface SourceTopic {
  id: string
  gradeId: string
  title: string
  description: string
  category: string
  image: ImageKey
  lesson?: Lesson
  quiz: SourceQuestion[]
}

export interface QuizQuestion extends SourceQuestion {
  id: string
  kind: "authored" | "vocabulary"
}

export interface Topic {
  id: string
  gradeId: string
  title: string
  description: string
  category: Category
  image: ImageKey
  lesson: Lesson
  questions: QuizQuestion[]
}
