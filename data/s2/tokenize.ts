// Real BPE tokenization (gpt-tokenizer, offline). Shared by the slide 8 tokenizer and the
// slide 14 context-window simulator.
import * as o200k from 'gpt-tokenizer/encoding/o200k_base'
import * as cl100k from 'gpt-tokenizer/encoding/cl100k_base'
import * as r50k from 'gpt-tokenizer/encoding/r50k_base'

export type EncId = 'o200k' | 'cl100k' | 'r50k'
const ENC = { o200k, cl100k, r50k }

export interface Piece { id: number, text: string, partial: boolean }

/** Split text into real tokens. Tokens that hold only part of a multi-byte character are flagged. */
export function tokenize(text: string, enc: EncId = 'o200k'): Piece[] {
  const e = ENC[enc]
  return e.encode(text).map((id) => {
    const t = e.decode([id])
    return { id, text: t, partial: t === '' || t.includes('�') }
  })
}

export function countTokens(text: string, enc: EncId = 'o200k'): number {
  return ENC[enc].encode(text).length
}

export const VOCAB = { o200k: o200k.vocabularySize, cl100k: cl100k.vocabularySize, r50k: r50k.vocabularySize }
