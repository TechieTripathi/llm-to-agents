// Slide 16 — a fluent, simulated answer checked claim by claim against a fictional policy.

export type ClaimKind = 'supported' | 'contradicted' | 'unsupported' | 'fabricated' | 'reasoning'

export interface HClaim {
  id: string
  text: string
  kind: ClaimKind
  /** Policy clause that settles the claim, if any. */
  clause?: string
  verdict: string
}

export const H_QUESTION = 'I’m flying to the Rotterdam office for two days. What can I claim?'

/** The answer is assembled from these segments, in order. Claims are segments with an id. */
export const H_CLAIMS: HClaim[] = [
  { id: 'c1', text: 'A taxi from the airport is covered if you land after 21:00.', kind: 'supported', clause: '2.3', verdict: 'Supported — matches clause 2.3' },
  { id: 'c2', text: 'Meals are €50 per day,', kind: 'contradicted', clause: '3.1', verdict: 'Contradicted — 3.1 caps meals at €40' },
  { id: 'c3', text: 'so two days gives you €120.', kind: 'reasoning', verdict: 'Reasoning error — 2 × €50 is €100, not €120' },
  { id: 'c4', text: 'Receipts aren’t needed under €25.', kind: 'unsupported', verdict: 'Unsupported — the policy says nothing about this' },
  { id: 'c5', text: 'Trips abroad need line-manager approval (section 7.3).', kind: 'fabricated', clause: '4.1', verdict: 'Invented reference — no section 7.3; 4.1 says director, not line manager' },
]

export const H_POLICY = {
  title: 'Kestrel travel policy (excerpt)',
  clauses: [
    { no: '2.3', text: 'Taxis are covered for journeys starting or ending between 21:00 and 06:00.' },
    { no: '3.1', text: 'Meals: receipted costs up to €40 per day away. No daily allowance.' },
    { no: '3.2', text: 'Submit claims within 60 days of return.' },
    { no: '4.1', text: 'Travel abroad needs your director’s approval before booking.' },
  ],
  footer: 'The policy has sections 1–5 only.',
}

export const KIND_STATUS: Record<ClaimKind, 'ok' | 'warn' | 'bad'> = {
  supported: 'ok',
  contradicted: 'bad',
  unsupported: 'warn',
  fabricated: 'bad',
  reasoning: 'bad',
}
