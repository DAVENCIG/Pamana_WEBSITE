import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// Only the version number reaches the browser bundle, not the rest of package.json.
const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')) as {
  version: string
}

export default defineConfig({
  base: '/',
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react(), tailwindcss(), pamanaServiceWorker()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // `host: true` makes the dev and preview servers reachable from a phone on the same Wi-Fi.
  server: { host: true, ...(process.env.PORT ? { port: Number(process.env.PORT) } : {}) },
  preview: { host: true, ...(process.env.PORT ? { port: Number(process.env.PORT) } : {}) },
})

/**
 * Stamps public/sw.js in the build output with a build id and the list of every emitted file,
 * so the service worker precaches all hashed and lazy-loaded chunks and old caches are replaced
 * on each release. Skipped when the worker is not part of the output.
 */
function pamanaServiceWorker(): Plugin {
  let outDir = 'dist'
  let root = process.cwd()
  return {
    name: 'pamana-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      root = config.root
    },
    closeBundle() {
      const dir = path.resolve(root, outDir)
      const swPath = path.join(dir, 'sw.js')
      if (!fs.existsSync(swPath)) return
      const files: string[] = []
      const walk = (d: string) => {
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
          const full = path.join(d, entry.name)
          if (entry.isDirectory()) walk(full)
          else files.push(path.relative(dir, full).split(path.sep).join('/'))
        }
      }
      walk(dir)
      const precache = files.filter(
        (f) => f !== 'sw.js' && !f.endsWith('.map') && !f.startsWith('.'),
      )
      const hash = crypto
        .createHash('sha256')
        .update(precache.map((f) => f + fs.statSync(path.join(dir, f)).size).join('|'))
        .digest('hex')
        .slice(0, 10)
      const source = fs
        .readFileSync(swPath, 'utf8')
        .replace('__BUILD_ID__', hash)
        .replace('/*__PRECACHE__*/ []', JSON.stringify(precache))
      fs.writeFileSync(swPath, source)
    },
  }
}
