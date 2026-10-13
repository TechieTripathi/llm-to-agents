<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CHOOSE, DECISION, EXPAND, GATE1, IMPROVE, PILOT, RMF, SCORE, STATIONS, STEP_LABELS } from '../data/s8/roadmap'

// Slide 63 — start small, measure, decide at gates, expand cautiously.
const { step, next, prev, reset, max } = useArtifactStep(5)

const cols = STATIONS.map(s => (s.kind === 'gate' ? '0.62fr' : '1fr')).join(' ')
const reached = (at: number) => step.value >= at
const current = (at: number) => step.value === at || (step.value === 5 && at === 4)
// Track segment i (after station i) is lit once the next station is reached.
const segLit = (i: number) => i < STATIONS.length - 1 && reached(STATIONS[i + 1].at)
const showRmf = computed(() => step.value >= 5)

// Bracket from Improve back to Pilot, positioned by the grid's fr weights.
const weights = STATIONS.map(s => (s.kind === 'gate' ? 0.62 : 1))
const total = weights.reduce((a, b) => a + b, 0)
const centre = (i: number) => (weights.slice(0, i).reduce((a, b) => a + b, 0) + weights[i] / 2) / total * 100
const iPilot = STATIONS.findIndex(s => s.id === 'pilot')
const iImprove = STATIONS.findIndex(s => s.id === 'improve')
const loopStyle = { left: `${centre(iPilot)}%`, width: `${centre(iImprove) - centre(iPilot)}%` }
</script>

<template>
  <Stage task="Step along the roadmap" tag="fictional">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="STEP_LABELS" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="road">
      <!-- Track -->
      <div class="track" :style="{ gridTemplateColumns: cols }">
        <div class="loop" :class="{ on: step >= 4 }" :style="loopStyle" aria-hidden="true">
          <svg class="head" width="10" height="8" viewBox="0 0 10 8"><path d="M1 1l4 6 4-6" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
          <span class="lt">re-test loop</span>
        </div>
        <div
          v-for="(s, i) in STATIONS" :key="s.id" class="st"
          :class="[s.kind, { on: reached(s.at), cur: current(s.at) && !showRmf, first: i === 0, last: i === STATIONS.length - 1 }]"
        >
          <div class="mk">
            <span class="seg l" :class="{ lit: i > 0 && segLit(i - 1) }" />
            <svg v-if="s.kind === 'stage'" class="dot" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /></svg>
            <svg v-else class="dia" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 1.5L16.5 9 9 16.5 1.5 9z" /></svg>
            <span class="seg r" :class="{ lit: segLit(i) }" />
          </div>
          <div class="nm">{{ s.name }}</div>
          <div class="wh">{{ s.what }}</div>
        </div>
      </div>

      <!-- NIST AI RMF band (loose teaching alignment) -->
      <Transition name="swap">
      <div v-if="showRmf" class="rmf" :style="{ gridTemplateColumns: cols }" aria-label="NIST AI RMF functions">
        <div class="gov" :style="{ gridColumn: `1 / ${STATIONS.length + 1}` }"><strong>Govern</strong> runs throughout: policy, roles, accountability</div>
        <div v-for="r in RMF" :key="r.fn" class="fn" :style="{ gridColumn: `${r.from + 1} / ${r.to + 2}` }">
          <strong>{{ r.fn }}</strong> {{ r.note }}
        </div>
      </div>
      </Transition>

      <!-- Detail for the current step -->
      <Transition name="swap" mode="out-in">
        <div :key="step" class="detail">
          <template v-if="step === 0">
            <div class="col">
              <p class="h">Pick: {{ CHOOSE.task }}</p>
              <ul class="ticks">
                <li v-for="w in CHOOSE.why" :key="w"><Status state="ok" compact /> {{ w }}</li>
              </ul>
            </div>
            <div class="col">
              <p class="h">Baseline: last four reports</p>
              <dl class="kv">
                <template v-for="b in CHOOSE.baseline" :key="b.k"><dt>{{ b.k }}</dt><dd>{{ b.v }}</dd></template>
              </dl>
            </div>
          </template>

          <template v-else-if="step === 1">
            <div class="col">
              <p class="h">Gate 1: safe to try?</p>
              <dl class="kv">
                <template v-for="g in GATE1" :key="g.q"><dt>{{ g.q }}</dt><dd><Status state="ok" compact /> {{ g.a }}</dd></template>
              </dl>
            </div>
            <div class="col">
              <p class="h">Pilot</p>
              <dl class="kv">
                <template v-for="p in PILOT" :key="p.k"><dt>{{ p.k }}</dt><dd>{{ p.v }}</dd></template>
              </dl>
            </div>
          </template>

          <template v-else-if="step === 2">
            <div class="col wide">
              <table class="score">
                <thead><tr><th>Measure</th><th>Baseline</th><th>Pilot</th><th>Result</th></tr></thead>
                <tbody>
                  <tr v-for="r in SCORE" :key="r.m">
                    <td class="m">{{ r.m }}</td><td>{{ r.base }}</td><td>{{ r.pilot }}</td>
                    <td><Status :state="r.state" :label="r.state === 'ok' ? 'Better' : 'Watch'" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template v-else-if="step === 3">
            <div class="col wide">
              <p class="h">Gate 2: better, safely? Decide with the evidence.</p>
              <div class="rules">
                <div v-for="d in DECISION" :key="d.id" class="rule" :class="{ pick: d.pick }">
                  <span class="when">{{ d.when }}</span>
                  <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true"><path d="M1 5h18M15 1.5l4 3.5-4 3.5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
                  <Status :state="d.pick ? 'active' : 'neutral'" :label="d.then" />
                  <span v-if="d.pick" class="ours">Kestrel's pilot: faster and better, but one wrong date slipped into a draft.</span>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="step === 4">
            <div class="col">
              <p class="h">Improve, then re-test</p>
              <dl class="kv">
                <template v-for="p in IMPROVE" :key="p.k"><dt>{{ p.k }}</dt><dd>{{ p.v }}</dd></template>
              </dl>
            </div>
            <div class="col">
              <p class="h">Expand, cautiously</p>
              <dl class="kv">
                <template v-for="p in EXPAND" :key="p.k"><dt>{{ p.k }}</dt><dd>{{ p.v }}</dd></template>
              </dl>
            </div>
          </template>

          <template v-else>
            <div class="col">
              <p class="h">The same loop, in a recognised framework</p>
              <p class="t">NIST AI RMF<Cite k="nist2023airmf" />: govern, map, measure and manage, applied iteratively. Test before deployment and regularly in operation.</p>
            </div>
            <div class="col">
              <p class="h">If you need something formal</p>
              <p class="t">NIST's generative AI profile<Cite k="s8nist2024genai" /> lists risks to check. ISO/IEC 42001<Cite k="s8iso42001" /> sets requirements for an AI management system.</p>
            </div>
          </template>
        </div>
      </Transition>
    </div>

    <template #notice>
      Measure before and after. Expand only what is better on <strong>time and quality</strong> at acceptable <strong>risk</strong>.
    </template>
  </Stage>
</template>

<style scoped>
.road { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 8px; }

/* Track */
.track { display: grid; column-gap: 0; position: relative; padding-top: 16px; }
.loop {
  position: absolute; top: 4px; height: 16px;
  border: 1.5px dashed var(--accent); border-bottom: 0; border-radius: 8px 8px 0 0;
  color: var(--accent); opacity: 0; transition: opacity var(--dur) var(--ease);
}
.loop.on { opacity: 1; }
.loop .head { position: absolute; left: -5.75px; bottom: -4px; }
.loop .lt { position: absolute; left: 50%; top: -9px; transform: translateX(-50%); background: var(--stage); padding: 0 6px; font-size: 14px; line-height: 16px; color: var(--accent); white-space: nowrap; }
.st { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; padding: 0 4px; }
.mk { position: relative; width: calc(100% + 8px); height: 20px; display: flex; align-items: center; justify-content: center; }
.seg { position: absolute; top: 50%; height: 2px; margin-top: -1px; background: var(--rule-strong); transition: background var(--dur) var(--ease); }
.seg.l { left: 0; right: 50%; }
.seg.r { left: 50%; right: 0; }
.seg.lit { background: var(--accent); }
.st.first .seg.l, .st.last .seg.r { display: none; }
.dot, .dia { position: relative; z-index: 1; fill: var(--paper); stroke: var(--rule-strong); stroke-width: 1.5; transition: fill var(--dur) var(--ease), stroke var(--dur) var(--ease); }
.st.on .dot { fill: var(--accent); stroke: var(--accent); }
.st.on .dia { fill: var(--surface); stroke: var(--accent); stroke-width: 2; }
.st.cur .dot { stroke: var(--accent-tint-2); stroke-width: 4; }
.nm { font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink-3); transition: color var(--dur) var(--ease); }
.st.on .nm { color: var(--ink); }
.st.gate .nm { font-weight: 500; font-size: 14px; }
.st.gate.on .nm { color: var(--accent); }
.wh { font-size: 14px; line-height: 1.25; color: var(--ink-3); max-width: 13ch; transition: color var(--dur) var(--ease); }
.st.on .wh { color: var(--ink-2); }

/* RMF band */
.rmf { display: grid; row-gap: 3px; }
.gov, .fn { font-size: 14px; line-height: 1; padding: 5px 8px; border-radius: var(--radius-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gov { grid-row: 1; background: var(--accent-tint); color: var(--accent-strong); text-align: center; }
.fn { grid-row: 2; margin: 0 3px; border: 1px solid var(--accent-tint-2); color: var(--ink-2); text-align: center; }
.fn strong, .gov strong { color: var(--accent-strong); }

/* Detail */
.detail {
  flex: 1 1 auto; min-height: 0;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius);
  padding: 14px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-content: start;
}
.col { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.col.wide { grid-column: 1 / -1; }
.h { margin: 0; font: 600 var(--fs-small)/1.3 var(--font-sans); color: var(--ink); }
.t { margin: 0; font-size: var(--fs-small); line-height: 1.4; color: var(--ink-2); }
.ticks { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
.ticks li { margin: 0; padding: 0; display: flex; align-items: center; gap: 8px; font-size: var(--fs-small); color: var(--ink-2); }
.kv { margin: 0; display: grid; grid-template-columns: auto 1fr; column-gap: 16px; row-gap: 5px; font-size: var(--fs-small); }
.kv dt { color: var(--ink-2); }
.kv dd { margin: 0; color: var(--ink); font-weight: 500; display: flex; align-items: center; gap: 6px; }

.score { font-size: var(--fs-small); }
.score th { font-size: var(--fs-label); padding: 2px 10px 5px; }
.score td { padding: 5px 10px; vertical-align: middle; }
.score .m { font-weight: 600; }
.score :deep(.status) { font-size: 15px; padding: 2px 8px 2px 5px; }

.rules { display: flex; flex-direction: column; gap: 6px; }
.rule { display: grid; grid-template-columns: 250px 22px auto 1fr; align-items: center; column-gap: 12px; padding: 6px 10px; border-radius: var(--radius-sm); color: var(--ink-3); font-size: var(--fs-small); }
.rule .when { color: var(--ink-2); }
.rule.pick { background: var(--accent-tint); color: var(--accent); }
.rule.pick .when { color: var(--ink); font-weight: 600; }
.ours { font-size: 15px; color: var(--ink-2); line-height: 1.3; }

.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
