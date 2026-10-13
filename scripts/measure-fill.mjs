// For each artifact slide, measure how much of the available content height the artifact uses
// at its tallest click state, and suggest a per-slide `scale` (frontmatter) that fills ~90%.
// Usage: node scripts/measure-fill.mjs <port> <from> <to>
import { chromium } from 'playwright-chromium'
const [port, from, to] = process.argv.slice(2).map(Number)
const BASE = 0.86
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 980, height: 552 } })
const rows = []
for (let n = from; n <= to; n++) {
  let maxContent = 0, avail = 0, zoom = BASE, isArtifact = false
  for (const c of [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 99]) {
    await p.goto(`http://localhost:${port}/${n}?clicks=${c}&embedded=true`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(350)
    const m = await p.evaluate((no) => {
      const body = document.querySelector(`.slidev-page-${no} .l-artifact > .body`)
      if (!body) return null
      const kids = [...body.children].filter(k => k.getBoundingClientRect().height > 0)
      if (!kids.length) return null
      const top = Math.min(...kids.map(k => k.getBoundingClientRect().top))
      const bottom = Math.max(...kids.map(k => k.getBoundingClientRect().bottom))
      return { avail: body.getBoundingClientRect().height, content: bottom - top, zoom: Number(getComputedStyle(body).zoom) || 1 }
    }, n)
    if (!m) break
    isArtifact = true
    avail = m.avail; zoom = m.zoom
    maxContent = Math.max(maxContent, m.content)
  }
  if (!isArtifact) continue
  const fill = maxContent / avail
  const suggest = Math.min(1, Math.floor((zoom * 0.9 / fill) * 50) / 50)
  rows.push({ n, fill: Math.round(fill * 100), zoom, suggest })
  console.log(`slide ${String(n).padStart(2)}  uses ${String(Math.round(fill * 100)).padStart(3)}%  zoom ${zoom}  suggest ${suggest.toFixed(2)}${suggest >= 0.92 ? '  <- enlarge' : ''}${fill > 1 ? '  !! overflow' : ''}`)
}
await b.close()
