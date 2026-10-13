// Slide 14 — fictional Kestrel Freight documents for the context-window simulator.
// Token counts are computed live with a real tokenizer; the answers are SIMULATED.

export type DocId = 'brief' | 'appendix' | 'meeting' | 'policy' | 'report'

export interface ContextDoc {
  id: DocId
  title: string
  kind: string
  relevant: boolean
  /** Short excerpt shown on the slide. */
  gist: string
  text: string
}

export const QUESTION = 'When can the portal go live? What must happen first?'

// Long technical appendix: realistic but irrelevant to the question. Generated so it is long.
const FIELDS = [
  ['shipment.id', 'string', 'Unique shipment reference issued by the booking system'],
  ['shipment.status_code', 'string', 'Two-letter status from the carrier gateway (IT in transit, DL delivered, EX exception)'],
  ['shipment.depot_id', 'integer', 'Depot that currently holds the consignment (1–6)'],
  ['shipment.eta_utc', 'datetime', 'Estimated arrival time in UTC, recalculated every 15 minutes'],
  ['shipment.weight_kg', 'decimal', 'Gross weight including pallet, rounded to 0.1 kg'],
  ['shipment.pallet_count', 'integer', 'Number of pallets on the consignment note'],
  ['shipment.hazard_class', 'string', 'Dangerous-goods class if any, otherwise empty'],
  ['shipment.customer_ref', 'string', 'Free-text reference supplied by the customer, max 40 characters'],
  ['event.timestamp_utc', 'datetime', 'Time the scan event was recorded at the depot'],
  ['event.scanner_id', 'string', 'Handheld scanner that produced the event'],
  ['event.location_code', 'string', 'Bay or dock code where the scan happened'],
  ['event.exception_reason', 'string', 'Reason text when status_code is EX'],
  ['proof.signature_ref', 'string', 'Pointer to the stored delivery signature image'],
  ['proof.photo_ref', 'string', 'Pointer to the stored delivery photo, if taken'],
  ['proof.received_by', 'string', 'Name typed by the driver at handover'],
  ['account.id', 'string', 'Customer account number'],
  ['account.tier', 'string', 'Service tier: standard, priority or contract'],
  ['account.portal_users', 'integer', 'Number of active portal logins on the account'],
  ['account.notification_pref', 'string', 'Email, SMS or none'],
  ['rate.zone', 'string', 'Pricing zone derived from the delivery postcode'],
  ['rate.surcharge_fuel', 'decimal', 'Fuel surcharge applied to this shipment'],
  ['rate.surcharge_remote', 'decimal', 'Remote-area surcharge, if applicable'],
  ['api.page_size', 'integer', 'Maximum records per page; default 50, maximum 500'],
  ['api.cursor', 'string', 'Opaque cursor for the next page of results'],
]
const appendixRows: string[] = []
for (let round = 0; round < 2; round++) {
  for (const [field, type, desc] of FIELDS) {
    const v = round === 0 ? 'v1' : 'v2'
    appendixRows.push(`| ${field} | ${type} | ${v} | ${desc}. Validation errors return HTTP 422 with the field name in error.detail. |`)
  }
}

// Long operations report: realistic, irrelevant to the question.
const reportRows: string[] = []
for (let week = 27; week <= 34; week++) {
  for (let depot = 1; depot <= 6; depot++) {
    const parcels = 14000 + ((week * 37 + depot * 113) % 6000)
    const onTime = (90 + ((week * 7 + depot * 3) % 70) / 10).toFixed(1)
    const defects = (week + depot) % 6
    const overtime = 60 + ((week * 11 + depot * 17) % 90)
    reportRows.push(`Week ${week}, Depot ${depot}: ${parcels.toLocaleString('en-GB')} parcels, on-time ${onTime}%, ${defects} vehicle defects, ${overtime} overtime hours.`)
  }
}

export const DOCS: ContextDoc[] = [
  {
    id: 'brief',
    title: 'Project brief (June)',
    kind: 'Project brief',
    relevant: true,
    gist: 'Target go-live: Tue 20 Oct',
    text: `Project Lark — Customer Portal Upgrade. Project brief (approved June).
Sponsor: Helen Brooks, Operations director. Project manager: Priya Nair.
Goal: replace the legacy shipment-tracking portal before the peak season.
Scope: customer login, live shipment tracking, proof-of-delivery download, notification preferences.
Out of scope: billing, rate quotes, driver app.
Target go-live: Tuesday 20 October.
Success measures: fewer "where is my order" calls to the service desk; portal available 99.5% of business hours.
Key risks: integration with the carrier gateway; load during peak; data migration of 4,000 customer accounts.`,
  },
  {
    id: 'appendix',
    title: 'API field appendix',
    kind: 'Technical appendix',
    relevant: false,
    gist: 'Data-field table. No dates.',
    text: `Appendix C — Carrier gateway API field reference (vendor document, version 4.2).
| Field | Type | Version | Description |
|---|---|---|---|
${appendixRows.join('\n')}`,
  },
  {
    id: 'meeting',
    title: 'Meeting note (2 Oct)',
    kind: 'Meeting note',
    relevant: true,
    gist: 'Go-live moved to Tue 27 Oct',
    text: `Project Lark steering meeting — Friday 2 October. Present: Helen Brooks, Priya Nair, Daniel Okafor, Tomás Ruiz.
1. Load test on 30 September failed at 60% of expected peak traffic (database connection limit).
2. Decision: go-live moves from 20 October to Tuesday 27 October.
3. Action: Daniel Okafor to fix the connection limit and rerun the load test by Friday 23 October.
4. Go-live goes ahead only if the rerun passes at 120% of expected peak.
5. Tomás Ruiz to brief depot managers once the date is confirmed.`,
  },
  {
    id: 'policy',
    title: 'IT change policy',
    kind: 'Policy excerpt',
    relevant: true,
    gist: 'Approval 5 working days ahead',
    text: `Kestrel Freight IT change policy — section 4, production releases.
4.1 Every production release needs approval from the Change Advisory Board (CAB).
4.2 Requests must reach the CAB at least five working days before the release date.
4.3 Peak-season change freeze: no production releases from 1 November to 5 January, except emergency fixes approved by the Operations director.`,
  },
  {
    id: 'report',
    title: 'Depot ops report (Q3)',
    kind: 'Operations report',
    relevant: false,
    gist: 'Depot volumes. Not about Lark.',
    text: `Kestrel Freight — Q3 depot operations report (weeks 27–34). Prepared by the operations analytics team.
${reportRows.join('\n')}
Summary: volumes rose steadily through the quarter; on-time performance stayed above 90% at all depots.`,
  },
]

/** Conceptual window for teaching. Real models have far larger windows; the trade-offs remain. */
export const CAPACITY = 4000

export interface Claim { text: string, state: 'ok' | 'warn' | 'bad' | 'neutral', note: string }
export interface SimAnswer { headline: string, claims: Claim[], lost?: boolean }

/** Deterministic simulated answer for the selected documents. */
export function simulateAnswer(on: Set<DocId>): SimAnswer {
  const B = on.has('brief'); const M = on.has('meeting'); const P = on.has('policy')
  // Teaching simplification of the "lost in the middle" risk: with both long documents in,
  // the meeting note sits near the middle of a long input, so the simulated answer misses it.
  const buried = M && on.has('appendix') && on.has('report')
  const claims: Claim[] = []
  if (!B && !M && !P) {
    return {
      headline: 'Without documents, only general terms.',
      claims: [
        { text: 'Portal launches usually follow testing and user acceptance; the date depends on your project plan.', state: 'neutral', note: 'Generic — nothing about Project Lark' },
      ],
    }
  }
  if (M && !buried) {
    claims.push({ text: 'Go-live is Tuesday 27 October (moved from 20 October).', state: 'ok', note: 'Meeting note, item 2' })
    claims.push({ text: 'First, the load-test rerun must pass by Friday 23 October.', state: 'ok', note: 'Meeting note, items 3–4' })
  }
  else if (B) {
    claims.push({ text: 'Go-live is planned for Tuesday 20 October.', state: buried ? 'bad' : 'warn', note: buried ? 'Outdated — the update was in context but missed' : 'Outdated — a later decision was not supplied' })
  }
  else {
    claims.push(buried
      ? { text: 'The documents do not give a go-live date.', state: 'bad', note: 'Wrong — the date was in the context but missed' }
      : { text: 'The go-live date is not stated in the documents provided.', state: 'neutral', note: 'Honest gap' })
  }
  if (P) {
    claims.push({ text: (M && !buried) ? 'Change board approval is needed by Tuesday 27 October.' : 'Change board approval is needed 5 working days before release.', state: 'ok', note: 'Policy 4.1–4.2' })
    claims.push({ text: 'A further slip past 1 November hits the change freeze.', state: 'ok', note: 'Policy 4.3' })
  }
  return {
    headline: buried
      ? 'The update was there, but buried mid-input.'
      : (M && P) ? 'Current, relevant sources.' : (M ? 'The latest decision is available.' : 'Limited to what was supplied.'),
    claims,
    lost: buried,
  }
}

/** Fixed assembly order of the context (as a retrieval system might concatenate them). */
export const ORDER: DocId[] = ['brief', 'appendix', 'meeting', 'report', 'policy']

/** Click-driven presets: what is included at each step (the PDF shows these). */
export const PRESETS: { label: string, on: DocId[] }[] = [
  { label: 'No documents', on: [] },
  { label: 'Brief only', on: ['brief'] },
  { label: 'Add meeting note', on: ['brief', 'meeting'] },
  { label: 'Add policy', on: ['brief', 'meeting', 'policy'] },
  { label: 'Add everything', on: ['brief', 'appendix', 'meeting', 'report', 'policy'] },
]
