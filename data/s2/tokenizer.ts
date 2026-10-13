// Slide 8 — preset texts for the live tokenizer. The tokenizer itself is real (gpt-tokenizer).
export interface TokenPreset { id: string, label: string, text: string, why: string }

export const TOKEN_PRESETS: TokenPreset[] = [
  { id: 'email', label: 'Email', text: 'Hi Priya, could you send the revised Q3 budget by Friday?', why: 'Common English words are usually one token each, and most carry their leading space.' },
  { id: 'numbers', label: 'Date & amount', text: 'Invoice due 14/11/2026: €12,450.75', why: 'Numbers are split into short digit groups, so the model never sees “12,450.75” as one value.' },
  { id: 'code', label: 'Product code', text: 'Order KF-2026-00417-B, SKU PLT-48X40-HT', why: 'Internal codes fragment into many pieces. Exact codes are where copying mistakes creep in.' },
  { id: 'german', label: 'German', text: 'Lieferverzögerung', why: 'One German word (“delivery delay”) becomes several word pieces.' },
  { id: 'hindi', label: 'Hindi', text: 'प्रोजेक्ट की स्थिति', why: '“Project status” in Hindi: older tokenizers need several times more tokens for the same words.' },
]

// Real OpenAI tokenizers, labelled by the models that use them (tiktoken model.py, checked 13 Oct 2026).
export const ENCODINGS = [
  { id: 'o200k', models: 'GPT-4o / GPT-5', short: 'GPT-4o', enc: 'o200k_base', note: 'used by GPT-4o, GPT-4.1, GPT-5 and the o-series' },
  { id: 'cl100k', models: 'GPT-4 / GPT-3.5', short: 'GPT-4', enc: 'cl100k_base', note: 'used by GPT-4 and GPT-3.5 Turbo' },
  { id: 'r50k', models: 'GPT-3', short: 'GPT-3', enc: 'r50k_base', note: 'used by the original GPT-3 models (davinci, 2020)' },
] as const
