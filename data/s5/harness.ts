// Slide 43 — runtime controls around an autonomous agent loop (fictional Lark report agent).
// Configuration values are illustrative examples.
export const CONTROLS = [
  { n: 1, name: 'Tool permissions', config: 'read data, write drafts only', prevents: 'actions outside the task' },
  { n: 2, name: 'Schemas', config: 'calls must match the declared shape', prevents: 'malformed or out-of-range calls' },
  { n: 3, name: 'Validation', config: 'results and drafts checked', prevents: 'bad data reaching the report' },
  { n: 4, name: 'Budgets', config: '30 calls, 15 min, cost cap', prevents: 'runaway loops and surprise costs' },
  { n: 5, name: 'State', config: 'task record saved each step', prevents: 'lost progress and repeated actions' },
  { n: 6, name: 'Error handling', config: 'retry, change or escalate', prevents: 'crashes and silent failure' },
  { n: 7, name: 'Audit trail', config: 'every call, result, decision', prevents: 'outcomes nobody can explain' },
]
