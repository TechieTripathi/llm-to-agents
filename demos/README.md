# Demonstration assets

Source material for Section 7, "Practical demonstrations" (slides 55–60, 13 minutes), and reusable for any other slide that needs a worked example. Everything here is **fictional and non-sensitive** (Kestrel Freight, Project Lark and every person are invented), except the public sources listed for slide 58.

## Files

| File | What it is | Used on |
|---|---|---|
| `meeting-notes.md` | Raw notes from the Lark weekly sync, Mon 12 Oct 2026: 17 terse lines with decisions, actions, owners, deadlines and open questions | 55, 59, 60 |
| `project-status-report.md` | Week-41 status report for Helen Brooks: milestones, key figures, risks, customer impact at cutover. Contains one stale figure on purpose (on-time 94.1%) | 55, 56, 59 |
| `policy-excerpt.md` | Travel and Expenses Policy v3.2, clauses 4.1–4.6. Silent on mileage on purpose | 57 |
| `depot-metrics.csv` | Week-41 shipments, on-time deliveries and portal tickets for six depots (on-time 6,845 of 7,400 = 92.5%; tickets 116) | 55, 59 |
| `agent-task-brief.md` | Goal, read-only inputs, tool permissions, rules, retry limit and final checks for the agent run. Names a missing file on purpose | 59 |
| `research-sources.md` | Real public sources for the password-policy question, with verbatim quotes, dates and status, checked 13 Oct 2026 | 58 |
| `prompts.md` | Every prompt, ready to paste | all |
| `expected-outputs.md` | The prepared outputs the deck shows, what to look for live, and the list of planted faults | all |
| `validation-checklist.md` | General and per-demo checks | all |

## The deck reads these files directly

The components import the raw files at build time (`data/s7/raw.ts`, Vite `?raw` imports), so the slides cannot drift from the files:

- Slide 60 shows `meeting-notes.md` verbatim, with its line numbers.
- Slide 57 parses clauses `**4.x Title.** text` from `policy-excerpt.md`.
- Slide 56 pastes section 5 of `project-status-report.md`.
- Slides 55 and 59 compute on-time delivery and tickets from `depot-metrics.csv` and read the reported figure from the status report.
- Slide 59 lists the real file names in this folder.

The AI outputs, verdicts and tracker items live in `data/s7/*.ts`. **If you edit a source file, update those too**: in particular, the tracker in `data/s7/meeting.ts` refers to note line numbers, and the claims in `data/s7/grounding.ts` refer to clause numbers.

## Running each demo live

General rules (spec §9): use only an AI assistant your organisation has approved; open it in a **separate browser window** before the session; attach only the files named; never connect a demo to real systems, mailboxes or production data; never perform a consequential action. Keep the slide on screen as the fallback: every slide works without a network.

| Slide | Live option (about 60–90 s) | In-deck fallback |
|---|---|---|
| 55 | Run the three prompts from `prompts.md`; compare the on-time figure in each answer | Click through the three levels |
| 56 | Run vague, structured and context-rich prompts in three tabs; score each against the five facts | Variant buttons and "Compare all" |
| 57 | Ask without the policy; then attach `policy-excerpt.md` and ask again | Audience votes, then click to reveal each verdict; "Grounded answer" panel |
| 58 | **The live demo of the section.** Paste the research prompt; open each cited link; tick the live scorecard on the slide | Toggle to "Prepared evidence" and step through |
| 59 | Only with a sandboxed agent that can read nothing but this folder; give it `agent-task-brief.md` | Step through the replay; "Show draft" at the end |
| 60 | Attach `meeting-notes.md`, run the extract prompt, then check two items against the note lines | Click through extract, summary, validate, sign-off |

Slide 58's toggle switches between **Live in browser** (instructions per step, the prompt with a copy button, the source links, and a scorecard you tick as you verify) and **Prepared evidence** (quotes captured and checked on 13 Oct 2026; the example AI draft there is labelled simulated). Say which one the audience is looking at.

## Likely live failures and what to do

| Failure | Do this |
|---|---|
| No network, login wall, rate limit or slow response | Say so, switch to the slide's fallback; do not wait more than 20 seconds |
| The live answer is better than the prepared one | Good: check it against the same checklist; the point is the checking |
| The live answer cites a source you have not opened | Open it in front of the audience, or say it is unverified |
| A page in `research-sources.md` has moved or changed status | Use the prepared evidence and say when it was checked |
| The model refuses or asks a clarifying question | Answer briefly; a clarifying question is good behaviour |

## Timing (13 minutes)

55: 1.5 · 56: 2.5 · 57: 2 · 58: 2.5 · 59: 2 · 60: 2.5. Run at most one demo fully live (58 is the natural one); use the fallback for the others.
