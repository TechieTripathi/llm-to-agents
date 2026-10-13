// Slide 42 — loop engineering. An illustrative loop specification for the fictional weekly Lark report,
// and the paths a run can take through the loop. Limits are examples, not recommendations.

export type EdgeId = 'bd' | 'de' | 'eg' | 'er' | 'rd' | 'rx' | 'gs' | 'gb' | 'bt'
export type SpecId = 'success' | 'check' | 'retry' | 'budget' | 'escalate' | 'safe'

export const SPEC: { id: SpecId, k: string, v: string }[] = [
  { id: 'success', k: 'Done when', v: 'Figures traced; totals reconcile' },
  { id: 'check', k: 'Check every step', v: 'Valid shape; data from this week' },
  { id: 'retry', k: 'Retry limit', v: '2 per call, each with a change' },
  { id: 'budget', k: 'Budget', v: '30 tool calls or 15 minutes' },
  { id: 'escalate', k: 'Escalate to', v: 'Priya Nair, with the reason' },
  { id: 'safe', k: 'Safe stop', v: 'Save state, log why, notify' },
]

export const PATHS: { id: string, label: string, edges: EdgeId[], end: 'S' | 'X' | 'T', spec: SpecId[], story: string }[] = [
  { id: 'pass', label: 'Passes', edges: ['bd', 'de', 'eg', 'gs'], end: 'S', spec: ['success', 'check'],
    story: 'Each step is checked; when every criterion holds, the loop stops with a result.' },
  { id: 'once', label: 'Fails once', edges: ['bd', 'de', 'er', 'rd', 'eg', 'gs'], end: 'S', spec: ['retry', 'success'],
    story: 'One failed check, one retry with a change, then success.' },
  { id: 'stuck', label: 'Keeps failing', edges: ['bd', 'de', 'er', 'rx'], end: 'X', spec: ['retry', 'escalate'],
    story: 'Retries run out, so a person gets the problem and the reason.' },
  { id: 'budget', label: 'Out of budget', edges: ['gb', 'bt'], end: 'T', spec: ['budget', 'safe'],
    story: 'Not finished, but the budget is spent: stop safely and say why.' },
]
