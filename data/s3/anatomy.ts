// Slide 19 — anatomy of a useful prompt, shown on a non-IT task (fictional customer email).
// `order` is the clicker order (objective first, the optional role last).

export type AnatomyKey = 'role' | 'objective' | 'context' | 'constraints' | 'output' | 'verification'

export interface AnatomyPart {
  key: AnatomyKey
  name: string
  optional?: boolean
  order: number
  text: string
  does: string
  without: string
}

export const ANATOMY: AnatomyPart[] = [
  {
    key: 'role',
    name: 'Role',
    optional: true,
    order: 6,
    text: 'You are helping an account manager write to a key customer.',
    does: 'Sets the point of view and tone.',
    without: 'Often little changes. A persona on its own is not a reliable way to improve accuracy.',
  },
  {
    key: 'objective',
    name: 'Objective',
    order: 1,
    text: 'Tell Halden Garden Supplies their tracking portal moves on 27 October, and what they must do.',
    does: 'States what “done” looks like.',
    without: 'A generic announcement that answers no one’s question.',
  },
  {
    key: 'context',
    name: 'Context',
    order: 2,
    text: 'Jo Park, their logistics manager, complained twice about outages in September. Use the attached FAQ.',
    does: 'Supplies facts the model cannot know: history, people, documents.',
    without: 'Bland filler, or invented specifics that sound right.',
  },
  {
    key: 'constraints',
    name: 'Constraints',
    order: 3,
    text: 'Under 180 words. Do not promise uptime figures.',
    does: 'Sets limits and no-go areas.',
    without: 'Overpromising, the wrong length, the wrong tone.',
  },
  {
    key: 'output',
    name: 'Output format',
    order: 4,
    text: 'Subject line, then three short paragraphs: what changes, what to do, who to call.',
    does: 'Fixes the shape of the deliverable.',
    without: 'You reformat by hand, every time.',
  },
  {
    key: 'verification',
    name: 'Verification',
    order: 5,
    text: 'Take every date from the FAQ. Then list anything you were unsure of.',
    does: 'Says how the answer should be checked, and flags doubt.',
    without: 'Errors hide inside fluent, confident text.',
  },
]
