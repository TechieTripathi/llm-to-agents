// Verify every Sources appendix page fits in two columns (no entry spills to a third column).
// Usage: node scripts/check-sources-fit.mjs <port> <firstAppendixSlide> <pages>
import { chromium } from 'playwright-chromium'
const [port, first, pages] = process.argv.slice(2).map(Number)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 980, height: 552 } })
let bad = 0
for (let i = 0; i < pages; i++) {
  await p.goto(`http://localhost:${port}/${first + i}?embedded=true`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(500)
  const r = await p.evaluate((no) => {
    const ol = document.querySelector(`.slidev-page-${no} .sources`); if (!ol) return null
    const box = ol.getBoundingClientRect()
    const items = [...ol.querySelectorAll('li')]
    const spill = items.filter(li => li.getBoundingClientRect().right > box.right + 1).length
    return { n: items.length, spill, first: items[0]?.querySelector('.n')?.textContent }
  }, first + i)
  console.log(`slide ${first + i}:`, r)
  if (!r || r.spill) bad++
}
await b.close()
process.exit(bad ? 1 : 0)
