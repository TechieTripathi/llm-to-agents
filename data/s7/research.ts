// Slide 58 — browser research runbook. REAL public sources, opened and checked on 2026-10-13.
// Quotes are verbatim from the pages listed. The example AI draft is SIMULATED (typical of answers
// built from older material); a live run will differ.

export const CHECKED = '13 Oct 2026'

export const QUESTION = 'What should a workplace password policy require today: length, complexity rules and scheduled expiry?'

export const LIVE_PROMPT = [
  'What do current official guidelines say a workplace',
  'password policy should require for minimum length,',
  'complexity rules and scheduled expiry? Use primary',
  'sources such as NIST and the UK NCSC. For each',
  'requirement give the source, its date and the exact',
  'sentence it comes from.',
]

export type SourceStatus = 'current' | 'withdrawn' | 'archived'

export interface Source {
  id: 'nist4' | 'nist3' | 'ncsc' | 'cisa'
  short: string
  title: string
  publisher: string
  kind: string
  date: string
  status: SourceStatus
  statusNote: string
  url: string
  /** Display form of the URL (no scheme). */
  host: string
  refKey: string
}

export const SOURCES: Source[] = [
  {
    id: 'nist4',
    short: 'NIST 2025',
    title: 'SP 800-63B-4 Digital Identity Guidelines, §3.1.1.2',
    publisher: 'NIST (US)',
    kind: 'Standard',
    date: 'Jul 2025',
    status: 'current',
    statusNote: 'Final, current',
    url: 'https://pages.nist.gov/800-63-4/sp800-63b.html',
    host: 'pages.nist.gov/800-63-4/sp800-63b.html',
    refKey: 's7nist2025sp80063b4',
  },
  {
    id: 'nist3',
    short: 'NIST 2017',
    title: 'SP 800-63B (2017, updated 2020)',
    publisher: 'NIST (US)',
    kind: 'Standard',
    date: 'Jun 2017',
    status: 'withdrawn',
    statusNote: 'Withdrawn 1 Aug 2025',
    url: 'https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final',
    host: 'csrc.nist.gov/pubs/sp/800/63/b/upd2/final',
    refKey: 's7nist2017sp80063b',
  },
  {
    id: 'ncsc',
    short: 'NCSC',
    title: 'Password policy: updating your approach',
    publisher: 'NCSC (UK)',
    kind: 'Government guidance',
    date: 'Nov 2018',
    status: 'current',
    statusNote: 'Reviewed 2018',
    url: 'https://www.ncsc.gov.uk/collection/passwords/updating-your-approach',
    host: 'ncsc.gov.uk/collection/passwords/updating-your-approach',
    refKey: 's7ncsc2018passwords',
  },
  {
    id: 'cisa',
    short: 'CISA',
    title: 'Use strong passwords (Secure Our World)',
    publisher: 'CISA (US)',
    kind: 'Advice for individuals',
    date: 'Undated',
    status: 'archived',
    statusNote: 'Marked “Archived content”',
    url: 'https://www.cisa.gov/secure-our-world/use-strong-passwords',
    host: 'cisa.gov/secure-our-world/use-strong-passwords',
    refKey: 's7cisapasswords',
  },
]

/** Compare step: what each current-ish source says, per topic. Short paraphrase; quotes in EVIDENCE. */
export const TOPICS = ['Minimum length', 'Composition rules', 'Scheduled expiry', 'Blocklist', 'Password managers'] as const

export type Cell = { text: string, tone: 'agree' | 'differs' | 'silent' }

export const COMPARE: Record<'nist4' | 'ncsc' | 'cisa', Cell[]> = {
  nist4: [
    { text: '15 characters; 8 if part of MFA', tone: 'agree' },
    { text: 'Must not be imposed', tone: 'agree' },
    { text: 'Must not be required', tone: 'agree' },
    { text: 'Required', tone: 'agree' },
    { text: 'Must be allowed', tone: 'agree' },
  ],
  ncsc: [
    { text: 'Set a minimum; no number given', tone: 'differs' },
    { text: 'Not recommended', tone: 'agree' },
    { text: 'Harms security', tone: 'agree' },
    { text: 'Use a deny list', tone: 'agree' },
    { text: 'Recommended', tone: 'agree' },
  ],
  cisa: [
    { text: 'At least 16 characters', tone: 'differs' },
    { text: 'Random mix or 4–7 word passphrase', tone: 'differs' },
    { text: 'Not addressed', tone: 'silent' },
    { text: 'Not addressed', tone: 'silent' },
    { text: 'Use one', tone: 'agree' },
  ],
}

/** Verbatim evidence, checked 2026-10-13. */
export const EVIDENCE: Record<string, { src: Source['id'], quote: string }> = {
  len4: { src: 'nist4', quote: 'Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length.' },
  len3: { src: 'nist3', quote: 'Memorized secrets SHALL be at least 8 characters in length if chosen by the subscriber.' },
  comp4: { src: 'nist4', quote: 'Verifiers and CSPs SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types) for passwords.' },
  compN: { src: 'ncsc', quote: 'the NCSC do not recommend the use of complexity requirements when implementing user generated passwords.' },
  exp4: { src: 'nist4', quote: 'Verifiers and CSPs SHALL NOT require subscribers to change passwords periodically. However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised.' },
  expN: { src: 'ncsc', quote: 'Regular password changing harms rather than improves security.' },
  block4: { src: 'nist4', quote: 'verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords.' },
  pm4: { src: 'nist4', quote: 'Verifiers SHALL allow the use of password managers and autofill functionality.' },
  cisaLen: { src: 'cisa', quote: 'At least 16 characters—longer is stronger!' },
}

export type ClaimVerdict = 'outdated' | 'contradicted' | 'supported'

/** Cite step: a typical AI draft built partly from older material (SIMULATED), claim by claim. */
export const DRAFT_CLAIMS: { text: string, verdict: ClaimVerdict, evidence: string[], why: string }[] = [
  { text: 'Require at least 8 characters.', verdict: 'outdated', evidence: ['len3', 'len4'], why: '8 was the 2017 rule. Now 15 when the password is used alone.' },
  { text: 'Require upper case, numbers and symbols.', verdict: 'contradicted', evidence: ['comp4', 'compN'], why: 'NIST: must not be imposed. NCSC: not recommended.' },
  { text: 'Force a password change every 90 days.', verdict: 'contradicted', evidence: ['exp4', 'expN'], why: 'Change only on evidence of compromise.' },
  { text: 'Block common and breached passwords.', verdict: 'supported', evidence: ['block4'], why: 'Blocklist check is required.' },
  { text: 'Allow password managers.', verdict: 'supported', evidence: ['pm4'], why: 'Must be allowed.' },
]

/** Verify step: the checks that turned the draft into a brief. */
export const VERIFY_CHECKS: { label: string, state: 'ok' | 'warn', detail: string }[] = [
  { label: 'Primary source found', state: 'ok', detail: 'NIST SP 800-63B-4 §3.1.1.2' },
  { label: 'Is it current?', state: 'warn', detail: 'The 8-character rule came from a withdrawn 2017 version' },
  { label: 'Is the page live policy?', state: 'warn', detail: 'The CISA page is marked archived' },
  { label: 'Requirement or advice?', state: 'ok', detail: 'NIST “SHALL” is a requirement; “SHOULD” is a recommendation' },
  { label: 'Same audience?', state: 'ok', detail: 'NIST sets rules for systems; CISA advises individuals, so 15 vs 16 is not a conflict' },
]

export const BRIEF = [
  'Minimum 15 characters for passwords used alone; 8 when part of multi-factor sign-in.',
  'No composition rules and no scheduled expiry; force a change on evidence of compromise.',
  'Check new passwords against a blocklist, and allow password managers.',
]

/** Live mode: what the presenter does in the browser at each step, and a scorecard to tick. */
export const LIVE_STEPS = [
  { name: 'Ask', do: 'In a separate browser window, paste the prompt into your approved AI research tool.', look: 'Does it name sources and dates, or only give advice?' },
  { name: 'Collect', do: 'Open every link it cites. Note publisher, date and status.', look: 'Is SP 800-63B-4 (2025) there, or the withdrawn 2017 version?' },
  { name: 'Compare', do: 'Put its numbers beside NIST §3.1.1.2 and the NCSC page.', look: 'Where do the sources differ, and why?' },
  { name: 'Cite', do: 'Ask: “Quote the exact sentence for each requirement.”', look: 'Do the quotes exist on the page when you search for them?' },
  { name: 'Verify', do: 'On the NIST page, search for “15 characters” yourself.', look: 'Tick the scorecard. Anything unticked goes back to step 2.' },
]

export const LIVE_SCORECARD = [
  'Cites SP 800-63B-4 (2025), not the 2017 version',
  'Gives 15 characters for passwords used alone',
  'Says no composition rules',
  'Says no scheduled expiry',
  'Every quote found on the cited page',
]
