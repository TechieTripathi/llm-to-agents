// Slide 31 — fictional Kestrel Freight depot data (September 2026) and an AI-written summary.
// Numbers are invented for teaching. Claim 2 is deliberately wrong: it averages the six
// percentages instead of dividing total on-time deliveries by total shipments.
export interface Row { depot: string, shipped: number, onTime: number }

export const TITLE = 'Depot on-time delivery · September 2026'
export const TARGET = 0.93

export const ROWS: Row[] = [
  { depot: 'Northgate', shipped: 4120, onTime: 3955 },
  { depot: 'Riverside', shipped: 3480, onTime: 3306 },
  { depot: 'Eastfield', shipped: 2950, onTime: 2714 },
  { depot: 'Harbour', shipped: 5210, onTime: 4611 },
  { depot: 'Westmoor', shipped: 860, onTime: 843 },
  { depot: 'Southbank', shipped: 1940, onTime: 1746 },
]

export const rate = (r: Row) => r.onTime / r.shipped
export const TOTAL_SHIPPED = ROWS.reduce((a, r) => a + r.shipped, 0) // 18,560
export const TOTAL_ON_TIME = ROWS.reduce((a, r) => a + r.onTime, 0) // 17,175
export const POOLED = TOTAL_ON_TIME / TOTAL_SHIPPED // 0.9254 → 92.5%
export const MEAN_OF_RATES = ROWS.reduce((a, r) => a + rate(r), 0) / ROWS.length // 0.9325 → 93.3%

export interface Claim {
  id: string
  text: string
  cells: string[] // e.g. 'B5', 'D2'
  formula: string
  result: string
  ok: boolean
  /** For the wrong claim: what the check uses instead. */
  check?: { cells: string[], formula: string, result: string, correction: string }
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`

export const CLAIMS: Claim[] = [
  {
    id: 'c1',
    text: 'Harbour shipped the most: 5,210.',
    cells: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
    formula: '=MAX(B2:B7)',
    result: '5,210 → row 5, Harbour',
    ok: true,
  },
  {
    id: 'c2',
    text: `Network on-time rate: ${pct(MEAN_OF_RATES)}, above the 93% target.`,
    cells: ['D2', 'D3', 'D4', 'D5', 'D6', 'D7'],
    formula: '=AVERAGE(D2:D7)',
    result: pct(MEAN_OF_RATES),
    ok: false,
    check: {
      cells: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'B8', 'C8', 'D8'],
      formula: '=SUM(C2:C7)/SUM(B2:B7)',
      result: `17,175 / 18,560 = ${pct(POOLED)}`,
      correction: `Network on-time rate: ${pct(POOLED)}, below the 93% target.`,
    },
  },
  {
    id: 'c3',
    text: 'Three depots missed target: Eastfield, Harbour, Southbank.',
    cells: ['D4', 'D5', 'D7'],
    formula: '=COUNTIF(D2:D7,"<93%")',
    result: '3 → rows 4, 5, 7',
    ok: true,
  },
  {
    id: 'c4',
    text: 'Westmoor had the best rate (98.0%) on the fewest shipments.',
    cells: ['B6', 'D6'],
    formula: '=MAX(D2:D7)  ·  =MIN(B2:B7)',
    result: '98.0% and 860 → row 6, Westmoor',
    ok: true,
  },
]
