// Slide 27 — capability ladder. Category-level description, not any one product.
export interface Rung {
  id: string
  name: string
  verb: string
  access: string
  risk: string
  control: string
}

export const RUNGS: Rung[] = [
  {
    id: 'chat',
    name: 'Conversation',
    verb: 'Explains, drafts, rewrites',
    access: 'Your prompt, pasted text and what it learned in training',
    risk: 'Fluent answers that are wrong or out of date',
    control: 'You check every line yourself',
  },
  {
    id: 'tools',
    name: 'Tool-assisted work',
    verb: 'Searches, reads, calculates',
    access: 'Plus web results, your documents and code it runs',
    risk: 'Weak or planted sources; data leaves your hands',
    control: 'Open the citations; limit what it can read',
  },
  {
    id: 'exec',
    name: 'Multi-step execution',
    verb: 'Plans and acts in steps',
    access: 'Plus a browser, apps and your signed-in accounts',
    risk: 'Real actions; small errors compound',
    control: 'Least privilege, approval before acting, logs',
  },
]
