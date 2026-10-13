<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CLAIMS, POOLED, ROWS, TITLE, TOTAL_ON_TIME, TOTAL_SHIPPED, rate } from '../data/s4/spreadsheet'

// Slide 31: each sentence of an AI summary is traced to cells and a formula; one figure fails the recompute.
const { step, next, prev, reset, max } = useArtifactStep(4)
const labels = ['Summary unchecked', 'Trace claim 1', 'Trace claim 2', 'Recompute from source', 'All claims checked']
const DEFAULT_SEL = [null, 'c1', 'c2', 'c2', 'c3']

const picked = ref<string | null>(null)
const forceCheck = ref(false)
watch(step, () => { picked.value = null; forceCheck.value = false })

const selId = computed(() => picked.value ?? DEFAULT_SEL[step.value])
const sel = computed(() => CLAIMS.find(c => c.id === selId.value) ?? null)
const recomputed = computed(() => step.value >= 3 || forceCheck.value)
const showCheck = computed(() => !!sel.value?.check && recomputed.value)

// Status per claim, driven by the step (and by manual inspection).
function status(id: string): { state: 'ok' | 'bad' | 'neutral' | 'active', label: string } {
  const c = CLAIMS.find(x => x.id === id)!
  const done = { c1: step.value >= 1, c2: recomputed.value, c3: step.value >= 4, c4: step.value >= 4 }[id] || (picked.value === id && id !== 'c2')
  if (done) return c.ok ? { state: 'ok', label: 'Matches' } : { state: 'bad', label: 'Wrong' }
  if (selId.value === id) return { state: 'active', label: 'Tracing' }
  return { state: 'neutral', label: 'To check' }
}

const hot = computed(() => new Set(showCheck.value ? sel.value!.check!.cells : sel.value?.cells ?? []))
const used = computed(() => new Set(showCheck.value ? sel.value!.cells : [])) // what the AI used, shown struck
const fmtN = (n: number) => n.toLocaleString('en-GB')
const pct = (x: number) => `${(x * 100).toFixed(1)}%`
const formula = computed(() => !sel.value ? '' : showCheck.value ? sel.value.check!.formula : sel.value.formula)
const result = computed(() => !sel.value ? '' : showCheck.value ? sel.value.check!.result : sel.value.result)
const cellRef = computed(() => !sel.value ? '' : showCheck.value ? 'D8' : `Claim ${CLAIMS.indexOf(sel.value) + 1}`)
const summaryDone = computed(() => step.value >= 4)
</script>

<template>
  <Stage tag="fictional" task="Click a sentence to trace it to the sheet">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="wrap">
      <!-- Sheet -->
      <div class="sheet-col">
        <div class="fx" :class="{ bad: showCheck === false && sel && !sel.ok && step >= 2, check: showCheck }">
          <span class="ref mono">{{ cellRef || '—' }}</span>
          <span class="fx-l">fx</span>
          <Transition name="s4fade" mode="out-in">
            <span v-if="formula" :key="formula" class="fx-f mono">{{ formula }}</span>
            <span v-else key="none" class="fx-f fx-ph">Select a sentence to see its formula</span>
          </Transition>
        </div>
        <table class="sheet" :aria-label="TITLE">
          <thead>
            <tr><th class="rh" /><th>A</th><th>B</th><th>C</th><th>D</th></tr>
          </thead>
          <tbody>
            <tr class="hdr">
              <td class="rh">1</td><td>Depot</td><td class="n">Shipped</td><td class="n">On time</td><td class="n">Rate</td>
            </tr>
            <tr v-for="(r, i) in ROWS" :key="r.depot">
              <td class="rh">{{ i + 2 }}</td>
              <td>{{ r.depot }}</td>
              <td class="n mono" :class="{ hot: hot.has(`B${i + 2}`) }">{{ fmtN(r.shipped) }}</td>
              <td class="n mono" :class="{ hot: hot.has(`C${i + 2}`) }">{{ fmtN(r.onTime) }}</td>
              <td class="n mono" :class="{ hot: hot.has(`D${i + 2}`), used: used.has(`D${i + 2}`) }">{{ pct(rate(r)) }}</td>
            </tr>
            <tr class="tot">
              <td class="rh">8</td>
              <td>Total</td>
              <td class="n mono" :class="{ hot: hot.has('B8') }">{{ recomputed ? fmtN(TOTAL_SHIPPED) : '' }}</td>
              <td class="n mono" :class="{ hot: hot.has('C8') }">{{ recomputed ? fmtN(TOTAL_ON_TIME) : '' }}</td>
              <td class="n mono" :class="{ hot: hot.has('D8'), badcell: hot.has('D8') }">{{ recomputed ? pct(POOLED) : '' }}</td>
            </tr>
          </tbody>
        </table>
        <p class="target">Target: 93% of deliveries on time. Ask for the formula, not just the answer.</p>
      </div>

      <!-- AI summary -->
      <div class="sum-col">
        <div class="sum-h">AI-written summary</div>
        <ol class="claims">
          <li v-for="c in CLAIMS" :key="c.id">
            <button class="claim" :class="{ sel: selId === c.id, wrong: status(c.id).state === 'bad' }" @click="picked = c.id">
              <span class="ctext">
                <span :class="{ struck: status(c.id).state === 'bad' && summaryDone }">{{ c.text }}</span>
                <span v-if="c.check && status(c.id).state === 'bad' && summaryDone" class="fix">{{ c.check.correction }}</span>
              </span>
              <Status :state="status(c.id).state" :label="status(c.id).label" compact />
            </button>
          </li>
        </ol>

        <Transition name="s4fade" mode="out-in">
          <div v-if="sel" :key="selId + String(showCheck)" class="verdict" :class="{ bad: showCheck, warn: !showCheck && sel.check }">
            <template v-if="showCheck">
              <strong>Recomputed from the raw counts: {{ pct(POOLED) }}.</strong>
              Averaging the six percentages gives small Westmoor the same weight as Harbour.
            </template>
            <template v-else-if="sel.check">
              <span>The AI averaged column D: {{ sel.result }}. Does that match the raw counts?</span>
              <button class="btn btn-primary recompute" @click="forceCheck = true">Recompute from source data</button>
            </template>
            <span v-else-if="summaryDone && picked === null">3 of 4 sentences match the sheet. One figure was corrected from the raw counts.</span>
            <span v-else>Formula gives <span class="mono res">{{ sel.result }}</span> — matches the sentence.</span>
          </div>
          <div v-else key="none" class="verdict neutral">
            Four sentences, four checks. Trace each figure to cells and a formula.
          </div>
        </Transition>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1; min-height: 0; }

.sheet-col { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.fx {
  display: flex; align-items: center; gap: 8px;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm);
  padding: 4px 8px; min-height: 32px;
  transition: border-color var(--dur) var(--ease);
}
.fx.check { border-color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); }
.ref { font-size: 14px; color: var(--ink-2); border-right: 1px solid var(--rule); padding-right: 8px; min-width: 28px; white-space: nowrap; }
.fx-l { font-style: italic; color: var(--ink-3); font-size: 15px; }
.fx-ph { color: var(--ink-3); font-family: var(--font-sans); }
.fx-f { font-size: 15px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sheet { width: 100%; border-collapse: collapse; font-size: 15px; background: var(--surface); table-layout: fixed; }
.sheet th, .sheet td { border: 1px solid var(--rule); padding: 3px 8px; line-height: 1.25; }
.sheet th { background: var(--stage); font-weight: 500; color: var(--ink-3); text-align: center; font-size: 14px; padding: 1px; border-bottom: 1px solid var(--rule); }
.sheet .rh { width: 26px; background: var(--stage); color: var(--ink-3); text-align: center; font-size: 14px; padding: 3px 0; }
.sheet th:nth-child(2) { width: 30%; }
.hdr td { font-weight: 600; color: var(--ink-2); font-size: 15px; }
.n { text-align: right; }
.sheet td.mono { font-size: 15px; }
.tot td { border-top: 1.5px solid var(--ink); font-weight: 600; height: 27px; }
.hot { background: var(--accent-tint); box-shadow: inset 0 0 0 1.5px var(--accent); transition: background var(--dur) var(--ease); }
.used { background: var(--bad-tint) !important; box-shadow: none; text-decoration: line-through; text-decoration-color: var(--bad); color: var(--ink-2); }
.badcell { color: var(--accent-strong); }
.tip { margin-top: 6px; font-size: 15px; }
.target { margin: 0; font-size: var(--fs-label); color: var(--ink-2); }

.sum-col { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.sum-h { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); }
.claims { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; counter-reset: c; }
.claims li { margin: 0; padding: 0; }
.claim {
  width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
  text-align: left; font: inherit; font-size: 15px; line-height: 1.3; color: var(--ink);
  background: var(--surface); border: 1px solid var(--rule); border-left: 3px solid var(--rule-strong);
  border-radius: var(--radius-sm); padding: 5px 10px; cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.claim:hover { border-color: var(--ink-3); }
.claim:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.claim.sel { border-left-color: var(--accent); background: var(--accent-tint); }
.claim.wrong { border-left-color: var(--bad); }
.ctext { display: flex; flex-direction: column; gap: 2px; }
.struck { text-decoration: line-through; text-decoration-color: var(--bad); color: var(--ink-2); font-size: 15px; }
.fix { font-weight: 600; color: var(--ink); }
.claim :deep(.status) { margin-top: 2px; flex: 0 0 auto; }

.verdict { font-size: 15px; line-height: 1.32; padding: 7px 12px; background: var(--surface); border-left: 3px solid var(--ok); display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.verdict.bad { border-left-color: var(--bad); }
.verdict.warn { border-left-color: var(--warn); }
.verdict.neutral { border-left-color: var(--rule-strong); color: var(--ink-2); }
.recompute { padding: 6px 12px; }
.res { font-size: 15px; }

.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
