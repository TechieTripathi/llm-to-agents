// Slide 24 — context selection board. Candidate material for one task: "Recommend whether to
// approve CR-7 before the Project Lark go-live". All items are fictional.

export type Bucket = 'include' | 'exclude'

export interface Candidate {
  key: string
  title: string
  meta: string
  bucket: Bucket
  reason: string
  /** Rank in the source hierarchy (lower = more authoritative), if the item is a source of record. */
  tier?: number
}

export const CANDIDATES: Candidate[] = [
  { key: 'tracker', title: 'Week 41 tracker', meta: 'System of record', bucket: 'include', reason: 'Current figures', tier: 2 },
  { key: 'policy3', title: 'Change policy v3, 2026', meta: 'Approved', bucket: 'include', reason: 'Approved policy: freeze rule', tier: 0 },
  { key: 'faq', title: 'Office move FAQ', meta: 'Facilities', bucket: 'exclude', reason: 'Irrelevant to the task' },
  { key: 'policy1', title: 'Change policy v1, 2024', meta: 'Superseded', bucket: 'exclude', reason: 'Outdated: replaced by v3' },
  { key: 'minutes', title: 'Steering minutes, 12 Sep', meta: 'Signed', bucket: 'include', reason: 'Decision of record', tier: 1 },
  { key: 'email', title: 'Email: “go-live 3 Nov?”', meta: 'Thread', bucket: 'exclude', reason: 'Conflict: the minutes outrank it', tier: 3 },
  { key: 'sick', title: 'Team sick-leave log', meta: 'HR system', bucket: 'exclude', reason: 'Sensitive personal data' },
  { key: 'contract', title: 'Portal contract §9', meta: 'Signed 2025', bucket: 'include', reason: 'Live-by-15-Nov clause' },
]

/** Source hierarchy used to resolve conflicts: higher beats lower. */
export const HIERARCHY = ['Approved policy', 'Signed decision record', 'System of record', 'Email or chat']
