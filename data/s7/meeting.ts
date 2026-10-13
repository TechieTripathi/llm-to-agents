// Slide 60 — raw meeting notes (demos/meeting-notes.md, read verbatim in raw.ts) transformed into a
// tracker and summary, then validated line by line. The AI output is PREPARED and SIMULATED and
// contains one deliberate AI-introduced error (a wrong deadline) that validation catches.

export const EXTRACT_PROMPT = 'Extract decisions, actions (owner, deadline), risks and open questions. Cite note line numbers. Leave a deadline blank if the notes give none.'

export interface Decision { text: string, lines: number[] }
export interface Action {
  owner: string
  task: string
  /** Deadline as the AI first wrote it. */
  due: string | null
  /** Correct deadline per the notes, when the AI got it wrong. */
  fixed?: string
  /** Verbatim fragment of the note line that settles it. */
  evidence?: string
  lines: number[]
}
export interface Risk { text: string, lines: number[], inferred?: boolean }

export const DECISIONS: Decision[] = [
  { text: 'UAT sign-off moves to Fri 16 Oct', lines: [6] },
  { text: 'Go-live stays Tue 27 Oct, for now', lines: [7] },
  { text: '3 joint training sessions, not 6', lines: [10, 11] },
]

export const ACTIONS: Action[] = [
  { owner: 'Daniel Okafor', task: 'Fix search-screen defects', due: 'Thu 15 Oct', lines: [4, 5] },
  { owner: 'Tomás Ruiz', task: 'Get scanner vendor ETA', due: 'Wed 14 Oct', lines: [8, 9] },
  { owner: 'Daniel Okafor', task: 'Confirm API impact', due: 'Fri 16 Oct', fixed: 'Fri 23 Oct', evidence: 'by the 23rd', lines: [14] },
  { owner: 'Arjun Mehta', task: 'Customer notice, after API answer', due: null, lines: [15, 16] },
]

export const RISKS: Risk[] = [
  { text: 'Search defects could push UAT and go-live', lines: [3, 4, 7] },
  { text: 'Riverside scanner outages', lines: [8] },
  { text: 'Customer notice waits on the API answer', lines: [7, 14, 16], inferred: true },
]

export const QUESTIONS: Risk[] = [
  { text: 'Are API customers affected?', lines: [12, 13] },
  { text: 'Do 3 joint sessions fit the €6k cap?', lines: [10, 11] },
]

/** Polished summary. `{api}` is replaced by the API deadline (wrong before validation, fixed after). */
export const SUMMARY_TEMPLATE = 'Go-live stays Tue 27 Oct, for now. UAT sign-off moves to Fri 16 Oct while Daniel fixes the search-screen defects (14 open, 3 high). Training: 3 joint sessions instead of 6 (budget cap €6k). Watch: Riverside scanner outages (Tomás has a vendor ETA by Wed 14 Oct) and API impact, which Daniel confirms by {api} before Arjun drafts the customer notice.'

export const QUALITY_CHECKS: { text: string, state: 'ok' | 'warn' | 'active', detail?: string }[] = [
  { text: 'Every item cites a note line', state: 'ok' },
  { text: 'Owners were at the meeting', state: 'ok', detail: 'line 2' },
  { text: 'Deadlines match the notes', state: 'ok', detail: '1 corrected' },
  { text: 'Missing deadline flagged, not invented', state: 'warn', detail: 'Arjun' },
  { text: 'Inference labelled', state: 'ok', detail: '1 risk' },
  { text: 'Summary carries the correction', state: 'ok' },
  { text: 'Priya approves before it is sent', state: 'active', detail: 'waiting' },
]

export const STAGES = ['Raw notes', 'Extract', 'Summarise', 'Validate', 'Sign off'] as const
