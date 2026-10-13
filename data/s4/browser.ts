// Slide 32 — a simulated browser-agent run with explicit permission boundaries.
// Not any real product. Domains use the reserved .example top-level domain (RFC 2606).
export type Decision = 'allow' | 'ask' | 'block'

export const TASK = 'Get quotes for four electric pallet trucks from two suppliers.'
export const ALLOWLIST = ['liftparts.example', 'palletpro.example']

export interface Rule { id: string, text: string, decision: Decision }
export const RULES: Rule[] = [
  { id: 'read', text: 'Read allowlisted sites', decision: 'allow' },
  { id: 'fill', text: 'Fill in forms (nothing sent)', decision: 'allow' },
  { id: 'send', text: 'Submit, send or share data', decision: 'ask' },
  { id: 'offlist', text: 'Visit sites off the allowlist', decision: 'block' },
  { id: 'pay', text: 'Pay, sign in, accept terms', decision: 'block' },
]

export interface Action { cmd: string, note: string, rule: string, decision: Decision }
export const ACTIONS: Action[] = [
  { cmd: 'open liftparts.example', note: 'Search “electric pallet truck”', rule: 'read', decision: 'allow' },
  { cmd: 'read product page', note: 'Price and lead time noted', rule: 'read', decision: 'allow' },
  { cmd: 'go to pay-now.example', note: 'Told to by hidden page text', rule: 'offlist', decision: 'block' },
  { cmd: 'open palletpro.example', note: 'Second supplier', rule: 'read', decision: 'allow' },
  { cmd: 'fill quote form', note: 'Quantity 4, Harbour depot', rule: 'fill', decision: 'allow' },
  { cmd: 'submit quote form', note: 'Sends Kestrel contact details', rule: 'send', decision: 'ask' },
  { cmd: 'click “Buy now”', note: 'Not part of the task', rule: 'pay', decision: 'block' },
]

export const APPROVER = 'Tomás Ruiz'
