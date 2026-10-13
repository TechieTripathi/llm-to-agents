// Slide 4 — what the MODEL does versus what the surrounding PRODUCT or SYSTEM provides.
// Claims are tied to sources in data/refs/s1.ts and core.ts.

export type Where = 'model' | 'system' | 'both'

export interface Capability {
  id: string
  label: string
  where: Where
  what: string
  example: string
  refs: string[]
}

export const MODEL_CAPS: Capability[] = [
  {
    id: 'lang',
    label: 'Follows plain-language instructions',
    where: 'model',
    what: 'Instruction-tuned models follow requests written in ordinary language. No query syntax or menus.',
    example: '“Summarise this week’s Lark risks for the operations director.”',
    refs: ['ouyang2022'],
  },
  {
    id: 'general',
    label: 'Handles many tasks without retraining',
    where: 'model',
    what: 'One model can summarise, classify, translate or draft, steered by instructions and a few examples in the prompt.',
    example: 'The same assistant drafts the update, then rewrites it as five bullets.',
    refs: ['brown2020'],
  },
  {
    id: 'multi',
    label: 'Reads images as well as text',
    where: 'model',
    what: 'Multimodal models accept images as input. Whether you can upload one is up to the product.',
    example: 'A photo of the whiteboard from the Lark planning session.',
    refs: ['s1openai2023gpt4'],
  },
  {
    id: 'long',
    label: 'Works with long inputs',
    where: 'both',
    what: 'Context windows grew from 2,048 tokens (GPT-3, 2020) to millions in 2024 research. The model sets the limit; the system decides what goes in.',
    example: 'The whole risk log and three weeks of notes in one request.',
    refs: ['brown2020', 's1gemini2024'],
  },
  {
    id: 'propose',
    label: 'Proposes tool calls',
    where: 'model',
    what: 'The model can output a structured request: which tool, with which inputs. It does not run anything itself.',
    example: 'It asks for search_files("risk log"); something else must run it.',
    refs: ['s5openaifc2026', 's5anthropictools2026'],
  },
]

export const SYSTEM_CAPS: Capability[] = [
  {
    id: 'search',
    label: 'Web search',
    where: 'system',
    what: 'A search service runs the query and the results are placed in the model’s context. The model then reads them.',
    example: 'Checking this week’s public fuel-price news for the update.',
    refs: ['s5anthropictools2026'],
  },
  {
    id: 'files',
    label: 'Your files',
    where: 'system',
    what: 'The product retrieves relevant passages from your documents and adds them to the context.',
    example: 'Pulling the Lark risk log from the shared drive.',
    refs: ['lewis2020rag'],
  },
  {
    id: 'memory',
    label: 'Memory',
    where: 'system',
    what: 'The model keeps nothing between requests. The application resends the conversation, and any “memory” is stored by the product.',
    example: 'The assistant “remembers” Priya’s preferred report format because the product saved it.',
    refs: ['s5anthropictools2026', 's1anthropicdocs2026messages'],
  },
  {
    id: 'run',
    label: 'Runs the tools',
    where: 'system',
    what: 'Your application, or the provider’s servers, execute the requested call and return the result to the model.',
    example: 'The file search actually runs, and its result goes back into the context.',
    refs: ['s5openaifc2026', 's5anthropictools2026'],
  },
  {
    id: 'perm',
    label: 'Permissions',
    where: 'system',
    what: 'The builder decides which tools exist, what data they can reach and where a person must approve.',
    example: 'The assistant can read the tracker but cannot send email without Priya.',
    refs: ['anthropic2024agents', 's5anthropictools2026'],
  },
]

export const STEP_NOTES = [
  { title: 'Five changes in the models themselves', body: 'These are what made modern LLMs feel different from earlier software.' },
  { title: 'The product around the model', body: 'Search, files, memory, running tools and permissions are built by the product, not learned by the model.' },
  { title: 'The model asks; the system acts', body: 'The system decides whether to run the call, runs it, and puts the result back into the context.' },
]
