# PAMANA

Installable, offline-capable web app for Araling Panlipunan, Grades 7–10 (React, TypeScript, Vite, Tailwind).

## Run it in VS Code

1. Install **Node.js 22 or newer** (https://nodejs.org).
2. Open this folder in VS Code (**File → Open Folder**). Accept the prompt to install the recommended extensions.
3. Open the terminal (**Ctrl+\`**) and run:

   ```bash
   corepack enable
   pnpm install
   pnpm dev
   ```

   If `corepack enable` says permission denied, run the terminal as administrator once, or use `npm i -g pnpm@10` instead.
4. Open the **Local** address it prints (normally http://localhost:5173).

Or press **Ctrl+Shift+B** to start the dev server, or **F5** and pick *Chrome: dev server* to launch it with the debugger attached.

## Test install and offline

The service worker only runs in the built app, not in `pnpm dev`.

```bash
pnpm pwa
```

Open http://localhost:4173, wait a few seconds, then in Chrome DevTools → **Application → Service Workers** tick **Offline** and reload. Lessons and quizzes should still open. The **Install** icon appears in the address bar (localhost counts as secure).

To try it on a phone, use the **Network** address printed in the terminal while the phone is on the same Wi-Fi. Installing on a phone needs HTTPS, so deploy it (for example to Netlify or Vercel) to test that.

## Configure the AI Buddy on Cloudflare Pages

The AI Buddy uses the Cloudflare Pages Function at `functions/api/chat.ts` and Cloudflare Workers AI. No provider API key is required.

1. Deploy this project to Cloudflare Pages with the build command `pnpm run build` and output directory `dist`.
2. In the Cloudflare dashboard, open the Pages project **Settings → Bindings → Add → Workers AI**. Set **Variable name** to `AI`. Configure production and preview separately if both environments should use AI.
3. Redeploy the Pages project so the Function can use the binding.
4. Configure rate limiting for `POST /api/chat` before sharing the app publicly. Workers AI usage may be subject to Cloudflare plan limits or charges.

Learners do not need to enter a key. Their AI questions are sent to the PAMANA Function and Cloudflare Workers AI; learning progress remains local to the app. The AI Buddy is unavailable in the local Vite dev server and static-only preview unless the Pages Function is deployed.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Development server with hot reload |
| `pnpm pwa` | Production build and preview (use this to test install/offline) |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests |
| `pnpm check` | Typecheck, tests and build |

## Deploying

Host the `dist/` folder on any static host with a **single-page-app fallback** (unknown paths must serve `index.html`), over HTTPS, at the site root. Learner progress stays in each learner's own browser.

See `CLAUDE.md` for architecture and offline/PWA details.
