// Slide 25 — harness architecture around ONE assisted task (Artifact F). Edit this file to change
// the diagram: layers, their order of reveal, the descriptions, and the example trace.
// Task: draft the weekly Project Lark status note (fictional). The trace is simulated.

export const TASK = 'Draft the weekly Project Lark status note'

export interface Layer {
  key: string
  name: string
  sub: string
  detail: string
  /** Click at which the layer appears (the model is always visible). */
  at: number
  lane: 'top' | 'bottom'
  /** Column (0–5) for top-lane boxes; 0 or 1 for the bottom bars. */
  col: number
}

export const LAYERS: Layer[] = [
  { key: 'instructions', name: 'Instructions', sub: 'rules and format', at: 1, lane: 'top', col: 0, detail: 'Instructions: the system prompt sets the task, the rules and the output format.' },
  { key: 'retrieval', name: 'Retrieval', sub: 'approved sources', at: 2, lane: 'top', col: 1, detail: 'Context retrieval: code fetches the tracker, minutes and policy and adds them to the prompt.' },
  { key: 'permissions', name: 'Permissions', sub: 'read-only, Lark', at: 4, lane: 'top', col: 2, detail: 'Permissions: the model may ask for any tool; code decides which calls actually run.' },
  { key: 'tools', name: 'Tools', sub: 'read_tracker', at: 3, lane: 'top', col: 3, detail: 'Tools: functions the application runs on the model’s behalf, returning results to it.' },
  { key: 'validation', name: 'Validation', sub: 'check vs sources', at: 5, lane: 'top', col: 4, detail: 'Validation: code checks the draft against sources and schema; failures go back with the reason.' },
  { key: 'approval', name: 'Approval', sub: 'a person signs off', at: 8, lane: 'top', col: 5, detail: 'Human approval: nothing is sent until an accountable person approves it.' },
  { key: 'state', name: 'State', sub: 'draft version, checks passed, open questions', at: 6, lane: 'bottom', col: 0, detail: 'State: the application, not the model, remembers versions, checks passed and open questions.' },
  { key: 'logging', name: 'Logging', sub: 'every call, result and decision, for audit', at: 7, lane: 'bottom', col: 1, detail: 'Logging: every prompt, tool call, result and approval is recorded for audit and debugging.' },
]

/** Shown in the trace panel before any tool exists. */
export const TRACE_EMPTY = 'No tools yet: the model can only return text. The trace starts at the first tool call.'

export const MODEL_DETAIL = 'A bare model call: text in, text out. No sources, no tools, no checks.'

export interface TraceLine {
  at: number
  who: string
  text: string
  state?: 'ok' | 'bad' | 'warn' | 'neutral' | 'active'
}

export const TRACE: TraceLine[] = [
  { at: 3, who: 'model proposes', text: 'read_tracker(project="LARK", week=41)' },
  { at: 4, who: 'permission', text: 'read-only tool · project LARK → allowed', state: 'ok' },
  { at: 3, who: 'tool returns', text: 'depots 4/6 · defects 2 · spend €612k' },
  { at: 5, who: 'validation', text: 'go-live "20 Oct" ≠ minutes "27 Oct" → revise', state: 'bad' },
  { at: 5, who: 'model revises', text: 'draft v2 with go-live 27 Oct' },
  { at: 5, who: 'validation', text: 'figures match sources · format ok', state: 'ok' },
  { at: 8, who: 'approval', text: 'Priya Nair approved draft v2 → sent', state: 'ok' },
]
