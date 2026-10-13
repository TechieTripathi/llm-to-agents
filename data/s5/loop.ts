// Slide 39 — agent-loop simulator (Artifact G). Two simulated runs of the same fictional task.
// Run A: tools respond and the loop stops on success. Run B: the budget system is down,
// bounded retries fail and the loop stops by escalating to a person. No real system is called.

export type Station = 'observe' | 'decide' | 'act' | 'inspect' | 'validate'
export type Tone = 'ok' | 'warn' | 'bad' | 'neutral' | 'active'

export interface LoopStep {
  run: 'A' | 'B'
  station: Station
  short: string
  title: string
  detail: string
  call?: string
  response?: { tone: Tone, text: string }
  verdict?: { tone: Tone, label: string }
  stop?: 'done' | 'escalate'
  iter: number
  calls: number
  retries: number
  /** Task state after this step: what the agent has recorded. */
  have: { tickets: Tone, budget: Tone, dates: Tone, draft: Tone }
}

const none = { tickets: 'neutral', budget: 'neutral', dates: 'neutral', draft: 'neutral' } as const

export const STATIONS: { id: Station, label: string }[] = [
  { id: 'observe', label: 'Observe' },
  { id: 'decide', label: 'Decide' },
  { id: 'act', label: 'Act' },
  { id: 'inspect', label: 'Inspect' },
  { id: 'validate', label: 'Validate' },
]

export const RUN_START = { A: 0, B: 7 }

export const LOOP: LoopStep[] = [
  // ── Run A: success path ───────────────────────────────────────────
  { run: 'A', station: 'observe', short: 'Observe', iter: 1, calls: 0, retries: 0, have: { ...none },
    title: 'Read the goal and the current state',
    detail: 'Nothing gathered yet. Needed: ticket counts, budget, milestone dates.' },
  { run: 'A', station: 'decide', short: 'Decide', iter: 1, calls: 0, retries: 0, have: { ...none },
    title: 'Choose the next action',
    detail: 'The model proposes a read-only call for the first missing fact.',
    call: 'tracker.search_issues(project="LARK", status="open")' },
  { run: 'A', station: 'act', short: 'Act', iter: 1, calls: 1, retries: 0, have: { ...none },
    title: 'The harness runs the call',
    detail: 'Permission checked (read). Simulated tracker answers.',
    call: 'tracker.search_issues(project="LARK", status="open")',
    response: { tone: 'ok', text: '200 OK  open=14  blocked=3  as_of=2026-10-12' } },
  { run: 'A', station: 'inspect', short: 'Inspect', iter: 1, calls: 1, retries: 0, have: { ...none },
    title: 'Look at what came back',
    detail: 'All fields present, dated yesterday, matches what was asked.',
    response: { tone: 'ok', text: '200 OK  open=14  blocked=3  as_of=2026-10-12' } },
  { run: 'A', station: 'validate', short: 'Validate', iter: 1, calls: 1, retries: 0, have: { ...none, tickets: 'ok' },
    title: 'Check against the success criteria',
    detail: 'Fresh and complete, so it is recorded. Budget and dates still missing: continue.',
    verdict: { tone: 'ok', label: 'Passes — continue' } },
  { run: 'A', station: 'validate', short: 'Two more loops', iter: 3, calls: 3, retries: 0, have: { tickets: 'ok', budget: 'ok', dates: 'ok', draft: 'neutral' },
    title: 'Two more loops: budget, then dates',
    detail: 'Each result goes through the same inspect and validate steps.',
    response: { tone: 'ok', text: 'budget 200 OK  spent=€628k of €700k\ndates  200 OK  M3=13 Nov' },
    verdict: { tone: 'ok', label: 'Both pass' } },
  { run: 'A', station: 'validate', short: 'Stop: done', iter: 4, calls: 4, retries: 0, have: { tickets: 'ok', budget: 'ok', dates: 'ok', draft: 'ok' },
    title: 'Stop: the success criteria are met',
    detail: 'Draft saved; every figure traces to a tool result. Handed to Priya for approval. Nothing was sent.',
    verdict: { tone: 'ok', label: 'Stopped — goal met' }, stop: 'done' },

  // ── Run B: failure path with bounded retry and escalation ─────────
  { run: 'B', station: 'decide', short: 'Decide', iter: 2, calls: 1, retries: 0, have: { ...none, tickets: 'ok' },
    title: 'Run B: tickets done, budget next',
    detail: 'Same task, another day. The model proposes the budget call.',
    call: 'finance.get_budget(project="LARK", period="2026-10")' },
  { run: 'B', station: 'inspect', short: 'Act, inspect', iter: 2, calls: 2, retries: 0, have: { ...none, tickets: 'ok' },
    title: 'The call fails',
    detail: 'The budget system does not answer. No figure came back.',
    call: 'finance.get_budget(project="LARK", period="2026-10")',
    response: { tone: 'bad', text: '503 Service Unavailable' } },
  { run: 'B', station: 'validate', short: 'Retry 1', iter: 2, calls: 3, retries: 1, have: { ...none, tickets: 'ok', budget: 'bad' },
    title: 'Validate fails; the error looks temporary',
    detail: 'Policy: an outage may clear, so retry, at most twice, after a pause.',
    response: { tone: 'bad', text: 'retry 1 of 2 (after 30 s): 503 Service Unavailable' },
    verdict: { tone: 'warn', label: 'Retry 1 of 2 used' } },
  { run: 'B', station: 'act', short: 'Retry 2', iter: 2, calls: 4, retries: 2, have: { ...none, tickets: 'ok', budget: 'bad' },
    title: 'Second retry, same result',
    detail: 'The cause has not changed, so the result has not either.',
    response: { tone: 'bad', text: 'retry 2 of 2 (after 60 s): 503 Service Unavailable' },
    verdict: { tone: 'bad', label: 'Retry limit reached' } },
  { run: 'B', station: 'validate', short: 'Stop: escalate', iter: 2, calls: 4, retries: 2, have: { ...none, tickets: 'ok', budget: 'bad' },
    title: 'Stop: escalate to a person',
    detail: 'Partial draft saved. Mei Chen (finance) is told the budget system is down. No figures are guessed.',
    verdict: { tone: 'warn', label: 'Stopped — escalated' }, stop: 'escalate' },
]
