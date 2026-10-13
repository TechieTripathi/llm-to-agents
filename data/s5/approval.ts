// Slide 44 — approval gate for a consequential action in the fictional Lark scenario:
// sending the weekly report to an external customer distribution list. Simulated: nothing is sent.
import { LARK } from './lark'
import { PEOPLE } from '../universe'

export type Who = 'agent' | 'harness' | 'p.nair'
export type EvKind = 'proposed' | 'blocked' | 'changes' | 'revised' | 'approved' | 'sent' | 'rejected'
export interface Ev { kind: EvKind, who: Who, text: string }

export const APPROVER = PEOPLE.pm

export const ACTION = {
  fn: 'email.send',
  to: `${LARK.list.id} · ${LARK.list.size} external`,
  file: (v: number) => `Lark-weekly-W42-v${v}.pdf`,
  risk: 'External and cannot be undone',
}

export const EV: Record<EvKind, Ev> = {
  proposed: { kind: 'proposed', who: 'agent', text: 'proposed email.send v1 → HELD, approval required' },
  blocked: { kind: 'blocked', who: 'harness', text: 'agent tried to execute → BLOCKED, no approval on record' },
  changes: { kind: 'changes', who: 'p.nair', text: 'requested changes: "remove the internal cost table"' },
  revised: { kind: 'revised', who: 'agent', text: 'revised draft v2, proposed again → HELD' },
  approved: { kind: 'approved', who: 'p.nair', text: 'APPROVED the current version' },
  sent: { kind: 'sent', who: 'harness', text: 'executed email.send (simulated, nothing sent)' },
  rejected: { kind: 'rejected', who: 'p.nair', text: 'REJECTED → action cancelled, nothing sent' },
}

/** Events visible at each click (cumulative). */
export const CLICK_PATH: EvKind[][] = [
  ['proposed'],
  ['proposed', 'blocked'],
  ['proposed', 'blocked', 'changes'],
  ['proposed', 'blocked', 'changes', 'revised'],
  ['proposed', 'blocked', 'changes', 'revised', 'approved', 'sent'],
]

export const TIMES = ['10:42:07', '10:42:09', '10:51:30', '10:58:02', '11:03:44', '11:03:45', '11:04:10', '11:05:02', '11:06:31', '11:07:15', '11:08:40', '11:09:12']
