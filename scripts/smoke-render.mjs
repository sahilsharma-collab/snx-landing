// Renders every route once on the server and reports any page that throws.
// Catches render-time crashes (bad variables, broken data) without a browser.
//   node scripts/smoke-render.mjs
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

const routes = [
  '/', '/pricing', '/features', '/blog', '/compare',
  '/compare/appbrew-vs-nuvo', '/compare/shopney-vs-nuvo',
  '/features/automations', '/features/analytics', '/features/native-app', '/features/guide-ai',
  '/features/push', '/features/personalization', '/features/checkout', '/features/content',
]

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
let failed = 0
try {
  const { default: App } = await vite.ssrLoadModule('/src/app/App.tsx')
  for (const url of routes) {
    try {
      const html = renderToString(React.createElement(MemoryRouter, { initialEntries: [url] }, React.createElement(App)))
      console.log(`ok    ${url}  (${Math.round(html.length / 1024)} KB)`)
    } catch (e) {
      failed++
      console.log(`FAIL  ${url}  ${e.message}`)
    }
  }
} finally {
  await vite.close()
}
process.exit(failed ? 1 : 0)
