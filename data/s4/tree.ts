// Slide 33 — decision tree for choosing a tool. Teaching heuristic, not a standard.
export interface Leaf { id: string, name: string, hint: string }
export interface Question { q: string, yes: string }

export const LEAVES: Record<string, Leaf> = {
  fixed: { id: 'fixed', name: 'Ordinary software', hint: 'A formula, script or existing system: testable, repeatable.' },
  agent: { id: 'agent', name: 'Agent with approvals', hint: 'Least privilege; a person approves consequential steps.' },
  data: { id: 'data', name: 'Data-analysis tool', hint: 'Runs code on your data. Check the code; recompute.' },
  docs: { id: 'docs', name: 'Document retrieval', hint: 'Answers from your files, citing the passages used.' },
  web: { id: 'web', name: 'Web search or research assistant', hint: 'Current sources with links. Open and check them.' },
  chat: { id: 'chat', name: 'Ordinary chat', hint: 'Drafting and rewriting. Check any facts it adds.' },
}

export const QUESTIONS: Question[] = [
  { q: 'Same fixed rule, every time?', yes: 'fixed' },
  { q: 'Must it change another system?', yes: 'agent' },
  { q: 'Mainly numbers in your tables?', yes: 'data' },
  { q: 'Answer is in your own documents?', yes: 'docs' },
  { q: 'Needs current, citable public info?', yes: 'web' },
]
export const FINAL_NO = 'chat'

export interface Example { label: string, task: string, path: boolean[] }
export const EXAMPLES: Example[] = [
  { label: 'EU AI Act', task: 'When do the EU AI Act rules for general-purpose AI models apply?', path: [false, false, false, false, true] },
  { label: 'Email', task: 'Make this reply to a customer shorter and warmer.', path: [false, false, false, false, false] },
  { label: 'Overtime CSV', task: 'Total overtime hours by depot from this CSV export.', path: [false, false, true] },
  { label: 'Travel policy', task: 'What does our travel policy say about rail upgrades?', path: [false, false, false, true] },
  { label: 'Book rooms', task: 'Book three meeting rooms for next week’s workshop.', path: [false, true] },
  { label: 'VAT', task: 'Calculate VAT on 3,000 invoices, every month.', path: [true] },
]
