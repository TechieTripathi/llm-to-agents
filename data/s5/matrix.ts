// Slide 36 — capability matrix. Column = kind of system, row = question.
// Example tasks use the fictional Kestrel Freight / Project Lark scenario.
export const SYSTEMS = [
  { id: 'chat', name: 'Chat assistant', autonomy: 1, example: '“Tighten this paragraph.”' },
  { id: 'tool', name: 'Tool-using system', autonomy: 2, example: '“Summarize open Lark tickets.”' },
  { id: 'agent', name: 'Agent', autonomy: 3, example: '“Prepare and route the Lark report.”' },
] as const

export const ROWS = [
  {
    q: 'Who decides the next step?',
    cells: ['You, every turn', 'You or fixed code; the model fills in the call', 'The model, step by step, within set limits'],
  },
  {
    q: 'What can it see?',
    cells: ['Only what you paste in', 'The sources the app connects', 'Connected sources, over many steps'],
  },
  {
    q: 'What can it change?',
    cells: ['Nothing outside the chat', 'Usually nothing, or one action you trigger', 'Whatever its tools permit: files, tickets, email'],
  },
  {
    q: 'Typical failure',
    cells: ['Fluent but wrong text', 'Wrong query or misread result', 'Errors compound; a wrong action is taken'],
  },
  {
    q: 'Control you need',
    cells: ['Read and check the answer', 'Scoped access; check the results', 'Permissions, limits, checks, approval, logs'],
  },
]
