// Slide 6 (and later revisits) — the course path as nested layers around the model.
export const LAYERS = [
  {
    id: 'Model',
    items: ['Predicts the next token'],
    says: 'Predicts text from the text it is given.',
    where: 'Section 2',
  },
  {
    id: 'Context',
    items: ['Instructions', 'Documents', 'Examples'],
    says: 'What you give it to work with.',
    where: 'Section 3',
  },
  {
    id: 'Tools',
    items: ['Search', 'Files', 'Business systems'],
    says: 'Lets the system look things up and act.',
    where: 'Section 4',
  },
  {
    id: 'Agent',
    items: ['Decide', 'Act', 'Check', 'Repeat or stop'],
    says: 'A loop: decide, act, check, until done.',
    where: 'Section 5',
  },
  {
    id: 'Workflow',
    items: ['Validation', 'Human approval', 'Owner', 'Log'],
    says: 'A business process with checks and owners.',
    where: 'Sections 6–8',
  },
] as const

export type LayerId = typeof LAYERS[number]['id']
