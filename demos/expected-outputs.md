# Expected outputs and observations

What the in-deck fallback shows for each demonstration, and what to look for when you run it live. The AI outputs below were **written for this workshop** to show typical behaviour. They are prepared examples, not captured from a specific product. A live run will word things differently; the observations are what matter.

> Fictional example data for the "From LLMs to AI Agents" workshop, except the public sources for slide 58.

## The deliberate faults in the material

These are planted so each demo has something real to catch. Keep them when you edit the files.

| Fault | Where | Caught on |
|---|---|---|
| Status report gives on-time delivery as **94.1%**; the CSV gives **92.5%** (6,845 of 7,400). The report reused last week's figure. | `project-status-report.md` §3 vs `depot-metrics.csv` | Slides 55 and 59 |
| The agent brief names `depot-metrics-w41.csv`; the file is `depot-metrics.csv`. | `agent-task-brief.md` | Slide 59 (failed action) |
| The policy excerpt says nothing about mileage. | `policy-excerpt.md` | Slide 57 (not in source) |
| The notes give Daniel's API check "by the 23rd", close to the UAT date "Fri 16th". | `meeting-notes.md` lines 6 and 14 | Slide 60 (AI-introduced wrong deadline) |
| Arjun's action has no deadline. | `meeting-notes.md` lines 15–16 | Slide 60 (gap, not to be invented) |

## Slide 55: one task, three levels

| Level | Expected on-time figure in the draft | Observation |
|---|---|---|
| Basic chat | Invented (prepared example: "remains strong at 96%") or a placeholder | Fluent, generic, unverifiable |
| Context-rich | 94.1%, copied from the status report | Specific and plausible, but stale |
| Controlled workflow | 92.5%, recomputed from the CSV, below the 93% target, mismatch flagged | Slower to set up, much less to fix |

Effort dots on the slide are illustrative, not measured.

## Slide 56: prompt lab

**Vague, prepared output**

> Subject: Exciting news: our new customer portal is here!
> We're thrilled to announce our new portal, with real-time GPS tracking and a new mobile app. The switch happens next week with no interruption to service. Simply log in with your existing details.
> Questions? Contact your account manager.

Unsupported assumptions (5): GPS tracking; mobile app; "next week"; "no interruption" (contradicts the read-only window); "existing details" (contradicts the password reset). Covers 1 of 5 required facts. Editing: rewrite.

**Structured, prepared output**

> Subject: Changes to the Kestrel tracking portal
> From [date] we are moving to a new tracking portal. The current portal will be unavailable for a short time [time].
> After the switch you may need to [action]. Existing bookmarks will keep working.
> Questions? Contact your account manager.

Placeholders instead of facts (good behaviour). Unsupported assumptions (2): "unavailable" (it is read-only); bookmarks work indefinitely (only 90 days). Covers 1 of 5, 3 as placeholders. Editing: moderate.

**Context-rich, prepared output**

> Subject: New tracking portal on 27 October
> Our new tracking portal goes live on Tuesday 27 October. From Mon 26 Oct 22:00 to Tue 06:00 the old portal is read-only; the service desk can give updates.
> At first log-in you will reset your password. CSV exports move to Reports › Exports; old links redirect for 90 days. Questions? Ask your account manager.
> Note for Arjun: API impact is not confirmed. Check with Daniel before sending.

Covers 5 of 5, no unsupported assumptions, flags the open API question. Editing: light.

Observation to state: context-rich won **here** because the facts lived in a document. A vague prompt can be fine for brainstorming subject lines. Do not claim one format always wins (see Sclar et al., ICLR 2024).

## Slide 57: without sources versus grounded

Ungrounded answer, claim by claim, checked against `policy-excerpt.md`:

| # | Claim | Verdict | Clause |
|---|---|---|---|
| 1 | Get your manager's approval before you book. | Supported | 4.1 |
| 2 | Book on whichever site is cheapest. | Contradicted: TravelDesk only | 4.2 |
| 3 | Hotels up to €150 a night are fine. | Contradicted: €130 (€160 in capital cities) | 4.4 |
| 4 | You get a daily meal allowance of about €50. | Contradicted: no per diem; receipted up to €40 a day | 4.5 |
| 5 | Claim mileage at €0.30 per km if you drive. | Not in source | — |
| 6 | Attach an itemised receipt to every claim. | Supported | 4.6 |

Only 2 of 6 could be signed off. Grounded answer (prepared):

- Get line-manager approval first. §4.1
- Book rail and hotel through TravelDesk; rail is standard class. §4.2, 4.3
- Hotel up to €130 a night, breakfast included. §4.4
- Meals: receipted costs up to €40 a day. No per diem, no alcohol. §4.5
- Claim within 60 days, with itemised receipts. §4.6
- Mileage is not covered by this excerpt. Ask Group Finance.

## Slide 58: browser research

Example AI draft (simulated, typical of answers built partly on older material) and verdicts against `research-sources.md`:

| Claim | Verdict |
|---|---|
| Require at least 8 characters. | Outdated: the withdrawn 2017 rule; now 15 when used alone |
| Require upper case, numbers and symbols. | Contradicted: NIST "SHALL NOT impose"; NCSC "do not recommend" |
| Force a password change every 90 days. | Contradicted: change only on evidence of compromise |
| Block common and breached passwords. | Supported |
| Allow password managers. | Supported |

Live run: expect the assistant to cite NIST and NCSC, sometimes vendor blogs. Watch whether it cites SP 800-63B-4 (2025) or the withdrawn 2017 version, and whether its quotes exist on the page.

## Slide 59: agent run (simulated replay)

Trace: read brief → read status report (on-time 94.1%) → read `depot-metrics-w41.csv` **fails: file not found** → retry 1 of 2 with a changed approach: list the folder → read `depot-metrics.csv` (6 depots, week 2026-W41) → compute 6,845 / 7,400 = 92.5% → validate: tickets 116 = 116; on-time 92.5% ≠ 94.1% → apply the brief's rule: use the CSV, flag, do not edit → read notes, write draft to `out/` → final checks 4 of 4 → request approval from Priya Nair → stop. Nothing is sent.

Draft produced:

> Project Lark, week 41 (draft for approval)
> Status: Amber. UAT is four days late (shipment-search defects); sign-off moves to Fri 16 Oct. Go-live stays Tue 27 Oct, provisionally.
> Figures (depot-metrics.csv): on-time 92.5% (6,845 of 7,400), below the 93% target; Riverside 88.3%. Portal tickets: 116.
> Flag: the status report shows 94.1%; the CSV gives 92.5%. Please confirm before sending.
> Actions: Daniel, search fixes by Thu 15 Oct and API impact by Fri 23 Oct. Tomás, vendor ETA by Wed 14 Oct. Arjun, customer notice once API impact is confirmed.

## Slide 60: meeting notes to a checked tracker

| Type | Item | Owner | Due | Note lines |
|---|---|---|---|---|
| Decision | UAT sign-off moves to Fri 16 Oct | | | 6 |
| Decision | Go-live stays Tue 27 Oct, for now | | | 7 |
| Decision | 3 joint training sessions, not 6 | | | 10–11 |
| Action | Fix search-screen defects | Daniel | Thu 15 Oct | 4–5 |
| Action | Get scanner vendor ETA | Tomás | Wed 14 Oct | 8–9 |
| Action | Confirm API impact | Daniel | **Fri 23 Oct** (the prepared AI draft says Fri 16 Oct: the error to catch) | 14 |
| Action | Customer notice, after API answer | Arjun | none in the notes: ask, do not invent | 15–16 |
| Risk | Search defects could push UAT and go-live | | | 3–4, 7 |
| Risk | Riverside scanner outages | | | 8 |
| Risk (inferred) | Customer notice waits on the API answer | | | 7, 14, 16 |
| Open question | Are API customers affected? | | | 12–13 |
| Open question | Do 3 joint sessions fit the €6k cap? | | | 10–11 |

Corrected summary:

> Go-live stays Tue 27 Oct, for now. UAT sign-off moves to Fri 16 Oct while Daniel fixes the search-screen defects (14 open, 3 high). Training: 3 joint sessions instead of 6 (budget cap €6k). Watch: Riverside scanner outages (Tomás has a vendor ETA by Wed 14 Oct) and API impact, which Daniel confirms by Fri 23 Oct before Arjun drafts the customer notice.
