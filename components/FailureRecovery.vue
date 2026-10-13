<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { FAILURES } from '../data/s5/failures'

// Slide 40 — clicks: for each failure, first the naive loop, then the engineered loop beside it.
const { step, next, prev, reset, go } = useArtifactStep(FAILURES.length * 2 - 1)
const idx = computed(() => Math.floor(step.value / 2))
const showEng = computed(() => step.value % 2 === 1)
const f = computed(() => FAILURES[idx.value])
const labels = FAILURES.flatMap(() => ['Naive loop', 'Both loops'])
</script>

<template>
  <Stage task="Pick a failure. Compare the two loops." tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="FAILURES.length * 2 - 1" :labels="labels" @next="next" @prev="prev" @reset="reset" />
    </template>

    <div class="fr">
      <div class="tabs" role="tablist" aria-label="Failure type">
        <button
          v-for="(x, i) in FAILURES" :key="x.id" role="tab" class="tab" :aria-selected="i === idx"
          :class="{ on: i === idx }" @click.stop="go(i * 2 + 1)"
        >
          <span class="tab-n">{{ x.name }}</span>
          <Status :state="x.kindTone" :label="x.kind" compact />
        </button>
      </div>

      <Transition name="swap" mode="out-in">
        <div :key="f.id" class="lanes">
          <div class="lane naive">
            <div class="lane-k">
              <strong>Naive loop</strong>
              <span>repeats the same call</span>
            </div>
            <div class="seq">
              <template v-for="(a, j) in f.naive.attempts" :key="j">
                <div class="att" :class="a.tone">
                  <span class="att-n">Attempt {{ j + 1 }}</span>
                  <code>{{ a.action }}</code>
                  <span class="att-r">{{ a.result }}</span>
                </div>
                <svg class="arr" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h14M11 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
              </template>
              <div class="out" :class="f.naive.outcome.tone">
                <Status :state="f.naive.outcome.tone" compact />
                <span>{{ f.naive.outcome.label }}</span>
              </div>
            </div>
          </div>

          <div class="lane eng" :class="{ waiting: !showEng }">
            <div class="lane-k">
              <strong>Engineered loop</strong>
              <span>classifies, then responds</span>
            </div>
            <div class="seq">
              <template v-for="(a, j) in f.engineered.attempts" :key="j">
                <div class="att" :class="a.tone">
                  <span class="att-n">{{ j === 0 ? 'Attempt 1' : 'Then' }}</span>
                  <code>{{ a.action }}</code>
                  <span class="att-r">{{ a.result }}</span>
                </div>
                <svg v-if="j < f.engineered.attempts.length - 1" class="arr" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h14M11 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
              </template>
              <div v-for="n in 3 - f.engineered.attempts.length" :key="'sp' + n" class="att spacer" aria-hidden="true" />
              <svg class="arr" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h14M11 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
              <div class="out" :class="f.engineered.outcome.tone">
                <Status :state="f.engineered.outcome.tone" compact />
                <span>{{ f.engineered.outcome.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div class="rule" :class="{ waiting: !showEng }">
        <span class="rule-k">Rule</span>
        <span>{{ f.rule }}</span>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.fr { display: flex; flex-direction: column; gap: 12px; flex: 1 1 auto; min-height: 0; }
.tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.tab { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; text-align: left; padding: 8px 12px; background: var(--surface); border: 1px solid var(--rule-strong); border-radius: var(--radius-sm); cursor: pointer; font: inherit; color: var(--ink); transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.tab.on { border-color: var(--accent); box-shadow: inset 0 -3px 0 var(--accent); }
.tab-n { font-size: var(--fs-label); font-weight: 600; }
.tab :deep(.status) { font-size: 14px; }
.tab :deep(.txt) { color: var(--ink-2); }

.lanes { display: flex; flex-direction: column; gap: 10px; }
.lane { display: grid; grid-template-columns: 150px 1fr; gap: 12px; align-items: stretch; transition: opacity var(--dur) var(--ease); }
.lane.waiting { opacity: 0.18; }
.lane-k { display: flex; flex-direction: column; justify-content: center; gap: 2px; font-size: var(--fs-label); line-height: 1.25; border-left: 3px solid var(--rule-strong); padding-left: 10px; }
.eng .lane-k { border-color: var(--accent); }
.eng .lane-k strong { color: var(--accent); }
.lane-k span { color: var(--ink-2); font-size: 15px; }
.seq { display: flex; align-items: center; gap: 4px; min-width: 0; }
.att { flex: 1 1 0; min-width: 0; align-self: stretch; display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; background: var(--surface); border: 1px solid var(--rule); border-top: 3px solid var(--rule-strong); border-radius: var(--radius-sm); }
.att.bad { border-top-color: var(--bad); }
.att.ok { border-top-color: var(--ok); }
.att.warn { border-top-color: var(--warn); }
.att.spacer { border: none; background: none; padding: 0; position: relative; }
.att.spacer::before { content: ''; position: absolute; left: -4px; right: -2px; top: 50%; border-top: 1.5px dashed var(--rule-strong); }
.att-n { font-size: 14px; color: var(--ink-3); }
.att code { font: 400 15px/1.3 var(--font-mono); color: var(--ink); background: none; padding: 0; word-break: break-word; }
.att-r { font-size: var(--fs-label); font-weight: 500; line-height: 1.25; }
.att.bad .att-r { color: var(--bad); }
.att.ok .att-r { color: var(--ok); }
.att.warn .att-r { color: var(--warn); }
.arr { flex: 0 0 18px; color: var(--ink-3); }
.out { flex: 1.15 1 0; min-width: 0; align-self: stretch; display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: var(--radius-sm); font-size: var(--fs-label); font-weight: 600; line-height: 1.25; }
.out.bad { background: var(--bad-tint); color: var(--bad); }
.out.ok { background: var(--ok-tint); color: var(--ok); }
.out.warn { background: var(--warn-tint); color: var(--warn); }
.out span { color: var(--ink); }
.rule { display: flex; gap: 12px; align-items: baseline; font-size: var(--fs-small); border-top: 1px solid var(--rule); padding-top: 8px; transition: opacity var(--dur) var(--ease); }
.rule.waiting { opacity: 0.18; }
.rule-k { font-weight: 600; color: var(--accent); font-size: var(--fs-label); }
.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
