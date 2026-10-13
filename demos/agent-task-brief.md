# Agent task brief: Project Lark week-41 update

> Fictional example data for the "From LLMs to AI Agents" workshop. Kestrel Freight, Project Lark and all people named here are invented.

## Goal

Draft the Project Lark update for week 41 (Mon 5 – Fri 9 October 2026) for Helen Brooks, Operations director.

## Inputs (read-only)

- `project-status-report.md`
- `depot-metrics-w41.csv`
- `meeting-notes.md`

## Tools

| Tool | Permission |
|---|---|
| `list_files(folder)` | Allowed, `demos/` only |
| `read_file(name)` | Allowed, `demos/` only |
| `compute(expression)` | Allowed |
| `write_draft(path)` | Allowed, `out/` sandbox folder only |
| `request_approval(to)` | Allowed |
| Edit any source file | Not allowed |
| `send_email` | Not allowed without approval from Priya Nair |

## Rules

1. The depot metrics CSV is the system of record for all figures.
2. If a figure in the status report disagrees with the CSV, use the CSV figure, flag the mismatch in the draft, and do not edit the report.
3. Retry a failing step at most 2 times, and change the approach each time. If it still fails, stop and escalate to Priya Nair.
4. Every owner named in the draft must appear in the meeting notes.
5. Keep the draft under 200 words.
6. Never send anything. Finish with `request_approval(to: "Priya Nair")`.

## Final checks before requesting approval

- [ ] Every figure traces to the depot metrics CSV
- [ ] Every owner appears in the meeting notes
- [ ] Mismatches are flagged, not hidden
- [ ] The draft is under 200 words
