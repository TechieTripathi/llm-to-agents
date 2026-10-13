// Slide 64 — personal action plan. The default is a filled-in fictional Kestrel Freight example,
// so the exported PDF shows a complete plan.
export type Risk = 'low' | 'medium' | 'high'

export interface Plan {
  task: string
  inputs: string
  output: string
  risk: Risk
  verify: string
  measure: string
}

export const EXAMPLE: Plan = {
  task: 'Weekly Project Lark status report',
  inputs: 'Meeting notes, task-tracker export, last week\'s report',
  output: 'One-page report: progress, risks, decisions needed',
  risk: 'low',
  verify: 'Check dates and owners against the tracker; Helen reviews',
  measure: 'Under 45 min, with no corrections, 4 weeks running',
}

export const BLANK: Plan = { task: '', inputs: '', output: '', risk: 'low', verify: '', measure: '' }

export const FIELDS: { key: Exclude<keyof Plan, 'risk'>, label: string, placeholder: string, rows?: number }[] = [
  { key: 'task', label: 'One recurring task', placeholder: 'e.g. Monthly supplier performance summary' },
  { key: 'inputs', label: 'Inputs it needs', placeholder: 'Documents, data, notes', rows: 2 },
  { key: 'output', label: 'Desired output', placeholder: 'Format, length, audience', rows: 2 },
  { key: 'verify', label: 'How I will verify it', placeholder: 'What I check, against what, and who reviews' },
  { key: 'measure', label: 'Success measure', placeholder: 'Time, quality, rework', rows: 2 },
]

export const RISKS: { id: Risk, label: string, state: 'ok' | 'warn' | 'bad', advice: string }[] = [
  { id: 'low', label: 'Low', state: 'ok', advice: 'good first candidate' },
  { id: 'medium', label: 'Medium', state: 'warn', advice: 'pilot it with full human review' },
  { id: 'high', label: 'High', state: 'bad', advice: 'pick a lower-risk task first' },
]

export const STORAGE_KEY = 's8-action-plan-v1'
