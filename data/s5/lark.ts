// Section 5 running example: an agent prepares Kestrel Freight's weekly Project Lark report.
// Everything here is fictional (see data/universe.ts). Figures are invented for teaching.
import { ORG, PEOPLE } from '../universe'

export const LARK = {
  org: ORG.name,
  project: ORG.project.code,
  goal: 'Prepare this week\'s Project Lark status report',
  due: 'Friday 16 Oct, 12:00',
  requester: PEOPLE.pm,
  reader: PEOPLE.director,
  figures: {
    open: 14,
    blocked: 3,
    asOf: '2026-10-12',
    budget: '€700k',
    spent: '€628k',
  },
  milestone: { id: 'M3', name: 'Customer pilot', was: '30 Oct', now: '13 Nov', cause: 'vendor API delay' },
  list: { id: 'lark-pilot', size: 23 },
}

/** Tools the fictional agent can use, with the permission each one has. */
export const TOOLS = [
  { id: 'tracker', name: 'Project tracker', fn: 'tracker.search_issues', access: 'read' },
  { id: 'finance', name: 'Budget sheet', fn: 'finance.get_budget', access: 'read' },
  { id: 'drafts', name: 'Report drafts', fn: 'drafts.save', access: 'write' },
  { id: 'email', name: 'Email', fn: 'email.send', access: 'approval' },
] as const
