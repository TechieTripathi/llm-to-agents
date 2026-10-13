<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { H_CLAIMS, H_POLICY, H_QUESTION, KIND_STATUS } from '../data/s2/hallucination'

// Slide 16 — a fluent answer checked claim by claim against a (fictional) policy.
// Step 0: unchecked. Steps 1–5: one claim checked per step. Step 6: calibrated trust.
const { step, max, next, prev, reset } = useArtifactStep(H_CLAIMS.length + 1)
const checked = computed(() => Math.min(step.value, H_CLAIMS.length))
const current = computed(() => (step.value >= 1 && step.value <= H_CLAIMS.length ? H_CLAIMS[step.value - 1] : null))
const summary = computed(() => step.value > H_CLAIMS.length)
const supported = H_CLAIMS.filter(c => c.kind === 'supported').length
const stateOf = (i: number) => (i < checked.value ? KIND_STATUS[H_CLAIMS[i].kind] : 'neutral')
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
const stepLabels = ['Unchecked', 'Claim 1', 'Claim 2', 'Claim 3', 'Claim 4', 'Claim 5', 'Trust']
const LABEL = { supported: 'Supported', contradicted: 'Contradicted', unsupported: 'Unsupported', fabricated: 'Invented source', reasoning: 'Reasoning error' }
</script>

<template>
  <Stage task="Check one claim per step" tag="fictional">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="stepLabels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="hc">
      <section class="left">
        <p class="q"><span class="lab">Question</span> <span class="qt">“{{ H_QUESTION }}”</span></p>
        <div class="answer">
          <span class="lab">AI answer <span class="muted">· simulated, fluent, confident</span></span>
          <p class="prose">
            Yes.
            <template v-for="(c, i) in H_CLAIMS" :key="c.id">
              <span class="cl" :class="[stateOf(i), { cur: current?.id === c.id }]"><sup class="n">{{ i + 1 }}</sup>{{ c.text }}</span>{{ ' ' }}
            </template>
          </p>
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="step === 0" key="start" class="verdict">
            <Status state="neutral" label="Not yet checked" />
            <p>It sounds authoritative. Nothing in the tone tells you which parts are right.</p>
          </div>
          <div v-else-if="current" :key="current.id" class="verdict">
            <Status :state="KIND_STATUS[current.kind]" :label="`Claim ${step}: ${LABEL[current.kind]}`" />
            <p>{{ cap(current.verdict.replace(/^[^—]*— ?/, '')) }}.</p>
          </div>
          <div v-else key="sum" class="trust">
            <p class="score"><strong>{{ supported }} of {{ H_CLAIMS.length }} claims hold up.</strong> Calibrate your trust:</p>
            <ul>
              <li><Status state="ok" compact /> Low stakes, easy to check: spot-check a claim.</li>
              <li><Status state="warn" compact /> Numbers, policy, money, people: check every claim.</li>
              <li><Status state="bad" compact /> No source to check against: treat it as a draft.</li>
            </ul>
          </div>
        </Transition>
      </section>

      <section class="src">
        <h3 class="lab">Source: {{ H_POLICY.title }}</h3>
        <ol class="clauses">
          <li v-for="cl in H_POLICY.clauses" :key="cl.no" :class="{ hit: current?.clause === cl.no }">
            <span class="no mono">{{ cl.no }}</span><span>{{ cl.text }}</span>
          </li>
          <li v-if="current?.kind === 'fabricated'" class="ghost">
            <span class="no mono">7.3</span><span>Not found. {{ H_POLICY.footer }}</span>
          </li>
          <li v-else-if="current?.kind === 'unsupported'" class="ghost">
            <span class="no mono">?</span><span>Nothing in the policy mentions receipt thresholds.</span>
          </li>
          <li v-else-if="current?.kind === 'reasoning'" class="ghost">
            <span class="no mono">=</span><span class="mono">2 × €50 = €100<br>(policy: 2 × €40 = €80)</span>
          </li>
        </ol>
      </section>
    </div>
  </Stage>
</template>

<style scoped>
.hc { display: grid; grid-template-columns: 1.3fr 1fr; gap: 18px; flex: 1; min-height: 0; }
.lab { font-size: var(--fs-label); font-weight: 600; color: var(--ink); margin: 0; }
.lab .muted { font-weight: 400; color: var(--ink-3); }
.left { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.q { margin: 0; font-size: 15px; line-height: 1.3; }
.qt { font-style: italic; }
.answer { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); padding: 7px 12px 8px; }
.prose { margin: 3px 0 0; font-size: 15px; line-height: 1.55; color: var(--ink); }
.cl { border-bottom: 2.5px solid transparent; padding-bottom: 1px; transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.cl .n { font-size: 14px; font-weight: 600; color: var(--ink-3); margin-right: 2px; }
.cl.ok { border-color: var(--ok); }
.cl.warn { border-color: var(--warn); }
.cl.bad { border-color: var(--bad); }
.cl.cur { background: var(--accent-tint); }
.cl.bad.cur { background: var(--bad-tint); }
.cl.warn.cur { background: var(--warn-tint); }
.cl.ok.cur { background: var(--ok-tint); }
.verdict { display: flex; flex-direction: column; gap: 5px; align-items: flex-start; }
.verdict p { margin: 0; font-size: var(--fs-small); line-height: 1.35; color: var(--ink); }
.verdict :deep(.status .txt) { font-weight: 600; }
.trust { display: flex; flex-direction: column; gap: 4px; }
.score { margin: 0; font-size: var(--fs-label); line-height: 1.35; }
.trust ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.trust li { margin: 0; padding: 0; display: flex; gap: 8px; align-items: center; font-size: 15px; line-height: 1.35; }
.src { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); padding: 8px 12px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.clauses { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.clauses li { display: grid; grid-template-columns: 34px 1fr; gap: 6px; margin: 0; padding: 4px 6px; font-size: 15px; line-height: 1.3; border-radius: var(--radius-sm); transition: background var(--dur) var(--ease); }
.clauses li.hit { background: var(--accent-tint); box-shadow: inset 3px 0 0 var(--accent); }
.no { color: var(--ink-2); font-size: 15px; }
.ghost { border: 1.5px dashed var(--bad); color: var(--bad); }
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
