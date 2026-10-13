---
section: 3
layout: split
ratio: 1.15fr 1fr
clicks: 3
sources: [s3anthropic2026prompting]
---

# Prompting is specification, not magic

::left::

<div class="s3-evo-code">

````md magic-move {lines: false}
```text
Prepare a project report.
```
```text
Prepare a status report on Project Lark
for the steering committee.
```
```text
Prepare a status report on Project Lark
for the steering committee.

Source: the attached week 41 tracker
(6–10 October) only.
```
```text
Prepare a status report on Project Lark
for the steering committee.

Source: the attached week 41 tracker
(6–10 October) only.

Goal: help them decide on change
request CR-7 at Thursday's meeting.

Format: one page. Overall status, top
three risks, the decision needed.
If a figure is missing, write
"not in source".
```
````

</div>

<div class="s3-evo-cap"><span>Each addition removes a guess. No special phrasing needed.</span><SimTag kind="fictional" /></div>

::right::

<PromptEvolution />

<style>
h1 { max-width: none; }
.s3-evo-code :deep(.slidev-code-wrapper) { margin: 0; }
.s3-evo-code :deep(.slidev-code) {
  background: var(--surface) !important;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  padding: 14px 16px !important;
  font-size: var(--fs-label) !important;
  line-height: 1.42 !important;
  min-height: 112px;
}
.s3-evo-code :deep(.slidev-code span) { color: var(--ink) !important; }
.s3-evo-code :deep(.slidev-code-copy) { display: none; }
.s3-evo-cap { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; font-size: var(--fs-label); color: var(--ink-2); }
</style>

<!--
**Time:** ~1.5 min
**Objective:** Reframe prompting as writing a specification: stating what a capable newcomer would need, not finding magic words.
**Say:** Most disappointing AI output starts with a request, not a specification. "Prepare a project report" is a complete sentence, but it leaves the model to guess the project, the reader, the data, the purpose and the shape of the result — and it will guess, fluently. Watch the prompt grow: each addition removes a guess. Nothing here is a trick phrase; it is the same information you would give a new colleague on their first week. Anthropic's own guidance puts it this way: treat the model like a brilliant new employee with no context on your norms, and test your prompt by asking whether a colleague with minimal context could follow it.
**Example:** Priya Nair, project manager on Kestrel Freight's Project Lark (fictional), needs a status report for Thursday's steering committee. The final version names the project, the reader, the source, the period, the goal, the format, and what to do when a figure is missing.
**Notice:** The counter on the right. Six guesses become zero. The last line — "if a figure is missing, write 'not in source'" — is a preview of prompt hardening, slide 23.
**Ask:** Think of the last request you sent to a colleague that came back wrong. Which of these six questions did it leave open?
**Caveat:** A longer prompt is not automatically better; every line should remove a real ambiguity. Modern models also infer a lot — the point is to stop them inferring what you could simply state.
**Transition:** Let's put the weak and the structured versions side by side and look at what each one produces.
**Sources:** s3anthropic2026prompting — Anthropic's prompting best practices: "be clear and direct", the brilliant-new-employee framing and the colleague "golden rule". Kestrel Freight and Project Lark are fictional.
-->

---
section: 3
layout: artifact
clicks: 2
sources: [s3anthropic2026prompting, s3openai2026prompting]
---

::title::
# Weak prompt versus structured prompt

::default::
<PromptBeforeAfter />

<!--
**Time:** ~2 min
**Objective:** Give participants a reusable recipe: audience, source, objective, constraints, output format.
**Say:** On the left is the request most people type first. The output is grammatical, well organised — and empty. It cannot use figures it was never given, so it falls back on safe generalities and a fill-in-the-blank line. On the right, the same task with five labelled parts. Click once: every line of the better draft traces back to a part of the prompt — the status line to the format, the risks to the source, the decision to the objective, and "not in source" to the constraint. Click again: the weak draft needs rewriting; the structured draft needs a check of three figures before it goes out. That difference in review effort is where the time saving actually lives.
**Example:** The recipe works for any recurring deliverable: a monthly finance variance note, an incident summary, a hiring-panel brief. Write the five parts once, save them as a template, and reuse them.
**Notice:** Step 1 — the chips on each output line show which part of the prompt produced it. Step 2 — the review verdicts.
**Ask:** Which of the five parts do you most often leave out?
**Caveat:** Both outputs are hand-written simulations of typical behaviour, not captured model output. The structured version is not guaranteed to be correct: it still contains figures that need checking. Labels like "Audience:" are a convenience — both OpenAI's and Anthropic's guides suggest clear sections (Markdown headings or XML tags), not a mandatory syntax. Slide 13 covered why wording changes outputs mechanically; slide 56 runs a full prompt lab.
**Transition:** Let's dissect the parts of a useful prompt one at a time — on a non-project task.
**Sources:** s3anthropic2026prompting — be specific about output format and constraints; give context and motivation. s3openai2026prompting — prompt engineering defined as writing instructions that consistently meet requirements; structure prompts into sections (identity, instructions, examples, context) with Markdown/XML.
-->

---
section: 3
layout: artifact
clicks: 6
sources: [s3anthropic2026prompting, s3openai2026prompting, s3zheng2024personas]
scale: 0.94
---

::title::
# The anatomy of a useful prompt

::default::
<PromptAnatomy />

<!--
**Time:** ~1.5 min
**Objective:** Name the parts of a useful prompt and what each contributes, and show that "role" is optional.
**Say:** Here is a prompt for a non-technical task: Arjun Mehta, an account manager, writing to a customer about the portal switchover. Walk the parts. The objective says what done looks like. The context supplies what the model cannot know — the complaint history, who the reader is, the FAQ. Constraints set limits and no-go areas, like not promising uptime figures. The output format fixes the shape. Verification tells the model how its answer will be checked and asks it to flag doubt. Finally the role line — "you are helping an account manager…" — which can set tone but is the least important part. Research on personas in system prompts found that adding a persona did not improve accuracy across a broad set of questions.
**Example:** The same anatomy works for an HR policy summary, a procurement comparison, or a SQL query review: change the content of each part, keep the parts.
**Notice:** Click a label (or advance) to highlight one part; the right panel says what it does and what goes wrong without it. The role is drawn faded and marked optional.
**Ask:** Which part would most improve the prompts your team uses today?
**Caveat:** This is a checklist, not a template you must fill every time — a quick question needs none of it. Order matters less than completeness, although Anthropic recommends placing long documents above the instructions for long-context tasks. Personas can still be useful for tone and style; the finding is about accuracy (Zheng et al., Findings of EMNLP 2024).
**Transition:** Now let's make those parts selectable and watch the deliverable change.
**Sources:** s3anthropic2026prompting — clear instructions, context and motivation, roles as an option, documents above the query. s3openai2026prompting — prompt sections (identity, instructions, examples, context). s3zheng2024personas — personas in system prompts did not improve performance compared with no persona. Halden Garden Supplies and Jo Park are fictional.
-->

---
section: 3
layout: artifact
clicks: 4
sources: [s3anthropic2026prompting, s3openai2026prompting]
---

::title::
# Requirements reshape the deliverable

::default::
<PromptBuilder />

<!--
**Time:** ~2 min
**Objective:** Show that audience, format, length and rules are not cosmetic: each one changes what the deliverable contains, not just how it looks.
**Say:** This is the same Project Lark update, assembled from fields. Each click changes exactly one field — watch the highlighted line in the prompt and the draft beneath it. Switch the audience from the steering group to customers and the budget disappears: customers should not see internal spend, and the draft now talks about their login and bookmarks. Switch to email and you get a subject line and a greeting. Make it detailed and two more facts appear. Tick "plain words" and "SSO with existing credentials" becomes "your usual username and password". The point: a requirement in the prompt is a decision about content, and if you do not make it, the model makes it for you.
**Example:** Finance teams can keep one variance-explanation prompt and flip only the audience field — board pack, budget holders, or auditors — instead of rewriting each version by hand.
**Notice:** The word count in the draft header, the highlighted prompt line, and which facts appear or vanish when the audience changes.
**Ask:** Which field would you save as a default for your own recurring reports?
**Caveat:** The drafts are hand-written simulations that show the typical direction of change; a real model's wording would vary from run to run, and you would still check each figure. Treat length limits as approximate and check them. Turning on "cite sources" here adds source markers the reviewer can check; it does not by itself make the facts true (slide 22).
**Transition:** So far we have changed the instructions. Next: what happens when you change what the model knows.
**Sources:** s3anthropic2026prompting — be specific about format and constraints; explain context and motivation. s3openai2026prompting — prompts specify identity, instructions and context; test prompt behaviour with evals because outputs vary. Kestrel Freight data is fictional.
-->

---
section: 3
layout: artifact
clicks: 6
sources: [s3anthropic2026prompting, s3openai2026prompting]
---

::title::
# Context often beats clever wording

::default::
<ContextCompare />

<!--
**Time:** ~1.5 min
**Objective:** Show that adding the right information changes the substance of an answer, while polishing the wording mostly changes its tone.
**Say:** Same question, Helen Brooks asks whether to approve CR-7 before go-live. The bare question gets a balanced, empty answer. Click once: the "world-class consultant, think step by step" line makes it sound more decisive — but there is still not a single fact Helen could check. Now add context, one piece per click: the change-freeze policy, the steering committee's earlier decision, the tracker data, the contract date, and finally who the reader is and what she wants. Each one adds a reason the reader can verify, and the counter goes up. The answer did not get better because the model got smarter; it got better because it finally knew what we know.
**Example:** In HR, "summarise this grievance" versus the same request plus the relevant policy clause, the previous meeting outcome, and who will read the summary.
**Notice:** The "checkable facts" counter stays at zero after the clever wording. Each reason in the answer is labelled with the context item it came from.
**Ask:** What context do you routinely leave in your head when you ask an AI tool for help — prior decisions, policies, constraints?
**Caveat:** "Often", not "always": wording still matters (slide 13), and a role line can help tone. More context is not automatically better either — irrelevant, outdated or conflicting material can hurt, which is the subject of slide 24. Answers here are hand-written simulations.
**Transition:** If context matters this much, the next question is whether the answer actually stays true to the documents we gave it.
**Sources:** s3anthropic2026prompting — "add context to improve performance": explaining context and motivation helps the model deliver targeted responses. s3openai2026prompting — include relevant context the model could not otherwise know (proprietary data; constraining to chosen resources). Kestrel Freight data is fictional.
-->

---
section: 3
layout: artifact
clicks: 6
sources: [lewis2020rag, s3liu2023verifiability, s3anthropic2026halluc, s3anthropic2026citations]
---

::title::
# Grounding answers in approved sources

::default::
<SourceVerification />

<!--
**Time:** ~2 min
**Objective:** Teach claim-level verification: a grounded answer is one where every factual claim traces to a passage in an approved source.
**Say:** The strip at the top is retrieval-augmented generation, or RAG, in plain words: a search step finds relevant passages in your approved documents, the system adds them to the prompt, and the model drafts from them — ideally citing which passage supports what. The last step is ours: check every claim. Here is an AI-drafted Lark summary split into six claims, beside the three documents it was given. Click through: the depot count is supported; the go-live date is contradicted — the minutes moved it to 27 October; the budget is supported; "30 % faster tracking" is unsupported — nothing we supplied measures speed; the vendor fix is contradicted; the defect count is supported. Three of six survive. Every sentence sounded equally confident.
**Example:** Before a quarterly business review, an analyst splits the AI-drafted narrative into claims and checks each one against the finance pack. Anything without a source is either sourced or cut.
**Notice:** Evidence lines light up in the sources when a claim is checked. Unsupported is different from contradicted: one has no evidence, the other has evidence against it.
**Ask (interactive):** Click a claim before advancing. Ask the room: supported, contradicted or unsupported? Press their answer, then "Show the evidence".
**Caveat:** Citations make an answer auditable, not correct. In a study of generative search engines (Liu, Zhang and Liang, Findings of EMNLP 2023), only 51.5 % of generated sentences were fully supported by their citations and 74.5 % of citations supported their sentence — measured on four engines in 2023; today's systems will differ, but the lesson stands: check the passage, not just the presence of a link. Anthropic's guidance suggests asking the model to find a supporting quote for each claim and retract claims it cannot support; its API offers citations that return the exact passages used. These techniques reduce but do not eliminate errors. Retrieved text can also carry hidden instructions (prompt injection), covered in Section 8.
**Transition:** Some of those errors could have been prevented in the prompt itself. That is prompt hardening.
**Sources:** lewis2020rag — retrieval-augmented generation combines a retriever over documents with a generator. s3liu2023verifiability — 51.5 % of sentences fully supported; 74.5 % of citations supportive (2023 audit). s3anthropic2026halluc — allow "I don't know", ground in direct quotes, verify each claim with a quote and retract if none. s3anthropic2026citations — citations return the passages supporting each claim. Report and documents are fictional.
-->

---
section: 3
layout: artifact
clicks: 5
sources: [s3anthropic2026halluc, s3openai2026prompting]
scale: 0.94
---

::title::
# Prompt hardening: decide the edge cases in advance

::default::
<PromptHardening />

<!--
**Time:** ~2 min
**Objective:** Show that a reusable prompt must say what to do when the input is incomplete, ambiguous, conflicting, missing or sensitive — and that each safeguard can be tested.
**Say:** A prompt that works on the happy path is not finished. Prompt hardening means deciding the awkward cases before they happen. Each tick adds one clause on the right and turns one test on the left from red to green. Missing data: without a rule the model fills the gap with a plausible number; with it, it writes "not in source". Ambiguity: tell it to ask one question rather than guess. Conflicting sources: show both values and name them. Failure: if the tracker is missing, stop and say so rather than writing a confident report from nothing. Exclusions: keep personal and health details out. Notice that every clause is a sentence a careful manager would say to a new analyst.
**Example:** A service-desk team hardening a ticket-summary prompt: what to do with a ticket in another language, with no error message, with two conflicting timestamps, or with a customer's personal data in it.
**Notice:** The score in the corner, and that each clause maps to a named test case. The test cases are the important part — they are how you know the clause works.
**Ask:** Pick one prompt your team reuses. Which of these five cases has it never been tested on?
**Caveat:** Instructions reduce failures; they do not guarantee behaviour. Anthropic's guidance says giving the model explicit permission to say it doesn't know "can drastically reduce" false information, and that such techniques reduce but do not eliminate hallucinations. OpenAI recommends building tests and evaluation suites to measure prompt behaviour as you iterate or change model versions. Hard limits — for example, never sending personal data to an external tool — belong in the surrounding application, not only in the prompt (slide 25). Test results here are simulated.
**Transition:** Hardening deals with bad inputs. The next step is choosing good inputs in the first place: context engineering.
**Sources:** s3anthropic2026halluc — allow the model to say "I don't know"; restrict it to provided documents; techniques reduce but don't eliminate hallucinations. s3openai2026prompting — build tests and evals that measure prompt behaviour; pin model snapshots. Example data is fictional.
-->

---
section: 3
layout: artifact
clicks: 8
sources: [s3anthropic2025context, shi2023distracted, s3xu2024conflicts, liu2024lost]
---

::title::
# Context engineering: choosing what the model sees

::default::
<ContextSelectionBoard />

<!--
**Time:** ~1.5 min
**Objective:** Show that context is curated, not dumped: relevant and authoritative material goes in; irrelevant, outdated, sensitive and lower-authority conflicting material stays out or is flagged.
**Say:** Slide 21 showed that context helps. This slide shows that *which* context matters. The task: recommend whether to approve CR-7 before go-live. Eight things could go in. Click through. The tracker and the approved policy go in. The office-move FAQ is irrelevant — and irrelevant text is not harmless: research shows models can be distracted by it. The 2024 policy is outdated; including it invites the model to quote the wrong rule. The signed minutes go in. Then a conflict: an email says go-live is 3 November, the minutes say 27 October. We do not let the model pick — we apply a source hierarchy: an approved policy beats a signed decision record, which beats the system of record, which beats an email thread. The sick-leave log is sensitive: it has no business in this prompt at all. The contract clause goes in.
**Example:** A procurement analyst comparing two suppliers includes the current framework agreement and the scored tender responses, but not last year's superseded price list or an unverified sales email.
**Notice:** Every card carries a reason. The hierarchy strip shows the conflict being settled by rank, not by the model's guess.
**Ask:** Does your team have an agreed source hierarchy — and would an AI assistant know about it?
**Caveat:** More context is not free. Anthropic describes "context rot": recall gets less reliable as the context grows, so the goal is the smallest set of high-signal information. Long-context studies found models use information in the middle of long inputs less reliably than at the start or end (Liu et al., TACL 2024). The hierarchy shown is an example; your organisation's governance decides the real order. Retrieved documents can also contain malicious instructions — Section 8.
**Terminology:** *Prompt engineering* is writing the instructions and output requirements. *Context engineering* — a term Anthropic's engineering team describes as "the natural progression of prompt engineering" — is selecting and organising everything the model sees at inference time: documents, history, tool results, examples. The two overlap but are not the same job.
**Transition:** Choosing context is one part of the system around the model. Next, the whole system: harness engineering.
**Sources:** s3anthropic2025context — definition of context engineering, "context rot", smallest set of high-signal tokens. shi2023distracted — irrelevant context can dramatically reduce accuracy (GSM-IC). s3xu2024conflicts — taxonomy of knowledge conflicts, including inter-context conflicts between sources. liu2024lost — long-context use degrades for information in the middle. Items are fictional.
-->

---
section: 3
layout: artifact
clicks: 8
sources: [s3anthropic2026evals, s3openai2026harness, s3osmani2026harness, s3openai2026structured]
---

::title::
# Harness engineering: the system around the model

::default::
<HarnessDiagram />

<!--
**Time:** ~2 min
**Objective:** Distinguish model behaviour from application-level controls, and show the layers a dependable AI-assisted task needs around a single model call.
**Say:** Start with the dashed band: a bare model call, text in and text out. Everything else we add is ordinary software that we control. Instructions and context retrieval decide what the model sees. Then tools: the model can only *propose* a tool call — here, read the week 41 tracker — and the application decides whether to run it. Permissions are enforced by code: read-only, Lark data only. Validation is code too: it checks the draft against the sources, catches "go-live 20 October", and sends it back with the reason. State remembers which version passed which checks. Logging records every call for audit. Finally a person — Priya — approves before anything is sent. Reliability comes from this system, not from the model alone.
**Example:** An expenses assistant: the model may suggest a cost code, but the finance system validates it against the chart of accounts, blocks amounts over the policy limit, logs the decision, and routes exceptions to a manager.
**Notice:** Arrows between lanes. The model never reaches a tool or the outside world directly. The trace below follows one tool call and one failed-then-passed validation.
**Ask:** In the AI tools you use today, which of these layers can you actually see or configure?
**Caveat:** Some controls are partly model behaviour (following instructions); others are guaranteed by code (permissions, schema validation, approval gates). Treat anything that must never happen as a code-level control, not a prompt instruction. Structured-output features can enforce a JSON schema, but a valid format does not make the content true. The trace is simulated. Section 5 (slide 43) returns to harnesses for multi-step agents: budgets, retries and stopping rules.
**Terminology:** *Prompt engineering* — writing the instructions and output requirements. *Context engineering* — selecting and organising the information the model can see. *Harness engineering* — designing the surrounding system that supplies tools, state, permissions, validation and execution control. There is no single authoritative definition of the last term (as of October 2026): Anthropic defines an "agent harness (or scaffold)" as the system that enables a model to act as an agent — processing inputs, orchestrating tool calls, returning results — and notes that evaluating "an agent" means evaluating harness and model together; OpenAI used "harness engineering" (February 2026) for engineers designing environments, specifying intent and building feedback loops for coding agents; practitioners summarise it as "everything that isn't the model". *Loop engineering* is an even newer practitioner term for designing the loop that repeatedly prompts, checks and re-runs agents — defined in Section 5. These practices overlap, but they are not interchangeable.
**Transition:** The last layer in every harness is a human reviewing the output. Let's look at how to review well.
**Sources:** s3anthropic2026evals — definition of agent harness/scaffold; harness and model are evaluated together. s3openai2026harness — "harness engineering": design environments, specify intent, build feedback loops; enforce constraints mechanically. s3osmani2026harness — practitioner synthesis: a harness is the code, configuration and execution logic that isn't the model. s3openai2026structured — schema-enforced outputs as an application-level check.
-->

---
section: 3
layout: artifact
clicks: 3
sources: [s3huang2024selfcorrect, s3openai2026harness, s3anthropic2026halluc]
---

::title::
# Verify, then correct precisely

::default::
<ReviewLoop />

<!--
**Time:** ~1 min
**Objective:** Close the loop: verify outputs against sources, requirements and format, then give targeted corrections rather than asking for a regeneration.
**Say:** Draft v1 fails two checks: the spend figure is wrong and the decision section is missing. Now two ways to respond. On the left, "that's not right, try again". The model has no idea what was wrong, so it re-rolls the whole draft: it fixes one thing and breaks another, and you must re-check everything every round. On the right, a targeted correction: which figure, from which source, what to add, and "change nothing else". One round, all checks pass, and the reviewer only needs to confirm two changes. Then a person signs it off.
**Example:** Reviewing an AI-drafted contract summary: "Clause 7.2 says 60 days, not 30 — correct that line only" beats "this isn't accurate, redo it".
**Notice:** Red highlights are new or remaining errors; green are fixes. The left lane's v3 even fixes the figure by luck while breaking the length.
**Caveat:** Research on "intrinsic self-correction" found models often fail to correct their own reasoning without external feedback, and performance sometimes got worse after self-correction (Huang et al., ICLR 2024). External feedback — a failed check, a named source — is what makes iteration converge. OpenAI's harness-engineering team reports the same lesson at system level: when something failed, the fix was almost never "try harder" but asking what capability or check was missing. The check results shown are simulated.
**Transition:** That completes the context stage of the journey. Next section: tools and AI-enabled browsers — what changes when the model can reach beyond the prompt.
**Sources:** s3huang2024selfcorrect — LLMs struggle to self-correct without external feedback; performance can degrade. s3openai2026harness — failures are fixed by adding missing capability and enforceable checks, not "try harder". s3anthropic2026halluc — iterative refinement and verifying each claim against quotes. Drafts are fictional.
-->
