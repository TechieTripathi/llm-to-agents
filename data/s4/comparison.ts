// Slide 29 — fictional source comparison for a Kestrel Freight vendor decision.
// Everything here is invented (Plover Routing and Fenwick Logistics Review are not real).
export type Stance = 'supports' | 'contradicts' | 'silent'

export interface Source { id: string, short: string, name: string, kind: string }
export interface Cell { stance: Stance, quote?: string, loc?: string }
export interface Claim { id: string, text: string, cells: Record<string, Cell>, verdict: 'agreed' | 'disputed' | 'open', brief: string }

export const QUESTION = 'Should Kestrel pilot Plover Routing at the Harbour depot?'

export const SOURCES: Source[] = [
  { id: 'S1', short: 'Vendor study', name: 'Plover Routing — customer case study', kind: 'Vendor' },
  { id: 'S2', short: 'Analyst review', name: 'Fenwick Logistics Review — route-planning tools', kind: 'Independent' },
  { id: 'S3', short: 'Reference call', name: 'Notes: call with another Plover customer (T. Ruiz)', kind: 'First-hand' },
]

export const CLAIMS: Claim[] = [
  {
    id: 'fuel',
    text: 'Cuts fuel cost by 12%',
    cells: {
      S1: { stance: 'supports', quote: '“Customers cut fuel spend by 12% in the first quarter.”', loc: 'p. 2' },
      S2: { stance: 'contradicts', quote: '“Fleets in our sample saw 4–7% fuel savings.”', loc: 'table 3' },
      S3: { stance: 'silent', quote: 'Says fuel use “went down” but they did not measure it.', loc: 'notes, item 4' },
    },
    verdict: 'disputed',
    brief: 'Fuel savings reported between 4% and 12%; only the vendor reports 12%.',
  },
  {
    id: 'tms',
    text: 'Fits our dispatch system',
    cells: {
      S1: { stance: 'supports', quote: '“Native connectors for all major dispatch systems.”', loc: 'p. 3' },
      S2: { stance: 'silent' },
      S3: { stance: 'contradicts', quote: '“We needed about three months of custom integration work.”', loc: 'notes, item 2' },
    },
    verdict: 'disputed',
    brief: 'Integration effort is unclear; one customer needed custom work.',
  },
  {
    id: 'golive',
    text: 'Live within 8 weeks',
    cells: {
      S1: { stance: 'supports', quote: '“Typical go-live: 8 weeks.”', loc: 'p. 1' },
      S2: { stance: 'contradicts', quote: '“Mid-size fleets typically took 12–16 weeks.”', loc: 'p. 9' },
      S3: { stance: 'contradicts', quote: '“We went live after 14 weeks.”', loc: 'notes, item 1' },
    },
    verdict: 'disputed',
    brief: 'Plan for 12–16 weeks, not 8.',
  },
  {
    id: 'drivers',
    text: 'Drivers find it easy to use',
    cells: {
      S1: { stance: 'silent' },
      S2: { stance: 'supports', quote: '“Driver feedback on the mobile app was mostly positive.”', loc: 'p. 11' },
      S3: { stance: 'supports', quote: '“Drivers liked the live re-routing.”', loc: 'notes, item 5' },
    },
    verdict: 'agreed',
    brief: 'Two independent sources report positive driver feedback.',
  },
]
