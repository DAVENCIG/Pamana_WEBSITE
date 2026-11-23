import type { ComponentType } from "react"
import { createBrowserRouter, redirect } from "react-router"
import Root from "./Root"
import Home from "../pages/Home"
import RouteError from "../pages/RouteError"

/** Loads a page chunk on demand. Every chunk is precached by the service worker for offline use. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/"

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      ErrorBoundary: RouteError,
      HydrateFallback: () => null,
      children: [
        { index: true, Component: Home },
        { path: "baitang/:gradeNumber", lazy: page(() => import("../pages/GradePage")) },
        { path: "topics", lazy: page(() => import("../pages/Topics")) },
        { path: "topics/:topicId", lazy: page(() => import("../pages/LessonPage")) },
        { path: "talahuluganan", lazy: page(() => import("../pages/Glossary")) },
        { path: "quiz", lazy: page(() => import("../pages/QuizSelection")) },
        { path: "quiz/:topicId", lazy: page(() => import("../pages/QuizRunner")) },
        { path: "results/:attemptId", lazy: page(() => import("../pages/QuizResult")) },
        { path: "progreso", lazy: page(() => import("../pages/Progress")) },
        { path: "about", lazy: page(() => import("../pages/About")) },
        { path: "settings", lazy: page(() => import("../pages/Settings")) },
        // Paths from the earlier app-style layout, kept so old links still work.
        { path: "home", loader: () => redirect("/progreso") },
        { path: "grades", loader: () => redirect("/#mga-baitang") },
        { path: "*", lazy: page(() => import("../pages/NotFound")) },
      ],
    },
  ],
  { basename },
)
