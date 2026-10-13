// Slide 23 — prompt hardening (required artifact 7). Each safeguard adds one clause to the prompt
// and flips one edge-case test from a bad behaviour to a handled one. Fictional, simulated behaviour.

export const BASE_PROMPT = 'Draft this week’s Lark status note from the attached tracker.'

export interface Safeguard {
  key: string
  name: string
  clause: string
  test: string
  before: string
  after: string
}

export const SAFEGUARDS: Safeguard[] = [
  {
    key: 'missing',
    name: 'Missing data',
    clause: 'No figure in the tracker? Write “not in source”. Never estimate.',
    test: 'budget row blank',
    before: 'Invents a figure',
    after: 'Says “not in source”',
  },
  {
    key: 'ask',
    name: 'Ask when unclear',
    clause: 'Period unclear? Ask one question before drafting.',
    test: '“last period”',
    before: 'Guesses a month',
    after: 'Asks which period',
  },
  {
    key: 'conflict',
    name: 'Conflicting sources',
    clause: 'Sources disagree? Give both values and name each source.',
    test: 'two go-live dates',
    before: 'Picks one silently',
    after: 'Shows both',
  },
  {
    key: 'failure',
    name: 'Failure response',
    clause: 'No tracker attached? Reply only: “Cannot draft: tracker missing.”',
    test: 'no tracker attached',
    before: 'Writes it anyway',
    after: 'Stops, says why',
  },
  {
    key: 'exclude',
    name: 'Exclusions',
    clause: 'Leave out personal or health details about staff.',
    test: 'sick day in notes',
    before: 'Repeats it',
    after: 'Leaves it out',
  },
]
