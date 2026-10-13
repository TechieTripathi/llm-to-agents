// Slide 26 — review loop: targeted correction versus unsupported regeneration ("try again").
// Fictional drafts; check results are simulated to show typical behaviour.

export type CheckKey = 'figures' | 'dates' | 'sections' | 'length'
export const CHECKS: { key: CheckKey, label: string, against: string }[] = [
  { key: 'figures', label: 'Figures', against: 'tracker' },
  { key: 'dates', label: 'Dates', against: 'minutes' },
  { key: 'sections', label: 'Sections', against: 'brief' },
  { key: 'length', label: 'Length', against: 'max 150 words' },
]

export interface Seg { t: string, mark?: 'm-bad' | 'm-fix' }
export interface Draft { label: string, text: Seg[], pass: CheckKey[], note?: string }

export const V1: Draft = {
  label: 'Draft v1',
  text: [{ t: 'Spend ' }, { t: '€621k', mark: 'm-bad' }, { t: ' of €700k. Go-live 27 Oct. ' }, { t: '(no decision section)', mark: 'm-bad' }],
  pass: ['dates', 'length'],
}

export const RETRY = {
  title: 'Unsupported regeneration',
  fb1: '“That’s not right. Try again.”',
  v2: {
    label: 'v2',
    text: [{ t: 'Spend ' }, { t: '€650k', mark: 'm-bad' }, { t: '. Go-live ' }, { t: '3 Nov', mark: 'm-bad' }, { t: '. ' }, { t: 'Decision: defer CR-7.', mark: 'm-fix' }],
    pass: ['sections', 'length'],
    note: '1 fixed, 1 new error',
  } as Draft,
  fb2: '“Still wrong. Try again.”',
  v3: {
    label: 'v3',
    text: [{ t: 'Spend €612k', mark: 'm-fix' }, { t: '. Go-live ' }, { t: '3 Nov', mark: 'm-bad' }, { t: '. Decision… ' }, { t: '(212 words)', mark: 'm-bad' }],
    pass: ['figures', 'sections'],
    note: 'Everything re-rolled; re-check it all',
  } as Draft,
}

export const TARGETED = {
  title: 'Targeted correction',
  fb1: 'Spend: use tracker row 18 (€612k). Add “Decision needed” from the brief. Change nothing else.',
  v2: {
    label: 'v2',
    text: [{ t: 'Spend ' }, { t: '€612k', mark: 'm-fix' }, { t: ' of €700k. Go-live 27 Oct. ' }, { t: 'Decision: defer CR-7.', mark: 'm-fix' }],
    pass: ['figures', 'dates', 'sections', 'length'],
    note: '2 fixed, nothing else changed',
  } as Draft,
  review: 'Priya Nair reviews v2 and approves it',
}

export const STEP_LABELS = ['v1', 'Feedback', 'v2', 'Round 2']
