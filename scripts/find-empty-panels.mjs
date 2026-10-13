// Find white panels inside artifacts that are mostly empty (content uses < 55% of the panel height).
// Usage: node scripts/find-empty-panels.mjs <port> <from> <to>
import { chromium } from 'playwright-chromium'
const [port, from, to] = process.argv.slice(2).map(Number)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 980, height: 552 } })
for (let n = from; n <= to; n++) {
  for (const c of [0, 99]) {
    await p.goto(`http://localhost:${port}/${n}?clicks=${c}&embedded=true`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(500)
    const hits = await p.evaluate((no) => {
      const root = document.querySelector(`.slidev-page-${no} .stage`) || document.querySelector(`.slidev-page-${no}`)
      if (!root) return []
      const out = []
      for (const el of root.querySelectorAll('*')) {
        const cs = getComputedStyle(el)
        const bg = cs.backgroundColor
        if (!(bg === 'rgb(255, 255, 255)')) continue
        const r = el.getBoundingClientRect()
        if (r.height < 120 || r.width < 150) continue
        let bottom = r.top
        for (const ch of el.querySelectorAll('*')) {
          const cr = ch.getBoundingClientRect()
          if (cr.height > 0 && cr.width > 0 && getComputedStyle(ch).visibility !== 'hidden' && cr.bottom <= r.bottom + 1) bottom = Math.max(bottom, cr.bottom)
        }
        const used = (bottom - r.top) / r.height
        if (used < 0.55) out.push(`${el.className?.toString().slice(0, 40)} h=${Math.round(r.height)} used=${Math.round(used * 100)}%`)
      }
      return out
    }, n)
    if (hits.length) console.log(`slide ${n} ${c ? 'end' : 'start'}: ${hits.join(' | ')}`)
  }
}
await b.close()
