// Slide 61 — data-sensitivity decision guide. Generic teaching guidance, not legal advice:
// the organisation's own policy and data classification always decide.
export type Verdict = 'ok' | 'warn' | 'bad'
export type ToolId = 'approved' | 'consumer'

export interface Guidance {
  state: Verdict
  label: string
  why: string
  instead?: string
}

export interface DataType {
  id: string
  label: string
  /** Fictional Kestrel Freight example. */
  example: string
  guidance: Record<ToolId, Guidance>
}

export const TOOLS: { id: ToolId, label: string, hint: string }[] = [
  { id: 'approved', label: 'Approved enterprise tool', hint: 'Assessed and contracted by your organisation' },
  { id: 'consumer', label: 'Unapproved consumer tool', hint: 'Personal account, free app or extension' },
]

const leaves = 'It leaves your control and is stored on the provider\'s terms, not your policy.'

export const DATA_TYPES: DataType[] = [
  {
    id: 'public',
    label: 'Public information',
    example: 'Published delivery zones',
    guidance: {
      approved: { state: 'ok', label: 'OK', why: 'Nothing confidential is exposed.', instead: 'The output can still be wrong: check it before you reuse it.' },
      consumer: { state: 'ok', label: 'OK', why: 'Nothing confidential is exposed.', instead: 'The output can still be wrong: check it before you reuse it.' },
    },
  },
  {
    id: 'internal',
    label: 'Internal document',
    example: 'Project Lark status notes',
    guidance: {
      approved: { state: 'ok', label: 'OK', why: 'This is what approved tools are for.', instead: 'Share chats and outputs only with people who may read the document.' },
      consumer: { state: 'bad', label: 'Don\'t', why: leaves, instead: 'Use the approved tool instead.' },
    },
  },
  {
    id: 'personal',
    label: 'Customer personal data',
    example: 'Names and delivery addresses',
    guidance: {
      approved: { state: 'warn', label: 'Only if policy allows', why: 'Personal data needs a permitted purpose, even in an approved tool.', instead: 'Use only what the task needs: swap names for customer IDs.' },
      consumer: { state: 'bad', label: 'Don\'t', why: leaves, instead: 'Use the approved tool, with the minimum personal data.' },
    },
  },
  {
    id: 'secrets',
    label: 'Credentials and secrets',
    example: 'API keys, passwords, tokens',
    guidance: {
      approved: { state: 'bad', label: 'Don\'t', why: 'No task needs a live secret in a prompt, and chats are stored.', instead: 'Use a placeholder like <API_KEY>. Rotate any key that leaks.' },
      consumer: { state: 'bad', label: 'Don\'t', why: 'No task needs a live secret in a prompt, and chats are stored.', instead: 'Use a placeholder like <API_KEY>. Rotate any key that leaks.' },
    },
  },
  {
    id: 'regulated',
    label: 'Regulated data',
    example: 'Payroll, health or card data',
    guidance: {
      approved: { state: 'warn', label: 'Specific approval only', why: 'Regulated data often has rules beyond general tool approval.', instead: 'Ask your data protection or compliance team first.' },
      consumer: { state: 'bad', label: 'Don\'t', why: leaves, instead: 'Ask your data protection or compliance team which system to use.' },
    },
  },
]

/** Presenter tour driven by clicks: [dataTypeId, toolId]. */
export const TOUR: [string, ToolId][] = [
  ['internal', 'approved'],
  ['internal', 'consumer'],
  ['personal', 'approved'],
  ['secrets', 'approved'],
]

export const CHECKS = [
  { term: 'Approved tool?', q: 'Has my organisation approved this tool?' },
  { term: 'Classification?', q: 'How is this data classified?' },
  { term: 'Retention?', q: 'Where is it stored, and for how long?' },
  { term: 'Who has access?', q: 'Who else can see the chat and output?' },
]
