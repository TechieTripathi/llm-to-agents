// Slide 30 — fictional Kestrel Freight policy excerpt and the fields extracted from it.
// Each field points at the span(s) of text it came from. Everything here is invented.
export interface Seg { t: string, span?: string }
export type FieldState = 'ok' | 'warn' | 'neutral'

export interface Field {
  key: string
  value: string | number | null
  spans: string[]
  state: FieldState
  label: string
  note: string
}

export const DOC_TITLE = 'Subcontracted haulier policy'
export const DOC_ID = 'KF-OPS-014 v3'

export const DOC: Seg[][] = [
  [
    { t: 'This policy applies to ' },
    { t: 'all depots that book third-party hauliers', span: 'scope' },
    { t: ' for overflow volume. ' },
    { t: 'It takes effect on 1 November 2026', span: 'date' },
    { t: '.' },
  ],
  [
    { t: 'Policy owner: ', span: 'owner' },
    { t: 'Tomás Ruiz, Operations lead.', span: 'owner' },
  ],
  [
    { t: 'Every haulier must hold ' },
    { t: 'goods-in-transit insurance of at least €250,000', span: 'ins' },
    { t: ' and a valid operator licence.' },
  ],
  [
    { t: 'Bookings ' },
    { t: 'above €25,000 in a calendar month', span: 'thr' },
    { t: ' need written approval from the ' },
    { t: 'Operations director', span: 'appr' },
    { t: '.' },
  ],
  [
    { t: 'Review note, 12 Sept: ' },
    { t: 'Finance asks to lower the approval limit to €20,000 — not yet agreed.', span: 'thr2' },
  ],
]

export const FIELDS: Field[] = [
  { key: 'effective_date', value: '2026-11-01', spans: ['date'], state: 'ok', label: 'Traced', note: 'Read “1 November 2026” and wrote it as a standard date.' },
  { key: 'owner', value: 'Tomás Ruiz, Operations lead', spans: ['owner'], state: 'ok', label: 'Traced', note: 'Copied word for word from the owner line.' },
  { key: 'applies_to', value: 'Depots booking outside hauliers', spans: ['scope'], state: 'ok', label: 'Traced', note: 'A short paraphrase of the scope sentence. Check paraphrases.' },
  { key: 'min_insurance_eur', value: 250000, spans: ['ins'], state: 'ok', label: 'Traced', note: '“at least €250,000” became the number 250000.' },
  { key: 'approval_limit_eur', value: 25000, spans: ['thr', 'thr2'], state: 'warn', label: 'Conflict', note: 'The policy says €25,000; a later note proposes €20,000. Flagged for a person to decide.' },
  { key: 'approver', value: 'Operations director', spans: ['appr'], state: 'ok', label: 'Traced', note: 'The role only. The document names no person, so none is added.' },
  { key: 'review_date', value: null, spans: [], state: 'neutral', label: 'Not stated', note: 'No review date anywhere in the text. Left empty instead of guessed.' },
]
