// Slide 2 — the same weekly Project Lark update, done two ways. Fictional (see data/universe.ts).

export type Actor = 'pm' | 'ai'

export interface WorkflowRow {
  stage: string
  before: { text: string }
  after: { actor: Actor, text: string, review?: boolean }
}

export const ROWS: WorkflowRow[] = [
  {
    stage: 'Gather',
    before: { text: 'Chases five leads for their updates' },
    after: { actor: 'pm', text: 'Attaches tracker, notes and risk log' },
  },
  {
    stage: 'Make sense',
    before: { text: 'Reads it all to spot what changed' },
    after: { actor: 'ai', text: 'Summarises what changed, with sources' },
  },
  {
    stage: 'Draft',
    before: { text: 'Writes it from a blank page' },
    after: { actor: 'ai', text: 'Drafts it in the team’s template' },
  },
  {
    stage: 'Check',
    before: { text: 'Proofreads her own draft' },
    after: { actor: 'pm', text: 'Checks each claim against sources', review: true },
  },
  {
    stage: 'Send',
    before: { text: 'Adds her judgement and sends it' },
    after: { actor: 'pm', text: 'Adds judgement, approves, sends', review: true },
  },
]
