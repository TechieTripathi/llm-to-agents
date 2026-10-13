---
section: 5
layout: artifact
clicks: 4
sources: [anthropic2024agents, yao2023react]
lede: "A model-based system that picks actions through tools, reads the results, and repeats until it should stop."
---

::title::
# What is an AI agent?

::default::
<AgentArchitecture />

<!--
**Time:** ~1.5 min
**Objective:** Participants can define an agent in one sentence and name its parts: goal, model, context, tools, loop, stop rule, and the application around it.
**Say:** Until now the model has answered one request at a time. An agent is a system built around a model that pursues a goal over several steps: it chooses an action from the tools it has been given, looks at what came back, and decides again. Click through the four reveals: first the parts, then the loop, then the stop rule, then the boundary that matters most — the application that actually runs the tools and enforces limits. The last click separates two designs that are often both called "agents". In a workflow, your code fixes the path; in an agent, the model chooses the next step each time.
**Example:** Priya Nair asks for this week's Project Lark report. A workflow would always fetch tickets, then budget, then draft. An agent decides what it still needs from what it has already found — and can stop to ask when something is wrong.
**Notice:** The model never touches the tools directly; every action crosses the application boundary. The email tool is drawn differently because sending needs approval — we return to that on the approval slide.
**Ask:** Which of your recurring tasks has a fixed path, and which needs the next step to depend on what you find?
**Caveat:** "Agent" is used loosely in marketing. Many useful products are workflows with a model inside, and Anthropic's guidance recommends starting with the simplest design that works. All tools and names here are fictional.
**Transition:** If the model is the same, what really changes between a chat assistant, a tool-using system and an agent?
**Sources:** anthropic2024agents — definitions of workflows (predefined code paths) versus agents (the model directs its own process and tool use); agents get "ground truth" from the environment at each step. yao2023react — the interleaving of reasoning and actions with observations from the environment that underlies the loop.
-->

---
section: 5
layout: artifact
clicks: 5
sources: [anthropic2024agents]
lede: "Same kind of model inside. What changes is who decides the next step."
scale: 0.94
---

::title::
# Chat, tools or agent?

::default::
<ChatToolAgentMatrix />

<!--
**Time:** ~1.5 min
**Objective:** Participants can tell the three kinds of system apart by who decides, what the system can see and change, how it fails, and what control it needs.
**Say:** Read the example row first: three requests at Kestrel, from rewriting a paragraph to preparing and routing a whole report. Each click answers one question for all three columns. The key row is the first: in a chat, you decide every next step; in a tool-using system, you or fixed code decide and the model fills in a structured call; in an agent, the model chooses the next step within limits you set. As the right-hand column gains reach, its failures change shape — a wrong sentence becomes a wrong action — and the controls must grow with it.
**Example:** A chat assistant can only be wrong on screen. An agent with write access to the tracker can close the wrong ticket or email the wrong list.
**Notice:** The bottom row. Control requirements rise in step with autonomy; that is the theme of the rest of this section.
**Ask:** Which column does the AI tool you use most sit in today?
**Caveat:** These are categories on a spectrum, not product names; one product can offer all three modes. The bars show relative autonomy for teaching, not a measurement.
**Transition:** Let's open up the middle column and see what actually happens in one tool call.
**Sources:** anthropic2024agents — the distinction between predefined code paths (workflows) and model-directed processes (agents) behind the "who decides" row. Remaining rows are conceptual.
-->

---
section: 5
layout: artifact
clicks: 6
sources: [s5openaifc2026, s5anthropictools2026, s5mcpspec2026]
lede: "The model only proposes. Your application checks, runs and returns the result."
---

::title::
# Tools and function calling

::default::
<ToolCallTrace />

<!--
**Time:** ~2 min
**Objective:** Participants understand that a model does not have access or permissions by itself: it emits a structured request, and the surrounding application decides whether to execute it.
**Say:** Step through the trace. The application sends the request together with tool descriptions — the model only sees a description. The model replies with a structured proposal: a tool name and arguments in JSON. Nothing has run yet. Your code checks it against the schema and the agent's permissions, runs it with the application's own credentials, and sends the result back. Only then does the model continue. Now press "Make the model ask to close a ticket": the model proposes an action it was never given, the check fails in code, nothing reaches the tracker, and the model receives an error and routes the decision to a person.
**Example:** It is like a junior colleague filling in a purchase request: writing the form does not spend any money. Finance checks it and makes the payment — or refuses.
**Notice:** The credentials line: "agent-lark-readonly" belongs to the application, not the model. The block in the forbidden run happens before any request is made.
**Ask:** If your organization connected an assistant to a system tomorrow, whose account would its calls run under?
**Caveat:** Field names are simplified; OpenAI and Anthropic APIs differ in detail. With some providers' built-in "server tools" (for example web search), the provider's infrastructure executes the call instead of your code — still not the model itself. The Model Context Protocol standardizes how applications connect tools, and its specification says hosts must obtain explicit user consent before invoking any tool, while noting the protocol cannot enforce this itself. Everything here is simulated, as of October 2026.
**Transition:** One call is easy. Real tasks need many — so how does an agent decide which calls, in what order?
**Sources:** s5openaifc2026 — the five-step flow (model returns a tool call; application executes it and sends the output back) and strict schema adherence. s5anthropictools2026 — Claude returns a tool_use block; for client tools your application executes it and returns a tool_result; server tools run on Anthropic's infrastructure. s5mcpspec2026 — MCP as an open protocol for tools; the consent principle for tool invocation.
-->

---
section: 5
layout: artifact
clicks: 3
sources: [huang2024planning, yao2023react]
lede: "Break a broad goal into steps you can check. Expect to revise the plan when facts change."
---

::title::
# Planning and decomposition

::default::
<TaskDecomposition />

<!--
**Time:** ~1.5 min
**Objective:** Participants can break a broad goal into smaller steps, each with a verifiable "done when" check, and see why plans must be revised when new information arrives.
**Say:** The goal is broad: a weekly report for Helen Brooks by Friday noon. The first click attaches a check to every step — something a tool or a person can verify, such as "counts match the tracker export". Without checks, "done" just means the model stopped writing. The next click brings new information mid-run: milestone M3 has slipped by two weeks. One check no longer holds. The last click revises the plan: re-plan the dates and add a schedule-risk section confirmed by Daniel Okafor. The goal did not change; the plan did.
**Example:** A good project manager does the same: the plan is a living document, the deliverable is fixed.
**Notice:** The amber step and its failed check, then the "revised" and "added" tags. Revision is triggered by an observation, not by the model's mood.
**Ask:** For a report you write regularly, what would your "done when" checks be?
**Caveat:** Research surveys group agent planning into task decomposition, plan selection, external planners, reflection and memory; none guarantees a correct plan, and models can produce confident but unworkable plans. Keep a person able to see and edit the plan for anything important. Fictional data.
**Transition:** Planning sets the steps; the loop is how each step actually gets done and checked.
**Sources:** huang2024planning — survey taxonomy of LLM-agent planning: task decomposition, plan selection, external modules, reflection and memory. yao2023react — reasoning traces help the model induce, track and update action plans and handle exceptions.
-->

---
section: 5
layout: artifact
clicks: 11
sources: [yao2023react, anthropic2024agents]
lede: "Observe, decide, act, inspect, validate. Then continue, or stop."
---

::title::
# The observe–decide–act loop

::default::
<AgentLoopSimulator />

<!--
**Time:** ~2.5 min
**Objective:** Participants can follow an agent through observe, decide, act, inspect and validate, and recognize both stop conditions: goal met, or blocked and escalated.
**Say:** This is a simulated run of the Lark report agent. Run A first. Observe: read the goal and current state — nothing gathered yet. Decide: propose a read-only tracker call. Act: the harness runs it. Inspect: look at what came back — complete and dated yesterday. Validate: check against the success criteria, record it, and continue. Two more loops collect the budget and the dates, then the stop rule fires: every figure traces to a tool result, so the draft goes to Priya for approval. Nothing is sent. Now Run B, same task on a bad day: the budget system answers 503. Validation fails; the error looks temporary, so the policy allows a bounded retry — at most two, with a pause. Both fail. The loop stops and escalates to Mei Chen in finance, and it does not guess a figure.
**Example:** A diligent analyst does exactly this: ask, check the answer, write it down, decide what's next, and phone finance when their system is down rather than inventing a number.
**Notice:** The task-state chips under the card, the call counter in the center, the retry arc lighting up in Run B, and the two different stop boxes.
**Ask:** In your work, what would count as "blocked — ask a person" for an agent?
**Caveat:** Real agents do not run these stations as separate programs; observe, decide and act are often one model response plus the harness's checks. The labels make the responsibilities visible. All tool responses are simulated; no real system was called.
**Transition:** Run B showed one way to handle failure. Not all failures should be handled the same way.
**Sources:** yao2023react — interleaving reasoning with actions and observations, the basis of the loop. anthropic2024agents — agents gain ground truth from the environment at each step, may pause for human feedback when blocked, and commonly use stopping conditions such as a maximum number of iterations.
-->

---
section: 5
layout: artifact
clicks: 5
sources: [shinn2023reflexion, anthropic2024agents]
lede: "Retrying only helps when the cause can clear. Otherwise change the action or ask a person."
---

::title::
# Feedback and recovery

::default::
<FailureRecovery />

<!--
**Time:** ~2 min
**Objective:** Participants can classify a failure as temporary, a data problem, or not permitted, and choose the right response: bounded retry, a changed action, or escalation.
**Say:** Three simulated failures, each shown first as a naive loop and then as an engineered one. A timeout is temporary: retrying can work, but only with a limit and a pause — the naive loop hammers the system forty times. A budget total that disagrees with its line items is a data problem: calling the same tool again returns the same mismatch every time, because the cause has not changed. The engineered loop changes the action — fetch the line items, find the €14k pending invoice, and flag both figures for Mei Chen. A permission denial is not recoverable by the agent: the naive loop retries and then hunts for an old copy on a shared drive, which is working around a control. The engineered loop stops and asks Priya.
**Example:** If a colleague's login is refused, you do not want them trying a different door.
**Notice:** The middle tab: three identical red attempts. Same input, same cause, same error.
**Ask:** Which failures in your processes are temporary, and which mean "stop and ask"?
**Caveat:** Research such as Reflexion shows agents can use feedback about a failure to change later attempts, but they can also misdiagnose the cause. Classification rules belong in the harness, not only in the prompt. Numbers and names are fictional.
**Transition:** Recovery depends on remembering what has already happened — which brings us to context and state.
**Sources:** shinn2023reflexion — agents that reflect verbally on task feedback and keep it in memory improve subsequent attempts (support for "use feedback to change the next action"). anthropic2024agents — pausing for human feedback when encountering blockers; stopping conditions.
-->

---
section: 5
layout: artifact
clicks: 3
sources: [s3anthropic2025context, anthropic2025harness, liu2024lost]
lede: "Four places information lives during a multi-step run. Not all of it survives."
---

::title::
# Context is not state

::default::
<AgentStateDiagram />

<!--
**Time:** ~1.5 min
**Objective:** Participants can distinguish working context, explicit state, retrieved memory and persistent storage, and explain what may be lost when context is compacted.
**Say:** Working context is what the model reads on this step — it is limited and gets trimmed. Explicit state is a structured record the harness keeps for the whole run: the checklist, the figures, retries used. Retrieved memory is notes or past documents found by search when relevant, across runs. Persistent storage is the system of record: tracker, drafts, audit log. Click: the context is nearly full, so older turns are compacted into a summary. Click: the summary kept "€628k" but dropped Mei's caveat that October is provisional — so the draft reports a provisional figure as final. Click: the fix is in the harness — caveats and decisions are written to explicit state when they arrive, so they survive compaction.
**Example:** Meeting notes versus memory: if a decision only lived in someone's head during a long meeting, it may not make it into the minutes.
**Notice:** The context meter dropping, the struck-through caveat, and the same caveat reappearing in the explicit-state column.
**Ask:** Where do the caveats in your reports live today — in a document, or in someone's head?
**Caveat:** Products implement memory and compaction differently, and a larger context window does not guarantee reliable use of everything in it. Anthropic's engineering notes warn that overly aggressive compaction can lose subtle but critical context, and that a new session starts with no memory unless the harness provides it. Fictional example.
**Transition:** If state and stopping rules matter this much, they need to be designed on purpose. That is loop engineering.
**Sources:** s3anthropic2025context — compaction (summarizing a context near its limit) can lose subtle but critical details; structured notes persisted outside the context window. anthropic2025harness — sessions start with no memory; progress files and feature lists carry state between them. liu2024lost — models use information in long contexts unevenly, so presence in context is not the same as reliable use.
-->

---
section: 5
layout: artifact
clicks: 4
sources: [anthropic2024agents, s5openaiagentsrun2026]
lede: "Design how the loop measures progress and how every run ends — before it starts."
---

::title::
# Loop engineering

::default::
<LoopEngineering />

<!--
**Time:** ~1.5 min
**Objective:** Participants can specify a loop's success criteria, per-step checks, retry limit, budget and safe-stop behavior, and trace the four ways a run can end.
**Say:** "Loop engineering" is not an established technical term; in this workshop it simply means designing how a loop measures progress and how it stops. On the right is a loop spec for the Lark report: what "done" means, what is checked after every step, how many retries are allowed and what must change between them, the budget, who gets escalations, and what a safe stop does. Click through the four runs. Passes: checked steps until every criterion holds. Fails once: one retry with a change, then success. Keeps failing: retries run out and a person gets the problem with the reason. Out of budget: the loop stops safely even though it is not finished, saves its state, and says why.
**Example:** Agent SDKs expose these as settings — for example, the OpenAI Agents SDK raises an error when a run exceeds its maximum number of turns.
**Notice:** Every path ends in a box. There is no path that loops forever.
**Ask:** What would "done" mean, measurably, for one task you would hand to an agent?
**Caveat:** The limits shown (2 retries, 30 calls, 15 minutes) are illustrative, not recommendations; set them from your own task and risk. Success criteria the agent cannot check itself need a human or a separate validator.
**Transition:** These rules only work if something outside the model enforces them — the harness.
**Sources:** anthropic2024agents — stopping conditions such as a maximum number of iterations to maintain control. s5openaiagentsrun2026 — the max_turns limit; exceeding it raises MaxTurnsExceeded.
-->

---
section: 5
layout: artifact
clicks: 7
sources: [s8owasp2025llm06, s5openaifc2026, s5openaiagentsrun2026, anthropic2025harness]
lede: "For dependable agents: runtime controls around the loop, each placed where it acts."
scale: 0.94
---

::title::
# Harness engineering

::default::
<AgentHarnessStack />

<!--
**Time:** ~2 min
**Objective:** Participants can name the runtime controls around an autonomous agent, where each one acts in the loop, and what each prevents.
**Say:** Earlier, in Section 3, the harness wrapped a single model call. With an agent the harness must govern a loop that runs many steps on its own. Each click attaches one control where it acts. Permissions sit on the call: the Lark agent can read data and write drafts, nothing else. Schemas sit on the call too: a call that does not match the declared shape never runs. Validation sits on the result. Budgets wrap the whole loop. State is saved after every step so a crash does not mean starting again — or sending twice. Error handling decides between retry, change and escalate. The audit log sits under everything, so afterwards you can explain what happened and who decided.
**Example:** Think of a new contractor: limited building access, a standard form for requests, someone checking the output, a time budget, a project log, and a manager to call when stuck.
**Notice:** The "Prevents" line for each control. If you cannot say what a control prevents, you may not need it; if you cannot name the control that prevents a failure you fear, you have a gap.
**Ask:** Which of these seven exists today for the AI tools your team already uses?
**Caveat:** None of these controls makes an agent safe on its own; they reduce and contain risk. OWASP notes that logging does not prevent excessive agency but limits the damage. Configuration values are fictional.
**Transition:** One control deserves its own slide: a person deciding before a consequential action.
**Sources:** s8owasp2025llm06 — minimize permissions, authorize in downstream systems, log and monitor, rate-limit. s5openaifc2026 — strict mode ensures calls adhere to the declared JSON schema. s5openaiagentsrun2026 — turn limits as a run budget. anthropic2025harness — the agent harness, and progress files and commits that carry state across sessions.
-->

---
section: 5
layout: artifact
clicks: 4
sources: [s8owasp2025llm06, s5nistleastprivilege, s5openaihitl2026]
lede: "Least privilege by default. A named person for consequential actions. A record of both."
---

::title::
# Human approval gates

::default::
<ApprovalGate />

<!--
**Time:** ~2 min
**Objective:** Participants understand least privilege, approval for consequential actions, stopping conditions and auditability, and see an approval gate block an action until an authorized person decides.
**Say:** The agent has prepared the customer version of the report and proposes sending it to 23 external recipients — an action that cannot be undone. The gate holds it. Click: the agent tries to send anyway; the harness blocks it because no approval is on record, and the attempt is logged. Click: Priya requests a change — remove the internal cost table from the customer version. Click: the agent revises to version 2 and proposes again. Click: Priya approves version 2, the gate opens, and the send executes — simulated here. The audit log shows who did what, when, to which version.
**Example:** The same principle as two-person approval for payments: the person who prepares does not authorize.
**Notice:** The agent cannot approve itself, and approval attaches to a version. If the draft changes after approval, the approval should not carry over.
**Ask:** Which actions in your processes are irreversible or external enough to need this gate?
**Caveat:** Approval only works if the approver has time and information to decide — a gate that is always clicked through becomes theatre. Keep gates for consequential actions, and use least privilege so routine steps never need them. Agent SDKs support this pattern; for example, the OpenAI Agents SDK can pause a run on tools marked as needing approval until a person approves or rejects. Everything here is simulated; nothing was sent.
**Transition:** Now put every piece together into one workflow you can design yourself.
**Sources:** s8owasp2025llm06 — LLM06:2025 Excessive Agency: excessive functionality, permissions and autonomy; mitigations include human-in-the-loop approval of high-impact actions and authorization in downstream systems. s5nistleastprivilege — least privilege: minimum authorizations needed to perform a function. s5openaihitl2026 — approval-required tools pause the run; approve or reject; the run resumes.
-->

---
section: 5
layout: artifact
clicks: 7
sources: [anthropic2024agents, s8owasp2025llm06]
lede: "The weekly Lark report, end to end, with checks and a human decision."
scale: 0.94
---

::title::
# Design a controlled workflow

::default::
<WorkflowBuilder />

<!--
**Time:** ~2 min
**Objective:** Participants can lay out a controlled agentic workflow — request, retrieve authorized data, draft, validate, approve, deliver — with inputs, outputs, failure rules and owners for each stage, and explain what is lost when a safeguard is removed.
**Say:** This is the whole section in one picture. Six stages; the first six clicks walk them, showing what each needs, what it produces and when it fails. Four are automated, two belong to people: the request and the approval. Click: remove "Validate figures" — the safeguard count drops and a warning explains that a wrong total now reaches Helen as fact. Click: switch "Approve" to the agent — another warning: an agent approving its own work is not an approval. You can restore stages, remove "Get authorized data", or hand validation to a person and see the trade-off.
**Example:** For your own task, write these six rows on a single page before choosing any tool.
**Notice:** Failure rules are part of each stage, not an afterthought; and the safeguard count only counts validation and a human approval.
**Ask:** Pick one recurring report in your team. Which stage would you automate first, and which would you never automate?
**Caveat:** A workflow with fixed stages is often more reliable than a fully autonomous agent for a recurring task; use agentic steps only where the path really varies. The stages and rules are a fictional example, not a template for every organization.
**Transition:** Section 6 takes this pattern across departments — HR, finance, sales, operations, IT and management.
**Sources:** anthropic2024agents — workflows with predefined paths versus agents; start simple and add autonomy only when needed; human checkpoints. s8owasp2025llm06 — the risk of removing human approval for high-impact actions (excessive autonomy).
-->
