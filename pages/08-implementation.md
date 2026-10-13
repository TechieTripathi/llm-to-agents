---
section: 8
layout: artifact
clicks: 3
sources: [s8ncsc2023llmrisk, s8owasp2025llm02]
lede: Security and privacy start with what you share. Generic guidance; your policy decides.
---

::title::
# Decide before you paste

::default::
<DataSensitivityGuide />

<!--
**Time:** ~2 min

**Objective:** Participants can decide, before they paste anything, whether a piece of data belongs in a given AI tool, and know the four questions that decide it: approved tool, classification, retention, access.

**Say:** Every time you paste something into an AI tool, a copy leaves your hands. The UK National Cyber Security Centre put it plainly: your query is visible to the organisation that provides the model, and it is stored. So the decision happens before you paste, not after. Two things decide it: what kind of data it is, and whether your organisation has approved the tool. "Approved" matters because someone has checked the terms: whether your inputs are used for training, how long they are kept, and who can see them. This guide is generic, not legal advice. Your organisation's data classification and AI policy always win.

**Example:** Priya's Project Lark status notes are fine in Kestrel's approved enterprise tool. The same notes pasted into her personal chatbot account break policy, even if nothing bad ever happens to them.

**Notice:** Click through the tour (3 clicks). (1) Same internal document, different tool: the verdict flips from OK to Don't. (2) Customer personal data is "Check first" even in the approved tool: approving a tool is not approving every use of it. (3) Secrets are "Don't" everywhere; there is never a reason to paste a live API key. Any cell can be clicked to discuss it. The bottom line carries the four checks.

**Ask:** "Does everyone know where your organisation's AI policy lives, and who to ask about it?"

**Caveat:** Tool terms differ between products, plans and contracts, and change over time. Never assume a tool's data handling from its brand name; check the agreement your organisation signed. Rules for personal and regulated data depend on jurisdiction and sector and are out of scope here.

**Transition:** That is the data you choose to share. The next risk is the data an AI reads on its own, and what that data can make it do.

**Sources:**
- s8ncsc2023llmrisk: queries are visible to and stored by the LLM provider; NCSC recommends not including sensitive information in queries to public LLMs.
- s8owasp2025llm02: guide users away from entering sensitive data; least-privilege access to data; clear data-use, opt-out and retention policies.
-->

---
section: 8
layout: artifact
clicks: 4
sources: [greshake2023, s8owasp2025llm01, s8willison2025trifecta, s8ncsc2025injection, s8owasp2025llm06]
lede: Pages, emails and files can carry hidden orders. Treat them as data, not instructions.
---

::title::
# Prompt injection

::default::
<InjectionFlow />

<!--
**Time:** ~2.5 min

**Objective:** Understand indirect prompt injection: content an AI reads can try to redirect it. Know the design defences (treat retrieved content as data, least privilege, never combine private data + untrusted content + outbound action, approval for consequential actions) and that no complete technical fix exists today.

**Say:** A language model reads everything in its context as one stream of text. It has no reliable way to tell your instructions apart from instructions hidden inside a web page, an email or a PDF it was asked to read. Greshake and colleagues demonstrated this "indirect prompt injection" in 2023 against real LLM-integrated applications, including data theft. OWASP ranks prompt injection first (LLM01) in its 2025 Top 10 for LLM applications. Here, Mei asks for a summary of a supplier's page; the page hides a line telling the AI to email out Kestrel's rate sheet. Whether that works depends far less on the model than on how the agent is set up.

**Example:** Hidden instructions can sit in white-on-white text, an HTML comment, a document's metadata, an email footer or a calendar invite. A person never sees them; the model reads them like everything else.

**Notice:**
- Step 0: the user's harmless task and the page with the hidden line.
- Steps 1–2 (unsafe): the page is read as orders, the agent has broad access to files, mail and sending, and it emails the file out without asking. All three legs of Simon Willison's "lethal trifecta" are present: private data, untrusted content, the ability to send data out.
- Steps 3–4 (safer): the page is wrapped and labelled as untrusted data to summarise; the agent can read only this page; anything outbound waits for Mei's approval. One leg is removed and one is gated behind a person.

**Ask:** "Which AI tools at your work can both read your email and send email?"

**Caveat:** Be precise: there is no complete technical fix today. OWASP says it is unclear whether fool-proof prevention exists. The UK NCSC (December 2025) says current LLMs do not enforce a security boundary between instructions and data inside a prompt, that prompt injection may never be totally mitigated the way SQL injection can be, and that designers should reduce likelihood and impact with deterministic, non-LLM safeguards. Labelling content as untrusted helps but is not a guarantee, and detection filters miss rephrased attacks, which is why least privilege and human approval carry the weight.

**Transition:** Safe set-ups are a design decision. So how do you introduce AI across an organisation without betting on it? Start small and measure.

**Sources:**
- greshake2023: indirect prompt injection via retrieved data; demonstrated against real applications, including data theft.
- s8owasp2025llm01: definition, direct vs indirect; fool-proof prevention unclear; least privilege, human approval for high-risk actions, segregate external content.
- s8owasp2025llm06: excessive functionality, permissions and autonomy; limit tools and permissions; human approval for high-impact actions.
- s8willison2025trifecta: private data + untrusted content + external communication lets attackers exfiltrate data; avoid the combination.
- s8ncsc2025injection: no instruction/data boundary; may never be totally mitigated; reduce likelihood and impact.
-->

---
section: 8
layout: artifact
clicks: 5
sources: [anthropic2024agents, nist2023airmf, s8nist2024genai, s8iso42001]
lede: Bring AI into the organisation with one low-risk task, measured before anything scales.
---

::title::
# Start small and measure

::default::
<AdoptionRoadmap />

<!--
**Time:** ~2 min

**Objective:** Give participants a repeatable, low-risk way to introduce AI: choose, baseline, pilot, evaluate, decide at gates, improve, expand cautiously.

**Say:** The common mistake is to buy a tool, roll it out to everyone, and only then ask whether it worked. Reverse that. Choose one frequent, low-risk task and measure how it is done today; without a baseline you cannot tell an improvement from an impression. Gate 1 asks whether it is safe to try: approved tool, data class, a named owner and reviewer. Pilot with a few people for a fixed period, with every output reviewed. Then evaluate four things: time (including review time, which is where savings often shrink), quality, rework and risk. Gate 2 is a real decision: expand, improve first, or stop. Anthropic's guidance to agent builders says the same: start with the simplest solution and add complexity only when it demonstrably improves outcomes.

**Example:** Kestrel's status-report pilot (fictional, numbers illustrative): faster and better, but one wrong date slipped into a draft and was caught in review. So the decision is "Improve first": add a date check to the prompt and the reviewer checklist, re-test for two weeks, then expand to two more teams with the same measures.

**Notice:** Steps: (0) choose and baseline, (1) Gate 1 and pilot, (2) the four-measure scorecard, (3) Gate 2 decision rules, (4) the re-test loop and cautious expansion, (5) the same loop in NIST AI RMF terms.

**Ask:** "For the task you have in mind, what would your baseline number be: minutes, errors or rework?"

**Caveat:** All numbers are illustrative, not measured. The alignment of stages to NIST functions is a loose teaching mapping: NIST says its functions are not a checklist or an ordered set of steps, that Govern is cross-cutting, and that the process should be iterative. ISO/IEC 42001 is a management-system standard for organisations that want formal structure; a first pilot does not need it.

**Transition:** Now make it personal: one recurring task of your own.

**Sources:**
- anthropic2024agents: "finding the simplest solution possible, and only increasing complexity when needed"; measure performance and iterate.
- nist2023airmf: Govern, Map, Measure, Manage; iterative use; "AI systems should be tested before their deployment and regularly while in operation"; Govern includes accountability structures.
- s8nist2024genai: 12 risks unique to or worsened by generative AI, e.g. confabulation, data privacy, information security, human-AI configuration (over-reliance).
- s8iso42001: requirements for establishing, maintaining and continually improving an AI management system.
-->

---
section: 8
layout: artifact
lede: Your personal action plan. Fill it in now, then try it this week.
---

::title::
# Improve one recurring task

::default::
<ActionPlanTemplate />

<!--
**Time:** ~1.5 min

**Objective:** Each participant leaves with one concrete, low-risk task, with its inputs, output, risk level, verification method and success measure.

**Say:** Give everyone sixty seconds, on paper or in a notes app. The slide shows a finished example: Priya's weekly status report. Pick one task you do at least every week or month, that uses data you are allowed to put into an approved tool, and whose output you can check. Write down how you will verify it and the number that will tell you it worked.

**Example:** Priya: inputs are meeting notes, a tracker export and last week's report; output is a one-page report; she checks every date and owner against the tracker and Helen reviews; success is under 45 minutes with no corrections, four weeks running.

**Notice:** Click "Clear the form" and type a volunteer's task live. The checks on the right turn amber when something is missing; a success measure with no number is flagged ("Add a number"). Switching the risk level changes the advice: a high-risk task is not a first pilot.

**Ask:** "Would someone share their task? I'll type it in."

**Caveat:** What is typed stays in this browser only (localStorage); nothing is sent anywhere. Do not type confidential details on a shared presenter laptop. The risk level is self-assessed; use the data guide from the start of this section and your own policy.

**Print / blank version:** The PDF export shows the filled Kestrel example. For a blank handout, click "Clear the form" in the live deck and print the slide from the browser. If the form opens with leftover text from a rehearsal, click "Restore example": the stored copy is removed.

**Transition:** Let's close by putting the whole session on one line.

**Sources:** None. Conceptual; applies the two previous slides on data handling and measured pilots.
-->

---
section: 8
clicks: 6
---

# From model to verified workflow

<TakeawayJourney />

<!--
**Time:** ~7 min (about 1 min for the takeaways, about 6 min for questions)

**Objective:** Consolidate the five takeaways along the journey used throughout the deck, then open the discussion.

**Say:** This is the strip you have seen in the top corner of every slide, now full size. Click once per stage.
1. Model: LLMs generate and transform information. They are fluent, and fluency is not correctness.
2. Context: what you give the model (documents, examples, constraints) does more for relevance than clever wording.
3. Tools: search, browsers and connected apps extend what AI can reach and do, and they extend the risk with it.
4. Agent: agents coordinate multi-step tasks within the constraints you set: tools, permissions, budgets, stop conditions.
5. Verified workflow: validation, permissions and human accountability remain essential.
Click 6: the line under all five is the point of the day. You stay accountable at every step; the model does not.

**Example:** Priya's status report touches all five: a model drafts, her notes are the context, the tracker is a tool, an agent could assemble it, and Helen's review makes it a verified workflow.

**Notice:** The same five words as the journey strip; the last stage stays lit, and the accountability line spans all of them.

**Ask:** Open with the three prompts on the slide. Short answers to likely questions:
- "Will AI replace my job?" Talk about tasks, not jobs, and avoid forecasts nobody can support.
- "Which tool should we use?" Whichever your organisation has approved for your data; the four checks from the data guide are how to judge one.
- "Can we let an agent handle email?" Only with least privilege and approval for anything sent (the prompt-injection slide).
- "How do we prove it saves time?" Baseline first, and include review time (the roadmap slide).

**Caveat:** Products and policies change quickly; recheck capabilities and terms before relying on anything shown today.

**Transition:** Thank you. All sources are listed in the appendix that follows.

**Sources:** None. Summary slide; claims are sourced on the slides where they were made.
-->
