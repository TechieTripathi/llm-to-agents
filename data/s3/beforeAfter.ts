// Slide 18 — weak versus structured prompt for the same task (fictional Kestrel Freight data).
// Outputs are hand-written simulations of typical behaviour; no model was called.

export const WEAK_PROMPT = 'Prepare a project report.'

export const WEAK_OUTPUT: { text: string, flag?: string }[] = [
  { text: 'Project Report' },
  { text: 'An overview of progress to date.', flag: 'Says nothing' },
  { text: 'The project is broadly on track.', flag: 'No evidence' },
  { text: 'Next: keep monitoring risks.', flag: 'Generic' },
  { text: '[Insert key milestones here]', flag: 'Placeholder' },
]

export type PartKey = 'audience' | 'source' | 'objective' | 'constraints' | 'format'

export const STRUCTURED_PROMPT: { part: PartKey, label: string, text: string }[] = [
  { part: 'audience', label: 'Audience', text: 'steering committee' },
  { part: 'source', label: 'Source', text: 'week 41 tracker only' },
  { part: 'objective', label: 'Objective', text: 'help them decide on CR-7' },
  { part: 'constraints', label: 'Constraints', text: 'max 150 words; write “not in source” for gaps' },
  { part: 'format', label: 'Format', text: 'status, 3 risks, decision' },
]

export const STRUCTURED_OUTPUT: { text: string, from: PartKey[] }[] = [
  { text: 'Project Lark, week 41: Amber.', from: ['format'] },
  { text: 'Risks: 2 open test defects; vendor fix due 21 Oct; €612k of €700k spent.', from: ['source'] },
  { text: 'Decision: defer CR-7 to January? No time to test it before the 27 Oct go-live.', from: ['objective'] },
  { text: 'Forecast cost: not in source.', from: ['constraints'] },
]

export const VERDICT = {
  weak: { state: 'bad' as const, label: 'Rewrite' },
  structured: { state: 'warn' as const, label: 'Check 3 figures, then send' },
}
