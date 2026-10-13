// Static checks on the deck source: slide count, sections, speaker notes, citation keys.
// Usage: node scripts/check-deck.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from '@slidev/parser/fs'

const root = process.cwd()
const data = await load({ roots: [root], userRoot: root }, resolve(root, 'slides.md'))
const slides = data.slides
const core = slides.filter(s => !['sources', 'institution-cover'].includes(s.frontmatter?.layout))
const problems = []

// Collect citation keys from data/refs/*.ts with a simple scan.
const keys = new Set()
for (const f of readdirSync('data/refs').filter(f => f.endsWith('.ts'))) {
  for (const m of readFileSync(`data/refs/${f}`, 'utf8').matchAll(/key:\s*'([^']+)'/g)) {
    if (keys.has(m[1])) problems.push(`Duplicate ref key ${m[1]} (in ${f})`)
    keys.add(m[1])
  }
}

const perSection = {}
core.forEach((s, i) => {
  const no = i + 1
  const fm = s.frontmatter ?? {}
  const sec = fm.section
  if (!sec) problems.push(`Slide ${no}: missing section`)
  perSection[sec] = (perSection[sec] ?? 0) + 1
  const note = (s.note ?? '').trim()
  if (note.length < 120) problems.push(`Slide ${no}: speaker notes missing or very short (${note.length} chars)`)
  if (/PLACEHOLDER|TODO|FIXME|[Ll]orem ipsum/.test(s.content + note)) problems.push(`Slide ${no}: placeholder text`)
  const src = Array.isArray(fm.sources) ? fm.sources : fm.sources ? [fm.sources] : []
  for (const k of src) if (!keys.has(k)) problems.push(`Slide ${no}: unknown source key ${k}`)
  for (const m of (s.content ?? '').matchAll(/<Cite\s+k="([^"]+)"/g))
    if (!src.includes(m[1])) problems.push(`Slide ${no}: <Cite k="${m[1]}"> not listed in frontmatter sources`)
})

console.log(`Core slides: ${core.length} (expected 65); appendix slides: ${slides.filter(s => s.frontmatter?.layout === 'sources').length}; cover: ${slides.filter(s => s.frontmatter?.layout === 'institution-cover').length}`)
console.log('Slides per section:', perSection)
console.log(`Reference keys defined: ${keys.size}`)
console.log(problems.length ? `\n${problems.length} problem(s):\n- ${problems.join('\n- ')}` : '\nNo problems found.')
process.exit(problems.length ? 1 : 0)
