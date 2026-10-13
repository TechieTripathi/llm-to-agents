<script setup lang="ts">
// Slide 60 — raw meeting notes (demos/meeting-notes.md, verbatim) become a tracker and summary,
// then every item is traced back to a note line. One AI-introduced error (a wrong deadline) is caught.
// Clicks: 0 notes · 1 decisions · 2 actions · 3 risks · 4 summary · 5 trace · 6 error caught · 7 sign-off.
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ACTIONS, DECISIONS, EXTRACT_PROMPT, QUALITY_CHECKS, QUESTIONS, RISKS, STAGES, SUMMARY_TEMPLATE } from '../data/s7/meeting'
import { meetingLines, MEETING_NOTES_FILE } from '../data/s7/raw'

const { step, next, prev, reset, max } = useArtifactStep(7)
const hover = ref<number[] | null>(null)
watch(step, () => { hover.value = null })

const stage = computed(() => [0, 1, 1, 1, 2, 3, 3, 4][step.value])
const tracing = computed(() => step.value >= 5)
const caught = computed(() => step.value >= 6)
const bad = ACTIONS.find(a => a.fixed)!
const badLine = bad.lines[0]

// Lines highlighted as the source of what was just extracted.
const fresh = computed<number[]>(() => {
  if (hover.value) return hover.value
  if (step.value === 1) return DECISIONS.flatMap(d => d.lines)
  if (step.value === 2) return ACTIONS.flatMap(a => a.lines)
  if (step.value === 3) return [...RISKS, ...QUESTIONS].flatMap(r => r.lines)
  return []
})
const traced = computed(() => new Set([...DECISIONS, ...ACTIONS, ...RISKS, ...QUESTIONS].flatMap(x => x.lines)))
const lineState = (n: number) => {
  if (caught.value && n === badLine) return 'bad'
  if (fresh.value.includes(n)) return 'fresh'
  return ''
}
const summary = computed(() => {
  const due = caught.value ? bad.fixed! : bad.due!
  return SUMMARY_TEMPLATE.split('{api}').map((t, i) => ({ t, i }))
    .flatMap(({ t, i }) => i === 0 ? [{ t }] : [{ t: due, mark: true }, { t }])
})
// Line references: contiguous runs become ranges, e.g. [3, 4, 7] → "L3–4, 7".
function L(ls: number[]) {
  const runs: number[][] = []
  for (const n of ls) {
    const last = runs[runs.length - 1]
    if (last && n === last[last.length - 1] + 1) last.push(n)
    else runs.push([n])
  }
  return `L${runs.map(r => (r.length > 1 ? `${r[0]}–${r[r.length - 1]}` : `${r[0]}`)).join(', ')}`
}
</script>

<template>
  <div class="s7-mt">
    <div class="bar">
      <ol class="stages">
        <li v-for="(s, i) in STAGES" :key="s" :class="{ on: stage === i, done: stage > i }">{{ s }}</li>
      </ol>
      <span class="spacer" />
      <SimTag kind="fictional" />
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </div>

    <div class="s7grid">
      <!-- the raw notes, verbatim from demos/meeting-notes.md -->
      <section class="notes">
        <header class="nh"><span class="mono">{{ MEETING_NOTES_FILE.split('/').pop() }}</span><span>raw, as typed</span></header>
        <ol class="nl">
          <li v-for="(t, i) in meetingLines" :key="i" :class="lineState(i + 1)">
            <span class="no">
              <template v-if="tracing && traced.has(i + 1)">
                <svg v-if="!(caught && i + 1 === badLine)" width="12" height="12" viewBox="0 0 12 12" class="tick" aria-label="traced"><path d="M2 6.3l2.6 2.5L10 3.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <svg v-else width="12" height="12" viewBox="0 0 12 12" class="cross" aria-label="mismatch"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
              </template>
              <span class="nn">{{ i + 1 }}</span>
            </span>
            <span class="tx">{{ t }}</span>
          </li>
        </ol>
      </section>

      <!-- the AI output and its validation -->
      <section class="work">
        <Transition name="s7swap" mode="out-in">
          <!-- 0: prompt + empty tracker -->
          <div v-if="step === 0" key="w0" class="pane">
            <div class="prompt"><span class="plab">Prompt</span>{{ EXTRACT_PROMPT }}</div>
            <div class="skel"><span>Decisions</span><span>Actions: owner, deadline</span><span>Risks and open questions</span></div>
          </div>

          <!-- 1–3 extract, 5–6 validate -->
          <div v-else-if="step <= 3 || step === 5 || step === 6" key="w1" class="pane tracker">
            <div class="ohead"><span>Tracker</span><SimTag kind="simulated" /></div>
            <div v-if="step >= 3" class="collapsed">
              <h5>Decisions</h5>
              <span v-for="(d, i) in DECISIONS" :key="i" class="chip" :class="{ ok: tracing }" :title="d.text" @mouseenter="hover = d.lines" @mouseleave="hover = null">{{ L(d.lines) }}</span>
              <span class="cl-n">{{ DECISIONS.length }} decisions</span>
            </div>
            <h5 v-if="step < 3">Decisions</h5>
            <ul v-if="step < 3" class="items">
              <li v-for="(d, i) in DECISIONS" :key="i" @mouseenter="hover = d.lines" @mouseleave="hover = null">
                <span class="it">{{ d.text }}</span>
                <span class="chip" :class="{ ok: tracing }">{{ L(d.lines) }}</span>
              </li>
            </ul>

            <template v-if="step >= 2">
              <h5>Actions</h5>
              <div class="acts">
                <div v-for="(a, i) in ACTIONS" :key="i" class="arow" :class="{ err: caught && a.fixed, gap: caught && !a.due }" @mouseenter="hover = a.lines" @mouseleave="hover = null">
                  <span class="own">{{ a.owner.split(' ')[0] }}</span>
                  <span class="task">{{ a.task }}</span>
                  <span class="due">
                    <template v-if="a.fixed && caught"><s>{{ a.due }}</s> <strong class="fix">{{ a.fixed }}</strong></template>
                    <template v-else-if="a.due">{{ a.due }}</template>
                    <span v-else class="nodate">no date</span>
                  </span>
                  <span class="chip" :class="{ ok: tracing && !(caught && a.fixed), bad: caught && a.fixed }">{{ L(a.lines) }}</span>
                </div>
              </div>
              <p v-if="caught" class="why">
                <Status compact state="bad" /> <span>Line {{ badLine }} says “{{ bad.evidence }}”. The AI reused the UAT date. Corrected.</span>
              </p>
            </template>

            <template v-if="step >= 3 && step < 6">
              <h5>Risks and open questions</h5>
              <ul class="items">
                <li v-for="(r, i) in [...RISKS, ...QUESTIONS]" :key="i" @mouseenter="hover = r.lines" @mouseleave="hover = null">
                  <span class="it">{{ i >= RISKS.length ? 'Open: ' : '' }}{{ r.text }}<span v-if="r.inferred" class="inf">inferred</span></span>
                  <span class="chip" :class="{ ok: tracing }">{{ L(r.lines) }}</span>
                </li>
              </ul>
            </template>
            <p v-if="caught" class="why warnline">
              <Status compact state="warn" /> <span>Arjun’s action has no date in the notes. Ask him; do not invent one.</span>
            </p>
          </div>

          <!-- 4: polished summary -->
          <div v-else-if="step === 4" key="w4" class="pane">
            <div class="ohead"><span>Summary for Helen Brooks</span><SimTag kind="simulated" /></div>
            <article class="sum">
              <p><template v-for="(s, i) in summary" :key="i"><span v-if="s.mark">{{ s.t }}</span><template v-else>{{ s.t }}</template></template></p>
            </article>
            <p class="counts">From 17 lines: {{ DECISIONS.length }} decisions · {{ ACTIONS.length }} actions · {{ RISKS.length }} risks · {{ QUESTIONS.length }} open questions</p>
          </div>

          <!-- 7: sign-off -->
          <div v-else key="w7" class="pane signoff">
            <div class="ohead"><span>Quality checklist</span><SimTag kind="simulated" /></div>
            <ul class="qc">
              <li v-for="q in QUALITY_CHECKS" :key="q.text"><Status compact :state="q.state" /><span>{{ q.text }}<span v-if="q.detail" class="qd"> · {{ q.detail }}</span></span></li>
            </ul>
            <article class="sum compact">
              <p><template v-for="(s, i) in summary" :key="i"><strong v-if="s.mark" class="corr">{{ s.t }}</strong><template v-else>{{ s.t }}</template></template></p>
            </article>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
.s7-mt { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 8px; }
.bar { display: flex; align-items: center; gap: 12px; }
.spacer { flex: 1; }
.stages { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 0; }
.stages li { margin: 0; padding: 4px 12px 4px 10px; font-size: var(--fs-label); color: var(--ink-3); position: relative; }
.stages li + li::before { content: '›'; position: absolute; left: -4px; color: var(--rule-strong); }
.stages li.done { color: var(--ink-2); }
.stages li.on { color: var(--accent); font-weight: 600; }

.s7grid { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 366px 1fr; grid-template-rows: minmax(0, 1fr); gap: 16px; }

.notes { min-height: 0; display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); overflow: hidden; }
.nh { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; background: var(--stage); border-bottom: 1px solid var(--rule); font-size: var(--fs-label); color: var(--ink-2); }
.nl { list-style: none; margin: 0; padding: 3px 0; }
.nl li { display: grid; grid-template-columns: 46px 1fr; margin: 0; padding: 0 8px 0 0; font-size: var(--fs-label); line-height: 19.6px; white-space: pre; transition: background var(--dur) var(--ease); }
.no { font: 400 14px/19.6px var(--font-mono); color: var(--ink-3); text-align: right; padding-right: 10px; display: inline-flex; justify-content: flex-end; align-items: center; gap: 3px; }
.tick, .cross { flex: 0 0 auto; }
.nn { display: inline-block; min-width: 2ch; text-align: right; }
.tick { color: var(--ok); }
.cross { color: var(--bad); }
.tx { overflow: hidden; text-overflow: ellipsis; }
.nl li.fresh { background: var(--accent-tint); }
.nl li.bad { background: var(--bad-tint); }
.nl li.bad .tx { color: var(--bad); font-weight: 500; }

.work { min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.pane { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.ohead { display: flex; justify-content: space-between; align-items: center; font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); padding-bottom: 4px; border-bottom: 1.5px solid var(--ink); }
.prompt { background: var(--stage); border-radius: var(--radius-sm); padding: 8px 12px; font: 400 15px/1.4 var(--font-mono); }
.plab { display: block; font: 600 var(--fs-label)/1.4 var(--font-sans); color: var(--ink-2); }
.skel { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.skel span { border: 1.5px dashed var(--rule-strong); border-radius: var(--radius-sm); padding: 14px 12px; color: var(--ink-3); font-size: var(--fs-label); }

h5 { margin: 5px 0 0; font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--accent); }
.items { list-style: none; margin: 0; padding: 0; }
.items li { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; margin: 0; padding: 1px 0; font-size: var(--fs-label); line-height: 1.3; border-bottom: 1px solid var(--rule); }
.it { min-width: 0; }
.inf { margin-left: 8px; font-size: var(--fs-label); color: var(--warn); border: 1px dashed var(--warn); border-radius: 999px; padding: 0 7px; }
.chip { flex: 0 0 auto; font: 500 15px/1.35 var(--font-mono); color: var(--ink-2); background: var(--stage); border-radius: var(--radius-sm); padding: 0 5px; transition: background var(--dur) var(--ease), color var(--dur) var(--ease); }
.chip.ok { background: var(--ok-tint); color: var(--ok); }
.chip.bad { background: var(--bad-tint); color: var(--bad); }

.acts { display: flex; flex-direction: column; }
.arow { display: grid; grid-template-columns: 62px 1fr auto auto; gap: 10px; align-items: baseline; padding: 1px 0; border-bottom: 1px solid var(--rule); font-size: var(--fs-label); line-height: 1.3; transition: background var(--dur) var(--ease); }
.arow.err { background: var(--bad-tint); }
.own { font-weight: 600; }
.due { white-space: nowrap; font-variant-numeric: tabular-nums; }
.due s { color: var(--bad); }
.fix { color: var(--ok); }
.nodate { color: var(--warn); }
.arow.gap .nodate { font-weight: 600; }
.why { margin: 4px 0 0; display: flex; gap: 8px; align-items: baseline; font-size: var(--fs-label); line-height: 1.3; }

.sum { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 10px 14px; font-size: var(--fs-label); line-height: 1.42; margin-top: 4px; }
.sum p { margin: 0; }
.sum.compact { line-height: 1.34; padding: 7px 12px; }
.corr { white-space: nowrap; background: var(--ok-tint); color: var(--ok); font-weight: 600; padding: 0 3px; border-radius: 2px; }
.collapsed { display: flex; align-items: baseline; gap: 6px; padding-bottom: 3px; border-bottom: 1px solid var(--rule); }
.collapsed h5 { margin-right: 6px; }
.cl-n { margin-left: auto; font-size: var(--fs-label); color: var(--ink-2); }
.counts { margin: 6px 0 0; font-size: var(--fs-label); color: var(--ink-2); }

.qc { list-style: none; margin: 4px 0 4px; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.qc li { display: flex; gap: 7px; align-items: baseline; margin: 0; padding: 0; font-size: var(--fs-label); line-height: 1.28; }
.qd { color: var(--ink-2); }

.s7swap-enter-active, .s7swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.s7swap-enter-from { opacity: 0; transform: translateY(6px); }
.s7swap-leave-to { opacity: 0; }
</style>
