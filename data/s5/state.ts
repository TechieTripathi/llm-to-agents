// Slide 41 — four places information can live during a multi-step agent run (fictional Lark example),
// and what happens to a caveat when the working context is compacted.

export interface Store {
  id: 'context' | 'state' | 'memory' | 'storage'
  name: string
  what: string
  lives: string
  items: { id: string, text: string, key?: boolean }[]
}

export const STORES: Store[] = [
  {
    id: 'context',
    name: 'Working context',
    what: 'What the model reads now',
    lives: 'Lasts until compacted',
    items: [
      { id: 'goal', text: 'Goal and instructions' },
      { id: 'results', text: 'Tool results, steps 1–8' },
      { id: 'caveat', text: 'Mei: Oct is provisional', key: true },
      { id: 'draft', text: 'Draft so far' },
    ],
  },
  {
    id: 'state',
    name: 'Explicit state',
    what: 'Kept by the harness',
    lives: 'Lasts the whole run',
    items: [
      { id: 'check', text: 'Checklist: 2 of 3 done' },
      { id: 'figs', text: '14 open · €628k spent' },
      { id: 'retries', text: 'Retries: 1 of 2' },
    ],
  },
  {
    id: 'memory',
    name: 'Retrieved memory',
    what: 'Searched when needed',
    lives: 'Lasts across runs',
    items: [
      { id: 'last', text: 'Last week\'s report' },
      { id: 'pref', text: 'Style: one page' },
    ],
  },
  {
    id: 'storage',
    name: 'Persistent storage',
    what: 'Systems of record',
    lives: 'Durable',
    items: [
      { id: 'sys', text: 'Tracker, budget sheet' },
      { id: 'drafts', text: 'Saved drafts' },
      { id: 'audit', text: 'Audit log' },
    ],
  },
]

export const STATE_STEPS = [
  { event: 'Step 8 of the run. Each place holds different things for different lengths of time.', draft: null },
  { event: 'Step 9: the context is nearly full, so older turns are compacted into a summary.', draft: null },
  { event: 'The summary kept the figure but dropped the caveat.', draft: { text: 'Spend to date: €628k.', tone: 'bad' as const, verdict: 'Provisional figure reported as final' } },
  { event: 'Fix in the harness: caveats and decisions are written to explicit state as they arrive.', draft: { text: 'Spend to date: €628k (provisional, per Mei Chen).', tone: 'ok' as const, verdict: 'Caveat survives compaction' } },
]
