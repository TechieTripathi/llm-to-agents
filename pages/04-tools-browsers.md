---
section: 4
layout: artifact
clicks: 2
sources: [anthropic2024agents, greshake2023, s8owasp2025llm06]
---

::title::
# From chatbots to AI&#8209;enabled workspaces

::default::
<CapabilityLadder />

<style>
.head h1 { max-width: none !important; }
</style>

<!--
**Time:** ~1.5 min

**Objective:** Participants can place any AI tool on one of three rungs (conversation, tool-assisted work, multi-step execution) and say what extra control each rung needs.

**Say:** So far we have treated the model as something you talk to. In practice, most AI products now sit on top of the model and give it reach: web search, your files, a code sandbox, a browser, your signed-in apps. I find it useful to think of a ladder. On the bottom rung the assistant only sees what you paste and what it learned in training; the main risk is a fluent answer that is wrong or out of date, and the control is simply you reading it. On the middle rung it can search, read documents and run calculations — so it can cite and compute, but it can also pick up weak or planted sources, and your data leaves your hands. On the top rung it plans and acts over many steps in a browser or in apps with your access; now mistakes become actions, and they compound.

**Example:** "Draft a reply to this customer" is rung one. "Find our refund policy and draft a reply that quotes it" is rung two. "Find the order, issue the refund and email the customer" is rung three — and that is the one you would never let a new colleague do unsupervised on day one either.

**Notice:** Click through: each click lights the next rung. The bottom row — "Control you add" — grows from "check every line" to "least privilege, approval before acting, logs".

**Ask:** Which rung are the AI tools in your organisation on today?

**Caveat:** The rungs are a teaching simplification, not product categories. Many products span rungs, and vendors move features between them quickly — that is the next slide. Anthropic's "Building effective agents" describes the same building block: a model augmented with retrieval, tools and memory, then composed into workflows or agents.

**Transition:** Let's look at the actual product categories you will meet on rung two and three.

**Sources:** anthropic2024agents — augmented LLM with retrieval/tools; workflows vs agents. greshake2023 — retrieved content can carry indirect prompt injection (the "planted sources" risk). s8owasp2025llm06 — excessive functionality, permissions and autonomy; human approval for high-impact actions.
-->

---
section: 4
layout: artifact
clicks: 3
sources: [s4googleaioverviews, s4googleaimode, s4bing2025copilotsearch, s4openaisearch, s4openaideepresearch, s4geminideepresearch, s4perplexityresearch, s4clauderesearch, s4chromeautobrowse, s4claudechromega2026, s4comet2025, s4edge2026, s4openairelnotes2026]
scale: 0.94
---

::title::
# Search, research and browser AI overlap

::default::
<ToolLandscape />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~2 min

**Objective:** Distinguish three categories — AI-enhanced search, research assistants, browser-integrated AI — and see that their capabilities overlap, so you choose by job, not by brand.

**Say:** Three kinds of tool are easy to confuse. AI-enhanced search is still search: it finds pages and puts an AI summary with links on top — Google's AI Overviews and AI Mode, Copilot Search in Bing, ChatGPT search. Research assistants, often called "deep research", run many searches for you and hand back a long report with citations — ChatGPT deep research, Gemini Deep Research, Perplexity's and Claude's Research modes. Browser-integrated AI lives in the browser: it can read the page you have open and, increasingly, click and type for you — Gemini in Chrome, Claude in Chrome, Perplexity's Comet browser, and Microsoft Edge's "Browse with Copilot". The columns show where they overlap. The shaded column, "clicks and types", is where the risk changes character: from reading to acting.

**Example:** Need the official page for a regulation? Search. Need a reading list and first draft on "how are other logistics firms using route optimisation"? A research assistant. Need to fill in the same supplier portal form twenty times? That is where a browser agent might help — with the boundaries we will set on slide 32.

**Notice:** Click 4 shows how much changed in 2026 alone: OpenAI retired its Atlas browser (it stopped working on 9 August 2026) and moved browser-based agent work into ChatGPT; Microsoft retired Edge Copilot Mode in May 2026 and renamed its actions feature "Browse with Copilot" (US, Microsoft 365 Premium); Claude in Chrome became generally available on all paid Claude plans in August 2026; Chrome's agentic "auto browse" is still labelled experimental and limited to paid plans in a few countries. That churn is the reason to learn categories, not product menus.

**Ask:** Which of these do people in your team already use — officially or not?

**Caveat:** Product facts verified on official vendor pages on 13 October 2026; they will change. The dots are my categorisation of typical capability, not a vendor feature list — "in some products" means at least one listed product does it, often only on paid plans or in limited regions. Google's own help page says AI Overviews "can and will make mistakes". Not listed: general agents that run their own virtual browser (for example ChatGPT agent mode); they behave like the browser row.

**Transition:** Whichever tool you use, the core skill is the same: compare what the sources actually say.

**Sources:** s4googleaioverviews, s4googleaimode — AI Overviews/AI Mode give AI answers with links; "can and will make mistakes". s4bing2025copilotsearch — Copilot Search in Bing. s4openaisearch — ChatGPT search on all plans. s4openaideepresearch, s4geminideepresearch, s4perplexityresearch, s4clauderesearch — research modes producing cited reports. s4chromeautobrowse — Chrome auto browse experimental, US, AI Pro/Ultra. s4claudechromega2026 — Claude in Chrome GA on paid plans (26 Aug 2026). s4comet2025 — Comet free worldwide (Oct 2025). s4edge2026 — Copilot Mode retired, Browse with Copilot (13 May 2026). s4openairelnotes2026 — Atlas deprecated 9 Jul 2026, stopped working 9 Aug 2026.
-->

---
section: 4
layout: artifact
clicks: 3
lede: 'Should Kestrel pilot Plover Routing? Four claims, three sources.'
sources: [s3liu2023verifiability, s4jazwinska2025cjr]
---

::title::
# Compare sources claim by claim

::default::
<SourceComparison />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~1.5 min

**Objective:** Summarise several sources by extracting claims and checking each against each source — keeping disagreement visible and citations attached.

**Say:** When you ask an AI to "summarise these three documents", you usually get a smooth paragraph that hides disagreement. A better instruction is: list the claims, then tell me for each source whether it supports, contradicts or says nothing. Here Kestrel is considering a route-planning vendor. The vendor's case study supports every claim — of course it does. Add an independent analyst review and two claims become disputed. Add a reference call with another customer and the go-live claim collapses. The final column turns the matrix into a decision: three disputed, one agreed. And every sentence that goes into the brief keeps its source IDs.

**Example:** Fuel savings: the vendor says 12%, the analyst saw 4–7%, the customer did not measure. A good brief says "4–12%, only the vendor reports 12%" — not "about 12%".

**Notice:** Click any cell to read the evidence behind it. A "Silent" cell is not support. Watch which source type each column is: vendor, independent, first-hand.

**Ask:** Where in your work does a single vendor or a single report quietly become "the answer"?

**Caveat:** The matrix is only as good as the extraction — check that the AI quoted each source accurately, which is the next slide's topic. AI search tools have a documented citation problem: a 2023 Stanford audit of four generative search engines found only 51.5% of generated sentences fully supported by their citations, and only 74.5% of citations supported their sentence; a 2025 Tow Center test found eight AI search tools collectively gave incorrect answers to more than 60% of news-citation queries. These are specific studies of specific tools at specific times — use them as a reason to check, not as a current error rate.

**Transition:** Comparing sources starts with extracting the right facts from each one.

**Sources:** s3liu2023verifiability — 51.5% / 74.5% figures (Bing Chat, NeevaAI, Perplexity, YouChat; 2023). s4jazwinska2025cjr — collectively incorrect on >60% of 1,600 queries (CJR/Tow Center, March 2025). Matrix content is fictional (Plover Routing and Fenwick Logistics Review are invented).
-->

---
section: 4
layout: artifact
clicks: 3
lede: Every extracted field should point back to the words it came from.
---

::title::
# From documents to structured data

::default::
<DocExtraction />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~1.5 min

**Objective:** Use AI to turn policies, reports and notes into structured fields — and insist every field is traceable, conflicts are flagged and missing values stay empty.

**Say:** One of the most reliable everyday uses of a language model is extraction: read a document and fill in a fixed set of fields — dates, owners, thresholds, who approves what. It turns pages into something you can sort, filter and compare. But you need three rules. One: each field points to the words it came from, so a person can check it in seconds. Two: when the document disagrees with itself, flag it — do not let the model quietly pick one. Three: if it is not in the text, the field stays empty. A model that "helpfully" fills a review date from general knowledge has just invented policy.

**Example:** Kestrel's haulier policy says approvals are needed above €25,000; a review note says Finance wants €20,000. The extraction keeps 25,000 — what the policy currently says — and flags the conflict for a person.

**Notice:** Click 1: the date was normalised to a standard format. Click 2: "approver" is the role only — the document names no person, so none is added, even though we know who the Operations director is. Click 3: the conflict highlights both passages. Click 4: review_date is null. Click any field yourself.

**Ask:** Which documents in your area would be more useful as a table?

**Caveat:** Ask for the output in a fixed schema (JSON or a table with named columns) and for the quoted source text alongside each value — that makes checking fast. Extraction quality drops with scanned PDFs, tables and long documents; spot-check a sample against the original before trusting a batch.

**Transition:** Numbers deserve an even stricter check — let's look at a spreadsheet.

**Sources:** None — conceptual; the policy is fictional Kestrel Freight data.
-->

---
section: 4
layout: artifact
clicks: 4
lede: Trace every figure to cells and a formula. Recompute from the raw data.
sources: [s4openaidataanalysis, s4anthropiccodeexec]
---

::title::
# Check the numbers, not the prose

::default::
<SpreadsheetTrace />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~1.5 min

**Objective:** Verify an AI-written summary of a table by tracing each figure to cells and a formula, and by recomputing headline numbers from the raw data.

**Say:** AI is good at writing a fluent summary of a table, and fluent summaries are exactly where wrong numbers hide. Here is September on-time delivery for Kestrel's six depots, and four sentences an AI wrote about it. Three are right. The second one is wrong in a classic way: it averaged the six percentages — 93.3% — and declared the network above target. But Westmoor shipped 860 parcels and Harbour 5,210; they should not count equally. Total on-time divided by total shipped is 92.5% — below target. The conclusion flips.

**Example:** The same slip turns up with average prices, average margins and average satisfaction scores — any time you average ratios built on different-sized groups.

**Notice:** Each click traces one sentence: the formula bar shows the formula, the cells it used light up. On click 3 the check recomputes from columns B and C, and the row-8 totals appear. On click 2 you can also press "Recompute from source data" yourself.

**Ask:** Which number in your last report would you most hate to get wrong?

**Caveat:** Data-analysis tools that run code are much better at arithmetic than a model "doing it in its head" — OpenAI's help centre says ChatGPT writes and runs Python for some analysis tasks, and tells you to review the generated code, outputs and assumptions before relying on the result; Anthropic's code execution tool likewise runs Python in a sandbox. But correct arithmetic on the wrong formula is still wrong — the error here is a method error, not a calculation error. The data is fictional and illustrative.

**Transition:** So far the AI has read and calculated. What happens when it can click?

**Sources:** s4openaidataanalysis — ChatGPT runs Python for analysis; review code, outputs and assumptions. s4anthropiccodeexec — Claude's sandboxed code execution for data analysis. Data is fictional.
-->

---
section: 4
layout: artifact
clicks: 6
sources: [s4anthropiccomputeruse, s4openaiagent2025, s4openaicomputeruse, s4anthropic2025injection, s4chromeautobrowse, s8owasp2025llm01, s8owasp2025llm06]
---

::title::
# Set the boundaries before the agent clicks

::default::
<BrowserActionSequence />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~1.5 min

**Objective:** Explain how browser agents ("computer use") work and why their permissions must be decided before the run: read freely within an allowlist, ask before sending or submitting, block payments and off-list sites.

**Say:** Browser agents and computer-use tools take screenshots, decide what to do, and then move the mouse and type — the same way you would. That makes them useful for web chores, and it means a mistake is now an action. Vendors are explicit about this. Anthropic's computer-use documentation recommends a dedicated virtual machine with minimal privileges, no access to sensitive data such as logins, an allowlist of domains, and a human to confirm anything with real-world consequences. OpenAI says ChatGPT agent asks permission before consequential actions such as purchases, and its API guide says screen content is untrusted and cannot grant permission. This simulated run shows those rules working: reading allowlisted sites is automatic; a hidden instruction on a page tries to send the agent to another site and is blocked; submitting a form waits for a person; "Buy now" is blocked outright.

**Example:** Think of a temp on their first day with your laptop: fine to look things up, ask before sending anything outside, never let them pay.

**Notice:** The left panel is the policy, written before the run. Each click adds one proposed action and lights the rule that decided it. On click 6 you can press Approve or Decline yourself.

**Ask:** For one web task you do every week, which steps would you put in "ask a person"?

**Caveat:** This is a simulated demonstration, not a product: the domains use the reserved .example name and nothing was called. Real products implement these controls differently and not always completely. Prompt injection is not solved: Anthropic reports that even a 1% attack success rate "still represents meaningful risk", and Google's Chrome help page says you are responsible for the agent's actions, including mistakes such as purchases. OWASP lists prompt injection (LLM01) and excessive agency (LLM06) among the top risks for LLM applications.

**Transition:** With all these options, how do you pick the right one for a task?

**Sources:** s4anthropiccomputeruse — precautions: VM, no sensitive data, allowlist, human confirmation; prompt-injection warning. s4openaiagent2025 — permission before consequential actions, watch mode, refuses high-risk tasks. s4openaicomputeruse — isolated browser, allow list, screen content untrusted, users control purchases and data transmission. s4anthropic2025injection — "1% ... still represents meaningful risk". s4chromeautobrowse — user responsible for agent actions; prompt-injection warning. s8owasp2025llm01, s8owasp2025llm06 — OWASP LLM01 and LLM06.
-->

---
section: 4
layout: artifact
clicks: 5
---

::title::
# Choose the simplest tool that does the job

::default::
<ToolDecisionTree />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~1 min

**Objective:** Choose between ordinary software, an agent, a data-analysis tool, document retrieval, web search and ordinary chat by asking a few questions about the task.

**Say:** Before choosing an AI tool, ask whether you need AI at all. If the task follows a fixed rule and must give the same answer every time — VAT on invoices, a monthly reconciliation — use a formula, a script or the system you already have. If it must change something in another system, you are on the top rung: an agent with least privilege and approvals. If the answer is in your numbers, use a tool that runs code. If it is in your documents, use retrieval over those documents. If it needs current public facts, search. Only when none of those apply is plain chat the right tool — drafting, rewriting, brainstorming.

**Example:** Each click walks the EU AI Act question: no fixed rule, no system to change, not our tables, not our documents, but it needs current, citable public information — so web search or a research assistant. That is our demonstration next.

**Notice:** Click the example chips — "Book rooms" lands on the agent, "VAT" on ordinary software. Or press "Your own" and answer the questions for a task from your week.

**Ask:** Pick one task from your week. Where does it land?

**Caveat:** This is a teaching heuristic, not a standard. Real tasks mix branches — a report may need your data and current public context. The order matters: the first "yes" usually points to the most predictable, cheapest and most testable option.

**Transition:** Let's take the EU AI Act question all the way to a brief.

**Sources:** None — conceptual.
-->

---
section: 4
layout: artifact
clicks: 3
sources: [s4euaiact2024, s4ecgpaiguidelines, s4euomnibus2026, s4ecaiact, s4ecgpaicode]
---

::title::
# Demonstration: from browser research to a brief

::default::
<ResearchBrief />

<style>
.head h1 { max-width: none !important; white-space: nowrap; }
</style>

<!--
**Time:** ~1.5 min (prepared fallback); allow ~4 min if run live in a longer session

**Objective:** Show the full research loop — plan, collect official sources, check an AI draft claim by claim, write a short brief where every sentence is cited — on a real, verifiable professional question.

**Say:** Here is a question a compliance or IT manager might genuinely be asked: when do the EU AI Act obligations for providers of general-purpose AI models apply? Plan first: go to the law and the Commission before blogs. Then collect and open the sources. Then let the AI draft an answer — and check it claim by claim. In our run, two of five claims were wrong: the draft said obligations start in August 2026, which is the Act's general date, not the GPAI date; and it said the 2026 "Digital Omnibus" postponed the GPAI deadlines, which it did not. The brief keeps only checked claims, cites each one, and is dated.

**Steps:**
1. Open a research assistant or AI search tool (any of slide 28's) and paste the question exactly as shown.
2. Ask: "Use only official EU sources (eur-lex.europa.eu, digital-strategy.ec.europa.eu). List each date with the article or page that supports it."
3. Open every cited link. For the Regulation, find Article 113 (application dates), Article 111(3) (models already on the market) and Article 101 (fines). On the Commission's "Guidelines for providers of GPAI models" page, find the three dates.
4. Ask: "Did the 2026 Digital Omnibus change any of these GPAI dates?" Check the answer against the Commission's AI Act page.
5. Ask for a five-bullet brief, one citation per bullet, dated today. Compare it with the prepared brief (click 4).

**Expected observations:** GPAI provider obligations applied from 2 August 2025 (Art. 113(b)); the Commission's enforcement powers, including fines up to 3% of worldwide annual turnover or EUR 15 million, apply from 2 August 2026 (Art. 101 is excluded from the 2025 date); models placed on the market before 2 August 2025 must comply by 2 August 2027 (Art. 111(3)). The Digital Omnibus on AI — Regulation (EU) 2026/1744, adopted as a proposal on 19 November 2025, politically agreed 7 May 2026, in force 27 July 2026 — moved high-risk dates (Annex III to 2 December 2027, Annex I to 2 August 2028) but left these GPAI dates unchanged. The GPAI Code of Practice was published 10 July 2025 and the Commission calls it "an adequate voluntary tool" to demonstrate compliance.

**Likely failure modes:** The tool states 2 August 2026 for everything (confuses the general application date). It cites a law-firm blog or news piece written before the Omnibus. It claims the Omnibus delayed GPAI obligations (confusing the high-risk delay). It gives a correct date with a citation that does not contain it. EUR-Lex sometimes shows a bot check or loads slowly. Live services may be rate-limited or require sign-in.

**Fallback:** Use the prepared state on this slide — clearly labelled "Prepared fallback — not live". Step through the four clicks and narrate as above. If asked for proof, open the Commission's GPAI guidelines page, which states all three dates on one page. Do not sign in or install anything live in the session.

**Notice:** Click 3 shows the two contradicted claims struck through, with the evidence that contradicts them. Click 4 shows the corrected brief; the corrected bullets are marked. Click any [A]–[E] citation to see its source.

**Caveat:** This is a worked example, not legal advice. Sources were checked on 13 October 2026; laws change — the Act itself was amended in July 2026. The AI draft is simulated; the sources and dates are real. Section 7 has a separate live research demonstration on a different topic.

**Transition:** That is the tools layer. Next, we give the model a goal and a loop — agents.

**Sources:** s4euaiact2024 — Arts 101, 111(3), 113 (dates, fines, transition). s4ecgpaiguidelines — "entered into application on 2 August 2025"; enforcement from 2 August 2026; pre-2025 models by 2 August 2027. s4euomnibus2026 — Regulation (EU) 2026/1744, in force 27 July 2026; high-risk dates moved; GPAI dates unchanged. s4ecaiact — timeline and Omnibus adoption/agreement/entry-into-force dates. s4ecgpaicode — Code published 10 July 2025; "an adequate voluntary tool".
-->
