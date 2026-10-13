# Build conventions — read fully before writing any slide

The authoritative content brief is `docs/llm_agents_productivity_presentation_spec.md`. This file says **how** to build it so eight parallel builders produce one coherent deck.

## 1. Stack and files

- Slidev 53 (`@slidev/cli`), Vue 3 SFCs, `<script setup lang="ts">`. Canvas is **980 × 552** px, 16:9.
- `slides.md` — headmatter + slide 1 (title) + `src:` includes. **Do not edit.**
- `pages/0N-*.md` — one file per section. You own only your section's file.
- `components/*.vue` — artifacts (auto-registered by filename, including subfolders). You own only the components listed in your brief, plus any helpers you prefix with `S<N>` (e.g. `S4ToolCard.vue`).
- Packages available: Slidev, Vue, `gpt-tokenizer` (real BPE tokenizer, o200k_base etc., works offline). Do **not** edit `package.json` or install packages; ask in your report if you need one.
- `components/ui/*` — shared primitives (below). **Do not edit.** If one is missing something, work around it inside your component and mention it in your report.
- `composables/useArtifactStep.ts`, `composables/useRefs.ts` — shared. **Do not edit.**
- `styles/tokens.css`, `styles/base.css`, `layouts/*`, `slide-top.vue`, `slide-bottom.vue` — shared. **Do not edit.**
- `data/s<N>/*.ts` — your section's artifact data (create the folder). `data/universe.ts` — shared fictional org (read-only).
- `data/refs/s<N>.ts` — your section's sources (create it). `data/refs/core.ts` — shared core sources (read-only; reuse its keys).

## 2. Slide authoring

Every slide's frontmatter must include `section: <N>`. Other fields:

| Field | Use |
|---|---|
| `layout` | `default` (omit), `artifact`, `split`, `statement`, `cover` |
| `sources` | list of citation keys this slide relies on → footer shows `Sources [n]` and the end appendix lists them |
| `clicks` | number of clicker steps for an artifact driven by `useArtifactStep` |
| `lede` | one sentence beside the title (`artifact` layout only) |
| `scale` | optional per-slide zoom for the artifact area (default 0.86); use ~0.9–1.0 on sparse slides so key content fills the space |
| `ratio` | grid columns for `split`, e.g. `1fr 1.4fr` |

Layout templates:

```md
---
section: 2
sources: [vaswani2017]
---

# Attention lets every token look at every other token

<p class="lede">One short sentence that states the slide's message.</p>

<SomeArtifact />

<!--
(notes — see §5)
-->
```

```md
---
section: 2
layout: artifact
clicks: 6
lede: Watch the context grow by one token per step.
---

::title::
# Autoregression: one token at a time

::default::
<TokenSimulator />

<!-- notes -->
```

```md
---
section: 3
layout: split
ratio: 1fr 1.2fr
---

# Weak prompt versus structured prompt

::left::
...left column...

::right::
...right column...
```

`statement` = dark big-idea slide (max one per section). Titles are **claims or clear topic names in sentence case** (“Context is often more valuable than clever wording”), never ALL CAPS. Keep each slide's visible text short — detail belongs in the notes.

On `artifact` slides the artifact is sized to its content and centred between title and footer — never stretch panels with `flex: 1` or `height: 100%` to fill space; give diagrams an explicit height instead.

Reserved areas: top-right 40 px (journey strip) and bottom 34 px (footer). Nothing may overlap them. Nothing may overflow the 980×552 canvas — check screenshots.

## 3. Shared primitives (components/ui)

- `<Stage task="What to try" notice="What to notice" tag="simulated|illustrative|fictional|teaching|false">` — frame for every interactive artifact. Has a `#controls` slot (put `<StepControls>` there) and a `#notice` slot.
- `<SimTag kind="…">` — honesty label. **Every** simulated output, invented data, illustrative number or teaching-only visualization must carry one (Stage adds it automatically).
- `<Status state="ok|warn|bad|neutral|active" label="Supported" />` — status always shows icon + text, never color alone.
- `<StepControls :step :max :labels @prev @next @reset />` — on-screen stepping.
- `<Token text=" meeting" space state="context|new|candidate|chosen|dim|focus" />` — token chips (mono font).
- `<Callout kind="key|caution|note" title="…">` — one emphasised note.
- `<Cite k="key" />` — inline `[n]`; the key must also be in the slide's `sources`.
- Global CSS helpers: `.lede`, `.muted`, `.small`, `.label`, `.mono`, `.accent`, `.btn`, `.btn-primary`, `.btn.is-active` / `aria-pressed`.

Step-driven artifacts:

```ts
import { useArtifactStep } from '../composables/useArtifactStep'
const { step, next, prev, reset, max } = useArtifactStep(6) // pair with `clicks: 6` in frontmatter
```

The presenter's clicker advances `step`; on-screen buttons override it. The PDF export captures every click state, so **every step must be a meaningful, readable picture on its own** (that is the static fallback). Step 0 must already show something useful (never an empty box).

Free interaction (toggles, sliders, selecting a token, checkboxes) is encouraged on top — but the default state must be meaningful because that is what the PDF shows.

## 4. Visual design rules

Direction: restrained, credible, technical. Light theme, cool off-white paper, near-black ink, **one ultramarine accent** (`--accent`), semantic status colors only for status. IBM Plex Sans for text, IBM Plex Mono **only** for things that really are machine text: tokens, prompts, tool calls, logs, JSON, file names.

- Use only CSS variables from `styles/tokens.css`. No hard-coded colors (white `#fff` on accent fills is fine).
- Sizes (calm density): body 17px, intro lines 18px, artifact text/labels 14–15px, titles 32px (26px on artifact slides). Use the `--fs-*` tokens; prefer whitespace over larger text. Everything inside an artifact slide's content area is additionally scaled by `--artifact-scale` (0.86) in `styles/tokens.css` — adjust that one value to make all artifacts larger or smaller.
- Spend boldness in the artifact. Everything around it stays quiet.
- Diagrams: hand-built inline SVG or HTML/CSS in the component, using tokens; 1.5px strokes; arrows that show real flow. Label what things are in plain words.
- Avoid: emoji, ALL-CAPS labels, eyebrow labels above titles, generic robot imagery, gradients, glassmorphism, drop shadows on everything, grids of identical rounded cards, decorative numbered markers (01/02/03) unless the content really is a sequence, accenting one word of a headline.
- Variety: alternate big-idea, diagram, comparison, artifact and reflection slides. Do not make every slide a Stage.
- Plain language first, then the term. Sentence case everywhere. Active voice. Buttons say exactly what they do (“Add the policy document”, not “Submit”).

### Motion

- Motion explains sequence or causality only. Use `v-click` / `v-clicks` / `v-after` for reveals, `v-mark` sparingly for emphasis, Vue `<Transition>`/`<TransitionGroup>` for state changes inside artifacts, ```` ```md magic-move ```` for prompt text evolving.
- Durations ~0.3–0.6s (`var(--dur)`, `var(--ease)`). No looping, bouncing, spinning or continuous motion. Respect `prefers-reduced-motion` (the tokens already shorten `--dur`).

## 5. Speaker notes (every slide)

At the end of each slide, an HTML comment in this shape (markdown allowed inside):

```md
<!--
**Time:** ~1.5 min
**Objective:** What participants should understand.
**Say:** Plain-language explanation, 3–6 sentences, presenter's voice.
**Example:** A workplace example or analogy.
**Notice:** What to point at in the artifact (if any).
**Ask:** Optional discussion question.
**Caveat:** Technical caveat, if any.
**Transition:** One line into the next slide.
**Sources:** Keys used and what each supports (or "None — conceptual").
-->
```

Demonstration slides additionally get: **Steps**, **Expected observations**, **Likely failure modes**, **Fallback**.

Respect the section's time budget: total of your `Time:` lines must equal your section's minutes (see `data/sections.ts`).

## 6. Accuracy and sources (non-negotiable)

- Research with WebSearch / WebFetch. Prefer primary sources: original papers (arXiv abs page or DOI), official docs, standards bodies (NIST, OWASP, ISO), peer-reviewed studies.
- **Open every URL you cite** and confirm it supports the exact claim. Never cite from memory alone. Never invent citations, quotes, benchmark numbers, dates or product features.
- Product capabilities change fast. Today is 2026-10-13. Describe products only as verified from official sources, phrase as “as of October 2026”, and prefer category-level descriptions over feature lists.
- Productivity figures: only from cited studies, with the study's context (who, what task, what was measured) in the notes. Note limitations. Never present illustrative numbers as measured.
- Add each source to `data/refs/s<N>.ts`:

```ts
import type { Ref } from './types'
export const refs: Ref[] = [
  { key: 'liu2024lost', authors: '…', year: 2024, title: '…', venue: '…', url: 'https://arxiv.org/abs/…', accessed: '2026-10-13', supports: '…' },
]
```

- Key format: first author's surname (lowercase) + year + optional short word: `yao2023react`, `owasp2025llm`. **Check `data/refs/core.ts` first and reuse existing keys.** Keys must be unique across all ref files; prefix with your section if in doubt (`s4perplexitydocs2026`).
- Fictional content uses the shared fictional org in `data/universe.ts` (Kestrel Freight, Project Lark and named staff) and is labelled with `SimTag kind="fictional"`.

## 7. Testing your section (required before reporting)

1. Your dev entry is `dev-s<N>.md` (already created; it includes only your section). Start it:
   `npx slidev dev-s<N>.md --port 303<N>`
2. Screenshot every slide, and every click state of step-driven artifacts:
   `node scripts/shot.mjs 303<N> <out-dir> 1 2 3:0 3:2 3:5 …`
   (slide numbers are positions within your dev entry). Ignore page errors mentioning `FloatingVue` or `Wake Lock`; fix every other error.
3. **Look at every PNG** (Read tool). Check: no overflow or clipping, nothing under the footer/journey strip, text ≥ minimum sizes, every step meaningful, honesty tags present, it looks deliberate and polished. Iterate until it does.
4. Test interactivity with Playwright where it matters (click a control, screenshot the result).
5. Stop your dev server when finished with `fuser -k 303<N>/tcp` (do **not** use `pkill -f`, it can kill your own shell).

Slide numbers in the footer of your dev entry are local; final numbering comes from `slides.md`.

## 8. Report

End with a short report: slides built, components created, sources added (keys), interactions verified, anything you could not verify, and any shared-file change you needed but did not make.
