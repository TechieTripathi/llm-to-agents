// Slide 10 — illustrative attention patterns for a Winograd-style sentence pair.
// These weights are hand-authored for teaching. They are NOT read from any real model.
// Token boundaries match o200k_base. A token may only look at itself and earlier tokens (causal).

export interface AttnSentence {
  id: 'big' | 'small'
  label: string
  tokens: string[]
  /** Which noun "it" refers to, for the explanation text. */
  referent: string
  /** Hand-authored weights: token index -> { earlier index: weight } (normalised at render). */
  weights: Record<number, Record<number, number>>
}

const base = ['The', ' file', ' did', ' not', ' fit', ' on', ' the', ' drive', ' because', ' it', ' was', ' too']

// Shared weights for tokens before the deciding word (identical in both sentences, because
// a left-to-right model has not yet seen the last word when it processes them).
const shared: Record<number, Record<number, number>> = {
  0: { 0: 1 },
  1: { 0: 0.45, 1: 0.55 },
  2: { 1: 0.5, 0: 0.15, 2: 0.35 },
  3: { 2: 0.55, 1: 0.15, 3: 0.3 },
  4: { 1: 0.38, 3: 0.24, 2: 0.12, 4: 0.18, 0: 0.08 },
  5: { 4: 0.5, 1: 0.15, 5: 0.35 },
  6: { 5: 0.45, 4: 0.15, 6: 0.4 },
  7: { 6: 0.2, 5: 0.22, 4: 0.24, 1: 0.14, 7: 0.2 },
  8: { 4: 0.22, 3: 0.2, 1: 0.12, 7: 0.12, 8: 0.34 },
  // " it": split between the two candidate nouns — the sentence has not decided yet.
  9: { 1: 0.3, 7: 0.28, 8: 0.12, 4: 0.08, 9: 0.12, 0: 0.05, 6: 0.05 },
  10: { 9: 0.5, 1: 0.12, 7: 0.12, 10: 0.26 },
  11: { 10: 0.38, 9: 0.2, 11: 0.42 },
}

export const ATTN_SENTENCES: AttnSentence[] = [
  {
    id: 'big',
    label: '… too big.',
    tokens: [...base, ' big', '.'],
    referent: ' file',
    weights: {
      ...shared,
      12: { 9: 0.32, 1: 0.27, 11: 0.12, 4: 0.1, 7: 0.06, 12: 0.13 },
      13: { 12: 0.35, 9: 0.15, 1: 0.15, 13: 0.35 },
    },
  },
  {
    id: 'small',
    label: '… too small.',
    tokens: [...base, ' small', '.'],
    referent: ' drive',
    weights: {
      ...shared,
      12: { 9: 0.31, 7: 0.28, 11: 0.12, 4: 0.1, 1: 0.05, 12: 0.14 },
      13: { 12: 0.35, 9: 0.15, 7: 0.15, 13: 0.35 },
    },
  },
]

/** Index of the pronoun and the deciding word, used by the click-driven default states. */
export const IT_INDEX = 9
export const DECIDER_INDEX = 12
