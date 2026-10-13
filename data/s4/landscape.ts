// Slide 28 — three categories with overlapping capabilities. Product names are examples only,
// each checked against the vendor's own page on 2026-10-13 (see data/refs/s4.ts).
export type Level = 'core' | 'some' | 'no'

export const CAPS = [
  'Finds pages',
  'Answers with links',
  'Cited multi-step report',
  'Reads your open page',
  'Clicks and types',
]

export interface Category {
  id: string
  name: string
  levels: Level[]
  examples: string
  useWhen: string
  watch: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'search',
    name: 'AI-enhanced search',
    levels: ['core', 'core', 'some', 'no', 'no'],
    examples: 'Google AI Overviews, AI Mode · Bing Copilot Search · ChatGPT search',
    useWhen: 'Quick, current facts; finding the official page.',
    watch: 'The summary can be wrong. Open the link before you rely on it.',
  },
  {
    id: 'research',
    name: 'Research assistants',
    levels: ['some', 'core', 'core', 'no', 'no'],
    examples: 'ChatGPT deep research · Gemini Deep Research · Perplexity and Claude Research',
    useWhen: 'A broad question that needs many sources and a first-draft report.',
    watch: 'Long reports hide weak citations. Check the claims you will reuse.',
  },
  {
    id: 'browser',
    name: 'Browser-integrated AI',
    levels: ['no', 'some', 'some', 'core', 'some'],
    examples: 'Gemini in Chrome · Claude in Chrome · Perplexity Comet · Edge Browse with Copilot',
    useWhen: 'Work inside pages you already use; repetitive web chores.',
    watch: 'It acts with your signed-in access. Hidden page text can try to steer it.',
  },
]

export const CHANGED_2026 = [
  'ChatGPT Atlas browser retired (August 2026)',
  'Edge Copilot Mode retired (May 2026)',
  'Claude in Chrome generally available (August 2026)',
  'Chrome auto browse: experimental, paid plans',
]
