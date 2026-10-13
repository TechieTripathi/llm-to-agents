---
section: 7
layout: artifact
clicks: 2
---

::title::
# One task, three levels of assistance

::default::
<ThreeLevels />

<!--
**Time:** ~1.5 min
**Objective:** See that the same task can be done with three levels of AI assistance, and that each level trades set-up effort for less checking and fixing afterwards.
**Say:** Here is one ordinary task: Priya has to send Helen this week's Project Lark update. At level 1 she just asks a chat assistant. She gets something fluent in seconds, but it has no data, so the numbers are guessed. At level 2 she attaches the status report, the depot metrics and the meeting notes. Now the draft is specific, and it looks finished. But look at the on-time figure: 94.1%, copied from the report, and the report reused last week's number. At level 3 the same draft goes through a controlled workflow: figures are recomputed from the CSV, owners are checked against the notes, and Priya approves before anything is sent. It catches the real figure, 92.5%, which is below target. The next five demos zoom into the pieces of this ladder.
**Steps:** (1) Start on level 1; read the on-time figure aloud. (2) Click: level 2 appears; point at 94.1% and "Stale". (3) Click: level 3; point at 92.5% and the checks row. (4) Point at the effort dots: set-up goes up, review goes down.
**Expected observations:** The same number changes three times: invented, then stale, then checked. Only level 3 catches it, and not because the model got smarter but because a check was built in.
**Example:** A weekly report that goes to a director is worth level 3; a first outline for your own eyes is fine at level 1.
**Notice:** The on-time figure row, and the stair line rising with each level.
**Ask:** Which of your recurring tasks deserve level 3?
**Caveat:** The effort dots are illustrative, not measured. Level 3 is not always worth it: for a one-off low-risk draft the set-up costs more than it saves.
**Likely failure modes (live option):** If you run the three prompts from `demos/prompts.md` live, level 1 may refuse to invent and ask for data (good behaviour; say so), and level 2 may already spot the mismatch if it reads the CSV carefully (also good; point out that you cannot rely on that).
**Fallback:** The slide is the demo. All three states are on the clicker.
**Transition:** Let's start at the bottom of the ladder: what you write in the prompt.
**Sources:** None — fictional worked example (`demos/project-status-report.md`, `demos/depot-metrics.csv`); figures computed from the CSV.
-->

---
section: 7
layout: artifact
clicks: 3
sources: [sclar2024formatting]
---

::title::
# Prompt lab: one task, three prompts

::default::
<PromptLab />

<!--
**Time:** ~2.5 min
**Objective:** Compare a vague, a structured and a context-rich prompt for the same task and the same source, and judge each output on completeness, unsupported assumptions and editing effort.
**Say:** Arjun has to tell customers about the portal switchover. Same task three times; only the prompt changes. The vague prompt gets a cheerful email that invents GPS tracking and a mobile app, says "next week", and promises no interruption, when in fact the old portal goes read-only overnight and everyone must reset their password. The structured prompt is better behaved: it leaves placeholders instead of inventing, but it still cannot know the facts. The context-rich prompt pastes the cutover section of the status report and says "use only these facts; tell me what is not confirmed". It covers all five facts and flags the open API question for Arjun instead of guessing. Context-rich won here because the facts lived in a document, not because there is a magic format.
**Steps:** (1) Vague is on screen: read the prompt, then point at the five wavy-underlined assumptions. (2) Click: Structured. Point at the dashed placeholders: honest gaps. (3) Click: Context-rich. Point at "+ source attached" and the note to Arjun. (4) Click: Compare all. Read the "good enough when" column.
**Expected observations:** Vague 1 of 5 facts and 5 unsupported assumptions; structured 1 of 5 plus 3 placeholders and 2 assumptions; context-rich 5 of 5 and none. Editing effort falls from rewrite to light.
**Example:** The same pattern applies to a job advert, a board paper or a release note: paste the facts, say what to do when a fact is missing.
**Notice:** The checklist scores against the report, not against taste.
**Ask:** Which would you have sent after a quick read? The vague one sounds the most confident.
**Caveat:** Results depend on the model and the task. Sclar et al. (ICLR 2024) found that formatting changes alone shifted few-shot accuracy by up to 76 points on one open model, and that format performance correlated only weakly across models [sclar2024formatting]. Do not claim one prompt style always wins. The outputs are prepared examples written for this workshop, labelled simulated.
**Likely failure modes (live option):** Run the three prompts from `demos/prompts.md` in three tabs. A modern assistant may answer the vague prompt with questions, or with placeholders: say that is good behaviour and score it anyway. Rate limits or a slow model: stop after 20 seconds and use the slide.
**Fallback:** The variant buttons and "Compare all" are the prepared run; every state is on the clicker.
**Transition:** Context helped here. Next: what happens when the AI answers without any source at all.
**Sources:** sclar2024formatting — prompt-format sensitivity and weak cross-model transfer.
-->

---
section: 7
layout: artifact
clicks: 7
---

::title::
# Context demo: would you sign off this answer?

::default::
<GroundedClaimExercise />

<!--
**Time:** ~2 min
**Objective:** Check an answer written without sources, claim by claim, against the policy it should have used, and see how a grounded answer differs.
**Say:** Daniel asks an assistant what he can book and claim for the cutover. The answer comes back confident and reasonable. It is the kind of thing you would forward. Now let's check it against our actual travel policy. Before I reveal anything: hands up for each claim you would sign off. ... Claim 1 is supported. Claim 2: the policy says book through TravelDesk only. Claim 3: the cap is 130, not 150. Claim 4: there is no daily allowance at all. Claim 5 is the interesting one: the policy simply does not cover mileage, and silence is not permission. Claim 6 is fine. Two out of six. Now the same question with the policy attached: every line cites a clause, and the gap is named instead of filled.
**Steps:** (1) Read the question and the six claims; take a show of hands per claim (keep it fast: "who would sign off 2? 3?"). (2) Click six times to reveal verdicts; the right panel opens the clause each verdict rests on. (3) Click: the grounded answer appears. (Clicking a claim reveals it out of order; the Policy / Grounded answer buttons switch the panel.)
**Expected observations:** 2 supported, 3 contradicted, 1 not in source. The contradicted claims are not absurd; they are generic company practice, just not Kestrel's. The grounded answer cites §4.1–4.6 and refers mileage to Group Finance.
**Example:** HR policy questions, procurement thresholds, IT acceptable-use rules: generic answers are plausible and wrong for your organisation.
**Notice:** "Not in source" is a separate verdict from "contradicted". Both block sign-off.
**Ask:** Where in your work would a plausible generic answer be most expensive?
**Caveat:** Grounding reduces but does not remove errors: a model can still misread or misquote the attached text, so the clause references are there for checking. Policy and answers are fictional; the answers are prepared and labelled simulated.
**Likely failure modes (live option):** Ask the question without sources, then with `demos/policy-excerpt.md` attached (prompts in `demos/prompts.md`). The live ungrounded answer may hedge ("check your company policy"); that is the right instinct, so point at whatever specifics it still gave. If the grounded answer misses the mileage gap, that is a finding worth showing.
**Fallback:** The click sequence is the prepared run.
**Transition:** Here the source was ours. Next, the source is the open web, and checking gets harder.
**Sources:** None — fictional policy (`demos/policy-excerpt.md`).
-->

---
section: 7
layout: artifact
clicks: 4
sources: [s7nist2025sp80063b4, s7nist2017sp80063b, s7ncsc2018passwords, s7cisapasswords]
---

::title::
# Browser demo: research, compare, cite, verify

::default::
<ResearchRunbook />

<!--
**Time:** ~2.5 min
**Objective:** Run a short browser research task on a real question with public sources, and show the four checks that turn an AI answer into something you can cite: primary source, currency, exact wording, same audience.
**Say:** A real question every organisation has: what should our password policy require? Many people still believe "8 characters, symbols, change every 90 days". The authority in this area, NIST, published a new version in 2025: at least 15 characters when the password is used on its own, no composition rules, no scheduled expiry. The old 2017 version, which said 8, was withdrawn on 1 August 2025 but it is still all over the web and in training data. So an AI answer can be fluent, cite NIST, and still be out of date. We compare with the UK NCSC, which agrees on expiry and complexity, and with a CISA page that says 16 characters. That is not a contradiction: CISA advises individuals, NIST sets rules for systems. And notice the CISA page is marked archived. Checking the status of a source is part of checking the source.
**Steps:** (1) Say which mode is on screen. Live: click "Live in browser", copy the prompt, paste it into your approved research assistant in a separate window. Prepared: stay on "Prepared evidence". (2) Click to Collect: open the cited links (live) or show the four sources with their status. (3) Click to Compare: where do sources differ, and why. (4) Click to Cite: pick the "8 characters" claim and show the two quotes side by side, 2017 vs 2025. (5) Click to Verify: the checks, then the three-line brief. Live: tick the scorecard as you confirm each item on the NIST page (search the page for "15 characters").
**Expected observations:** Live answers usually cite NIST and NCSC, sometimes vendor blogs; some still quote 8 characters or the 2017 document. Quotes must be found on the cited page. Prepared run: 2 claims supported, 2 contradicted, 1 outdated.
**Example:** The same discipline applies to tax rates, regulatory thresholds or product specifications: anything that changes over time.
**Notice:** The badge says whether you are looking at live retrieval or at prepared material captured on 13 Oct 2026. The example AI draft in the Cite step is simulated.
**Ask:** How would you know a source you found today was withdrawn last year?
**Caveat:** NIST SP 800-63B-4 sets requirements for US federal systems ("verifiers and CSPs"); many organisations adopt it as best practice, but it is not law for them. NCSC guidance was last reviewed in 2018 and gives no minimum number. Re-check all four pages before the session; statuses change. Do not name or demo a product feature you have not verified on the day.
**Likely failure modes:** No network, login wall, captcha or rate limit; the tool answers without links; a link 404s; the answer is perfectly correct (then still verify one quote live, which is the point). Do not spend more than 90 seconds live.
**Fallback:** Toggle to "Prepared evidence" and step through; full quotes, URLs and the comparison are in `demos/research-sources.md`.
**Transition:** So far a person did every step. Next, an agent does the steps, and we watch what keeps it safe.
**Sources:** s7nist2025sp80063b4 — 15/8-character minimums, no composition rules, no periodic change, blocklist, password managers (§3.1.1.2). s7nist2017sp80063b — earlier 8-character rule; withdrawn 1 Aug 2025. s7ncsc2018passwords — UK guidance against expiry and complexity rules; deny lists; password managers. s7cisapasswords — 16+ characters for individuals; page marked archived.
-->

---
section: 7
layout: artifact
clicks: 9
sources: [anthropic2024agents]
---

::title::
# Agent demo: gather, act, observe, validate, recover

::default::
<AgentRunReplay />

<!--
**Time:** ~2 min
**Objective:** Follow a read-only agent run step by step: gather inputs, act through tools, observe results, validate against rules, recover from a failure within a fixed budget, and stop for human approval.
**Say:** This is a replay of an agent compiling the weekly update from the same three files. It is simulated: nothing was really called. Watch the loop at the top. It reads its brief: read-only access, two retries at most, and nothing leaves without Priya's approval. Third step: a failed action. The brief named a file that does not exist. A naive loop would retry the same call. This one uses one retry and changes the approach: list the folder, find the right file, and check it is for the right week. The figure is computed by a tool, not written by the model. Then validation finds the mismatch with the status report, and the brief says what to do: use the CSV, flag it, don't edit the source. It writes the draft into a sandbox folder, runs its final checks, and stops at the approval gate. Nothing has been sent.
**Steps:** (1) Point at the phase strip and the permissions panel. (2) Click through the ten steps; pause on step 3 (file not found, Act turns into an error) and step 4 (Recover, retry 1 of 2). (3) Pause on the mismatch (92.5% ≠ 94.1%). (4) At the end click "Show draft" to show what Priya will approve; "Send to Helen" stays disabled.
**Expected observations:** One failed action, one bounded recovery (1 of 2 retries used), one validation finding flagged rather than hidden, a stop condition, and a human approval gate.
**Example:** The same shape fits month-end reconciliations, ticket triage or compiling a compliance evidence pack.
**Notice:** The retry budget, the permissions (edit source files: denied; send email: needs approval) and the "held for approval" state.
**Ask:** What would you want in the brief before you let an agent touch your weekly report?
**Caveat:** Anthropic's guidance describes agents getting "ground truth" from the environment at each step, stopping conditions such as a maximum number of iterations, pausing for human feedback at checkpoints, and testing in sandboxed environments [anthropic2024agents]. This replay shows those ideas; it is not a specific product. Real agents can also fail silently or follow injected instructions in files (Section 8).
**Likely failure modes (live option):** Only run this live with an agent sandboxed to the `demos/` folder. A real agent may guess the right file name immediately (then the failure does not happen; say so), may skip the week check, or may ask permission before each step. Never connect it to email or production systems.
**Fallback:** The replay is the prepared run; every step is on the clicker. The brief is `demos/agent-task-brief.md`; the draft is in `demos/expected-outputs.md`.
**Transition:** Finally, one complete workflow from messy input to a checked output.
**Sources:** anthropic2024agents — ground truth from the environment at each step; stopping conditions; human checkpoints; sandboxed testing.
-->

---
section: 7
layout: artifact
clicks: 7
---

::title::
# Before and after: meeting notes to a checked tracker

::default::
<MeetingNotesTransform />

<!--
**Time:** ~2.5 min
**Objective:** Turn raw meeting notes into decisions, actions, owners, deadlines, risks and a summary, then validate every item against the original notes and catch an AI-introduced error.
**Say:** These are real-looking raw notes: seventeen terse lines from Monday's sync. The AI extracts three decisions, four actions with owners and dates, risks and open questions, each pointing to the note lines it came from. Then a polished summary for Helen. It reads well. Now we validate: every item traces back to a line, and the ticks appear on the left. But one deadline is wrong. Line 14 says Daniel checks API impact "by the 23rd"; the AI wrote Friday 16th, borrowing the UAT date from line 6. It is exactly the kind of error a reader skims past, and it also went into the summary. Arjun's action has no date in the notes at all: the right move is to ask, not to invent one. After correction, the checklist passes and Priya approves before it goes out.
**Steps:** (1) Show the raw notes and the prompt. (2) Click three times: decisions, actions, risks appear, and their source lines light up on the left. (3) Click: the summary. Ask: "Anything wrong?" (4) Click: validate; ticks appear. (5) Click: the error is caught at line 14. (6) Click: the quality checklist and the corrected summary. Hover any tracker item to light up its lines.
**Expected observations:** 3 decisions, 4 actions, 3 risks (1 marked inferred), 2 open questions; every item cites lines; 1 wrong deadline caught and corrected; 1 missing deadline flagged, not invented; lines 1, 2 and 17 are context, not items.
**Example:** Any minutes-to-actions task: project syncs, incident reviews, customer calls.
**Notice:** The error is in the summary too, so correcting the tracker alone is not enough.
**Ask:** How long does this check take compared with writing the tracker yourself?
**Caveat:** The AI output is prepared and simulated; the notes are fictional. Line references only help if someone actually follows them.
**Likely failure modes (live option):** Attach `demos/meeting-notes.md` and use the prompt in `demos/prompts.md`. A live model may get the 23rd right (then check two other items against the notes anyway), may invent a date for Arjun, or may drop line references. Any of those is a teaching moment.
**Fallback:** The click sequence is the prepared run; the full tracker is in `demos/expected-outputs.md`.
**Transition:** We have seen the tools work and fail. The last section is about introducing them safely in your organisation.
**Sources:** None — fictional notes (`demos/meeting-notes.md`).
-->
