// The eight sections of the deck and how each maps to the learning journey.
export const JOURNEY = ['Model', 'Context', 'Tools', 'Agent', 'Workflow'] as const
export type JourneyStage = typeof JOURNEY[number]

export interface Section {
  no: number
  name: string
  slides: [number, number]
  minutes: number
  /** Journey stage lit in the top strip; null = overview (all shown equally). */
  stage: JourneyStage | null
}

export const SECTIONS: Section[] = [
  { no: 1, name: 'The AI shift', slides: [1, 6], minutes: 10, stage: null },
  { no: 2, name: 'LLM fundamentals', slides: [7, 16], minutes: 18, stage: 'Model' },
  { no: 3, name: 'Prompting and context', slides: [17, 26], minutes: 17, stage: 'Context' },
  { no: 4, name: 'AI tools and browsers', slides: [27, 34], minutes: 12, stage: 'Tools' },
  { no: 5, name: 'Agents and workflow engineering', slides: [35, 45], minutes: 20, stage: 'Agent' },
  { no: 6, name: 'Cross-functional productivity', slides: [46, 54], minutes: 15, stage: 'Workflow' },
  { no: 7, name: 'Practical demonstrations', slides: [55, 60], minutes: 13, stage: 'Workflow' },
  { no: 8, name: 'Implementation and discussion', slides: [61, 65], minutes: 15, stage: 'Workflow' },
]

export const CORE_SLIDES = 65
/** Unnumbered slides before slide 1 (the institutional cover). */
export const FRONT_SLIDES = 1

export function sectionFor(no: number | undefined): Section | undefined {
  return SECTIONS.find(s => s.no === no)
}
