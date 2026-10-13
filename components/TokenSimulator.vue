<script setup lang="ts">
import { computed, ref } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { BRANCHES, END_TOKEN, SIM_PROMPT, SIM_STEPS } from '../data/s2/generation'

// Slide 12 (Artifact A) — autoregressive generation, one token per step.
// Token boundaries are real (o200k_base); probabilities and the "sampled" draw are illustrative.
const { step, max, next, prev, reset } = useArtifactStep(SIM_STEPS)
const temp = ref<'low' | 'high'>('low')

const decisions = computed(() => BRANCHES[temp.value])
const done = computed(() => step.value >= decisions.value.length)
const generated = computed(() => decisions.value.slice(0, Math.min(step.value, decisions.value.length))
  .map(d => d.candidates[d.chosen].t).filter(t => t !== END_TOKEN))
const current = computed(() => (done.value ? null : decisions.value[step.value]))

// The model's (illustrative) odds for the top four candidates, plus the long tail.
const shown = computed(() => {
  const d = current.value
  if (!d) return []
  const rest = Math.max(0, 1 - d.candidates.reduce((a, c) => a + c.p, 0))
  return [
    ...d.candidates.map((c, i) => ({ t: c.t, p: c.p, chosen: i === d.chosen, label: c.t })),
    { t: '__rest', p: rest, chosen: false, label: 'all other tokens' },
  ]
})
const pct = (p: number) => (p < 0.005 ? '<1%' : `${Math.round(p * 100)}%`)
const finals = computed(() => ({
  low: BRANCHES.low.map(d => d.candidates[d.chosen].t).filter(t => t !== END_TOKEN).join('').trim(),
  high: BRANCHES.high.map(d => d.candidates[d.chosen].t).filter(t => t !== END_TOKEN).join('').trim(),
}))
const pickNote = computed(() => {
  if (!current.value) return ''
  const c = current.value
  const topIdx = c.candidates.reduce((bi, x, i, a) => (x.p > a[bi].p ? i : bi), 0)
  if (temp.value === 'low') return 'Greedy: always the top candidate. Same output every run.'
  return c.chosen === topIdx
    ? 'Sampling: a weighted random draw. This time the top candidate came up.'
    : `Sampling: this draw landed on a ${Math.round(c.candidates[c.chosen].p * 100)}% candidate. Everything after it changes.`
})
const disp = (t: string) => (t === END_TOKEN ? 'end' : t.trimStart())
</script>

<template>
  <Stage tag="illustrative">
    <template #controls>
      <span class="dl">Decoding</span>
      <div class="seg" role="group" aria-label="Decoding">
        <button class="btn" :aria-pressed="temp === 'low'" @click.stop="temp = 'low'">Greedy</button>
        <button class="btn" :aria-pressed="temp === 'high'" @click.stop="temp = 'high'">Sample, temperature 1</button>
      </div>
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="sim">
      <section class="ctx">
        <h3 class="lab">Context at this step <span class="muted">— the prompt, plus everything generated so far</span></h3>
        <div class="chips">
          <Token v-for="(t, i) in SIM_PROMPT" :key="`p${i}`" :text="t.trimStart()" :space="t.startsWith(' ')" />
          <span class="sep" aria-hidden="true" />
          <TransitionGroup name="tok">
            <Token v-for="(t, i) in generated" :key="`${temp}-${i}-${t}`" :text="t.trimStart()" :space="t.startsWith(' ')" :state="i === generated.length - 1 ? 'new' : 'chosen'" />
          </TransitionGroup>
          <span v-if="!done" class="cursor" aria-hidden="true">?</span>
        </div>
      </section>

      <div class="lower">
        <section class="cands">
          <template v-if="current">
            <h3 class="lab">Candidates for token {{ step + 1 }}</h3>
            <ul>
              <li v-for="c in shown" :key="c.t" :class="{ chosen: c.chosen, rest: c.t === '__rest' }">
                <span class="ct mono">{{ c.t === '__rest' ? c.label : (c.t === END_TOKEN ? '⟨end⟩' : c.t.replace(/^ /, '·')) }}</span>
                <span class="cb"><span :style="{ width: `${c.p * 100}%` }" /></span>
                <span class="cp">{{ pct(c.p) }}</span>
                <span class="mark">{{ c.chosen ? 'picked' : '' }}</span>
              </li>
            </ul>
          </template>
          <template v-else>
            <h3 class="lab">Finished: the model picked the end token</h3>
            <div class="finals">
              <div :class="{ cur: temp === 'low' }">
                <span class="fl">Greedy</span>
                <p>“{{ finals.low }}”</p>
              </div>
              <div :class="{ cur: temp === 'high' }">
                <span class="fl">Sampled, the draw prepared here</span>
                <p>“{{ finals.high }}”</p>
              </div>
            </div>
          </template>
        </section>

        <aside class="side">
          <div v-if="current" class="how">
            <h3 class="lab">How this token was picked</h3>
            <p>{{ pickNote }}</p>
          </div>
          <div v-else class="how">
            <h3 class="lab">Same prompt, opposite status</h3>
            <p>Both sound plausible. Neither is grounded: the prompt held no project data.</p>
          </div>
          <div class="reason">
            <h3 class="lab">Reasoning models</h3>
            <p>Same loop, run longer: they write intermediate reasoning tokens before answering — more computation at inference time.<Cite :k="['openai2024o1', 'deepseek2025r1']" /></p>
          </div>
        </aside>
      </div>
    </div>

  </Stage>
</template>

<style scoped>
.dl { font-size: var(--fs-label); color: var(--ink-2); margin-right: -2px; }
.seg { display: inline-flex; margin-right: auto; }
.seg .btn { border-radius: 0; padding: 6px 10px; white-space: nowrap; }
.seg .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.seg .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; border-left: 0; }
.sim { display: flex; flex-direction: column; gap: 10px; flex: 1; min-height: 0; }
.lab { font-size: var(--fs-label); font-weight: 600; margin: 0 0 5px; color: var(--ink); line-height: 1.25; }
.lab .muted { font-weight: 400; }
.ctx { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); padding: 7px 12px 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 4px 3px; align-items: center; min-height: 66px; align-content: flex-start; }
.chips :deep(.tok) { font-size: 15px; padding: 4px 5px; }
.sep { width: 1.5px; height: 24px; background: var(--rule-strong); margin: 0 6px; }
.cursor { font: 500 16px/1 var(--font-mono); color: var(--accent); border: 1.5px dashed var(--accent); border-radius: var(--radius-sm); padding: 4px 7px; }
.tok-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.tok-enter-from { opacity: 0; transform: translateY(-6px); }
.lower { display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; flex: 1; min-height: 0; }
.cands ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.cands li { display: grid; grid-template-columns: 140px 1fr 44px 50px; align-items: center; gap: 8px; margin: 0; padding: 0; font-size: 15px; line-height: 1.3; }
.ct { white-space: pre; }
.rest .ct { font-family: var(--font-sans); color: var(--ink-2); }
.cb { height: 14px; background: var(--surface); border-radius: 2px; overflow: hidden; }
.cb span { display: block; height: 100%; background: var(--ink-3); transition: width var(--dur) var(--ease); }
.rest .cb span { background: var(--rule-strong); }
.cp { text-align: right; font-variant-numeric: tabular-nums; color: var(--ink-2); }
.mark { color: var(--accent); font-weight: 600; }
.chosen .cb span { background: var(--accent); }
.chosen .ct, .chosen .cp { color: var(--accent); font-weight: 600; }
.finals { display: flex; flex-direction: column; gap: 6px; }
.finals > div { border-left: 3px solid var(--rule-strong); padding: 1px 0 1px 10px; }
.finals > div.cur { border-color: var(--accent); }
.fl { font-size: var(--fs-label); color: var(--ink-2); }
.finals p { margin: 1px 0 0; font-size: var(--fs-small); line-height: 1.3; }
.side { display: flex; flex-direction: column; gap: 10px; border-left: 1px solid var(--rule); padding-left: 18px; }
.side p { margin: 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink-2); }
</style>
