<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CAPACITY, DOCS, type DocId, ORDER, PRESETS, QUESTION, simulateAnswer } from '../data/s2/context'
import { countTokens } from '../data/s2/tokenize'

// Slide 14 (Artifact C) — choose which documents enter the context. Token counts are real
// (o200k_base); the window size is conceptual and the answers are simulated.
const { step, max, next, prev, reset } = useArtifactStep(PRESETS.length - 1)
const on = ref<Set<DocId>>(new Set())
watch(step, s => { on.value = new Set(PRESETS[s].on) }, { immediate: true })

const tokens = Object.fromEntries(DOCS.map(d => [d.id, countTokens(d.text)])) as Record<DocId, number>
const qTokens = countTokens(QUESTION)

function toggle(id: DocId) {
  const s = new Set(on.value)
  s.has(id) ? s.delete(id) : s.add(id)
  on.value = s
}

const segments = computed(() => [
  ...ORDER.filter(id => on.value.has(id)).map(id => ({ id, n: tokens[id], doc: DOCS.find(d => d.id === id)! })),
])
const used = computed(() => segments.value.reduce((a, s) => a + s.n, 0) + qTokens)
const answer = computed(() => simulateAnswer(on.value))
const fmt = (n: number) => n.toLocaleString('en-GB')
const short: Record<DocId, string> = { brief: 'Brief', appendix: 'API appendix', meeting: 'Meeting', policy: 'Policy', report: 'Ops report' }
// When documents are toggled by hand, the step label no longer describes the selection.
const labels = computed(() => PRESETS.map((p, i) => {
  const same = p.on.length === on.value.size && p.on.every(id => on.value.has(id))
  return i === step.value && !same ? 'Custom selection' : p.label
}))
const listed = ORDER.map(id => DOCS.find(d => d.id === id)!)
</script>

<template>
  <Stage task="Tick documents to include" tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="cw">
      <section class="docs" aria-label="Documents">
        <h3 class="lab">Documents <SimTag kind="fictional" /></h3>
        <button v-for="d in listed" :key="d.id" class="doc" :class="{ in: on.has(d.id), rel: d.relevant }" :aria-pressed="on.has(d.id)" @click.stop="toggle(d.id)">
          <span class="box" aria-hidden="true"><svg v-if="on.has(d.id)" viewBox="0 0 14 14"><path d="M3 7.3l2.6 2.6L11 4.4" /></svg></span>
          <span class="dn">{{ d.title }}</span>
          <span class="dc mono">{{ fmt(tokens[d.id]) }}</span>
          <span class="dg">{{ d.gist }}</span>
        </button>
      </section>

      <section class="right">
        <p class="q"><span class="lab">Question</span> <span class="qt">“{{ QUESTION }}”</span></p>

        <div class="cap">
          <div class="cap-h">
            <span class="lab">Context window</span>
            <span class="cap-n"><strong>{{ fmt(used) }}</strong> of {{ fmt(CAPACITY) }} tokens <span class="muted">· real counts, conceptual size</span></span>
          </div>
          <div class="bar" role="img" :aria-label="`${used} of ${CAPACITY} tokens used`">
            <span v-for="sg in segments" :key="sg.id" class="seg" :class="[sg.id, { rel: sg.doc.relevant }]" :style="{ width: `${(sg.n / CAPACITY) * 100}%` }">
              <span v-if="sg.n / CAPACITY > 0.12" class="sl">{{ short[sg.id] }}</span>
            </span>
            <span class="seg qseg" :style="{ width: `${(qTokens / CAPACITY) * 100}%` }" />
          </div>
          <div class="pos" aria-hidden="true"><span>start</span><span>middle</span><span>end</span></div>
        </div>

        <div class="ans" :class="{ lost: answer.lost }">
          <p class="ah"><span class="lab">Simulated answer</span> <span class="muted">{{ answer.headline }}</span></p>
          <ul class="claims">
            <li v-for="c in answer.claims" :key="c.text">
              <span class="ct">{{ c.text }}</span>{{ ' ' }}<Status :state="c.state" :label="c.note" compact />
            </li>
          </ul>
          <p v-if="answer.lost" class="why">Mid-input details get used less reliably<Cite k="liu2024lost" />; noise distracts.<Cite k="shi2023distracted" /></p>
        </div>
      </section>
    </div>
  </Stage>
</template>

<style scoped>
.cw { display: grid; grid-template-columns: 0.74fr 1.26fr; gap: 18px; flex: 1; min-height: 0; }
.lab { font-size: var(--fs-label); font-weight: 600; color: var(--ink); margin: 0; }
.muted { color: var(--ink-2); font-weight: 400; }
.docs { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.docs h3 { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 2px; }
.doc {
  display: grid; grid-template-columns: 20px 1fr auto; grid-template-rows: auto auto; column-gap: 9px; row-gap: 0; align-items: center; text-align: left;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm);
  padding: 4px 10px; cursor: pointer; font: inherit; color: var(--ink);
  transition: border-color var(--dur) var(--ease), opacity var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
  opacity: 0.7;
}
.doc:hover { border-color: var(--ink-2); }
.doc.in { opacity: 1; border-color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); }
.doc:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.box { grid-row: 1 / 3; width: 18px; height: 18px; border: 1.5px solid var(--ink-3); border-radius: 3px; display: grid; place-items: center; background: var(--surface); }
.doc.in .box { background: var(--accent); border-color: var(--accent); }
.box svg { width: 14px; height: 14px; }
.box path { fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.dn { font-size: var(--fs-label); font-weight: 600; line-height: 1.25; }
.dc { font-size: 15px; color: var(--ink-2); font-variant-numeric: tabular-nums; text-align: right; }
.dg { grid-column: 2 / 4; font-size: 15px; color: var(--ink-2); line-height: 1.25; }
.tk-note { margin: 2px 0 0; font-size: 14px; color: var(--ink-3); }

.right { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.q { margin: 0; display: flex; gap: 8px; align-items: baseline; font-size: 15px; line-height: 1.3; }
.qt { font-size: 15px; line-height: 1.3; font-style: italic; }
.cap-h { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 3px; }
.cap-n { font-size: var(--fs-label); color: var(--ink-2); font-variant-numeric: tabular-nums; }
.cap-n strong { color: var(--ink); }
.cap-n .muted { color: var(--ink-3); }
.bar { display: flex; height: 28px; background: var(--surface); border: 1.5px solid var(--ink-2); border-radius: var(--radius-sm); overflow: hidden; }
.seg { height: 100%; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; overflow: hidden; border-right: 1.5px solid var(--surface); transition: width var(--dur) var(--ease); }
.seg.rel { background: var(--accent); color: #fff; }
.seg.meeting.rel { background: var(--accent-strong); }
.seg:not(.rel) { background: repeating-linear-gradient(135deg, var(--rule) 0 6px, var(--stage) 6px 12px); color: var(--ink); }
.seg.qseg { background: var(--ink); min-width: 4px; }
.sl { font-size: 14px; font-weight: 600; white-space: nowrap; padding: 0 4px; }
.pos { display: flex; justify-content: space-between; font-size: 14px; color: var(--ink-3); margin-top: 1px; }

.ans { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); padding: 5px 12px 6px; flex: 1; min-height: 0; transition: border-color var(--dur) var(--ease); }
.ans.lost { border-color: var(--bad); box-shadow: inset 3px 0 0 var(--bad); }
.ah { margin: 0 0 4px; font-size: var(--fs-label); line-height: 1.3; }
.claims { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.claims li { margin: 0; padding: 0; display: block; font-size: 15px; line-height: 1.28; }
.ct { font-size: var(--fs-label); line-height: 1.3; color: var(--ink); }
.claims :deep(.status) { font-size: 15px; line-height: 1.2; vertical-align: baseline; margin-left: 4px; }
.claims :deep(.status svg) { position: relative; top: 1px; }
.claims :deep(.status .txt) { color: var(--ink-2); }
.why { margin: 5px 0 0; font-size: var(--fs-label); line-height: 1.3; color: var(--bad); }
</style>
