// Slide 57 — context demonstration: an answer written without sources, checked claim by claim
// against the fictional Kestrel travel policy (demos/policy-excerpt.md, parsed in raw.ts).
// The two answers are PREPARED and SIMULATED; see demos/expected-outputs.md.

export const QUESTION = {
  who: 'Daniel Okafor',
  text: 'I’m supporting the Lark cutover at Riverside depot, Sun 25 Oct to Tue 27 Oct. What can I book and claim?',
}

export type Verdict = 'supported' | 'contradicted' | 'absent'

export interface Claim {
  /** The claim exactly as it appears in the answer written without sources. */
  text: string
  verdict: Verdict
  /** Policy clause id from demos/policy-excerpt.md, if any. */
  clause?: string
  /** What the policy actually says, in a few words. */
  finding: string
}

export const CLAIMS: Claim[] = [
  { text: 'Get your manager’s approval before you book.', verdict: 'supported', clause: '4.1', finding: 'Line-manager approval before booking' },
  { text: 'Book on whichever site is cheapest.', verdict: 'contradicted', clause: '4.2', finding: 'Book through TravelDesk only' },
  { text: 'Hotels up to €150 a night are fine.', verdict: 'contradicted', clause: '4.4', finding: 'Cap is €130 (€160 in capital cities)' },
  { text: 'You get a daily meal allowance of about €50.', verdict: 'contradicted', clause: '4.5', finding: 'No per diem; receipted costs up to €40 a day' },
  { text: 'Claim mileage at €0.30 per km if you drive.', verdict: 'absent', finding: 'The excerpt says nothing about mileage' },
  { text: 'Attach an itemised receipt to every claim.', verdict: 'supported', clause: '4.6', finding: 'Itemised receipt for every item' },
]

export const VERDICT_LABEL: Record<Verdict, { state: 'ok' | 'bad' | 'warn', label: string }> = {
  supported: { state: 'ok', label: 'Supported' },
  contradicted: { state: 'bad', label: 'Contradicted' },
  absent: { state: 'warn', label: 'Not in source' },
}

/** The same question asked again with the policy attached (prepared, simulated). */
export const GROUNDED_ANSWER: { text: string, cite?: string, gap?: boolean }[] = [
  { text: 'Get line-manager approval first.', cite: '4.1' },
  { text: 'Book rail and hotel through TravelDesk; rail is standard class.', cite: '4.2, 4.3' },
  { text: 'Hotel up to €130 a night, breakfast included.', cite: '4.4' },
  { text: 'Meals: receipted costs up to €40 a day. No per diem, no alcohol.', cite: '4.5' },
  { text: 'Claim within 60 days, with itemised receipts.', cite: '4.6' },
  { text: 'Mileage is not covered by this excerpt. Ask Group Finance.', gap: true },
]
