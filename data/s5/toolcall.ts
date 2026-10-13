// Slide 37 — one tool call, step by step. Two variants: an allowed read and a call outside the agent's permissions.
// Message shapes are simplified for teaching; real APIs differ in field names (see notes).

export type Lane = 'model' | 'app' | 'ext'
export interface TraceRow {
  from: Lane
  to: Lane            // same lane = a local step drawn as a box
  label: string
  state?: 'ok' | 'bad' | 'neutral'
  payloadTitle: string
  payload: string     // machine text shown in the side panel
  note: string        // one plain-language line under the payload
}

const toolDef = `{
  "name": "search_issues",
  "description":
    "Find tracker tickets
     (read-only)",
  "input_schema": {
    "project": "string",
    "status": "open|blocked"
  }
}`

export const ALLOWED: TraceRow[] = [
  { from: 'app', to: 'model', label: 'request + tool list', payloadTitle: 'Tool definition sent with the request', payload: toolDef, note: 'The model only sees a description. It has no connection to the tracker.' },
  { from: 'model', to: 'app', label: 'proposes a call', payloadTitle: 'Model output: a structured proposal', payload: `{
  "type": "tool_call",
  "name": "search_issues",
  "input": {
    "project": "LARK",
    "status": "open"
  }
}`, note: 'This is text in a fixed shape. Nothing has run yet.' },
  { from: 'app', to: 'app', label: 'checks schema + permission', state: 'ok', payloadTitle: 'Application checks', payload: `schema      valid
tool        search_issues
permission  read ✓ allowed
budget      call 4 of 30`, note: 'Your code decides whether this call may run.' },
  { from: 'app', to: 'ext', label: 'runs the call', payloadTitle: 'Application → tracker (simulated)', payload: `GET /issues
  ?project=LARK&status=open
Auth: agent-lark-readonly`, note: 'The credentials belong to the application, scoped to read-only.' },
  { from: 'ext', to: 'app', label: 'raw result', payloadTitle: 'Tracker response (simulated)', payload: `200 OK
{ "open": 14,
  "blocked": 3,
  "as_of": "2026-10-12" }`, note: 'Real systems answer; the model is not involved.' },
  { from: 'app', to: 'model', label: 'tool result', payloadTitle: 'Result returned to the model', payload: `{
  "type": "tool_result",
  "content": {
    "open": 14,
    "blocked": 3,
    "as_of": "2026-10-12"
  }
}`, note: 'The result joins the context as new information.' },
  { from: 'model', to: 'model', label: 'continues with the result', state: 'ok', payloadTitle: 'Model continues', payload: `Draft line:
"14 tickets are open, 3 of
them blocked (as of 12 Oct)."

Next: propose get_budget(…)`, note: 'It writes from the result, or proposes the next call.' },
]

export const FORBIDDEN: TraceRow[] = [
  ALLOWED[0],
  { from: 'model', to: 'app', label: 'proposes a call', payloadTitle: 'Model output: a structured proposal', payload: `{
  "type": "tool_call",
  "name": "close_issue",
  "input": {
    "id": "LARK-212"
  }
}`, note: 'The model asks for an action it was never given.' },
  { from: 'app', to: 'app', label: 'checks schema + permission', state: 'bad', payloadTitle: 'Application checks', payload: `tool        close_issue
permission  write ✗ denied
decision    BLOCKED`, note: 'The block happens in code, not by trusting the model.' },
  { from: 'app', to: 'ext', label: 'nothing is sent', state: 'neutral', payloadTitle: 'Application → tracker', payload: `(no request made)`, note: 'The tracker never sees the call.' },
  { from: 'ext', to: 'app', label: 'no response', state: 'neutral', payloadTitle: 'Tracker response', payload: `(none)`, note: 'No change was made to LARK-212.' },
  { from: 'app', to: 'model', label: 'error result', state: 'bad', payloadTitle: 'Result returned to the model', payload: `{
  "type": "tool_result",
  "is_error": true,
  "content":
    "permission_denied:
     close_issue is not
     available to this agent"
}`, note: 'The model learns the action was refused.' },
  { from: 'model', to: 'model', label: 'adapts: flags for a person', state: 'ok', payloadTitle: 'Model continues', payload: `Note for Priya:
"LARK-212 looks finished,
but I cannot close tickets.
Please review."`, note: 'A safe outcome: the decision goes to someone with authority.' },
]
