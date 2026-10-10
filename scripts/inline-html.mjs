// Folds the standalone build (dist-html/) into one self-contained HTML file:
// the stylesheet and the JS bundle are inlined, so it opens from disk.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist-html'
let html = readFileSync(join(dir, 'index.html'), 'utf8')

html = html.replace(/<link rel="stylesheet"[^>]*href="\.?\/?([^"]+)"[^>]*>/g, (_, href) =>
  `<style>${readFileSync(join(dir, href), 'utf8')}</style>`)

html = html.replace(/<script type="module"[^>]*src="\.?\/?([^"]+)"[^>]*><\/script>/g, (_, src) => {
  // "</script" inside the bundle would end the inline tag early
  const js = readFileSync(join(dir, src), 'utf8').replace(/<\/script/gi, '<\/script')
  return `<script type="module">${js}</script>`
})

writeFileSync('nuvo-site.html', html)
console.log(`nuvo-site.html written (${Math.round(html.length / 1024)} KB)`)
