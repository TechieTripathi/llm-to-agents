// Slide 38 — task decomposition for the fictional weekly Project Lark report, and its revision.
import { LARK } from './lark'

export interface PlanStep {
  id: string
  text: string
  check: string
  /** Only present after the revision. */
  added?: boolean
  /** Replacement text after new information arrives. */
  revised?: { text: string, check: string }
}

export const GOAL = {
  text: `Weekly Lark report for ${LARK.reader.name}`,
  due: `Due ${LARK.due}`,
}

const nb = (t: string) => t.replace(/ /g, '\u00A0')

export const NEW_INFO = {
  source: 'Tracker update, Tue 14:10',
  text: `${LARK.milestone.id} ${LARK.milestone.name} moved from ${nb(LARK.milestone.was)} to ${nb(LARK.milestone.now)} (${LARK.milestone.cause})`,
}

export const PLAN: PlanStep[] = [
  { id: 'tickets', text: 'Collect ticket status', check: 'Counts match the tracker export' },
  { id: 'budget', text: 'Collect budget figures', check: 'Totals reconcile to the finance snapshot' },
  {
    id: 'dates', text: 'Update milestone dates', check: 'Every date has a source',
    revised: { text: 'Re-plan dates after the M3 slip', check: 'Dependent dates recalculated and sourced' },
  },
  { id: 'risk', text: 'Add a schedule-risk section', check: 'Owner and mitigation confirmed by Daniel Okafor', added: true },
  { id: 'draft', text: 'Draft the report', check: 'Template followed; every figure cited' },
  { id: 'approve', text: 'Ask Priya Nair to approve', check: 'A person approves before anything is sent' },
]

export const PLAN_CAPTIONS = [
  'Break the goal into steps small enough to check.',
  'Give each step a “done when” test that a tool or a person can verify.',
  'New information arrives mid-run: the tracker shows milestone M3 has moved.',
  'Revise the plan, not the goal: re-plan the dates and add a risk section.',
]
