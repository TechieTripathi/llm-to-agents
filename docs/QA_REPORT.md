# QA report

Deck: *From LLMs to AI Agents: Transforming Professional Productivity*. Checked 13 October 2026.

## Result

| Check | Result |
|---|---|
| Core slide count | 65, plus a 10-page Sources appendix (A1–A10) that is not counted toward the 65 |
| Sections | 8; slides per section 6 / 10 / 10 / 8 / 11 / 9 / 6 / 5, matching the spec |
| Speaker notes | Present on every slide, following the conventions template; demo slides add steps, expected observations, failure modes and fallback |
| Timing | Speaker-note times sum to exactly 120 min, and every section matches its budget |
| Artifacts | All 16 required artifacts built, plus about 50 more slide-specific visuals; every one of the 65 slides has an artifact, diagram, simulation or worked example |
| Sources | 110, every one opened by the section builder and re-checked by script; no unknown or duplicate keys |
| Honesty labels | Every simulated output, illustrative number, fictional dataset and teaching visualization carries a dashed label |
| Offline build | `exports/spa` (6.5 MB), no runtime calls to font or script CDNs; tested served statically |
| PDF | All-steps (353 pages), handout (75 pages), speaker notes (73 pages) |

## Tests performed

1. **Static checks** (`npm run check`): slide count, sections, notes on every slide, placeholder text, citation keys, and per-section timing.
2. **Link check** (`npm run check:urls`): all 110 URLs resolve.
   - Five publisher DOIs return 403 to scripts (ACM, OUP, Science, INFORMS ×2). Each was confirmed through the Crossref API to exist and to match its title.
   - Two EUR-Lex links return 202 (accepted).
3. **Visual review**: each section builder screenshotted every slide at every click state and inspected each image. At integration, contact sheets of every slide's first and last state (slides 1–65, plus the appendix) were reviewed again after the shared title-layout change.
4. **Interaction tests**: builders drove each control with Playwright and confirmed it changed the display, covering toggles, sliders, step buttons, claim selection, the approval gate, the workflow builder, the calculator, the tokenizer input and the action-plan form. Typing in inputs does not advance slides.
5. **Sources appendix fit**: `scripts/check-sources-fit.mjs` confirms no page spills beyond two columns.
6. **Arithmetic spot checks**:
   - Slide 31 spreadsheet: rates, totals, the 92.5% network rate and the 93.3% naive average all recompute.
   - Slide 48 variance table: every percentage and total recomputes.
   - Slide 54 calculator presets match the spec formulas.
7. **Story consistency** (fixed at integration): all sections now share one Project Lark timeline and one currency.
   - Go-live Tue 27 Oct 2026, moved from 20 Oct.
   - Change freeze from 1 Nov.
   - Week 41 spend €612k of €700k.
   - Travel policy: receipted meals up to €40 a day, no per diem, claims within 60 days.
8. **Production build and exports** completed without errors, and sample PDF pages were inspected.

## Fixes made during integration

- Merged duplicate sources (Shi 2023, Liu 2023 verifiability, Sclar 2024, OWASP LLM06) and repaired one dangling key.
- Aligned the Project Lark dates, budget figures and travel-policy wording across Sections 2, 3, 5, 6 and 7.
- Changed the label on slide 27 (capability ladder): it no longer says "teaching visualization of model internals", which was wrong for a conceptual diagram.
- Widened artifact-slide titles. Inline citation numbers now sort ascending.
- After review, reduced the type scale about 25% to match the reference deck's calmer density: body 17px, titles 32/26px, labels 14–15px. All 65 slides were re-checked.
- After further review, artifact content is scaled to 86% (`--artifact-scale` in `styles/tokens.css`) so boxes, chips and diagrams sit with more whitespace; titles are unaffected.
- Removed empty space: artifact frames and panels now size to their content (they previously stretched to the footer) and sit centred between title and footer. The 14 sparsest slides use a per-slide `scale: 0.94`; the rest stay at 0.86. Checked with `scripts/measure-fill.mjs` (every slide now uses 57–89% of the available height, no stretched panels) and contact sheets of all slides.
- Slide 8 tokenizer now offers three real OpenAI tokenizers labelled by model (GPT-4o/GPT-5, GPT-4/GPT-3.5, GPT-3) and compares counts across all three.
- Rebuilt the Sources appendix: compact entries, 11 per page, 10 pages.

## Known limitations

- **Product facts age quickly.** Slides 28 and 32 describe AI search, browser and agent products as verified on 13 October 2026. Re-verify before each delivery.
- **The EU AI Act brief (slide 34)** reflects the Digital Omnibus (Regulation (EU) 2026/1744). It is labelled "not legal advice".
- **The PDF shows free-form controls in their default state**: sliders, text inputs and manual toggles. Click-driven states are captured page by page in the all-steps PDF.
- **Magic-move animation (slide 17)** is captured as static steps in the PDF.
- **Some sources were read through mirrors.** A few official pages (openai.com, help.openai.com, eur-lex.europa.eu) block automated fetching, so builders read them through the Wayback Machine, the EU Publications Office or a reader proxy. The citations keep the official URLs.
- **Preprints:**
  - Kalai et al. 2025 ("Why Language Models Hallucinate") is an arXiv preprint; the notes say so.
  - METR's 2026 follow-up is flagged by METR itself as unreliable; the notes say so.
- **Fictional universe.** Kestrel Freight, Project Lark and all staff are invented. Small details differ between sections' worked examples (for example, defect counts in different weeks), which is acceptable for illustration.
- **Build size.** The tokenizer bundle is about 3 MB (1.5 MB gzipped). The first load of slide 8 takes a moment on slow machines; open the deck once before presenting.
- **Rehearsal is still needed.** The deck has not been rehearsed live with a projector. Rehearse once in presenter mode and check legibility from the back of the room.
