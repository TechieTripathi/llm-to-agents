// Slide 55 — one task at three levels of assistance. Fictional (Kestrel Freight, Project Lark).
// The on-time figure is the thread: invented → copied stale → checked against the CSV.
import { depotTotals, reportedOnTime } from './raw'

export const TASK = 'Send Helen Brooks this week’s Project Lark update'

export interface Level {
  id: 'chat' | 'context' | 'workflow'
  name: string
  short: string
  /** What the person supplies. */
  give: string
  /** Optional file chips for what is supplied. */
  files?: string[]
  /** What comes back, in one line. */
  get: string
  /** The on-time figure that appears in the draft, and what it really is. */
  figure: { value: string, state: 'bad' | 'warn' | 'ok', label: string, note: string }
  /** What checks the output before it reaches Helen. */
  checks: string
  /** Illustrative effort, 1–5: set-up before, review and fixing after. */
  setup: number
  review: number
  fit: string
}

export const LEVELS: Level[] = [
  {
    id: 'chat',
    name: 'Basic chat',
    short: 'Ask',
    give: 'One line: “Write a weekly update for Project Lark.”',
    get: 'A fluent template. Facts are guessed or left [blank].',
    figure: { value: '96%', state: 'bad', label: 'Invented', note: 'No data was given.' },
    checks: 'None built in. It all rests on your reading.',
    setup: 1,
    review: 5,
    fit: 'For brainstorming',
  },
  {
    id: 'context',
    name: 'Context-rich assistance',
    short: 'Ask with sources',
    give: 'The request +',
    files: ['report', 'metrics', 'notes'],
    get: 'A specific draft with real milestones, owners and risks.',
    figure: { value: reportedOnTime, state: 'warn', label: 'Stale', note: 'Copied from a stale report.' },
    checks: 'You read it. Nothing re-checks the figures.',
    setup: 2,
    review: 3,
    fit: 'For one-off drafts',
  },
  {
    id: 'workflow',
    name: 'Controlled workflow',
    short: 'Ask, check, approve',
    give: 'Approved sources, a checklist and a named approver.',
    get: 'Same draft; figures recomputed, mismatches flagged.',
    figure: { value: `${depotTotals.rate}%`, state: 'ok', label: 'Checked', note: `${depotTotals.onTime.toLocaleString('en-GB')} of ${depotTotals.shipments.toLocaleString('en-GB')}: below target` },
    checks: 'Figures vs the CSV, owners vs notes. Priya approves.',
    setup: 4,
    review: 2,
    fit: 'For recurring, costly work',
  },
]
