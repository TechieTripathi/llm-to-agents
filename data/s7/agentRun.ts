// Slide 59 — replay of a SIMULATED, read-only agent run over the files in demos/.
// Numbers are computed from demos/depot-metrics.csv and demos/project-status-report.md at build
// time, so the replay always matches the files. No tool was really called; nothing is sent.
import { depotRows, depotTotals, meetingLines, reportedOnTime, reportedTickets } from './raw'
import statusReportRaw from '../../demos/project-status-report.md?raw'

// File names really present in demos/ (keys only, nothing is loaded).
const demoFiles = Object.keys(import.meta.glob('../../demos/*')).map(p => p.split('/').pop()!).sort()

export const BRIEF_FILE = 'agent-task-brief.md'
export const RETRY_LIMIT = 2

export type Phase = 'gather' | 'act' | 'observe' | 'validate' | 'recover'
export const PHASES: { id: Phase, label: string }[] = [
  { id: 'gather', label: 'Gather' },
  { id: 'act', label: 'Act' },
  { id: 'observe', label: 'Observe' },
  { id: 'validate', label: 'Validate' },
  { id: 'recover', label: 'Recover' },
]

/** One log line. kind: call = tool call, ok/err/warn = result, note = agent reasoning summary. */
export interface LogLine { kind: 'call' | 'ok' | 'err' | 'warn' | 'note' | 'stop', text: string }

export interface RunStep {
  phase: Phase
  lines: LogLine[]
  /** Plain-language caption for the audience. */
  say: string
  retriesUsed: number
  findings: { state: 'ok' | 'warn' | 'bad', text: string }[]
}

const reportLines = statusReportRaw.replace(/\r/g, '').trim().split('\n').length
const rate = `${depotTotals.rate}%`
const fmt = (n: number) => n.toLocaleString('en-GB')
const weekOk = depotRows.every(r => r.week === '2026-W41')
const rv = depotRows.find(r => r.depot === 'Riverside')!
const riverside = Math.round((rv.onTime / rv.shipments) * 1000) / 10
const ticketsMatch = String(depotTotals.tickets) === reportedTickets

const F_FILE = { state: 'ok' as const, text: 'Missing file: recovered' }
const F_MISMATCH = { state: 'bad' as const, text: `On-time ${rate} vs ${reportedOnTime}: flagged` }

/** The draft the run produces (also in demos/expected-outputs.md). */
export const DRAFT = [
  'Project Lark, week 41 (draft for approval)',
  'Status: Amber. UAT is four days late (shipment-search defects); sign-off moves to Fri 16 Oct. Go-live stays Tue 27 Oct, provisionally.',
  `Figures (depot-metrics.csv): on-time ${rate} (${fmt(depotTotals.onTime)} of ${fmt(depotTotals.shipments)}), below the 93% target; Riverside ${riverside}%. Portal tickets: ${depotTotals.tickets}.`,
  `Flag: the status report shows ${reportedOnTime}; the CSV gives ${rate}. Please confirm before sending.`,
  'Actions: Daniel, search fixes by Thu 15 Oct and API impact by Fri 23 Oct. Tomás, vendor ETA by Wed 14 Oct. Arjun, customer notice once API impact is confirmed.',
]

export const DRAFT_WORDS = DRAFT.join(' ').split(/\s+/).length

export const STEPS: RunStep[] = [
  {
    phase: 'gather',
    lines: [
      { kind: 'call', text: `read_file("${BRIEF_FILE}")` },
      { kind: 'note', text: 'plan: report → metrics → compute → validate → draft → approval' },
    ],
    say: 'The agent reads its brief: read-only sources, two retries at most, and nothing leaves without Priya’s approval.',
    retriesUsed: 0,
    findings: [],
  },
  {
    phase: 'gather',
    lines: [
      { kind: 'call', text: 'read_file("project-status-report.md")' },
      { kind: 'ok', text: `ok · ${reportLines} lines · reports on-time ${reportedOnTime}` },
    ],
    say: 'First source read. The report states an on-time figure; the agent notes it but does not trust it yet.',
    retriesUsed: 0,
    findings: [],
  },
  {
    phase: 'act',
    lines: [
      { kind: 'call', text: 'read_file("depot-metrics-w41.csv")' },
      { kind: 'err', text: 'error · file not found' },
    ],
    say: 'A failed action. The brief named a file that does not exist. Repeating the same call would fail the same way.',
    retriesUsed: 0,
    findings: [{ state: 'warn', text: 'Brief names a missing file' }],
  },
  {
    phase: 'recover',
    lines: [
      { kind: 'note', text: `retry 1 of ${RETRY_LIMIT} · change approach: list the folder` },
      { kind: 'call', text: 'list_files("demos/")' },
      { kind: 'ok', text: `ok · ${demoFiles.length} files · found depot-metrics.csv` },
    ],
    say: 'Bounded recovery: one retry used, and it changes the approach instead of guessing a file name.',
    retriesUsed: 1,
    findings: [F_FILE],
  },
  {
    phase: 'observe',
    lines: [
      { kind: 'call', text: 'read_file("depot-metrics.csv")' },
      { kind: 'ok', text: `ok · ${depotRows.length} depots · week 2026-W41 ${weekOk ? '✓' : '✗'}` },
    ],
    say: 'It checks the file is for the right week before using it. A file with the right name can still hold the wrong data.',
    retriesUsed: 1,
    findings: [F_FILE],
  },
  {
    phase: 'act',
    lines: [
      { kind: 'call', text: 'compute(sum(on_time) / sum(shipments))' },
      { kind: 'ok', text: `${fmt(depotTotals.onTime)} / ${fmt(depotTotals.shipments)} = ${rate}` },
    ],
    say: 'The figure is calculated by a tool from the data, not written from memory by the model.',
    retriesUsed: 1,
    findings: [F_FILE],
  },
  {
    phase: 'validate',
    lines: [
      { kind: ticketsMatch ? 'ok' : 'err', text: `tickets ${depotTotals.tickets} = report ${reportedTickets}` },
      { kind: 'err', text: `on-time ${rate} ≠ report ${reportedOnTime}` },
    ],
    say: 'Validation catches a mismatch: the status report reused last week’s on-time figure.',
    retriesUsed: 1,
    findings: [F_FILE, F_MISMATCH],
  },
  {
    phase: 'validate',
    lines: [
      { kind: 'note', text: 'rule in brief: CSV is the system of record' },
      { kind: 'warn', text: `use ${rate} · flag the mismatch · do not edit the report` },
    ],
    say: 'The brief says what to do when figures disagree, so the agent follows the rule and leaves the judgement to a person.',
    retriesUsed: 1,
    findings: [F_FILE, F_MISMATCH],
  },
  {
    phase: 'act',
    lines: [
      { kind: 'call', text: 'read_file("meeting-notes.md")' },
      { kind: 'ok', text: `ok · ${meetingLines.length} lines · owners and dates` },
      { kind: 'call', text: 'write_draft("out/lark-w41-update.md")' },
      { kind: 'ok', text: `ok · ${DRAFT_WORDS} words · sandbox folder` },
    ],
    say: 'The draft is written to a sandbox folder. The agent can write there and nowhere else.',
    retriesUsed: 1,
    findings: [F_FILE, F_MISMATCH],
  },
  {
    phase: 'validate',
    lines: [
      { kind: 'ok', text: 'final checks · 4 of 4 passed' },
      { kind: 'call', text: 'request_approval(to: "Priya Nair")' },
      { kind: 'stop', text: 'held for approval · send_email not permitted · run stopped' },
    ],
    say: 'Final checks pass, the draft goes to Priya with the flag, and the run stops. Nothing has been sent.',
    retriesUsed: 1,
    findings: [F_FILE, F_MISMATCH],
  },
]

export const PERMISSIONS: { label: string, state: 'ok' | 'bad' | 'warn', value: string }[] = [
  { label: 'Read demos/', state: 'ok', value: 'Allowed' },
  { label: 'Write out/ (sandbox)', state: 'ok', value: 'Allowed' },
  { label: 'Edit source files', state: 'bad', value: 'Denied' },
  { label: 'Send email', state: 'warn', value: 'Needs approval' },
]

export const FINAL_CHECKS = [
  'Figures trace to the CSV',
  'Owners found in the notes',
  'Mismatch flagged, not hidden',
  'Draft under 200 words',
]
