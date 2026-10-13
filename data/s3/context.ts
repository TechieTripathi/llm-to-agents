// Slide 21 — context versus clever wording. Same question; the presenter adds either polished
// wording or pieces of context. Answers are hand-written simulations (fictional Kestrel Freight data).

export const QUESTION = 'Should we approve CR-7 (text alerts) before the 27 Oct go-live?'

export const CLEVER = '“You are a world-class consultant. Think step by step.”'

export type CtxKey = 'policy' | 'decision' | 'source' | 'audience' | 'constraint'

export interface CtxItem {
  key: CtxKey
  kind: string
  text: string
  /** Sentence this item contributes to the answer. */
  adds: string
}

export const CONTEXT: CtxItem[] = [
  { key: 'policy', kind: 'Policy', text: 'Change freeze starts 1 Nov', adds: 'The change freeze starts 1 Nov, five days after go-live: no window to release it.' },
  { key: 'decision', kind: 'Prior decision', text: 'CR-7 deferred to Jan (12 Sep)', adds: 'Steering already deferred it to January on 12 Sep.' },
  { key: 'source', kind: 'Source data', text: '2 open defects; tests end 22 Oct', adds: 'Two serious defects are open and testing ends 22 Oct.' },
  { key: 'constraint', kind: 'Constraint', text: 'Contract: live by 15 Nov', adds: 'New scope now risks the 15 Nov contract date.' },
  { key: 'audience', kind: 'Audience', text: 'Helen wants yes/no, then why', adds: '' },
]

export const GENERIC = 'Whether to approve CR-7 depends on its benefits, costs and risks. Consider the impact on timelines and testing, consult stakeholders, and make sure it aligns with business priorities.'

export const GENERIC_CLEVER = 'Decisively: proceed with caution. Weigh CR-7’s strategic value against delivery risk, run a structured impact assessment, and align stakeholders before committing.'

export const RECOMMEND = 'Recommendation: do not approve CR-7 before go-live.'
export const RECOMMEND_AUDIENCE = 'Helen, short answer: no. Keep CR-7 for January.'

/** Clicker order: bare question, then clever wording, then one context item per click. */
export const STEPS: { clever: boolean, ctx: CtxKey[], label: string }[] = [
  { clever: false, ctx: [], label: 'Bare question' },
  { clever: true, ctx: [], label: 'Clever wording' },
  { clever: true, ctx: ['policy'], label: '+ policy' },
  { clever: true, ctx: ['policy', 'decision'], label: '+ decision' },
  { clever: true, ctx: ['policy', 'decision', 'source'], label: '+ data' },
  { clever: true, ctx: ['policy', 'decision', 'source', 'constraint'], label: '+ constraint' },
  { clever: true, ctx: ['policy', 'decision', 'source', 'constraint', 'audience'], label: '+ audience' },
]
