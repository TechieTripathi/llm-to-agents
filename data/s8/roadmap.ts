// Slide 63 — adoption and evaluation roadmap. Kestrel Freight pilot is fictional; all numbers are illustrative.
export interface Station { id: string, kind: 'stage' | 'gate', name: string, what: string, at: number }

/** `at` = the step at which the station becomes active. */
export const STATIONS: Station[] = [
  { id: 'choose', kind: 'stage', name: 'Choose', what: 'A frequent, low-risk task', at: 0 },
  { id: 'baseline', kind: 'stage', name: 'Baseline', what: 'Measure it as done today', at: 0 },
  { id: 'gate1', kind: 'gate', name: 'Gate 1', what: 'Safe to try?', at: 1 },
  { id: 'pilot', kind: 'stage', name: 'Pilot', what: 'Few people, fixed weeks', at: 1 },
  { id: 'evaluate', kind: 'stage', name: 'Evaluate', what: 'Time, quality, rework, risk', at: 2 },
  { id: 'gate2', kind: 'gate', name: 'Gate 2', what: 'Better, safely?', at: 3 },
  { id: 'improve', kind: 'stage', name: 'Improve', what: 'Fix, then re-test', at: 4 },
  { id: 'expand', kind: 'stage', name: 'Expand', what: 'Next team, same measures', at: 4 },
]

/** NIST AI RMF core functions, aligned loosely to the stations (teaching mapping, not NIST's own). */
export const RMF = [
  { fn: 'Map', from: 0, to: 2, note: 'context and risks' },
  { fn: 'Measure', from: 3, to: 4, note: 'test and track' },
  { fn: 'Manage', from: 5, to: 7, note: 'act on results' },
]

export const STEP_LABELS = ['Choose and baseline', 'Gate 1 and pilot', 'Evaluate', 'Gate 2: decide', 'Improve, then expand', 'Who governs it']

export const CHOOSE = {
  task: 'Weekly Project Lark status report',
  owner: 'Priya Nair, project manager',
  why: ['Done every week', 'Internal data only', 'A person reviews it before it is sent'],
  baseline: [
    { k: 'Time per report', v: '90 min' },
    { k: 'Reviewer checklist', v: '8 / 10 items met' },
    { k: 'Corrections after sending', v: '2 in 4 weeks' },
  ],
}

export const GATE1 = [
  { q: 'Approved tool', a: 'Yes' },
  { q: 'Data class', a: 'Internal only' },
  { q: 'Owner', a: 'Priya Nair' },
  { q: 'Reviewer', a: 'Helen Brooks' },
]
export const PILOT = [
  { k: 'Who', v: '3 project managers' },
  { k: 'How long', v: '4 weeks' },
  { k: 'Review', v: 'Every draft, before sending' },
  { k: 'Logged', v: 'Time, fixes, issues' },
]

export const SCORE = [
  { m: 'Time', base: '90 min', pilot: '40 min incl. review', state: 'ok' as const },
  { m: 'Quality', base: '8 / 10', pilot: '9 / 10', state: 'ok' as const },
  { m: 'Rework', base: '2 fixes', pilot: '1 fix', state: 'ok' as const },
  { m: 'Risk', base: 'none seen', pilot: '1 wrong date, caught in review', state: 'warn' as const },
]

export const DECISION = [
  { id: 'expand', when: 'Better on every measure', then: 'Expand now', pick: false },
  { id: 'improve', when: 'Better, but a risk signal', then: 'Improve first', pick: true },
  { id: 'stop', when: 'Not better, or not safe', then: 'Stop', pick: false },
]

export const IMPROVE = [
  { k: 'Change', v: 'Date check in prompt and checklist' },
  { k: 'Re-test', v: '2 more weeks: no misses' },
]
export const EXPAND = [
  { k: 'Scope', v: '2 more project teams' },
  { k: 'Keep', v: 'Same measures, same review' },
  { k: 'Next gate', v: 'Re-evaluate after 4 weeks' },
]
