# PAMANA

Offline-capable educational PWA for Philippine Araling Panlipunan, Grades 7–10. One shared React codebase; not a native app. No backend, accounts or analytics: all learner data stays in the browser (LocalStorage).

## Stack
React 19, TypeScript (strict), Vite 8, Tailwind CSS 4, React Router 8, Lucide React. Package manager: pnpm. Tests: Vitest.

## Commands
- `pnpm dev` – dev server (service worker is NOT registered in dev)
- `pnpm typecheck` – `tsc --noEmit`
- `pnpm test` – unit tests (`src/**/*.test.ts`)
- `pnpm build` – production build into `dist/` (also stamps `dist/sw.js`)
- `pnpm preview` – serve `dist/`; use this (not dev) to test install/offline

## Structure
- `src/app/` – `Root.tsx` layout (header, footer, bottom nav, status banners), `routes.ts` (pages are lazy-loaded)
- `src/pages/`, `src/components/`, `src/data/` (curriculum, images), `src/lib/`
- `src/lib/progress.ts` – learner state store (`pamana.progress.v1`); `progressSchema.ts` – pure validation used for load and backup import
- `src/lib/pwa.ts` – install prompt, installed/online/update state; `serviceWorker.ts` – registration and update activation
- `functions/api/chat.ts` – Cloudflare Pages AI proxy; uses the `AI` Workers AI binding and never exposes provider credentials to the client
- `public/sw.js`, `public/manifest.webmanifest`, `public/brand/` (logo, mascot, icons)
- `vite.config.ts` – React + Tailwind plugins and `pamanaServiceWorker()`, which injects the build id and the full file list into `dist/sw.js`; also injects `__APP_VERSION__`

## PWA / offline rules
- Every emitted file (including lazy route chunks) is precached at install. A new release gets a new `pamana-shell-<id>` cache; old shells are deleted on activate.
- A new worker waits until the learner taps "Update" (`SKIP_WAITING`), so a lesson or quiz is never interrupted.
- Lesson photos are remote (Unsplash) and are cached only after first view (`pamana-runtime-v1`, capped at 150 entries). They are not guaranteed offline.
- Manifest and icon links in `index.html` use absolute paths, so the app assumes it is served from `/`. Host it with a single-page-app fallback (unknown paths serve `index.html`).
- Icons in `public/brand/icon-*.png` are generated from `pamana-emblem.webp` (192 px source, so the 512 icons are upscaled).

## Conventions
- Bilingual strings use `tr("Tagalog", "English")` from `src/lib/i18n`.
- Reuse `buttonClass`, `container`, `cx` from `components/ui.ts`; colors are theme tokens in `src/index.css`.
- Do not remove or rename saved-data keys without a migration; never silently overwrite learner data.
- Never commit secrets. Do not push to `main` or deploy without the owner's approval.

## Known limitations
- Not tested on real devices: install prompt, standalone mode and iOS Safari were only checked with a headless browser and a simulated prompt.
- No manifest `screenshots` yet; capture real ones from a device with photos and fonts loaded.
- Remote lesson photos work offline only after they have been viewed once.
- AI Buddy requires the Cloudflare Pages Function and a Workers AI binding named `AI`; configure rate limiting for `POST /api/chat` before making the deployment public. AI questions are sent to Cloudflare Workers AI, while learner progress remains local.
- Desktop keeps the top navigation (no sidebar).
- `index.html` has `<meta name="robots" content="noindex, nofollow">` and `public/robots.txt` disallows everything, so Lighthouse SEO shows "not crawlable". Remove both if the site should be indexed.
- Remaining axe finding: decorative `aria-hidden` card numerals have low contrast (design choice).
- The project was exported from Figma Make; all Figma Make tooling (`.figma/`, build plugins) has been removed, so Figma publish/sync no longer applies to this repo.
