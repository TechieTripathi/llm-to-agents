// Slides 11–12 — illustrative next-token candidates. Token boundaries are real (o200k_base);
// every probability below is invented for teaching and was NOT produced by a model.

export interface Candidate { t: string, p: number }
export interface Decision { candidates: Candidate[], chosen: number }

/** Slide 11: one pass through the generation pipeline. */
export const PIPELINE_EXAMPLE = {
  context: ['K', 'est', 'rel', '’s', ' new', ' portal', ' will', ' launch', ' in'],
  /** Tail shown on the slide (the full context is longer). */
  tail: [' portal', ' will', ' launch', ' in'],
  candidates: [
    { t: ' March', p: 0.34 },
    { t: ' the', p: 0.21 },
    { t: ' early', p: 0.12 },
    { t: ' Q', p: 0.08 },
    { t: ' spring', p: 0.05 },
  ] as Candidate[],
  chosen: 0,
}

/** Slide 12: the prompt, then two decoding branches that share a prefix. */
export const SIM_PROMPT = ['Write', ' a', ' one', '-s', 'entence', ' status', ' update', ' for', ' Project', ' L', 'ark', '.']

const END = '⟨end⟩'
export const END_TOKEN = END

// Shared first four decisions (the top candidate is chosen under both settings).
const shared: Decision[] = [
  { candidates: [{ t: 'The', p: 0.52 }, { t: 'Project', p: 0.21 }, { t: 'Lark', p: 0.08 }, { t: 'Status', p: 0.06 }], chosen: 0 },
  { candidates: [{ t: ' portal', p: 0.41 }, { t: ' project', p: 0.27 }, { t: ' team', p: 0.11 }, { t: ' upgrade', p: 0.06 }], chosen: 0 },
  { candidates: [{ t: ' upgrade', p: 0.63 }, { t: ' project', p: 0.12 }, { t: ' launch', p: 0.08 }, { t: ' team', p: 0.05 }], chosen: 0 },
  { candidates: [{ t: ' is', p: 0.71 }, { t: ' remains', p: 0.12 }, { t: ' has', p: 0.07 }, { t: ' team', p: 0.03 }], chosen: 0 },
]

// Decision 5 is where the branches split: low temperature takes " on"; the prepared
// sample at temperature 1 draws " running" (17%).
const split: Candidate[] = [{ t: ' on', p: 0.46 }, { t: ' running', p: 0.17 }, { t: ' progressing', p: 0.12 }, { t: ' currently', p: 0.09 }]

export const BRANCHES: Record<'low' | 'high', Decision[]> = {
  low: [
    ...shared,
    { candidates: split, chosen: 0 },
    { candidates: [{ t: ' track', p: 0.93 }, { t: ' schedule', p: 0.03 }, { t: ' budget', p: 0.01 }, { t: ' hold', p: 0.01 }], chosen: 0 },
    { candidates: [{ t: ' for', p: 0.58 }, { t: '.', p: 0.24 }, { t: ',', p: 0.08 }, { t: ' to', p: 0.05 }], chosen: 0 },
    { candidates: [{ t: ' the', p: 0.44 }, { t: ' a', p: 0.19 }, { t: ' launch', p: 0.13 }, { t: ' its', p: 0.08 }], chosen: 0 },
    { candidates: [{ t: ' March', p: 0.29 }, { t: ' planned', p: 0.22 }, { t: ' Q', p: 0.14 }, { t: ' spring', p: 0.09 }], chosen: 0 },
    { candidates: [{ t: ' launch', p: 0.61 }, { t: ' release', p: 0.17 }, { t: ' go', p: 0.1 }, { t: ' deadline', p: 0.05 }], chosen: 0 },
    { candidates: [{ t: '.', p: 0.81 }, { t: ',', p: 0.08 }, { t: ' date', p: 0.05 }, { t: ' with', p: 0.03 }], chosen: 0 },
    { candidates: [{ t: END, p: 0.88 }, { t: ' Testing', p: 0.05 }, { t: ' The', p: 0.03 }, { t: ' Next', p: 0.02 }], chosen: 0 },
  ],
  high: [
    ...shared,
    { candidates: split, chosen: 1 },
    { candidates: [{ t: ' two', p: 0.31 }, { t: ' slightly', p: 0.24 }, { t: ' behind', p: 0.19 }, { t: ' on', p: 0.11 }], chosen: 0 },
    { candidates: [{ t: ' weeks', p: 0.86 }, { t: ' days', p: 0.06 }, { t: ' sprints', p: 0.04 }, { t: ' months', p: 0.02 }], chosen: 0 },
    { candidates: [{ t: ' behind', p: 0.79 }, { t: ' late', p: 0.09 }, { t: ' ahead', p: 0.06 }, { t: ' over', p: 0.03 }], chosen: 0 },
    { candidates: [{ t: ' schedule', p: 0.67 }, { t: ' plan', p: 0.14 }, { t: ',', p: 0.07 }, { t: ' its', p: 0.04 }], chosen: 0 },
    { candidates: [{ t: '.', p: 0.55 }, { t: ' due', p: 0.21 }, { t: ',', p: 0.12 }, { t: ' after', p: 0.07 }], chosen: 0 },
    { candidates: [{ t: END, p: 0.84 }, { t: ' Testing', p: 0.07 }, { t: ' The', p: 0.03 }, { t: ' A', p: 0.02 }], chosen: 0 },
  ],
}

export const SIM_STEPS = 12
