// Slide 65 — final takeaways, one per stage of the deck's learning journey (data/sections.ts JOURNEY).
// Each takeaway is split into [before, emphasised, after].
export const TAKEAWAYS: { stage: string, text: [string, string, string] }[] = [
  { stage: 'Model', text: ['LLMs ', 'generate and transform information', '. Fluent is not the same as correct.'] },
  { stage: 'Context', text: ['', 'Context improves task relevance', ': give the model what the task needs.'] },
  { stage: 'Tools', text: ['Tools and browsers ', 'extend access and action', ', and with them the risk.'] },
  { stage: 'Agent', text: ['Agents ', 'coordinate multi-step tasks', ' within the constraints you set.'] },
  { stage: 'Verified workflow', text: ['', 'Validation, permissions and human accountability', ' remain essential.'] },
]

export const QUESTIONS = [
  'Which recurring task will you try first?',
  'What would you need to see before trusting the output?',
  'What should never be delegated to an agent?',
]
