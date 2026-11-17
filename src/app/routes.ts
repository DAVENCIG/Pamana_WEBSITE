import { createBrowserRouter, redirect } from "react-router"
import Root from "./Root"
import Home from "../pages/Home"
import GradePage from "../pages/GradePage"
import Progress from "../pages/Progress"
import Topics from "../pages/Topics"
import LessonPage from "../pages/LessonPage"
import Glossary from "../pages/Glossary"
import QuizSelection from "../pages/QuizSelection"
import QuizRunner from "../pages/QuizRunner"
import QuizResult from "../pages/QuizResult"
import About from "../pages/About"
import Settings from "../pages/Settings"
import NotFound from "../pages/NotFound"
import RouteError from "../pages/RouteError"

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/"

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      ErrorBoundary: RouteError,
      children: [
        { index: true, Component: Home },
        { path: "baitang/:gradeNumber", Component: GradePage },
        { path: "topics", Component: Topics },
        { path: "topics/:topicId", Component: LessonPage },
        { path: "talahuluganan", Component: Glossary },
        { path: "quiz", Component: QuizSelection },
        { path: "quiz/:topicId", Component: QuizRunner },
        { path: "results/:attemptId", Component: QuizResult },
        { path: "progreso", Component: Progress },
        { path: "about", Component: About },
        { path: "settings", Component: Settings },
        // Paths from the earlier app-style layout, kept so old links still work.
        { path: "home", loader: () => redirect("/progreso") },
        { path: "grades", loader: () => redirect("/#mga-baitang") },
        { path: "*", Component: NotFound },
      ],
    },
  ],
  { basename },
)
