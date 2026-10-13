// Slide 3 — A short history of AI. Every date and figure is taken from the source named in `refs`
// (see data/refs/s1.ts and data/refs/core.ts). `at` is the decimal year used to place the era on the
// true-scale ruler; `year` is the label shown.

export interface Era {
  id: string
  year: string
  at: number
  name: string
  /** Which way the system gets its knowledge (groups eras into bands). */
  band: 0 | 1 | 2 | 3
  changed: string
  work: string
  evidence: string
  refs: string[]
}

export const BANDS = [
  'Written rules',
  'Learned from examples',
  'Pre-trained at scale',
  'Connected to data and tools',
]

export const RULER = { from: 1950, to: 2026 }

export const ERAS: Era[] = [
  {
    id: 'rules',
    year: '1956',
    at: 1956,
    name: 'Rules and symbols',
    band: 0,
    changed: 'People write the knowledge down as explicit rules; the machine follows them.',
    work: 'Expert systems: R1 configured DEC VAX computer orders using 772 hand-written rules (1980).',
    evidence: 'Dartmouth proposal (1955) names the field; R1 / XCON at DEC',
    refs: ['s1mccarthy1955', 's1mcdermott1980'],
  },
  {
    id: 'stats',
    year: '1990s',
    at: 1998,
    name: 'Statistical learning',
    band: 1,
    changed: 'Instead of writing rules, systems learn patterns from labelled examples.',
    work: 'Junk-mail filters trained on mail that people had already marked as junk or not (1998).',
    evidence: 'Sahami et al., Bayesian junk-mail filtering',
    refs: ['s1sahami1998'],
  },
  {
    id: 'deep',
    year: '2012',
    at: 2012,
    name: 'Deep learning',
    band: 1,
    changed: 'Many-layered neural networks, trained on GPUs, learn their own features from large datasets.',
    work: 'Image recognition jumps: 15.3% top-5 error on ImageNet against 26.2% for the next-best entry.',
    evidence: 'Krizhevsky, Sutskever and Hinton, “AlexNet”',
    refs: ['s1krizhevsky2012'],
  },
  {
    id: 'transformer',
    year: '2017',
    at: 2017.45,
    name: 'Trans\u00ADformers',
    band: 1,
    changed: 'Attention relates every word in a passage to every other word, and training scales well.',
    work: 'First shown on machine translation; it became the architecture behind today’s language models.',
    evidence: 'Vaswani et al., “Attention Is All You Need”',
    refs: ['vaswani2017'],
  },
  {
    id: 'foundation',
    year: '2020',
    at: 2020.4,
    name: 'Foundation models',
    band: 2,
    changed: 'One very large pre-trained model adapts to many tasks from instructions and a few examples.',
    work: 'GPT-3 (175 billion parameters) took on new tasks with no retraining. The name “foundation model” followed in 2021.',
    evidence: 'Brown et al. (GPT-3); Bommasani et al.',
    refs: ['brown2020', 's1bommasani2021'],
  },
  {
    id: 'chatgpt',
    year: 'Nov 2022',
    at: 2022.91,
    name: 'ChatGPT',
    band: 2,
    changed: 'A conversational interface: anyone can ask in plain language, follow up and refine.',
    work: 'Released 30 November 2022 as a free research preview, built on instruction-following training.',
    evidence: 'OpenAI launch post; Ouyang et al. (InstructGPT)',
    refs: ['s1openai2022chatgpt', 'ouyang2022'],
  },
  {
    id: 'tools',
    year: '2023',
    at: 2023.45,
    name: 'Retrieval and tools',
    band: 3,
    changed: 'Systems fetch documents and call tools, so answers can use current or private information.',
    work: 'Answer a policy question from the company handbook, citing the passage. In mainstream APIs from June 2023.',
    evidence: 'Lewis et al. (RAG, 2020); Schick et al. (Toolformer); OpenAI function calling',
    refs: ['lewis2020rag', 's1schick2023', 's1openai2023functions'],
  },
  {
    id: 'agents',
    year: '2024 →',
    at: 2024.5,
    name: 'Agents',
    band: 3,
    changed: 'The model works in a loop: decide, call a tool, look at the result, decide again, until done.',
    work: 'Gather status from several systems, draft the report, and flag gaps for a person to resolve.',
    evidence: 'Yao et al. (ReAct, 2022); Anthropic guidance on agents (Dec 2024)',
    refs: ['yao2023react', 'anthropic2024agents'],
  },
]
