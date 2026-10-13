// Slide 40 — failure and recovery. Three simulated failures in the fictional Lark report run,
// each handled two ways: a naive loop (retry the same call) and an engineered loop (classify, then respond).
export type Tone = 'ok' | 'warn' | 'bad' | 'neutral' | 'active'

export interface Attempt { action: string, result: string, tone: Tone }
export interface Handling { attempts: Attempt[], outcome: { tone: Tone, label: string } }
export interface Failure {
  id: string
  name: string
  kind: string
  kindTone: Tone
  naive: Handling
  engineered: Handling
  rule: string
}

export const FAILURES: Failure[] = [
  {
    id: 'timeout',
    name: 'Budget system times out',
    kind: 'Temporary: recoverable',
    kindTone: 'warn',
    naive: {
      attempts: [
        { action: 'get_budget()', result: 'timeout', tone: 'bad' },
        { action: 'get_budget()', result: 'timeout', tone: 'bad' },
        { action: 'get_budget() ×38', result: 'timeout', tone: 'bad' },
      ],
      outcome: { tone: 'bad', label: 'No limit: 40 calls, still stuck' },
    },
    engineered: {
      attempts: [
        { action: 'get_budget()', result: 'timeout', tone: 'bad' },
        { action: 'wait 30 s, retry 1/2', result: '200 OK', tone: 'ok' },
      ],
      outcome: { tone: 'ok', label: 'Recovered within the limit' },
    },
    rule: 'Temporary fault: retry a bounded number of times, with a pause.',
  },
  {
    id: 'mismatch',
    name: 'Budget total and lines disagree',
    kind: 'Data problem: recoverable',
    kindTone: 'warn',
    naive: {
      attempts: [
        { action: 'get_budget()', result: '€628k vs €614k', tone: 'bad' },
        { action: 'get_budget()', result: '€628k vs €614k', tone: 'bad' },
        { action: 'get_budget()', result: '€628k vs €614k', tone: 'bad' },
      ],
      outcome: { tone: 'bad', label: 'Same cause, same error, three times' },
    },
    engineered: {
      attempts: [
        { action: 'get_budget()', result: '€628k vs €614k', tone: 'bad' },
        { action: 'get_lines()', result: '€14k invoice pending', tone: 'ok' },
        { action: 'draft both figures', result: 'flagged for Mei Chen', tone: 'ok' },
      ],
      outcome: { tone: 'ok', label: 'Changed the action, found the cause' },
    },
    rule: 'Known cause: change the action, not just the timing.',
  },
  {
    id: 'permission',
    name: 'Access denied to staff costs',
    kind: 'Not permitted: unrecoverable',
    kindTone: 'bad',
    naive: {
      attempts: [
        { action: 'hr_costs()', result: '403 denied', tone: 'bad' },
        { action: 'hr_costs()', result: '403 denied', tone: 'bad' },
        { action: 'search shared drive', result: 'finds an old copy', tone: 'bad' },
      ],
      outcome: { tone: 'bad', label: 'Works around a control' },
    },
    engineered: {
      attempts: [
        { action: 'hr_costs()', result: '403 denied', tone: 'bad' },
        { action: 'stop and ask Priya', result: 'request logged', tone: 'warn' },
      ],
      outcome: { tone: 'warn', label: 'Escalated after one attempt' },
    },
    rule: 'Not permitted: never work around it. Stop and escalate.',
  },
]
