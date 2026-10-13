// Slide 17 — the questions a capable new colleague would otherwise have to guess.
// `answeredAt` = the magic-move step (click) at which the prompt answers the question.
// Fictional example (Kestrel Freight, Project Lark).
export const OPEN_QUESTIONS: { q: string, answeredAt: number, by: string }[] = [
  { q: 'Which project?', answeredAt: 1, by: 'Project Lark' },
  { q: 'Who reads it?', answeredAt: 1, by: 'Steering committee' },
  { q: 'Which data, when?', answeredAt: 2, by: 'Week 41 tracker' },
  { q: 'What is it for?', answeredAt: 3, by: 'Decide on CR-7' },
  { q: 'How long, what shape?', answeredAt: 3, by: 'One page, 3 parts' },
  { q: 'Missing figures?', answeredAt: 3, by: '“not in source”' },
]

export const EVOLUTION_LABELS = ['A request', '+ subject and reader', '+ source and period', '+ goal, format, gaps']
