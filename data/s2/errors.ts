// Slide 15 — error taxonomy grouped by where the error originates. Examples are fictional.

export interface ErrorKind {
  id: string
  name: string
  origin: 'input' | 'model' | 'system'
  request: string
  output: string
  why: string
  helps: string
  cite?: string
}

export const ORIGINS = [
  { id: 'input', name: 'What we asked' },
  { id: 'model', name: 'What the model knows and does' },
  { id: 'system', name: 'The system around it' },
] as const

export const ERRORS: ErrorKind[] = [
  {
    id: 'missing', name: 'Missing information', origin: 'input',
    request: 'Summarise Q3 depot costs for the board pack.',
    output: 'Q3 depot costs rose 6%, driven mainly by fuel and overtime…',
    why: 'No cost data was attached. The model wrote a plausible summary anyway.',
    helps: 'Attach the source. Say what to do when data is missing: “write NOT PROVIDED”.',
  },
  {
    id: 'ambiguous', name: 'Ambiguous request', origin: 'input',
    request: 'Send me the latest numbers for Depot 4.',
    output: 'Depot 4 handled 18,200 parcels last month…',
    why: 'Which numbers — volume, cost, on-time rate? It silently picked one reading.',
    helps: 'Name the measure, period and format. Ask it to list assumptions first.',
  },
  {
    id: 'stale', name: 'Stale knowledge', origin: 'model',
    request: 'What is the current fuel duty rate?',
    output: 'Fuel duty is currently [a figure from its training data], stated with full confidence.',
    why: 'Learned knowledge stops at a training cutoff. “Current” facts may have changed since.',
    helps: 'Supply or retrieve a dated, authoritative source. Check the date.',
    cite: 'cheng2024dated',
  },
  {
    id: 'reasoning', name: 'Reasoning error', origin: 'model',
    request: 'On-time rate went from 88% to 92%. How big is the improvement?',
    output: 'A 4% improvement.',
    why: 'It is 4 percentage points — a 4.5% relative gain. Fluent text, wrong step.',
    helps: 'Do arithmetic with a calculator or spreadsheet tool; ask for the working.',
  },
  {
    id: 'tool', name: 'Tool failure', origin: 'system',
    request: 'Summarise all open incidents from the ticket export.',
    output: 'There are 1,000 open incidents; the main theme is…',
    why: 'The export stopped at 1,000 rows. The summary covers part of the data without saying so.',
    helps: 'The surrounding system should check tool results and surface errors and limits.',
  },
  {
    id: 'conflict', name: 'Conflicting sources', origin: 'system',
    request: 'When does Project Lark go live?',
    output: 'Go-live is on 20 October.',
    why: 'The brief says 20 October; a later meeting note says 27 October. It picked one.',
    helps: 'Rank sources (newest approved wins) and ask it to flag conflicts, not resolve them silently.',
    cite: 'xu2024conflicts',
  },
]
