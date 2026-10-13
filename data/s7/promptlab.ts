// Slide 56 — Prompt laboratory (spec Artifact D).
// Same task, same reference material (demos/project-status-report.md §5), three prompt variants.
// The outputs are PREPARED and SIMULATED: written for this workshop to show typical behaviour,
// not captured from a specific product. A live run will differ; see demos/expected-outputs.md.

export const LAB_TASK = 'Arjun’s customer notice on the switchover'
export const LAB_SOURCE = 'project-status-report.md §5 Customer impact at cutover'

/** A run of output text. `ph` = visible placeholder; `mark` = numbered unsupported assumption. */
export interface Seg { t: string, ph?: boolean, mark?: number, note?: boolean }

export type ItemState = 'ok' | 'warn' | 'bad'

/** The five things the notice must cover, all stated in the status report §5. */
export const MUST_COVER = [
  'Go-live date',
  'Read-only window',
  'Password reset',
  'What moves where',
  'Who to contact',
] as const

export interface Variant {
  id: 'vague' | 'structured' | 'context'
  name: string
  prompt: string[]
  /** Whether the §5 excerpt is pasted under the prompt. */
  withExcerpt: boolean
  output: Seg[][]
  /** Status per MUST_COVER item, with a few words of why. */
  cover: { state: ItemState, why: string }[]
  assumptions: string[]
  effort: { label: string, level: 1 | 2 | 3, why: string }
}

export const VARIANTS: Variant[] = [
  {
    id: 'vague',
    name: 'Vague',
    prompt: ['Write an email to our customers about the new portal.'],
    withExcerpt: false,
    output: [
      [{ t: 'Subject: Exciting news: our new customer portal is here!' }],
      [{ t: 'We’re thrilled to announce our new portal, with ' }, { t: 'real-time GPS tracking', mark: 1 }, { t: ' and ' }, { t: 'a new mobile app', mark: 2 }, { t: '. The switch happens ' }, { t: 'next week', mark: 3 }, { t: ' with ' }, { t: 'no interruption to service', mark: 4 }, { t: '. Simply ' }, { t: 'log in with your existing details', mark: 5 }, { t: '.' }],
      [{ t: 'Questions? Contact your account manager.' }],
    ],
    cover: [
      { state: 'bad', why: '“next week” is wrong' },
      { state: 'bad', why: 'says no interruption' },
      { state: 'bad', why: 'says existing details work' },
      { state: 'bad', why: 'missing' },
      { state: 'ok', why: 'account manager' },
    ],
    assumptions: ['GPS tracking', 'mobile app', 'next week', 'no interruption', 'existing log-in works'],
    effort: { label: 'Rewrite', level: 3, why: 'Five claims to remove or correct' },
  },
  {
    id: 'structured',
    name: 'Structured',
    prompt: [
      'Draft a customer notice about the portal switchover.',
      'Audience: logistics coordinators.',
      'Cover: when, what changes, what to do, who to contact.',
      'Max 120 words; no unconfirmed facts.',
      'Format: subject + 3 short paragraphs.',
    ],
    withExcerpt: false,
    output: [
      [{ t: 'Subject: Changes to the Kestrel tracking portal' }],
      [{ t: 'From ' }, { t: '[date]', ph: true }, { t: ' we are moving to a new tracking portal. The current portal will be ' }, { t: 'unavailable', mark: 1 }, { t: ' for a short time ' }, { t: '[time]', ph: true }, { t: '.' }],
      [{ t: 'After the switch you may need to ' }, { t: '[action]', ph: true }, { t: '. ' }, { t: 'Existing bookmarks will keep working.', mark: 2 }],
      [{ t: 'Questions? Contact your account manager.' }],
    ],
    cover: [
      { state: 'warn', why: 'placeholder' },
      { state: 'warn', why: 'placeholder; says unavailable' },
      { state: 'warn', why: 'placeholder' },
      { state: 'bad', why: 'export move missing' },
      { state: 'ok', why: 'account manager' },
    ],
    assumptions: ['“unavailable” (it is read-only)', 'bookmarks work for good (only 90 days)'],
    effort: { label: 'Moderate', level: 2, why: 'Fill three gaps from the report' },
  },
  {
    id: 'context',
    name: 'Context-rich',
    prompt: [
      '…the structured prompt, plus:',
      'Use only the facts in the excerpt below. If something is not confirmed, tell me in a note after the email. Do not guess.',
    ],
    withExcerpt: true,
    output: [
      [{ t: 'Subject: New tracking portal on 27 October' }],
      [{ t: 'Our new tracking portal goes live on Tuesday 27 October. From Mon 26 Oct 22:00 to Tue 06:00 the old portal is read-only; the service desk can give updates.' }],
      [{ t: 'At first log-in you will reset your password. CSV exports move to Reports › Exports; old links redirect for 90 days. Questions? Ask your account manager.' }],
      [{ t: 'Note for Arjun: API impact is not confirmed. Check with Daniel before sending.', note: true }],
    ],
    cover: [
      { state: 'ok', why: 'Tue 27 Oct' },
      { state: 'ok', why: 'Mon 22:00 to Tue 06:00' },
      { state: 'ok', why: 'reset at first log-in' },
      { state: 'ok', why: 'exports and redirects' },
      { state: 'ok', why: 'account manager' },
    ],
    assumptions: [],
    effort: { label: 'Light', level: 1, why: 'Answer the flagged API question' },
  },
]
