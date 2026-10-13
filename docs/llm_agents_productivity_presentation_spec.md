# From LLMs to AI Agents: Transforming Professional Productivity
## Artifact-First Presentation Build Specification

**Audience:** IT and non-IT industry professionals, specialists, managers, and business teams  
**Duration:** 120 minutes  
**Deck size:** Exactly 65 slides  
**Format:** 16:9 Slidev presentation (Vue 3 components for artifacts) with animations, interactive artifacts, diagrams, images, demonstrations, speaker notes, a static SPA build for offline delivery, and a shareable PDF export  
**Primary goal:** Teach professionals how to use LLMs, AI-enabled browsers, and agents to improve the speed, quality, and reliability of everyday work.

---

## 1. Project Objective

Build a complete, polished, artifact-first presentation for a two-hour professional workshop.

This is not a text-heavy lecture, an AI product advertisement, or a programming course. The audience consists of industry specialists with different levels of technical knowledge. Explain technical concepts accurately and accessibly, then connect each concept to a realistic work task.

The presentation should follow this learning progression:

**Understand the model → provide better context → use tools and browsers → build agentic workflows → verify outcomes → measure productivity.**

The visual artifacts are a central teaching mechanism, not decorative additions. Participants should be able to watch, compare, manipulate, and reason about how the systems work.

### Learning outcomes

By the end, participants should be able to:

1. Explain the evolution of AI and the role of modern LLMs.
2. Understand tokens, transformers, attention, autoregressive generation, and context windows at a conceptual level.
3. Recognize hallucinations, reasoning errors, prompt sensitivity, and other reliability limitations.
4. Design useful prompts and supply relevant context.
5. Distinguish prompt engineering, context engineering, harness engineering, and loop engineering.
6. Understand the difference between chat assistants, browser-enabled tools, tool-using systems, and agents.
7. Explain agent loops, feedback, validation, permissions, and human approval.
8. Identify practical applications across IT and non-IT departments.
9. Design and evaluate a small AI-assisted workflow with appropriate safeguards.

---

## 2. Timing and Slide Allocation

The section budgets total 120 minutes. Keep transitions concise and use selected slides for short audience interactions. The final block includes Q&A.

| Section | Slides | Time |
|---|---:|---:|
| 1. The AI shift | 1–6 | 10 min |
| 2. LLM fundamentals | 7–16 | 18 min |
| 3. Prompting and context | 17–26 | 17 min |
| 4. AI tools and browsers | 27–34 | 12 min |
| 5. Agents and workflow engineering | 35–45 | 20 min |
| 6. Cross-functional productivity | 46–54 | 15 min |
| 7. Practical demonstrations | 55–60 | 13 min |
| 8. Implementation and discussion | 61–65 | 15 min |
| **Total** | **65 slides** | **120 min** |

---

## 3. Audience and Teaching Principles

- Assume no prior knowledge of transformer internals.
- Treat the audience as experienced professionals, not as children or AI enthusiasts looking for hype.
- Use plain language first, then introduce the correct technical term.
- Teach intuition before terminology and terminology before detailed caveats.
- Connect each technical concept to a professional task.
- Prefer examples from email, meetings, reports, spreadsheets, research, policies, project tracking, operations, and software development.
- Make clear that AI assistance does not transfer professional accountability to the model.
- Avoid unsupported claims about productivity percentages or inevitable job replacement.
- Keep slide text concise; put detailed explanations in speaker notes.

---

## 4. Visual Design System

### Style

Use a restrained, modern, professional technology aesthetic.

- **Canvas:** 16:9 widescreen.
- **Palette:** primarily black, white, and neutral greys with one restrained accent color.
- **Typography:** readable sans-serif; clear hierarchy and sufficient contrast.
- **Layouts:** clean editorial grids, diagrams, comparison layouts, and visual storytelling.
- **Consistency:** stable section markers, slide numbers, spacing, and citation treatment.
- **Visual variety:** alternate between big-idea slides, technical diagrams, examples, comparison layouts, artifact demonstrations, and reflection slides.

Avoid excessive gradients, decorative glassmorphism, generic robot imagery, dense paragraphs, and repetitive layouts.

### Theme

Use a **light theme** as the primary theme. Training rooms are usually lit, light slides project more reliably, and the PDF export must read and print well.

- Set `colorSchema: light` in the Slidev headmatter. Do not rely on the dark-mode toggle during delivery.
- Define all colors as CSS custom properties (design tokens) in one stylesheet; components must use tokens, never hard-coded colors.
- **Background:** off-white (approximately `#FAFAF7`), not pure white, to reduce projector glare.
- **Text:** near-black (approximately `#1A1A1A`) for body; mid-grey only for secondary text that still meets WCAG AA contrast.
- **Accent:** one deep, saturated accent (e.g., deep blue or teal) that survives projector wash-out. Avoid pale accents such as light cyan, yellow, or mint.
- **Status colors (exception to the single-accent rule):** artifacts may use a small semantic set — success/supported (green), warning/unsupported (amber), failure/contradicted (red), neutral/pending (grey). Always pair status color with an icon or text label so meaning does not depend on color alone.
- **Section dividers:** the eight section-opening slides may use an inverted (dark) layout for rhythm; all other slides stay light.

### Type sizes (calm density)

Keep slides uncongested: modest type and generous space beat large text crammed into a frame.

- Slide titles: about 32px (26px on artifact slides) at the 980×552 Slidev canvas.
- Body text: about 17px; intro lines about 18px.
- Artifact labels, table cells and controls: 14–15px; small honesty labels about 12.5px.
- Interactive controls must be large enough to operate reliably with a mouse or clicker during a live session.

### Images

Use images only when they materially improve understanding or establish a realistic workplace context.

- Create a coherent set of custom images or illustrations for workplace scenarios.
- Prefer editable SVGs or native shapes for diagrams.
- Use screenshots of real products only when their current capabilities have been verified.
- Do not fabricate product interfaces or present a mock interface as a real product screenshot.
- Do not create 65 unrelated decorative images. Prioritize a smaller, coherent set of useful assets.
- Ensure all external assets are appropriately licensed and attributed where required.

### Slide density

Each slide should generally have:
- One main message.
- One clear visual focal point.
- A small amount of supporting text.
- An example, question, or implication where appropriate.
- Source attribution when making sourced claims.

---

## 5. Mandatory Artifact-First Requirements

### Minimum coverage

- Create **at least 12 substantial artifacts**.
- At least **30 of the 65 slides** should contain a meaningful artifact, visualization, simulation, comparison, or worked example.
- Every major section must include multiple substantive artifacts.
- Every technical concept must have a visual explanation, simulation, or worked example.
- Every major productivity concept must connect to a realistic workplace application.
- Reuse shared artifacts where useful, but adapt the state and explanation to the current slide.
- A decorative image or a static screenshot does not count as an interactive artifact.

### Required artifacts

1. **AI evolution timeline** — interactive or progressively revealed timeline of major paradigm shifts.
2. **LLM pipeline diagram** — input, tokenization, representations, model processing, decoding, and output.
3. **Token-generation simulator** — show a sentence being generated one token at a time.
4. **Attention explorer** — selecting a token highlights illustrative contextual relationships.
5. **Context-window simulator** — add or remove sample documents and show what information is available to the model.
6. **Prompt laboratory** — compare vague, structured, and context-rich prompts.
7. **Prompt-hardening checklist** — reveal how ambiguity, edge cases, constraints, and missing information are handled.
8. **Grounding and source-verification panel** — connect claims to evidence and flag unsupported statements.
9. **Harness architecture diagram** — show instructions, context, tools, state, validation, permissions, logging, and approval.
10. **Chat-versus-tool-versus-agent comparison** — reveal differences in capability and control.
11. **Agent-loop simulator** — step through observe, decide, act, inspect, validate, and continue or stop.
12. **Failure and recovery simulator** — show a tool failure, bounded retry, alternative action, or human escalation.
13. **Human-approval gate** — show how a consequential action is held until an authorized person approves it.
14. **Department use-case explorer** — navigate example workflows across departments.
15. **Productivity calculator** — adjust baseline time, AI task time, review time, and rework to estimate net time saved.
16. **Workflow builder** — assemble context retrieval, generation, validation, approval, and delivery stages.

At least 12 are mandatory; the full set above is preferred.

### Artifact quality criteria

Each substantial artifact must have:
- A clear teaching objective.
- A meaningful visual or interaction mechanism.
- A realistic example.
- A short instruction or prompt for the participant.
- A clear explanation of what to notice.
- A connection to professional productivity.
- Appropriate technical caveats.
- A static fallback state when interactivity is unavailable.

### Implementation rules

- Build each artifact as a self-contained Vue 3 single-file component in `components/`, using inline SVG or HTML/CSS for visuals. Use Mermaid (built into Slidev) only for simple static diagrams.
- Use functional controls for interactive artifacts; changing a control must visibly change the relevant output.
- Drive step-by-step artifact states from Slidev's click system (`v-click`, `$clicks` / `useSlideContext`) so the presenter can advance with the clicker and the PDF export can capture each state. Local controls (buttons, sliders, toggles) may add further interaction on top.
- Use real animations or progressive states to explain sequences.
- Do not fake interactivity with static screenshots.
- Keep simulations self-contained and usable offline where possible.
- Clearly label simulated, fictional, or illustrative data.
- Preserve source files for custom artifacts so they can be edited independently.
- If the target export format cannot support a feature, provide a working fallback rather than silently omitting it.

---

## 6. Animation Requirements

Animations should explain sequence, change, or causality—not merely decorate the slides.

### Required animated sequences

- Tokens appearing one by one during autoregressive generation.
- Attention relationships highlighting as a token is discussed.
- Context documents entering or leaving the model's available context.
- A vague prompt progressively becoming more specific.
- Claims being matched to source evidence.
- Browser research progressing through source collection, comparison, and verification.
- Agent tool calls returning results.
- Validation failure leading to a bounded retry, alternative strategy, or escalation.
- Human approval unlocking a consequential action.
- Raw meeting notes transforming into a structured, validated action tracker.

### Preferred effects

- Fade for supporting information (`v-click` with a fade class).
- Appear for tokens, labels, and step-by-step reveals (`v-click`, `v-clicks`, `v-after`).
- Wipe for process progression (CSS `clip-path` transitions tied to click state).
- State-to-state diagram evolution via Vue `<Transition>` / `<TransitionGroup>` or `v-motion`; use Shiki Magic Move only for code or prompt-text morphing.
- Highlight emphasis for the current step (`v-mark` or a token-based highlight class).
- Progressive disclosure for complex diagrams (click-indexed SVG groups).
- Slide transitions: one subtle default (e.g., `fade` or `slide-left`) set in headmatter; do not vary per slide without reason.

### Timing and accessibility

- Typical entrance duration: approximately 0.3–0.6 seconds.
- Keep sequences short and understandable.
- Avoid flashing, continuous motion, unnecessary bouncing, or spinning.
- Use transitions sparingly.
- Ensure readable contrast and text size.
- Respect `prefers-reduced-motion` in custom components (shorten or skip motion, keep the end state).
- Essential content must remain available without animation.
- Test animations in the intended presentation environment and in exported formats.

---

## 7. Authoritative 65-Slide Content Outline

Use these titles and topics as the authoritative slide sequence. Improve phrasing if needed, but do not omit topics or change the total slide count.

### Section 1 — The AI Shift (Slides 1–6, 10 minutes)

**1. Title — From LLMs to AI Agents: Transforming Professional Productivity**
- Subtitle: Understanding the technology, mastering the tools, and engineering reliable AI-powered workflows.
- Visual: a restrained progression from model to context to tools to agent to workflow.

**2. The Work Has Not Changed; The Way We Do It Has**
- Compare a traditional task workflow with an AI-assisted workflow.
- Example: preparing a weekly project update.
- Artifact: side-by-side workflow with progressive reveals.

**3. A Short History of AI**
- Rule-based systems, statistical machine learning, deep learning, transformers, foundation models, retrieval, and agents.
- Artifact: interactive or animated timeline.
- Keep the timeline concise and historically accurate.

**4. What Changed With Modern LLMs?**
- Natural-language interaction, generalization across tasks, multimodal input, longer contexts, and tool use.
- Distinguish model capabilities from capabilities provided by a surrounding product or system.

**5. From Traditional Software to AI-Assisted Workflows**
- Rules and forms versus natural-language assistance versus tool-mediated workflows.
- Explain that deterministic software remains preferable for many predictable, high-precision tasks.
- Artifact: task-selection comparison.

**6. The Journey: Model → Context → Tools → Agent → Workflow**
- Summarize the learning path.
- Artifact: progressive architecture diagram that will be revisited later.

### Section 2 — LLM Fundamentals (Slides 7–16, 18 minutes)

**7. What Is an LLM?**
- A neural network trained to model token sequences.
- Explain parameters, input context, and generated output.
- Artifact: simplified input-to-output model diagram.

**8. From Text to Tokens**
- Text is divided into tokens, which can be words, word pieces, or other units.
- Artifact: interactive tokenization illustration.
- Make clear that token boundaries are not identical to words.

**9. How a Transformer Processes Context**
- Embeddings, attention blocks, feed-forward operations, and layer stacking at a high level.
- Artifact: progressive transformer schematic.
- Avoid implying that the diagram is a complete implementation.

**10. Attention: How Relationships Between Tokens Are Represented**
- Explain attention conceptually using a short example sentence.
- Artifact: selectable token relationships or a clearly labelled illustrative attention map.
- Do not present a simplified visualization as a complete explanation of model internals.

**11. How an LLM Generates an Answer**
- Context processing, next-token distribution, decoding, appending the chosen token, and continuing.
- Artifact: animated generation pipeline.

**12. Autoregression: One Token at a Time**
- Show how generated tokens become part of the context for subsequent generation.
- Artifact: working token-by-token simulator with a short example.
- Explain that decoding choices influence the output.
- Note that some reasoning models use additional inference-time computation.

**13. Why Wording and Examples Influence Outputs**
- Ambiguity, formatting, constraints, examples, and demonstration selection.
- Artifact: prompt variants with a side-by-side comparison.
- Avoid suggesting that one prompt format always wins.

**14. Context Windows: What the Model Can Use**
- Explain context capacity, relevant information, and long-context failure modes.
- Artifact: context-window simulator with sample documents.
- Clarify that a larger context window does not guarantee perfect recall or use of every detail.

**15. Why LLMs Make Mistakes**
- Missing information, ambiguous requests, stale facts, reasoning errors, tool failures, and conflicting sources.
- Artifact: error taxonomy with workplace examples.

**16. Hallucination, Reasoning Limitations, and Verification**
- Fluency is not proof of correctness.
- Artifact: compare a plausible answer with fictional source evidence and flag unsupported claims.
- Teach source checking and calibrated trust.

### Section 3 — Prompting and Context (Slides 17–26, 17 minutes)

**17. Prompting Is Specification, Not Magic**
- Explain the difference between a request and a useful specification.
- Artifact: progressive prompt transformation.

**18. Weak Prompt Versus Structured Prompt**
- Compare “Prepare a project report” with a task containing audience, source, objective, constraints, and output format.
- Artifact: before-and-after comparison.

**19. The Anatomy of a Useful Prompt**
- Objective, context, constraints, output, and verification.
- Role or perspective can be included when useful, but is not mandatory.
- Artifact: labelled prompt anatomy.

**20. Roles, Objectives, Constraints, and Output Formats**
- Show how requirements change the deliverable.
- Artifact: prompt builder with editable fields or selectable prompt variants.

**21. Context Is Often More Valuable Than Clever Wording**
- Relevant policies, prior decisions, source documents, audience, and business constraints.
- Artifact: context-poor versus context-rich answer comparison.

**22. Grounding Answers in Documents and Approved Sources**
- Retrieval, source attribution, and checking evidence.
- Artifact: claim-to-source matching panel.

**23. Prompt Hardening: Handling Ambiguity and Edge Cases**
- Define missing-data behavior, exclusions, edge cases, and failure responses.
- Artifact: hardening checklist with a progressively improved prompt.

**24. Context Engineering: Selecting the Right Information**
- Relevant versus irrelevant context, source hierarchy, and conflicting information.
- Artifact: context selection board.

**25. Harness Engineering: Tools, Constraints, Validation, and State**
- Show how the surrounding system shapes reliability.
- Artifact: layered harness architecture with tools, permissions, validation, logging, state, and approval.

**26. Output Verification and Iterative Refinement**
- Validate against source material, requirements, schemas, and test cases.
- Artifact: review loop that distinguishes corrections from unsupported regeneration.

Clarify terminology in speaker notes:
- Prompt engineering: instructions and output requirements.
- Context engineering: selection and organization of information available to the model.
- Harness engineering: the surrounding system that supplies tools, state, permissions, validation, and execution control.
These practices overlap but are not interchangeable.

### Section 4 — AI Tools and Browsers (Slides 27–34, 12 minutes)

**27. From Chatbots to AI-Enabled Workspaces**
- Conversation, retrieval/tool-assisted work, and multi-step execution.
- Artifact: capability ladder.

**28. Search Engines, Research Assistants, and Browser-Integrated AI**
- Explain distinct categories and overlapping capabilities.
- Verify current product claims against official documentation.
- Artifact: tool-selection map.

**29. Summarizing and Comparing Multiple Sources**
- Extract claims, compare evidence, identify disagreement, and preserve citations.
- Artifact: source comparison panel.

**30. Document Analysis and Information Extraction**
- Work with policies, reports, meeting notes, and long documents.
- Artifact: document-to-structured-data transformation.

**31. Working With Spreadsheets, Tables, and Reports**
- Explain formulas, summaries, anomaly detection, and data interpretation.
- Artifact: sample spreadsheet/report with traceable calculations.
- Emphasize checking calculations against source data.

**32. Browser Automation and Computer-Use Capabilities**
- Explain permitted interactions, tool boundaries, and risk.
- Artifact: browser-action sequence with explicit permission boundaries.
- Distinguish actual product features from a simulated demonstration.

**33. Choosing the Right Tool for the Task**
- Compare ordinary chat, web search, document retrieval, data-analysis tools, and agents.
- Artifact: decision tree based on task, evidence, risk, and required action.

**34. Demonstration — Turn Browser Research Into an Evidence-Based Brief**
- Gather public sources, compare claims, and create a short brief.
- Artifact: research workspace and source-verification panel.
- Provide a prepared fallback if live services are unavailable.

### Section 5 — Agents and Workflow Engineering (Slides 35–45, 20 minutes)

**35. What Is an AI Agent?**
- A model-based system that selects actions through available tools and feedback to pursue a task.
- Artifact: agent architecture overview.

**36. Chat Assistant Versus Tool-Using System Versus Agent**
- Compare capabilities, control, and failure modes.
- Artifact: side-by-side capability matrix.

**37. Tools, Function Calling, and External Actions**
- Model proposes a tool call; an external system executes it and returns a result.
- Artifact: animated tool-call trace.
- Explain that the model does not automatically possess access or permissions.

**38. Planning and Task Decomposition**
- Break a broad goal into smaller, verifiable steps.
- Artifact: task decomposition tree.
- Show that plans may need revision as new information arrives.

**39. The Observe–Decide–Act Loop**
- Observe state, select an action, execute it, inspect the result, and continue or stop.
- Artifact: interactive agent-loop simulator.

**40. Feedback, Retries, and Recovery**
- Recoverable versus unrecoverable failures, bounded retries, alternative actions, and escalation.
- Artifact: failure-and-recovery simulation.
- Explain that retrying without changing the cause may repeat the same error.

**41. Context and State Across Multiple Steps**
- Working context, explicit state, retrieved memory, and persistent storage are different concepts.
- Artifact: state diagram showing what persists and what may be lost.

**42. Loop Engineering: Making Progress Measurable**
- Define success criteria, evaluate intermediate results, limit retries, and stop safely.
- Artifact: loop with success, retry, timeout, and escalation branches.

**43. Harness Engineering for Dependable Agents**
- Tools, permissions, schemas, validation, logs, budgets, state, and error handling.
- Artifact: layered harness diagram with progressive reveals.

**44. Human Approval, Permissions, and Stopping Conditions**
- Least privilege, confirmation for consequential actions, execution limits, and auditability.
- Artifact: approval gate that blocks an action until authorization is supplied.

**45. Design a Controlled End-to-End Agentic Workflow**
- Example: prepare a weekly report from authorized source data, validate the figures, draft findings, and request approval before distribution.
- Artifact: editable end-to-end workflow builder.

### Section 6 — Cross-Functional Productivity (Slides 46–54, 15 minutes)

**46. Productivity Opportunities Across Departments**
- Group tasks by information gathering, transformation, analysis, communication, and execution.
- Artifact: department use-case explorer.

**47. HR — Job Descriptions, Onboarding, and Policy Assistance**
- Example: draft an onboarding checklist from approved policy documents.
- Verification: HR policy, legal requirements, and factual accuracy.

**48. Finance — Report Interpretation and Variance Analysis**
- Example: explain illustrative budget variances.
- Verification: source figures, calculations, accounting definitions, and approval.

**49. Sales and Marketing — Account Research and Content Preparation**
- Example: prepare a public-source account brief or campaign variants.
- Verification: source freshness, brand requirements, and commercial facts.

**50. Operations — SOPs, Incidents, and Process Documentation**
- Example: transform fictional incident notes into an SOP draft.
- Verification: process-owner review and operational safety.

**51. IT and Engineering — Debugging, Tests, and Documentation**
- Example: summarize a synthetic log, propose a test, and explain a code change.
- Verification: run tests, review changes, and follow security requirements.

**52. Management — Decision Briefs, Project Risks, and Status Reports**
- Example: synthesize fictional team updates.
- Verification: owners, dates, assumptions, and decisions must match the source.

**53. Research and Learning — Literature Synthesis and Technical Onboarding**
- Example: compare claims from public research sources.
- Verification: original sources, methods, evidence, and limitations.

**54. Measure Productivity — Time, Quality, Rework, Cost, and Risk**
- Artifact: interactive productivity calculator.
- Include baseline time, AI-assisted work time, review time, correction/rework time, and total effort.
- Explain that faster first drafts do not necessarily mean lower total task time.
- Use clearly labelled illustrative numbers; do not present them as measured results.

### Section 7 — Practical Demonstrations (Slides 55–60, 13 minutes)

**55. One Task, Three Levels of AI Assistance**
- Show a fictional work task progressing from basic chat to context-rich assistance to a controlled workflow.
- Artifact: progressive comparison.

**56. Prompt Demonstration — Vague Request Versus Structured Instructions**
- Run the same task using three prompt variants.
- Compare completeness, unsupported assumptions, and editing effort.
- Artifact: prompt laboratory.

**57. Context Demonstration — Without Sources Versus Grounded in Material**
- Use a fictional policy or project brief.
- Compare claims with the supplied evidence.
- Artifact: claim-verification exercise.

**58. Browser Demonstration — Research, Compare, Cite, and Verify**
- Use public, verifiable sources.
- Artifact: research panel with source links and evidence matching.
- Clearly distinguish live retrieval from prepared screenshots.

**59. Agent Demonstration — Gather, Act, Observe, Validate, and Recover**
- Use a safe, simulated or read-only environment.
- Include one failed action and a bounded recovery path.
- Artifact: agent-loop simulator.

**60. Before and After — A Complete Professional Workflow**
- Transform fictional meeting notes into decisions, actions, owners, deadlines, risks, and a polished summary.
- Validate the output against the original notes.
- Artifact: animated transformation plus a final quality checklist.

### Section 8 — Implementation and Discussion (Slides 61–65, 15 minutes)

**61. Security, Privacy, and Responsible Data Handling**
- Approved tools, data classification, retention, access controls, and organizational policy.
- Artifact: data-sensitivity decision guide.

**62. Prompt Injection, Malicious Documents, and Unsafe Tool Use**
- Explain how untrusted content may attempt to redirect a model or agent.
- Artifact: safe-versus-unsafe workflow diagram.
- Teach treating retrieved content as data rather than automatically trusted instructions.

**63. Introducing AI Into an Organization — Start Small and Measure**
- Choose a frequent, low-risk task; baseline it; pilot; evaluate; improve; expand cautiously.
- Artifact: adoption and evaluation roadmap.

**64. Personal Action Plan — Improve One Recurring Task**
- Participants identify one task, its inputs, desired output, risk level, and verification method.
- Artifact: fillable action-plan template.

**65. Final Takeaways and Q&A**
- LLMs generate and transform information.
- Context improves task relevance.
- Tools and browsers extend access and action.
- Agents coordinate multi-step tasks within constraints.
- Validation, permissions, and human accountability remain essential.
- Artifact: final model → context → tools → agent → verified workflow diagram.

---

## 8. Detailed Artifact Build Briefs

### Artifact A — Token-Generation Simulator

**Purpose:** Make autoregressive generation intuitive.

Requirements:
- Show a short example prompt and generated continuation.
- Reveal generated tokens sequentially.
- Highlight the context available before each next-token step.
- Include a pause/step control if supported.
- Explain that displayed candidate probabilities are illustrative unless sourced from a real model.
- Provide a static sequence fallback.

### Artifact B — Attention Explorer

**Purpose:** Explain contextual relationships without overstating interpretability.

Requirements:
- Use a short, carefully selected sentence.
- Allow a token to be selected.
- Highlight illustrative connections to other tokens.
- Clearly label the display as a teaching visualization unless it comes from an actual model's attention values.
- Add a short explanation of what the visualization can and cannot establish.

### Artifact C — Context-Window Simulator

**Purpose:** Show why relevant context and information selection matter.

Requirements:
- Provide sample documents, such as a project brief, policy excerpt, meeting note, and irrelevant note.
- Allow participants to select which sources to include.
- Show the selected context and a conceptual capacity indicator.
- If using deterministic mock responses, label them as simulated.
- Explain that context size alone does not guarantee reliable recall.

### Artifact D — Prompt Laboratory

**Purpose:** Compare task specifications.

Requirements:
- Provide three variants: vague, structured, and context-rich.
- Use the same fictional task and reference material for a fair comparison.
- Display the prompt, resulting output, and evaluation checklist.
- Let the presenter switch between variants.
- Do not claim one prompt always performs best on all tasks.

### Artifact E — Grounding and Source Verification

**Purpose:** Teach claim-level verification.

Requirements:
- Display a fictional or sourced short report and a set of supporting documents.
- Break the report into individual factual claims.
- Allow claims to be marked as supported, contradicted, or unsupported.
- Link each claim to the evidence that supports the classification.
- Use clearly fictional content for invented examples.
- Never fabricate real citations.

### Artifact F — Harness Architecture

**Purpose:** Explain the system around the model.

Requirements:
- Progressively reveal instructions, context retrieval, model, tools, state, validation, permissions, logging, and human approval.
- Distinguish model behavior from application-level controls.
- Include one example of a tool call and its validation step.
- Make the diagram editable.

### Artifact G — Agent Loop Simulator

**Purpose:** Teach feedback-driven execution.

Requirements:
- Controls to advance through observe → decide → act → inspect → validate.
- Include a successful path and a failure path.
- Show a tool response after each simulated action.
- Include bounded retry and escalation branches.
- Include a stop condition.
- Clearly label simulated actions; do not imply actual external actions occurred.

### Artifact H — Productivity Calculator

**Purpose:** Encourage measurement of net productivity.

Inputs:
- Baseline task time.
- AI-assisted execution time.
- Human review time.
- Correction or rework time.
- Frequency of the task, if useful.

Outputs:
- Total time before AI.
- Total time with AI.
- Absolute time saved.
- Percentage time saved, when the baseline is greater than zero.

Use the formula:

`AI-assisted total = AI execution time + review time + correction/rework time`

`Net time saved = baseline time − AI-assisted total`

`Percentage time saved = (net time saved / baseline time) × 100`

Clearly distinguish illustrative values from measured organizational results. Do not imply that time savings alone establish quality or safety.

### Artifact I — Workflow Builder

**Purpose:** Show how a task becomes a controlled workflow.

Requirements:
- Present stages such as request, retrieve context, draft, validate, approve, and deliver.
- Allow stages to be selected or reordered if the implementation supports it reliably.
- Show required inputs, outputs, and failure conditions for each stage.
- Mark which stages can be automated and which need human review.
- Provide a static workflow fallback.

### Artifact J — Department Use-Case Explorer

**Purpose:** Make cross-functional applications relevant.

Departments:
- HR.
- Finance.
- Sales.
- Marketing.
- Operations.
- IT and engineering.
- Management.
- Research and learning.

Each use case should display:
- Task.
- Inputs.
- AI-assisted steps.
- Expected output.
- Verification step.
- Risk or data-sensitivity note.

---

## 9. Demonstration Assets

Create a reusable set of fictional, non-sensitive source material:

1. Meeting notes with decisions, actions, owners, deadlines, and unresolved questions.
2. A fictional project status report.
3. A fictional policy excerpt.
4. A small illustrative spreadsheet or CSV.
5. Several public, verifiable sources for a research comparison.
6. A sample task brief for an agent workflow.
7. A validation checklist and expected outputs.

Demonstration requirements:
- Prepare the prompts and expected observations in advance.
- Do not rely on a live external service for every step.
- Include screenshots or recorded fallback sequences where useful.
- Mark all simulated outputs clearly.
- Avoid confidential, personal, customer, employee, or production data.
- Never execute consequential actions against real systems during the presentation.

---

## 10. Speaker Notes and Facilitation

Every slide must include speaker notes with:

- Teaching objective.
- Plain-language explanation.
- Practical example or analogy.
- What the audience should notice in the artifact.
- Transition to the next slide.
- Discussion question where useful.
- Source notes for factual claims.

Technical slides should include additional detail in notes without overcrowding the visible slide.

For demonstrations, provide:
- Exact steps.
- Expected observations.
- Suggested narration.
- Likely failure modes.
- A fallback path.

Use occasional audience questions and short interactions, but protect the two-hour schedule. Do not require participants to install software or sign up for services during the session.

---

## 11. Research, Accuracy, and Citation Requirements

Use reliable and current sources, prioritizing:
- Foundational transformer and LLM research.
- Official model and API documentation.
- Official documentation for selected browser and agent products.
- Established security guidance on prompt injection and tool permissions.
- Credible studies of AI reliability and productivity.

Rules:
- Verify product capabilities before describing them as available.
- Distinguish general concepts from features of a specific product.
- Distinguish vendor claims from independently measured results.
- Cite factual claims on relevant slides.
- Collect all sources in a **Sources appendix after slide 65** (numbered A1, A2, …). The appendix does not count toward the 65 core slides. Each slide's footer lists the source numbers it relies on; sources are numbered in order of first citation.
- Label illustrative and fictional examples.
- Do not invent benchmark numbers, productivity results, quotations, citations, or product features.
- Ensure source links support the claims attached to them.

---

## 12. Technical Implementation Strategy

### Framework decision: Slidev

The deck is built with **[Slidev](https://sli.dev)** (Markdown slides + Vue 3 + Vite). Artifacts are Vue components; animations use Slidev's click system, `v-motion`, and Vue transitions. Do not substitute another framework.

How Slidev covers each requirement:

| Requirement | Slidev mechanism |
|---|---|
| 16:9 slides | `aspectRatio: 16/9` in headmatter (default canvas width 980) |
| Interactive artifacts | Vue SFCs in `components/`, auto-imported into slides |
| Progressive states / animations | `v-click`, `v-clicks`, `v-after`, `v-mark`, `v-motion`, `$clicks`, Vue `<Transition>` |
| Code / prompt morphing | Shiki Magic Move (` ````md magic-move `) |
| Speaker notes | HTML comment at the end of each slide (`<!-- notes -->`); shown in presenter mode |
| Diagrams | Inline SVG inside Vue components (editable source); Mermaid for simple static diagrams |
| Sections and slide numbers | Per-slide frontmatter (e.g., a `section` field) read by a custom global layout/footer |
| Offline delivery | `slidev build` → static SPA; all fonts, images, and data bundled locally (no CDN fonts at runtime) |
| PDF export | `slidev export --with-clicks` (Playwright) so each click state becomes a page |
| Theme | Light `colorSchema`, custom tokens in `styles/` (see §4 Theme) |

Rules specific to Slidev:
- Pin the Slidev version in `package.json` and commit the lockfile.
- Split the deck into one Markdown file per section under `pages/` and include them from `slides.md` with `src:` so sections can be edited independently.
- Keep artifact data (fictional documents, token sequences, agent traces, calculator presets) in `data/` as JSON/TS files, not hard-coded in templates.
- Every interactive component must render a meaningful **default state on first paint** and, where it is click-driven, a meaningful state at every click index — this is what the PDF export captures and serves as the static fallback.
- Components must not depend on network access during the talk. Any live browser demo (slides 34, 58) runs in a separate browser window, with a prepared in-deck fallback.
- Test in presenter mode (`/presenter`), in the built SPA, and in the exported PDF.

Do not stop at a prototype or a few sample slides; build the complete deck.

### Project organization

    LLM-for-professionals/
    ├── README.md                  # run, edit, present, export instructions
    ├── package.json               # pinned @slidev/cli, theme, playwright-chromium
    ├── slides.md                  # headmatter + includes for each section
    ├── pages/
    │   ├── 01-ai-shift.md
    │   ├── 02-llm-fundamentals.md
    │   ├── 03-prompting-context.md
    │   ├── 04-tools-browsers.md
    │   ├── 05-agents-workflows.md
    │   ├── 06-cross-functional.md
    │   ├── 07-demonstrations.md
    │   └── 08-implementation.md
    ├── components/                # Vue artifacts (auto-imported)
    │   ├── AiTimeline.vue
    │   ├── LlmPipeline.vue
    │   ├── TokenSimulator.vue
    │   ├── AttentionExplorer.vue
    │   ├── ContextWindowSimulator.vue
    │   ├── PromptLab.vue
    │   ├── PromptHardening.vue
    │   ├── SourceVerification.vue
    │   ├── HarnessDiagram.vue
    │   ├── ChatToolAgentMatrix.vue
    │   ├── AgentLoopSimulator.vue
    │   ├── FailureRecovery.vue
    │   ├── ApprovalGate.vue
    │   ├── UseCaseExplorer.vue
    │   ├── ProductivityCalculator.vue
    │   ├── WorkflowBuilder.vue
    │   └── ui/                    # shared primitives: StatusBadge, SimLabel, Panel, StepControls
    ├── layouts/                   # custom layouts: section-divider, artifact, comparison
    ├── styles/                    # tokens.css, base styles
    ├── data/                      # fictional demo data and artifact presets
    ├── public/                    # images, icons, fonts (served locally)
    ├── docs/                      # this specification, QA report, references
    └── exports/                   # PDF and built SPA

Keep assets, source code, demo data, citations, and exports organized and editable.

---

## 13. Quality Assurance and Definition of Done

Do not declare completion until all of the following are checked.

### Content
- Exactly 65 numbered slides.
- All eight sections and required topics are present.
- Slide content is accurate, concise, and suitable for industry specialists.
- Speaker notes are present for all slides.
- Sources support the claims they accompany.

### Artifacts
- At least 12 substantial artifacts have been implemented.
- At least 30 slides contain meaningful artifacts, diagrams, simulations, or worked examples.
- No placeholders remain.
- Interactive controls visibly work.
- Simulated data and simulated actions are labelled.
- Artifact source files are available for editing.

### Visuals and animations
- 16:9 layout is consistent.
- No text clipping, overlapping elements, or unreadable labels.
- Contrast and font sizes are suitable for projection.
- Images are relevant and properly sourced.
- Animations are tested in the intended environment.
- Essential information remains understandable without animation.
- Static/PDF fallbacks remain readable.

### Demonstrations
- All sample inputs and expected observations are prepared.
- Failure and recovery paths are tested.
- No confidential or production data is used.
- Live dependencies have fallback materials.

### Delivery
- Build the static SPA with `slidev build` and confirm it runs offline.
- Export a review PDF with `slidev export --with-clicks`, and a notes-inclusive PDF if useful for facilitators.
- Include the Markdown specification, source project, notes, artifacts, references, and README.
- Render and inspect the deck before delivery.
- Report any genuine limitations instead of claiming unsupported functionality.

---

## 14. Final Deliverables

Produce:

1. Complete 65-slide presentation.
2. Editable source project.
3. This Markdown specification.
4. Speaker notes for all slides.
5. Custom diagrams and supporting images.
6. At least 12 substantial artifacts, preferably the full required set.
7. Demonstration data and prepared fallback materials.
8. References and citations.
9. PDF export.
10. README with run, edit, present, and export instructions.
11. Quality-assurance report listing tests performed and any known limitations.

### Final creative direction

The finished deck should feel like a professional technology workshop with small, embedded learning experiences. Participants should watch a model generate tokens, inspect contextual relationships, compare prompts, verify claims, operate a simulated agent loop, and calculate productivity using illustrative data.

The presentation should be visually engaging but restrained, technically credible, practical across departments, and understandable without a programming background.

**Build the complete deck, test the artifacts, inspect the rendered slides, and only then report completion.**
