// Slide 5 — which approach fits which task? Fictional Kestrel Freight tasks; verdicts are
// teaching judgements (reasoned from the task profile), not measured results.

export type Fit = 'ok' | 'warn' | 'bad'
export type ApproachId = 'rules' | 'assist' | 'workflow'

export const APPROACHES: { id: ApproachId, name: string, sub: string }[] = [
  { id: 'rules', name: 'Rules and forms', sub: 'Deterministic software' },
  { id: 'assist', name: 'Language assistant', sub: 'Chat with a model' },
  { id: 'workflow', name: 'Tool-mediated workflow', sub: 'Model + tools + checks' },
]

export const TRAITS = [
  { id: 'fixed', label: 'Fixed rules' },
  { id: 'exact', label: 'One exact answer' },
  { id: 'language', label: 'Open-ended language' },
  { id: 'live', label: 'Live data or actions' },
] as const
export type TraitId = typeof TRAITS[number]['id']

export interface Task {
  id: string
  name: string
  traits: TraitId[]
  fit: Record<ApproachId, { fit: Fit, why: string }>
}

export const TASKS: Task[] = [
  {
    id: 'payroll',
    name: 'Calculate monthly payroll',
    traits: ['fixed', 'exact'],
    fit: {
      rules: { fit: 'ok', why: 'Same inputs, same result, every time. Auditable.' },
      assist: { fit: 'bad', why: 'Fluent is not exact, and output can vary between runs.' },
      workflow: { fit: 'warn', why: 'Only around the edges: explaining a payslip.' },
    },
  },
  {
    id: 'vat',
    name: 'Compute VAT on invoices',
    traits: ['fixed', 'exact'],
    fit: {
      rules: { fit: 'ok', why: 'Tax rules are fixed; the answer must be exact.' },
      assist: { fit: 'bad', why: 'Every figure would need checking by hand.' },
      workflow: { fit: 'warn', why: 'Could call the tax engine, but adds risk for no gain.' },
    },
  },
  {
    id: 'notes',
    name: 'Meeting notes to actions',
    traits: ['language'],
    fit: {
      rules: { fit: 'bad', why: 'Messy free text; no form can anticipate it.' },
      assist: { fit: 'ok', why: 'Language in, action list out. A person checks it.' },
      workflow: { fit: 'warn', why: 'Worth it if actions must flow into the tracker.' },
    },
  },
  {
    id: 'complaint',
    name: 'Answer a delivery complaint',
    traits: ['language', 'live'],
    fit: {
      rules: { fit: 'bad', why: 'A template cannot read what the customer wrote.' },
      assist: { fit: 'warn', why: 'Drafts well, but cannot see the shipment record.' },
      workflow: { fit: 'ok', why: 'Looks up the shipment, drafts; a person approves.' },
    },
  },
  {
    id: 'update',
    name: 'Weekly Project Lark update',
    traits: ['language', 'live'],
    fit: {
      rules: { fit: 'bad', why: 'What matters this week cannot be written as rules.' },
      assist: { fit: 'warn', why: 'Works if Priya pastes in every source by hand.' },
      workflow: { fit: 'ok', why: 'Pulls the sources, drafts; Priya checks and sends.' },
    },
  },
  {
    id: 'expense',
    name: 'Check expense claims',
    traits: ['fixed', 'exact', 'language'],
    fit: {
      rules: { fit: 'ok', why: 'Limits and categories are fixed: software enforces them.' },
      assist: { fit: 'warn', why: 'Can flag odd descriptions, but must not decide.' },
      workflow: { fit: 'warn', why: 'Rules decide; a model explains a rejection plainly.' },
    },
  },
]

export const CLICK_TASKS = ['payroll', 'notes', 'complaint']
