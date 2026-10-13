---
section: 6
layout: artifact
clicks: 3
sources: [euaiact2024annex3]
---

::title::
# Where AI helps across departments

::default::
<UseCaseExplorer />

<!--
**Time:** ~2.5 min
**Objective:** Participants see that AI help is not a "department thing": the same five kinds of work (gathering, transforming, analysing, communicating, executing) appear everywhere. The inputs and the person who checks the output change.
**Say:** This map has eight departments down the side and five kinds of work across the top. Each marker is a realistic use case at our fictional company, Kestrel Freight. Read the columns, not just the rows: every department gathers information, turns one format into another, analyses something, and writes for a reader. The last column, execution, is nearly empty on purpose: when AI acts inside a live system — creating tickets, opening pull requests — the risk changes, so those use cases need draft-only permissions and human approval. Every card has the same six parts: task, inputs, AI steps, expected output, the verification step, and a data-sensitivity note.
**Example:** Click through the tour: Marketing coding survey comments (lower risk), HR answering handbook questions (questions can contain health details), Finance writing a month-end summary (copy figures verbatim, never re-derive), and IT letting an agent propose a dependency update (high risk because it has write access).
**Notice:** The markers with a thick blue ring are the worked examples on the next seven slides. The "Verify" line is the one to read on every card — it names a specific check, not "review it".
**Ask:** Which column does most of your week fall into? Pick one marker that looks like your own work.
**Caveat:** These are illustrative use cases, not a measured list of where AI pays off. Risk levels are a teaching judgement; your organisation's data-classification policy decides what may go into which tool. One HR note matters legally: drafting a job description is ordinary drafting, but using AI to screen, filter or evaluate candidates, or to make decisions on promotion, termination, task allocation or performance monitoring, is listed as high-risk under the EU AI Act, Annex III point 4.
**Transition:** Let's open seven of these and see what the check actually looks like — starting with HR.
**Sources:** euaiact2024annex3 — EU AI Act Annex III point 4 lists AI for recruitment/selection and for work-relationship decisions and monitoring as high-risk (shown on the HR job-description card). Use cases themselves are fictional (Kestrel Freight).
-->

---
section: 6
layout: artifact
clicks: 2
sources: [euaiact2024annex3]
---

::title::
# HR: every line cites a policy

<S6Tags />

::default::
<S6Hr />

<!--
**Time:** ~1.2 min
**Objective:** Show that grounding a draft in approved documents — and demanding a reference per line — makes verification fast and concrete.
**Say:** Sara in HR needs an onboarding checklist for a new depot driver. The input is three approved policies and a role template — no employee records. The instruction says: use only these policies, cite the section on every line, and say so if something isn't covered. Click once and the draft appears. Click again and Sara checks each line against its reference. Four lines match. The data-protection course has no source at all — the model added it from general knowledge, so it is removed or routed to the policy owner. And probation is cited to section 5.2, but the section actually says six months, not three — a citation does not guarantee the content matches. The right-to-work check is a legal duty, so HR confirms the wording rather than trusting the draft.
**Example:** Same pattern for a job description: draft from the approved role profile, then the hiring manager confirms duties and HR checks pay and legal wording.
**Notice:** The policy reference column. A line without one is a line nobody can verify quickly.
**Caveat:** Keep personal data out unless the tool is approved for it. Drafting documents is low-stakes compared with using AI to screen or evaluate people, which the EU AI Act (Annex III, point 4) classes as high-risk.
**Transition:** In finance the reference isn't a policy section — it's the numbers themselves.
**Sources:** euaiact2024annex3 — high-risk classification of AI used for recruitment and employment decisions. Checklist content is fictional.
-->

---
section: 6
layout: artifact
clicks: 2
---

::title::
# Finance: recompute, then explain

<S6Tags />

::default::
<S6Finance />

<!--
**Time:** ~1.3 min
**Objective:** Participants learn that numbers in an AI explanation must be recomputed from the source, and that "explanations" of causes need evidence the data may not contain.
**Say:** Mei has the Q3 budget-versus-actual export for depot costs. Step one: the instruction asks for an explanation for depot managers, using only the table and our account definitions, showing how each percentage was calculated, and listing questions rather than guessing causes. Step two: the draft adds a percentage column and four sentences of commentary. Step three: Mei recomputes every figure — the "Recomputed" column on screen is calculated live from budget and actual, exactly as a spreadsheet formula would. Overtime is not 12% over budget, it is 16.7%. The fuel sentence names a cause — diesel prices — but the table only contains spend; price versus volume has to come from operations. And "maintenance under budget is a saving" may really be deferred work, which is a cost later.
**Example:** Variance = actual minus budget; for a cost line, positive is adverse. Agree definitions like that before you ask for commentary, or the model may use a different sign convention.
**Notice:** The single red row in the table, and the two amber sentences that are plausible but unsupported.
**Caveat:** Language models can make arithmetic slips and confidently state causes. Use the model to draft the narrative; use the spreadsheet for the arithmetic. Unreleased financials belong only in an approved tool, and the finance business partner approves before anything is shared.
**Transition:** Sales and marketing have a different risk: facts that were true once, and claims we cannot make.
**Sources:** None — fictional figures; the recomputation is performed in the slide.
-->

---
section: 6
layout: artifact
clicks: 2
---

::title::
# Sales & marketing: check every claim

<S6Tags />

::default::
<S6Sales />

<!--
**Time:** ~1.2 min
**Objective:** Show the two verification habits that matter most here: source freshness for research, and approved claims for anything published.
**Say:** On the left, Arjun prepares for a first call with a fictional prospect, Harbour & Vale Foods, using public sources only. The timeline shows when each source was published against today. Step two, the AI turns them into a brief. Step three, the check: two facts are recent; the distribution-centre fact comes from a press release more than two and a half years old, so it needs confirming; and "moving to a single logistics provider" has no source at all — it's an inference presented as a fact. On the right, marketing asked for one message in three variants. One variant promises "guaranteed 100% on-time", which breaks the brand rule on absolute guarantees and contradicts the fact sheet's 96%. Another promises live arrival times in the customer portal — a feature that only arrives with Project Lark.
**Example:** Paste the approved fact sheet into the context and ask the model to list every claim it made, with the fact-sheet line that supports it.
**Notice:** The timeline: the oldest dot is outside the shaded last-12-months window.
**Ask:** What is the oldest "fact" in your last customer presentation?
**Caveat:** Published claims can become commitments. Brand and, where needed, legal review stay with people. Keep CRM notes and customer data out of unapproved tools.
**Transition:** In operations, a missing step is not a brand problem — it can hurt someone.
**Sources:** None — fictional prospect, fact sheet and brand rules.
-->

---
section: 6
layout: artifact
clicks: 2
scale: 0.94
---

::title::
# Operations: the owner signs the SOP

<S6Tags />

::default::
<S6Ops />

<!--
**Time:** ~1.2 min
**Objective:** Show AI turning messy notes into a structured procedure, and why the process owner — not the model — decides the safety steps.
**Say:** These are real-looking shift-log notes from a fictional night at Depot 4: a dock door wouldn't close, two resets failed, the on-call engineer didn't answer, someone used the manual chain, and loading moved to another dock. The instruction asks for numbered steps, each linked to the note it came from, with assumptions marked. The draft is good structure fast. Then Tomás reviews it. The ten-minute escalation time was invented — it's in no note — so the owner sets it. And the notes describe what Jo did, not what should be done: using the manual chain needs power isolated first and trained staff only. The model faithfully reproduced a risky improvisation. The owner adds the lock-off step.
**Example:** Same pattern for shift handovers or post-incident reviews: AI structures, the accountable person corrects and signs.
**Notice:** The source column: "new" marks the step that came from the owner, not the notes.
**Caveat:** Notes record what happened, not what is safe. Never publish a safety-relevant SOP without the process owner and, where required, the safety officer signing it off.
**Transition:** IT has an advantage the other departments don't: it can test the output automatically.
**Sources:** None — fictional incident.
-->

---
section: 6
layout: artifact
clicks: 2
sources: [perry2023insecure]
---

::title::
# IT: the test decides

<S6Tags />

::default::
<S6It />

<!--
**Time:** ~1.3 min
**Objective:** Show the engineering loop — summarise, reproduce with a test, fix, explain — and that tests and review, not a fluent explanation, decide whether the change is right.
**Say:** Daniel has a synthetic log from the customer portal. Several requests return 500 errors. The instruction asks for a summary of the pattern, a failing test that reproduces it, and the smallest fix with an explanation. The summary spots it: lower-case IDs fail while the same ID in upper case works. The test encodes that. The fix normalises the ID and rejects malformed ones. Then the checks: the new test fails before the fix and the full suite passes after. Review catches what tests didn't: the change also logs request headers, which contain authentication tokens — a security problem — so that line is removed. And review notices unknown IDs still return 500 instead of 404, which becomes a separate ticket.
**Example:** This works for documentation too: ask the model to explain a legacy script, then rerun the examples it claims work.
**Notice:** The struck-through diff line. It would have passed every functional test.
**Caveat:** A controlled study at CCS 2023 found participants using an AI code assistant wrote significantly less secure code than those without one — and were more likely to believe their code was secure. Never paste secrets, tokens or real customer data into prompts; follow your secure-coding and review rules.
**Transition:** Management work has no test suite — so traceability to the source has to do that job.
**Sources:** perry2023insecure — user study: AI-assisted participants wrote less secure code and were more confident in it. Log, test and code are synthetic.
-->

---
section: 6
layout: artifact
clicks: 2
---

::title::
# Management: trace every line

<S6Tags />

::default::
<S6Mgmt />

<!--
**Time:** ~1.2 min
**Objective:** Show synthesis of several updates into a decision brief, and the specific check: owners, dates, assumptions and decisions must match the sources.
**Say:** Helen, the operations director, gets four updates about Project Lark. The instruction: draft a one-page decision brief, keep every owner, date and condition as written, and cite the update behind each line. The draft is tidy — and it has the classic synthesis errors. It says "on track for 27 October", taking Priya's plan but ignoring Daniel's failed load test and his "earliest 3 November" — which also falls inside the change freeze, so Helen would have to approve an exception. It derived a training deadline — 20 October is 3 November minus Tomás's two weeks — which is useful but is a calculation, so it is marked for confirmation. And it shortened Mei's budget line to "within contingency", dropping the condition "only one extra load test". Dropped conditions are the most common way a summary becomes wrong.
**Example:** The same check applies to status reports and minutes: does every action have the owner and date that the source gave it?
**Notice:** The source chips on each line. The red line cites only one update when another update contradicts it.
**Ask:** In your last status report, which line would fail this check?
**Caveat:** Ranking risks and choosing the date are judgements the manager owns. Keep performance or personal matters out of shared briefs.
**Transition:** Research synthesis is the same check, at a larger scale: what exactly did each source find?
**Sources:** None — fictional updates.
-->

---
section: 6
layout: artifact
clicks: 2
sources: [peng2023copilot, cui2026copilot, becker2025metr, metr2026update, walters2023citations]
---

::title::
# Research: methods before headlines

<S6Tags />

::default::
<S6Research />

<!--
**Time:** ~1.1 min
**Objective:** Show AI-assisted literature comparison, and that verification means checking each number, method and limitation against the original — using real studies.
**Say:** The question is a real one: do AI coding assistants make developers faster? Three published studies. The instruction asks the assistant to extract who took part, what was measured, the result and the main limitation, quoting numbers exactly. Check against the originals: Peng and colleagues — 95 programmers, one task, building an HTTP server in JavaScript — finished 55.8% faster with Copilot. Cui and colleagues — three field experiments, 4,867 developers — found 26% more completed tasks, with larger gains for less experienced developers. METR — 16 experienced developers on their own large projects — found tasks took 19% longer with AI. The draft flipped "slower" to "faster": one word, opposite meaning. The summary then over-generalised one lab task into "55.8% more productive" and claimed experienced developers benefit most, when the sources say the opposite.
**Example:** Fabricated citations are a known failure. In a 2023 audit, 55% of GPT-3.5 citations and 18% of GPT-4 citations were fabricated (Walters and Wilder, Scientific Reports). Open every source yourself.
**Notice:** The "Measured" column. "Time to finish one task", "pull requests per week" and "time per task in a familiar codebase" are three different things.
**Caveat:** Vendor versus independent: Peng et al. and two of the Cui et al. authors are at Microsoft or GitHub; METR is an independent non-profit. Context matters too: METR now labels its 2025 result out of date; its February 2026 follow-up points towards speed-ups (returning developers −18%, confidence interval −38% to +9%) but METR itself calls that data an unreliable signal because many developers would not do tasks without AI.
**Transition:** So how should you measure productivity in your own work? With the whole task, not the first draft.
**Sources:** peng2023copilot — 55.8% faster, one task, 95 recruited programmers; cui2026copilot — +26.08% completed tasks across 4,867 developers, less experienced gain more; becker2025metr — 19% longer completion time, 16 developers, 246 tasks; metr2026update — follow-up results and METR's reliability caveat; walters2023citations — rates of fabricated citations. The AI extraction and summary on the slide are simulated.
-->

---
section: 6
layout: artifact
clicks: 1
sources: [brynjolfsson2025genai, noy2023science, dellacqua2026jagged, peng2023copilot, becker2025metr, humlum2025denmark]
---

::title::
# Measure the whole task, not the first draft

::default::
<ProductivityCalculator>
  <template #aside><S6Evidence /></template>
</ProductivityCalculator>

<!--
**Time:** ~4 min
**Objective:** Participants can estimate net time saved for one of their own tasks, see how review and rework can cancel the gain, and read published productivity numbers with their context.
**Say:** The calculator uses three lines of arithmetic. Time with AI is execution plus human review plus correction or rework. Net saved is the baseline minus that. The percentage is net saved divided by baseline. "Good fit": a one-hour report becomes five minutes of generation, twelve of review and five of fixes — 22 minutes, so 38 minutes saved, about 63%, and at twenty times a month roughly 12.7 hours. Now click to "Poor fit": a 30-minute task where the draft arrives in four minutes, but checking takes fifteen and fixing it twenty. Total 39 minutes: you lose nine minutes every time, minus 3 hours a month — while feeling faster, because the first draft was instant. These numbers are illustrative. Measure your own: time a few real tasks with and without AI, including review and rework.
**Example:** Ask the room for one task: how long does it take now, and how long would honest review take?
**Notice:** The dashed line is the baseline. When the stacked bar crosses it, rework has eaten the gain.
**Ask:** For your chosen task, which bar would grow most: review or rework?
**Caveat:** Time saved does not establish quality or safety, and these studies measured different things in different settings. Customer support (Brynjolfsson, Li and Raymond, QJE 2025): 5,172 agents at one firm; issues resolved per hour rose 15% on average, about 30% for novice and low-skilled agents, with small speed gains and small quality declines for the most skilled. Writing (Noy and Zhang, Science 2023): 453 college-educated professionals on short, self-contained writing tasks; time fell 40% and graded quality rose 18% — the authors note short tasks may inflate the estimates. Consulting (Dell'Acqua et al., Organization Science 2026): 758 BCG consultants; inside the frontier of what GPT-4 could do they completed 12.2% more tasks, 25.1% faster, with higher quality; on a task chosen to be outside it, AI users were 19% less likely to reach the correct answer. Coding: Peng et al. (Microsoft/GitHub authors, preprint) found one lab task finished 55.8% faster; METR's 2025 trial with 16 experienced developers found 19% slower, while the developers believed they had been sped up by about 20%. Denmark (Humlum and Vestergaard, NBER WP 33777, revised 2026): adopters in 11 exposed occupations report saving about 3% of work hours, with no detectable effect on earnings or recorded hours. Self-reports are not measurements.
**Transition:** That closes the cross-functional tour. Next we'll watch the same ideas in live demonstrations.
**Sources:** brynjolfsson2025genai — +15% average, heterogeneity by experience (field data, one firm); noy2023science — −40% time, +18% quality on writing tasks; dellacqua2026jagged — gains inside and losses outside the "jagged frontier"; peng2023copilot — 55.8% faster on one task (vendor-affiliated); becker2025metr — 19% slower for experienced developers, and their mistaken self-estimate; humlum2025denmark — about 3% self-reported time savings, null effects on earnings and hours. Calculator values are illustrative.
-->
