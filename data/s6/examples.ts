// Section 6 — content of the department worked examples (slides 47–53).
// Everything about Kestrel Freight is fictional. AI drafts are simulated (written for teaching),
// and each one contains realistic flaws that the human check is meant to catch.

type Flag = { state: 'ok' | 'warn' | 'bad', label: string }

// ---------------------------------------------------------------- HR (47)
export const HR = {
  checks: ['Matches HR policy', 'Legal duties confirmed', 'Facts accurate'],
  docs: [
    { file: 'Onboarding_v4.pdf', code: 'ONB' },
    { file: 'IT_Access.pdf', code: 'ITA' },
    { file: 'Safety_Induction.pdf', code: 'SAF' },
  ],
  prompt: `Using ONLY the three attached policies,
draft an onboarding checklist for a
new depot driver.
Group by day 1, week 1 and month 1.
Cite the policy section on every line.
If a step is not in the policies,
say so instead of adding it.`,
  groups: [
    {
      when: 'Day 1',
      items: [
        { text: 'Right-to-work check', src: 'ONB §2.1', flag: { state: 'warn', label: 'Legal duty: HR confirms' } as Flag },
        { text: 'Safety induction before yard access', src: 'SAF §1.3' },
      ],
    },
    {
      when: 'Week 1',
      items: [
        { text: 'Routing app and email accounts', src: 'ITA §3.1' },
        { text: 'Two ride-along shifts', src: 'ONB §3.2' },
        { text: 'Data-protection e-learning', src: undefined, flag: { state: 'bad', label: 'In no policy' } as Flag },
      ],
    },
    {
      when: 'Month 1',
      items: [
        { text: 'Probation review at 3 months', src: 'ONB §5.2', flag: { state: 'bad', label: '§5.2 says 6 months' } as Flag },
      ],
    },
  ] as { when: string, items: { text: string, src?: string, flag?: Flag }[] }[],
}

// ---------------------------------------------------------------- Finance (48)
// Figures in thousands. `aiPct` is what the simulated AI draft wrote; the slide recomputes the truth.
export const FIN = {
  checks: ['Source figures', 'Calculations', 'Definitions', 'Approval'],
  period: 'Q3 depot costs, figures in thousands',
  rows: [
    { line: 'Fuel', budget: 420, actual: 465, aiPct: 10.7 },
    { line: 'Overtime', budget: 96, actual: 112, aiPct: 12.0 },
    { line: 'Maintenance', budget: 150, actual: 138, aiPct: -8.0 },
    { line: 'Haulage', budget: 210, actual: 251, aiPct: 19.5 },
    { line: 'Utilities', budget: 64, actual: 66, aiPct: 3.1 },
  ],
  totalAiPct: 9.8,
  prompt: `Explain the Q3 cost variances
for depot managers. Use only the
table and our account definitions.
Show how each % was calculated.
Do not guess causes: list the
questions to ask budget owners.`,
  commentary: [
    { text: 'Costs were 92k (9.8%) over budget.', flag: { state: 'ok', label: 'Recomputed: matches' } as Flag },
    { text: 'Driver overtime ran 12% over budget.', flag: { state: 'bad', label: 'Recomputed: 16.7%' } as Flag },
    { text: 'Fuel rose because diesel prices went up.', flag: { state: 'warn', label: 'Cause not in data — ask Ops' } as Flag },
    { text: 'Maintenance was 8% under: a saving.', flag: { state: 'warn', label: 'Saving, or deferred work?' } as Flag },
  ],
}

// ---------------------------------------------------------------- Sales & marketing (49)
export const SALES = {
  checks: ['Source freshness', 'Brand requirements', 'Commercial facts'],
  today: '2026-10-13',
  prospect: 'Harbour & Vale Foods',
  facts: [
    { text: 'Revenue grew 6% last financial year', src: 'Annual report', date: '2026-04-02', flag: { state: 'ok', label: 'Current' } as Flag },
    { text: 'Hiring 12 transport planners', src: 'Job postings', date: '2026-09-18', flag: { state: 'ok', label: 'Current' } as Flag },
    { text: 'New chilled distribution centre opening', src: 'Press release', date: '2024-01-15', flag: { state: 'warn', label: 'Stale' } as Flag },
    { text: 'Moving to a single logistics provider', src: undefined, date: undefined, flag: { state: 'bad', label: 'No source' } as Flag },
  ] as { text: string, src?: string, date?: string, flag: Flag }[],
  rules: ['No absolute guarantees (“always”, “100%”)', 'Service claims must match the fact sheet', 'Plain, specific language'],
  factSheet: ['96% on-time delivery (2025)', 'Temperature logging on every chilled load', 'Six regional depots'],
  variants: [
    { segment: 'Operations managers', text: 'Temperature-logged chilled loads, dock to door.', flag: { state: 'ok', label: 'Matches fact sheet' } as Flag },
    { segment: 'Procurement', text: 'Guaranteed 100% on-time delivery, every time.', flag: { state: 'bad', label: 'Fact sheet: 96%; no guarantees' } as Flag },
    { segment: 'Store managers', text: 'See live arrival times in our customer portal.', flag: { state: 'warn', label: 'Portal not live until Project Lark' } as Flag },
  ],
}

// ---------------------------------------------------------------- Operations (50)
export const OPS = {
  checks: ['Process-owner review', 'Operational safety', 'Assumptions resolved'],
  notes: [
    { t: '22:40', text: 'dock 3 door stuck' },
    { t: '22:45', text: 'remote reset x2: no' },
    { t: '22:50', text: 'on-call no answer' },
    { t: '23:05', text: 'Jo: manual chain' },
    { t: '23:10', text: 'trailer 118→dock 4' },
  ],
  prompt: `Turn these shift-log notes into a
draft SOP for "dock door fails
to close". Numbered, imperative
steps. Link each step to the note
it comes from. Mark anything you
had to assume.`,
  sop: [
    { text: 'Stop loading at that dock; mark it out of use', from: '22:40' },
    { text: 'Try one remote reset from the control panel', from: '22:45' },
    { text: 'Call maintenance on-call; escalate after 10 min', from: '22:50', flag: { state: 'warn', label: 'Assumed: owner sets the time' } as Flag },
    { text: 'Isolate door power and lock it off', from: undefined, added: true, flag: { state: 'ok', label: 'Added by process owner' } as Flag },
    { text: 'Close the door with the manual chain', from: '23:05', flag: { state: 'bad', label: 'Trained staff only — was missing' } as Flag },
    { text: 'Move loading to a free dock and log it', from: '23:10' },
  ] as { text: string, from?: string, added?: boolean, flag?: Flag }[],
}

// ---------------------------------------------------------------- IT & engineering (51)
export const IT = {
  checks: ['Tests run', 'Code reviewed', 'Security requirements'],
  log: [
    { lvl: 'INFO', text: 'GET /track/KF-20931 200 41ms' },
    { lvl: 'ERROR', text: 'GET /track/kf-20932 500 12ms' },
    { lvl: 'ERROR', text: 'GET /track/kf-20940 500 9ms' },
    { lvl: 'INFO', text: 'GET /track/KF-20940 200 38ms' },
    { lvl: 'ERROR', text: 'GET /track/kf-20951 500 8ms' },
  ],
  prompt: `Summarise the error pattern in
this log. Write a failing test
that reproduces it, then propose
the smallest fix and explain it.`,
  summary: 'Lower-case IDs fail with 500; the same ID in upper case works. The lookup is case-sensitive.',
  test: [
    "test('lookup ignores ID case', async () => {",
    "  const res = await get('/track/kf-20940')",
    '  expect(res.status).toBe(200)',
    '})',
  ],
  diff: [
    { op: '-', text: 'const id = req.params.id' },
    { op: '+', text: 'const id = req.params.id.toUpperCase()' },
    { op: '+', text: "if (!/^KF-\\d{5}$/.test(id))" },
    { op: '+', text: '  return res.status(400).end()' },
    { op: '+', text: "logger.debug('lookup', req.headers)", flag: { state: 'bad', label: 'Logs auth headers — removed' } as Flag },
  ] as { op: string, text: string, flag?: Flag }[],
  explain: 'upper-case the ID; reject malformed IDs.',
  runs: [
    { label: 'Before fix', state: 'bad' as const, text: 'new test fails' },
    { label: 'After fix', state: 'ok' as const, text: 'all 48 tests pass' },
    { label: 'Unknown ID still 500', state: 'warn' as const, text: 'new ticket' },
  ],
}

// ---------------------------------------------------------------- Management (52)
export const MGMT = {
  checks: ['Owners', 'Dates', 'Assumptions', 'Decisions'],
  updates: [
    { who: 'Priya Nair', role: 'PM', date: '9 Oct', text: 'Plan holds for 27 Oct go-live. UAT 80% done.' },
    { who: 'Daniel Okafor', role: 'IT', date: '9 Oct', text: 'Load test failed at 2× peak. Earliest safe go-live 3 Nov, if the retest passes.' },
    { who: 'Tomás Ruiz', role: 'Ops', date: '8 Oct', text: 'Depots need 2 weeks’ notice for training. Peak starts 17 Nov.' },
    { who: 'Mei Chen', role: 'Finance', date: '10 Oct', text: 'Within contingency, if only one extra load test.' },
  ],
  prompt: `From these four updates, draft a
one-page decision brief for Helen.
Keep every owner, date and condition
exactly as written. Cite the update
behind each line.`,
  decision: 'Go live on 27 Oct or 3 Nov?',
  lines: [
    { text: 'Status: on track for 27 Oct go-live', src: ['PN'], flag: { state: 'bad', label: 'Contradicts DO: load test failed' } as Flag },
    { text: 'Risk: load test failed at 2× peak; retest needed', owner: 'Daniel', src: ['DO'], flag: { state: 'ok', label: 'Matches' } as Flag },
    { text: 'Training notice: decide by 20 Oct for 3 Nov', owner: 'Tomás', src: ['TR', 'DO'], flag: { state: 'warn', label: 'Derived date — confirm' } as Flag },
    { text: 'Budget: within contingency', owner: 'Mei', src: ['MC'], flag: { state: 'warn', label: 'Dropped “one retest only”' } as Flag },
  ] as { text: string, owner?: string, src: string[], flag: Flag }[],
}

// ---------------------------------------------------------------- Research & learning (53)
// Real, published studies (figures checked against the originals on 2026-10-13).
// The AI extraction and summary are simulated, with errors planted for the check step.
export const RES = {
  checks: ['Original sources', 'Methods', 'Evidence', 'Limitations'],
  question: 'Do AI coding assistants make developers faster?',
  prompt: `For each attached paper, extract:
who took part, the task, what was
measured, the result, and the main
limitation. Quote numbers exactly.
Then summarise where they agree
and where they conflict.`,
  studies: [
    {
      key: 'peng2023copilot', study: 'Peng 2023', kind: 'Controlled experiment',
      who: '95 programmers hired online; one task: build an HTTP server',
      measured: 'Time to finish', ai: '55.8% faster', truth: '55.8% faster',
      limit: 'One lab task; GitHub and Microsoft authors',
    },
    {
      key: 'cui2026copilot', study: 'Cui 2026', kind: '3 field experiments',
      who: '4,867 developers at three companies, normal work',
      measured: 'Completed pull requests', ai: '+26% tasks', truth: '+26% tasks',
      limit: 'Noisy; results vary by company',
    },
    {
      key: 'becker2025metr', study: 'METR 2025', kind: 'Randomised trial',
      who: '16 experienced developers in their own large projects',
      measured: 'Time per task', ai: '19% faster', truth: '19% slower',
      limit: '16 people; early-2025 tools; 2026 rerun inconclusive',
    },
  ],
  summary: [
    { text: 'AI makes developers 55.8% more productive.', flag: { state: 'bad', label: 'One lab task, and it measured time' } as Flag },
    { text: 'Experienced developers benefit most.', flag: { state: 'bad', label: 'Sources: less experienced gain more' } as Flag },
    { text: 'The effect depends on task, experience and setting.', flag: { state: 'ok', label: 'Supported' } as Flag },
  ],
}
