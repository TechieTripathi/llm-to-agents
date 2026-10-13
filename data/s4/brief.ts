// Slide 34 — worked example: turn browser research into an evidence-based brief.
// The SOURCES are real official EU pages (checked 2026-10-13, see data/refs/s4.ts).
// The DRAFT claims imitate what an AI research assistant might produce; they are simulated,
// and two of them are deliberately wrong so the verification step has something to catch.
export const QUESTION = 'When do the EU AI Act obligations for providers of general-purpose AI (GPAI) models apply?'
export const CHECKED = '13 October 2026'

export interface Src { id: string, key: string, title: string, site: string, kind: 'Law' | 'Official guidance' }
export const SOURCES: Src[] = [
  { id: 'A', key: 's4euaiact2024', title: 'AI Act — Regulation (EU) 2024/1689', site: 'eur-lex.europa.eu', kind: 'Law' },
  { id: 'B', key: 's4ecgpaiguidelines', title: 'Guidelines for providers of GPAI models', site: 'digital-strategy.ec.europa.eu', kind: 'Official guidance' },
  { id: 'C', key: 's4euomnibus2026', title: 'Digital Omnibus on AI, Regulation (EU) 2026/1744', site: 'eur-lex.europa.eu', kind: 'Law' },
  { id: 'D', key: 's4ecaiact', title: 'AI Act — regulatory framework page', site: 'digital-strategy.ec.europa.eu', kind: 'Official guidance' },
  { id: 'E', key: 's4ecgpaicode', title: 'The General-Purpose AI Code of Practice', site: 'digital-strategy.ec.europa.eu', kind: 'Official guidance' },
]

export type Verdict = 'supported' | 'contradicted'
export interface DraftClaim { draft: string, verdict: Verdict, evidence: string, cites: string[], final: string }

export const CLAIMS: DraftClaim[] = [
  {
    draft: 'GPAI obligations apply from 2 August 2026.',
    verdict: 'contradicted',
    evidence: 'Art. 113(b): they apply from 2 August 2025.',
    cites: ['A', 'B'],
    final: 'Obligations for GPAI model providers have applied since 2 August 2025.',
  },
  {
    draft: 'The Commission can fine providers from 2 August 2026.',
    verdict: 'supported',
    evidence: 'Art. 113(b) holds back Art. 101 (fines) until then.',
    cites: ['A', 'B'],
    final: 'The Commission can enforce them, including fines, from 2 August 2026.',
  },
  {
    draft: 'Models on the market before 2 August 2025: 2 August 2027.',
    verdict: 'supported',
    evidence: 'Art. 111(3); Commission guidelines.',
    cites: ['A', 'B'],
    final: 'Models placed on the market before 2 August 2025 must comply by 2 August 2027.',
  },
  {
    draft: 'The 2026 Digital Omnibus postponed the GPAI dates.',
    verdict: 'contradicted',
    evidence: 'It moved high-risk dates; GPAI dates unchanged.',
    cites: ['C', 'D'],
    final: 'The Digital Omnibus (in force 27 July 2026) moved high-risk dates, not these GPAI dates.',
  },
  {
    draft: 'A voluntary Code of Practice can show compliance.',
    verdict: 'supported',
    evidence: 'Commission: “an adequate voluntary tool”.',
    cites: ['E'],
    final: 'Providers may use the voluntary GPAI Code of Practice (July 2025) to show compliance.',
  },
]
