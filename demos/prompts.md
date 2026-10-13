# Prompts for the live demonstrations

Copy these exactly. Use only an AI assistant your organisation has approved. All material is fictional except the public sources for slide 58. Attach or paste only the files named.

> Fictional example data for the "From LLMs to AI Agents" workshop.

## Slide 55: one task, three levels

**Level 1, basic chat** (attach nothing):

```
Write a weekly update for Project Lark.
```

**Level 2, context-rich** (attach `project-status-report.md`, `depot-metrics.csv`, `meeting-notes.md`):

```
Write this week's Project Lark update for Helen Brooks, Operations director.
Use only the three attached files. Keep it under 200 words: status, key
figures, decisions, actions with owners and dates, risks.
```

**Level 3, controlled workflow**: run the level 2 prompt, then the check prompt below, then review with `validation-checklist.md` before anything is sent.

```
Recalculate every figure in your draft from depot-metrics.csv and show the
calculation. List any figure where the status report and the CSV disagree.
Do not change the source files.
```

## Slide 56: prompt lab (same task, same source)

**Vague** (attach nothing):

```
Write an email to our customers about the new portal.
```

**Structured** (attach nothing):

```
Draft a customer notice about the portal switchover.
Audience: logistics coordinators.
Cover: when, what changes, what to do, who to contact.
Max 120 words; no unconfirmed facts.
Format: subject + 3 short paragraphs.
```

**Context-rich**: the structured prompt, plus the lines below, then paste section 5 ("Customer impact at cutover") of `project-status-report.md` underneath:

```
Use only the facts in the excerpt below. If something is not confirmed, tell
me in a note after the email. Do not guess.
```

## Slide 57: without sources, then grounded

**Without sources** (attach nothing):

```
I'm supporting the Lark cutover at Riverside depot, Sun 25 Oct to Tue 27 Oct.
What can I book and claim?
```

**Grounded** (attach `policy-excerpt.md`):

```
I'm supporting the Lark cutover at Riverside depot, Sun 25 Oct to Tue 27 Oct.
What can I book and claim? Answer only from the attached policy excerpt and
cite the clause number for each point. If the excerpt does not cover
something, say so.
```

## Slide 58: browser research

Use an approved AI research tool or browser assistant with web access, in a separate window:

```
What do current official guidelines say a workplace password policy should
require for minimum length, complexity rules and scheduled expiry? Use primary
sources such as NIST and the UK NCSC. For each requirement give the source,
its date and the exact sentence it comes from.
```

Follow-up for the Cite step:

```
Quote the exact sentence for each requirement, with the section number.
```

## Slide 59: agent run

With a file-reading assistant or agent that can only read the `demos/` folder (never production systems), give it `agent-task-brief.md`:

```
Follow the attached task brief exactly. Show each tool call and its result.
Do not send anything; finish by requesting approval from Priya Nair.
```

## Slide 60: meeting notes to tracker

Attach `meeting-notes.md`:

```
Extract decisions, actions (owner, deadline), risks and open questions. Cite
note line numbers. Leave a deadline blank if the notes give none.
```

Then:

```
Write a 4-sentence summary for Helen Brooks from your tracker.
```

Then check the result against the notes line by line with `validation-checklist.md`.
