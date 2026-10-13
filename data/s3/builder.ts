// Slide 20 — prompt builder. Every field changes the assembled prompt AND the simulated draft.
// All content is fictional (Kestrel Freight, Project Lark); drafts are hand-written simulations.

export type AudienceKey = 'steering' | 'depots' | 'customers'
export type FormatKey = 'brief' | 'email' | 'table'
export type LengthKey = 'short' | 'detailed'
export type RuleKey = 'plain' | 'cite' | 'decision'

export interface Fact {
  item: string
  value: string
  valuePlain?: string
  say: string
  sayPlain?: string
  cite: string
}

export interface Audience {
  key: AudienceKey
  button: string
  prompt: string
  subject: string
  greeting: string
  facts: Fact[]
  closing: string
}

export const AUDIENCES: Audience[] = [
  {
    key: 'steering',
    button: 'Directors',
    prompt: 'the steering committee (directors)',
    subject: 'Project Lark: week 41 status',
    greeting: 'Dear steering committee,',
    facts: [
      { item: 'Status', value: 'Amber; go-live 27 Oct holds', say: 'Lark is amber and the 27 Oct go-live holds.', cite: 'tracker r.2' },
      { item: 'Budget', value: '€612k of €700k spent', say: '€612k of the €700k budget is spent.', cite: 'tracker r.18' },
      { item: 'Testing', value: '2 Sev-1 defects open in UAT', valuePlain: '2 serious faults open in testing', say: 'Two Sev-1 defects remain open in UAT.', sayPlain: 'Two serious faults are still open in testing.', cite: 'tracker r.12' },
      { item: 'Vendor', value: 'API rate-limit fix due 21 Oct', valuePlain: 'supplier fix due 21 Oct', say: 'The vendor’s API rate-limit fix is due 21 Oct.', sayPlain: 'The supplier’s fix for slow updates is due 21 Oct.', cite: 'vendor email 8 Oct' },
    ],
    closing: 'Decision needed: defer CR-7 (text alerts) to January?',
  },
  {
    key: 'depots',
    button: 'Depots',
    prompt: 'depot supervisors',
    subject: 'New tracking portal: what changes for your depot',
    greeting: 'Hi all,',
    facts: [
      { item: 'Switchover', value: '4 of 6 live; North, Harbour 20 Oct', say: 'Four of six depots are live; North and Harbour switch on 20 Oct.', cite: 'tracker r.7' },
      { item: 'Training', value: '30-minute sessions, 14–17 Oct', say: 'Training runs in 30-minute sessions, 14–17 Oct.', cite: 'plan' },
      { item: 'Known issue', value: 'DEF-112 on legacy printers', valuePlain: 'old printers may fail', say: 'DEF-112: label printing fails on legacy printers.', sayPlain: 'Labels may not print on older printers.', cite: 'tracker r.12' },
      { item: 'Support', value: 'L2 ticket, OPS queue', valuePlain: 'IT desk, ext. 4400', say: 'Raise an L2 ticket in the OPS queue.', sayPlain: 'Call the IT desk on ext. 4400.', cite: 'guide' },
    ],
    closing: 'Action: book a training slot by 17 Oct.',
  },
  {
    key: 'customers',
    button: 'Customers',
    prompt: 'our business customers',
    subject: 'Your tracking portal moves on 27 October',
    greeting: 'Dear customer,',
    facts: [
      { item: 'Date', value: 'new portal live from 27 Oct', say: 'Your new tracking portal goes live on 27 October.', cite: 'FAQ §1' },
      { item: 'Login', value: 'SSO with existing credentials', valuePlain: 'same username and password', say: 'You can sign in via SSO with your existing credentials.', sayPlain: 'Sign in with your usual username and password.', cite: 'FAQ §3' },
      { item: 'Bookmarks', value: 'legacy URL redirects until 30 Nov', valuePlain: 'old link works until 30 Nov', say: 'The legacy URL redirects until 30 November.', sayPlain: 'Your old link keeps working until 30 November.', cite: 'FAQ §4' },
      { item: 'Help', value: 'portal-support@kestrel.example', say: 'Questions: portal-support@kestrel.example.', cite: 'FAQ §6' },
    ],
    closing: 'No action is needed before 27 October.',
  },
]

export const FORMATS: { key: FormatKey, button: string, prompt: string }[] = [
  { key: 'brief', button: 'Brief', prompt: 'a short brief with bullet points' },
  { key: 'email', button: 'Email', prompt: 'an email with a subject line' },
  { key: 'table', button: 'Table', prompt: 'a two-column table' },
]

export const LENGTHS: { key: LengthKey, button: string, prompt: string, facts: number }[] = [
  { key: 'short', button: 'Short', prompt: 'under 40 words', facts: 2 },
  { key: 'detailed', button: 'Detailed', prompt: 'under 80 words', facts: 4 },
]

export const RULES: { key: RuleKey, button: string, prompt: string }[] = [
  { key: 'plain', button: 'Plain words', prompt: 'no jargon' },
  { key: 'cite', button: 'Cite sources', prompt: 'cite each fact' },
  { key: 'decision', button: 'End with the ask', prompt: 'end with the ask' },
]

export interface BuilderState {
  audience: AudienceKey
  format: FormatKey
  length: LengthKey
  rules: RuleKey[]
}

/** Clicker presets: each step changes one field so every PDF state shows one cause and its effect. */
export const PRESETS: { state: BuilderState, changed: 'audience' | 'format' | 'length' | 'rules' | null, label: string }[] = [
  { state: { audience: 'steering', format: 'brief', length: 'short', rules: ['decision'] }, changed: null, label: 'Start' },
  { state: { audience: 'customers', format: 'brief', length: 'short', rules: ['decision'] }, changed: 'audience', label: 'Audience' },
  { state: { audience: 'customers', format: 'email', length: 'short', rules: ['decision'] }, changed: 'format', label: 'Format' },
  { state: { audience: 'customers', format: 'email', length: 'detailed', rules: ['decision'] }, changed: 'length', label: 'Length' },
  { state: { audience: 'customers', format: 'email', length: 'detailed', rules: ['decision', 'plain'] }, changed: 'rules', label: 'Rules' },
]
