// Slide 22 — claim-to-source matching (Artifact E). Fictional report and fictional source documents.
// No real citation is used or implied.

export type Verdict = 'supported' | 'contradicted' | 'unsupported'

export interface SourceDoc {
  id: string
  title: string
  lines: string[]
}

export const DOCS: SourceDoc[] = [
  { id: 'tracker', title: 'Project tracker, week 41', lines: ['Depots live: 4 of 6', 'Serious defects open: 2', 'Spend to date: €612k of €700k'] },
  { id: 'minutes', title: 'Steering minutes, 12 Sep', lines: ['Go-live moved from 20 to 27 Oct.', 'CR-7 deferred to January.'] },
  { id: 'vendor', title: 'Vendor email, 8 Oct', lines: ['Rate-limit fix deploys on 21 Oct.'] },
]

export interface Claim {
  text: string
  verdict: Verdict
  evidence?: { doc: string, line: number }
  why: string
}

export const CLAIMS: Claim[] = [
  { text: 'Four of six depots are live.', verdict: 'supported', evidence: { doc: 'tracker', line: 0 }, why: 'Tracker: “Depots live: 4 of 6”.' },
  { text: 'Go-live is set for 20 October.', verdict: 'contradicted', evidence: { doc: 'minutes', line: 0 }, why: 'Minutes moved go-live to 27 Oct.' },
  { text: '€612k of €700k is spent.', verdict: 'supported', evidence: { doc: 'tracker', line: 2 }, why: 'Tracker: “€612k of €700k”.' },
  { text: 'Customers see 30% faster tracking.', verdict: 'unsupported', why: 'No supplied source measures speed.' },
  { text: 'The vendor’s fix is already live.', verdict: 'contradicted', evidence: { doc: 'vendor', line: 0 }, why: 'Vendor: fix deploys on 21 Oct.' },
  { text: 'Two serious defects remain open.', verdict: 'supported', evidence: { doc: 'tracker', line: 1 }, why: 'Tracker: “Serious defects open: 2”.' },
]

export const VERDICT_UI: Record<Verdict, { state: 'ok' | 'bad' | 'warn', label: string }> = {
  supported: { state: 'ok', label: 'Supported' },
  contradicted: { state: 'bad', label: 'Contradicted' },
  unsupported: { state: 'warn', label: 'Unsupported' },
}

export const RAG_STEPS = ['Retrieve passages', 'Add them to the prompt', 'Draft with citations', 'Check every claim']
