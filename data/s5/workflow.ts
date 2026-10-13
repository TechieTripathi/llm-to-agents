// Slide 45 — workflow builder (Artifact I): the fictional weekly Lark report as a controlled workflow.
export type Who = 'agent' | 'person'
export type StageId = 'request' | 'retrieve' | 'draft' | 'validate' | 'approve' | 'deliver'

export interface WfStage {
  id: StageId
  name: string
  who: Who
  /** Whether the presenter may remove the stage or change who does it. */
  removable: boolean
  whoEditable: boolean
  inputs: string
  output: string
  fails: string
}

export const STAGES: WfStage[] = [
  { id: 'request', name: 'Request', who: 'person', removable: false, whoEditable: false,
    inputs: 'Period, audience, template', output: 'A clear task brief',
    fails: 'Period or audience missing: ask first' },
  { id: 'retrieve', name: 'Get authorized data', who: 'agent', removable: true, whoEditable: true,
    inputs: 'Tracker, budget sheet (read-only)', output: 'Dated extracts with links',
    fails: 'Source down: retry twice, then escalate' },
  { id: 'draft', name: 'Draft report', who: 'agent', removable: false, whoEditable: true,
    inputs: 'Extracts, template, last report', output: 'Draft with every figure cited',
    fails: 'Figure without a source: mark as gap' },
  { id: 'validate', name: 'Validate figures', who: 'agent', removable: true, whoEditable: true,
    inputs: 'Draft and source extracts', output: 'Each figure matched or flagged',
    fails: 'Totals differ: redraft or ask Mei Chen' },
  { id: 'approve', name: 'Approve', who: 'person', removable: true, whoEditable: true,
    inputs: 'Draft and the check report', output: 'Approve, change or reject (logged)',
    fails: 'No decision by Thu 17:00: remind' },
  { id: 'deliver', name: 'Deliver', who: 'agent', removable: false, whoEditable: false,
    inputs: 'The approved version only', output: 'Sent to Helen Brooks; logged',
    fails: 'Not the approved version: block' },
]

export interface Preset { selected: StageId, off: StageId[], who?: Partial<Record<StageId, Who>> }

/** One preset per click, so the PDF shows each stage and each removed safeguard. */
export const PRESETS: Preset[] = [
  { selected: 'request', off: [] },
  { selected: 'retrieve', off: [] },
  { selected: 'draft', off: [] },
  { selected: 'validate', off: [] },
  { selected: 'approve', off: [] },
  { selected: 'deliver', off: [] },
  { selected: 'validate', off: ['validate'] },
  { selected: 'approve', off: ['validate'], who: { approve: 'agent' } },
]

export interface Warning { tone: 'bad' | 'warn', text: string }
export function warningsFor(off: StageId[], who: Record<StageId, Who>): Warning[] {
  const w: Warning[] = []
  if (off.includes('retrieve'))
    w.push({ tone: 'bad', text: 'No source data: figures may be invented.' })
  if (off.includes('validate'))
    w.push({ tone: 'bad', text: 'Unchecked figures can reach Helen as fact.' })
  if (off.includes('approve'))
    w.push({ tone: 'bad', text: 'Nobody decides: the agent acts on its own output.' })
  else if (who.approve === 'agent')
    w.push({ tone: 'bad', text: 'An agent approving its own work is not approval.' })
  if (!off.includes('validate') && who.validate === 'person')
    w.push({ tone: 'warn', text: 'Manual checks work, but cost time every week.' })
  return w
}
