---
section: 1
layout: artifact
clicks: 6
lede: One weekly project update for the operations director, prepared two ways.
scale: 0.94
---

::title::
# The work has not changed; the way we do it has

::default::
<WorkflowCompare />

<!--
**Time:** ~2 min
**Objective:** Participants see that AI changes how a familiar task is done — not what the task is, who it is for, or who is accountable.
**Say:** Here is a task almost everyone in the room does in some form: a weekly status update. On the left, Priya — the project manager on Kestrel Freight's fictional Project Lark — does every step herself: chasing people, reading, writing, proofreading, sending. [click ×5] On the right, the same five stages with an AI assistant. Priya still gathers the sources. The assistant summarises what changed and drafts the update. Then Priya checks every claim against the sources, adds her judgement and sends it. [click] The deliverable, the reader and the owner are identical. What moved is where Priya spends her time: less on writing, more on checking and deciding.
**Example:** The same pattern applies to a monthly finance commentary, a sprint review or an HR policy summary: same output, same owner, new middle.
**Notice:** The blue "AI" markers appear only in the middle two stages. The green "Human review" outline sits on the last two stages of the AI-assisted path — review is a step in the process, not an optional extra. The shared bar at the bottom: same deliverable.
**Ask:** Which of your weekly tasks has a "gather → make sense → draft → check → send" shape?
**Caveat:** This is a fictional example; we make no claim here about how much time it saves. We measure that properly in Section 6 with the productivity calculator, where review and rework time count against the savings.
**Transition:** To see why this is possible now and was not ten years ago, let's take a very short tour of how AI got here.
**Sources:** None — fictional, conceptual example (Kestrel Freight universe).
-->

---
section: 1
layout: artifact
clicks: 8
lede: Select an era to see what changed and what it meant for work.
sources: [s1mccarthy1955, s1mcdermott1980, s1sahami1998, s1krizhevsky2012, vaswani2017, brown2020, s1bommasani2021, s1openai2022chatgpt, ouyang2022, lewis2020rag, s1schick2023, s1openai2023functions, yao2023react, anthropic2024agents]
---

::title::
# A short history of AI

::default::
<AiTimeline />

<!--
**Time:** ~2.5 min
**Objective:** Participants can place modern LLMs in a 70-year history and see that the big shifts are about where a system's knowledge comes from.
**Say:** Read the history as one question: where does the system's knowledge come from? [click] First, people wrote it down as rules. The field was named in a 1955 proposal for a Dartmouth summer study in 1956, and by 1980 expert systems such as R1 at Digital Equipment Corporation configured computer orders with 772 hand-written rules. [click] Then, instead of writing rules, we let systems learn patterns from labelled examples — the junk-mail filter is the classic case. [click] In 2012 deep neural networks trained on GPUs made a leap in image recognition: 15.3% top-5 error against 26.2% for the next-best entry. [click] In 2017 the transformer arrived, the architecture behind today's language models. [click] By 2020, GPT-3 showed that one very large pre-trained model could do new tasks from instructions and a few examples, without retraining; in 2021 researchers named these "foundation models". [click] On 30 November 2022 ChatGPT put that in a chat window anyone could use. [click] Since then the action has moved around the model: retrieving documents and calling tools. [click] And now agents: the model working in a loop — decide, act, check — until it is done.
**Example:** For each era, the "At work" line gives one concrete use — rule-based configuration, spam filtering, image recognition, translation, drafting, policy Q&A with citations, multi-system status reports.
**Notice:** The ruler at the top is to scale. The fan lines show how six of these eight shifts crowd into the last fourteen years. The bands underneath group eras by where the knowledge comes from.
**Ask:** Which of these eras is already inside tools you use every day? (Spam filtering is usually the answer nobody thinks of.)
**Caveat:** Eras overlap — rule-based software is still everywhere, and retrieval research (2020) predates ChatGPT; the timeline shows when each idea became prominent, not when the previous one ended. Dates are of the cited paper or announcement. The "2024 →" agents date marks when vendors published guidance for building agents; the ReAct research pattern dates from 2022. The AlexNet figures are from the ILSVRC-2012 competition as reported in the paper.
**Transition:** So what exactly changed with modern LLMs — and what belongs to the model versus the product around it?
**Sources:** s1mccarthy1955 — 1955 proposal, 1956 Dartmouth study, name of the field. s1mcdermott1980 — R1, 772 rules, VAX configuration. s1sahami1998 — Bayesian junk-mail filtering learned from labelled mail. s1krizhevsky2012 — 15.3% vs 26.2% top-5 error, ILSVRC-2012, GPU training. vaswani2017 — transformer, attention, machine translation. brown2020 — GPT-3, 175B parameters, no gradient updates. s1bommasani2021 — term "foundation models" (2021). s1openai2022chatgpt — launch 30 Nov 2022, free research preview, dialogue format. ouyang2022 — instruction-following via human feedback. lewis2020rag — retrieval-augmented generation (2020). s1schick2023 — Toolformer, tool use via APIs. s1openai2023functions — function calling in OpenAI's API, 13 June 2023. yao2023react — interleaved reasoning and actions (2022 preprint, ICLR 2023). anthropic2024agents — definition of agents, Dec 2024.
-->

---
section: 1
layout: artifact
clicks: 2
lede: Some abilities belong to the model. Many belong to the product around it.
sources: [ouyang2022, brown2020, s1openai2023gpt4, s1gemini2024, s5openaifc2026, s5anthropictools2026, lewis2020rag, s1anthropicdocs2026messages, anthropic2024agents]
scale: 0.94
---

::title::
# What changed with modern LLMs?

::default::
<ModelVsSystem />

<!--
**Time:** ~2 min
**Objective:** Participants distinguish what the model itself does from what the surrounding product or system provides — the single most useful mental model for the rest of the day.
**Say:** Five things changed in the models themselves. They follow instructions written in plain language. One model handles many different tasks without retraining. Many accept images as well as text. They can work with much longer inputs. And they can propose a tool call — a structured request to search, look something up, or run a calculation. [click] But much of what people experience as "the AI" is built by the product around the model: web search, access to your files, memory, actually running the tools, and permissions. The model only sees what the system puts into its context window. [click] Here is the key moment: the model asks — `search_files("risk log")` — and the system acts: it decides whether to run the search, runs it, and puts the result back into the context. The model never touches the file system itself.
**Example:** When an assistant "remembers" Priya's preferred report format, the model did not learn it — the product stored a note and sends it back with each request.
**Notice:** Select any item. The marker says whether it is the model, the system, or both. "Works with long inputs" is both: the model sets the maximum; the system decides what fills it.
**Ask:** Think of an AI tool you use. Which of its features would disappear if you called the bare model directly?
**Caveat:** Product features change fast and differ between vendors; this is a category-level description as of October 2026, not a feature list. A larger context window does not guarantee the model uses every detail well (see Section 2). Multimodal input depends on the specific model and on what the product lets you upload. The tool call and its result shown are simulated.
**Transition:** If the model is only one part of a system, when should a task be given to AI at all — and when is ordinary software still better?
**Sources:** ouyang2022 — instruction following from human-feedback fine-tuning. brown2020 — tasks from instructions and few examples, no retraining; GPT-3 context of 2,048 tokens. s1openai2023gpt4 — model that accepts image and text inputs. s1gemini2024 — recall over millions of tokens of context in research evaluations. s5openaifc2026 — the application executes the function the model requests. s5anthropictools2026 — client tools run in your application; server tools (e.g. web search) run on the provider's infrastructure; memory as a tool storing files you control. lewis2020rag — retrieving passages and adding them to generation. s1anthropicdocs2026messages — the API is stateless; the app resends the conversation. anthropic2024agents — LLM "augmented" with retrieval, tools and memory; human checkpoints.
-->

---
section: 1
layout: artifact
clicks: 2
lede: Deterministic software still wins when the rules are fixed and the answer must be exact.
sources: [anthropic2024agents, s1openaicookbookseed]
---

::title::
# From traditional software to AI-assisted workflows

::default::
<TaskFit />

<!--
**Time:** ~1.5 min
**Objective:** Participants can tell when a task belongs in deterministic software, in a natural-language assistant, or in a tool-mediated workflow.
**Say:** There are three ways to get work done with software now. Rules and forms — ordinary deterministic software: same input, same output, every time. A natural-language assistant — you chat with a model. And a tool-mediated workflow — a model connected to your systems, with checks around it. Start with payroll. It has fixed rules and one exact answer, so it belongs in payroll software. A model is fluent, not exact; model APIs are non-deterministic by default, and checking every figure would cost more than it saves. [click] Meeting notes are the opposite: messy language in, a structured list out — an assistant is a good fit, with a person checking owners and dates. [click] A complaint about a late delivery needs both language and live data: the workflow looks up the shipment, drafts the reply, and a person approves it.
**Example:** Expense claims are a hybrid: the rules engine decides on limits; a model can help explain a rejection in plain words.
**Notice:** The task profile chips above the columns — fixed rules, one exact answer, open-ended language, live data or actions. The verdict follows from those traits, not from how impressive the AI is.
**Ask:** Pick one task from your week. Which of the four traits does it have?
**Caveat:** The verdicts are teaching judgements for fictional tasks, not measured results. "Use with care" means possible with strong checks. Anthropic's own guidance recommends finding the simplest solution possible — which can mean not building an agentic system at all.
**Transition:** So when AI does fit, how do we build it up step by step? That is the journey for the rest of today.
**Sources:** s1openaicookbookseed — model APIs are non-deterministic by default; determinism not guaranteed. anthropic2024agents — "finding the simplest solution possible"; workflows offer predictability and consistency for well-defined tasks; sometimes not building agentic systems at all.
-->

---
section: 1
layout: artifact
clicks: 4
lede: Each section adds one layer around the last. The model in the middle never changes.
sources: [anthropic2024agents]
scale: 0.94
---

::title::
# The journey: from model to workflow

::default::
<JourneyDiagram />

<!--
**Time:** ~1 min
**Objective:** Participants hold a simple map of the day: model → context → tools → agent → workflow, each layer wrapping the previous one.
**Say:** This is the map for the rest of the workshop. In the middle is the model — it predicts text from the text it is given. That is Section 2. [click] Around it, context: the instructions, documents and examples you give it — Section 3. [click] Then tools: search, files and business systems, so the system can look things up and act — Section 4. [click] Then the agent: the model running in a loop, deciding the next step, acting, checking, until it is done or told to stop — Section 5. [click] And finally the workflow: putting all of it inside a real business process with validation, human approval, a named owner and a log — Sections 6 to 8. Notice that the model in the middle never changes. Most of the reliability you will get comes from the layers around it.
**Example:** Priya's weekly update from the start of the session: the model writes; the context is her tracker, notes and risk log; tools fetch them; an agent could gather and draft; the workflow makes sure she checks and approves before it is sent.
**Notice:** The current layer is highlighted in blue; the side notes show which section covers it. You will see this diagram again as we reach each layer.
**Ask:** Where does your team sit today — mostly model and context (chat), or already using tools?
**Caveat:** "Workflow" here means the business process around the AI. Anthropic's engineering guidance uses "workflow" more narrowly — LLMs and tools orchestrated through predefined code paths — in contrast to agents that direct their own steps. Both meanings appear in the literature.
**Transition:** Let's start at the centre: what is a large language model, actually?
**Sources:** anthropic2024agents — augmented LLM (retrieval, tools, memory) as the building block; definitions of workflows vs agents; human checkpoints and stopping conditions.
-->
