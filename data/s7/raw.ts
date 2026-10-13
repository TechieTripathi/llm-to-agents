// The demonstration files in demos/ are the single source of truth for the raw material.
// Components read them verbatim through Vite's `?raw` import so the deck and the files cannot drift apart.
import meetingNotesRaw from '../../demos/meeting-notes.md?raw'
import depotCsvRaw from '../../demos/depot-metrics.csv?raw'

export const MEETING_NOTES_FILE = 'demos/meeting-notes.md'
export const DEPOT_CSV_FILE = 'demos/depot-metrics.csv'

/** Meeting-note lines exactly as in demos/meeting-notes.md (1-based numbering in the UI). */
export const meetingLines: string[] = meetingNotesRaw.replace(/\r/g, '').replace(/\n+$/, '').split('\n')

export interface DepotRow { week: string, depot: string, shipments: number, onTime: number, tickets: number }

/** Rows parsed from demos/depot-metrics.csv. */
export const depotRows: DepotRow[] = depotCsvRaw.replace(/\r/g, '').trim().split('\n').slice(1).map((line) => {
  const [week, depot, shipments, onTime, tickets] = line.split(',')
  return { week, depot, shipments: Number(shipments), onTime: Number(onTime), tickets: Number(tickets) }
})

export const depotCsvLines: string[] = depotCsvRaw.replace(/\r/g, '').trim().split('\n')

export const depotTotals = (() => {
  const shipments = depotRows.reduce((a, r) => a + r.shipments, 0)
  const onTime = depotRows.reduce((a, r) => a + r.onTime, 0)
  const tickets = depotRows.reduce((a, r) => a + r.tickets, 0)
  return { shipments, onTime, tickets, rate: Math.round((onTime / shipments) * 1000) / 10 }
})()

import statusReportRaw from '../../demos/project-status-report.md?raw'
import policyRaw from '../../demos/policy-excerpt.md?raw'

export const STATUS_REPORT_FILE = 'demos/project-status-report.md'
export const POLICY_FILE = 'demos/policy-excerpt.md'

/** Bullet lines from one numbered section ("## 5. …") of the status report, verbatim. */
export function statusSection(no: number): string[] {
  const lines = statusReportRaw.replace(/\r/g, '').split('\n')
  const start = lines.findIndex(l => l.startsWith(`## ${no}.`))
  if (start < 0) return []
  const out: string[] = []
  for (const l of lines.slice(start + 1)) {
    if (l.startsWith('## ')) break
    if (l.startsWith('- ')) out.push(l.slice(2))
  }
  return out
}

/** The on-time figure exactly as the status report states it (deliberately stale, see agent demo). */
export const reportedOnTime: string = (statusReportRaw.match(/On-time delivery, all depots: ([\d.]+%)/) ?? [])[1] ?? '?'
export const reportedTickets: string = (statusReportRaw.match(/Portal support tickets this week: (\d+)/) ?? [])[1] ?? '?'

export interface PolicyClause { id: string, title: string, text: string }

/** Clauses "**4.1 Approval.** …" parsed verbatim from demos/policy-excerpt.md. */
export const policyClauses: PolicyClause[] = [...policyRaw.matchAll(/^\*\*(\d\.\d) ([^*]+?)\.\*\* (.+)$/gm)]
  .map(m => ({ id: m[1], title: m[2], text: m[3].trim() }))

export const policyMeta: string = (policyRaw.match(/^Version .+$/m) ?? [''])[0]
