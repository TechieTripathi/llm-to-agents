// Slide 13 — the same triage task under different wording. Outputs are SIMULATED to show the
// kind of shift research has measured; the research findings themselves are cited on the slide.

export interface Variant { name: string, prompt: string[], output: string, state: 'ok' | 'warn' | 'bad' | 'neutral', verdict: string }
export interface WordingCase { id: string, tab: string, change: string, a: Variant, b: Variant, mechanism: string, finding: string, cite: string[] }

const MSG = '“Pallet not here, we close at 5”'
export const TEST_MESSAGE = MSG

export const WORDING_CASES: WordingCase[] = [
  {
    id: 'ambiguity',
    tab: 'Ambiguity',
    change: 'only the instruction',
    a: { name: 'Open question', prompt: ['Is this urgent?', MSG], output: 'Possibly, depending on…', state: 'warn', verdict: 'Hedged, not usable' },
    b: { name: 'Defined rule', prompt: ['Label Urgent if a delivery is late AND the customer has a same-day deadline; else Routine. One word.', MSG], output: 'Urgent', state: 'ok', verdict: 'Follows the stated rule' },
    mechanism: 'A gap in the request gets filled with the most likely continuation, not with your intent.',
    finding: 'Define “urgent”, and the answer becomes checkable.',
    cite: [],
  },
  {
    id: 'selection',
    tab: 'Which examples',
    change: 'which examples are shown',
    a: { name: 'All examples say Routine', prompt: ['“Need an invoice copy” → Routine', '“Update our address” → Routine', '“Change delivery slot?” → Routine', `${MSG} →`], output: 'Routine', state: 'warn', verdict: 'Pulled toward the majority label' },
    b: { name: 'Mixed examples', prompt: ['“Need an invoice copy” → Routine', '“Truck broke down, due 9am” → Urgent', '“Update our address” → Routine', `${MSG} →`], output: 'Urgent', state: 'ok', verdict: 'Reads the deadline cue' },
    mechanism: 'Examples are evidence about the task. Lopsided examples shift the output toward the frequent label.',
    finding: 'Measured: GPT-3 favoured labels that were frequent among the examples (majority label bias).',
    cite: ['zhao2021calibrate'],
  },
  {
    id: 'order',
    tab: 'Example order',
    change: 'the order of the same four examples',
    a: { name: 'Routine examples last', prompt: ['“Truck broke down, due 9am” → Urgent', '“Freezer failed in transit” → Urgent', '“Need an invoice copy” → Routine', '“Update our address” → Routine', `${MSG} →`], output: 'Routine', state: 'warn', verdict: 'Echoes the most recent label' },
    b: { name: 'Urgent examples last', prompt: ['“Need an invoice copy” → Routine', '“Update our address” → Routine', '“Truck broke down, due 9am” → Urgent', '“Freezer failed in transit” → Urgent', `${MSG} →`], output: 'Urgent', state: 'ok', verdict: 'Same examples, different answer' },
    mechanism: 'Order alone can move the answer: labels near the end of the prompt tend to be over-weighted.',
    finding: 'Measured: example order alone moved few-shot accuracy between near state-of-the-art and near chance.',
    cite: ['zhao2021calibrate', 'lu2022order'],
  },
  {
    id: 'format',
    tab: 'Formatting only',
    change: 'separators and capitals only',
    a: { name: 'Format A', prompt: ['Message: Need an invoice copy', 'Label: Routine', '', `Message: ${MSG}`, 'Label:'], output: 'Urgent', state: 'neutral', verdict: 'One answer' },
    b: { name: 'Format B', prompt: ['MESSAGE:: Need an invoice copy || LABEL:: Routine', '', `MESSAGE:: ${MSG} || LABEL::`], output: 'Routine', state: 'neutral', verdict: 'A different answer' },
    mechanism: 'Formatting that means the same to a person can still shift the next-token odds.',
    finding: 'Measured: up to 76 accuracy points from formatting alone; the best format varied by model.',
    cite: ['sclar2024formatting'],
  },
]
