<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { WORDING_CASES } from '../data/s2/wording'

// Slide 13 — the same classification task under four kinds of wording change.
// Outputs are simulated; the research findings under each pair are cited.
const { step, max, go, next, prev, reset } = useArtifactStep(WORDING_CASES.length - 1)
const c = computed(() => WORDING_CASES[step.value])
const lines = (p: string[]) => p
</script>

<template>
  <Stage tag="simulated">
    <template #controls>
      <div class="tabs" role="tablist" aria-label="Kind of change">
        <button v-for="(w, i) in WORDING_CASES" :key="w.id" role="tab" class="btn" :aria-pressed="step === i" :aria-selected="step === i" @click.stop="go(i)">{{ w.tab }}</button>
      </div>
    </template>

    <div class="we">
      <p class="task">
        <span class="k">Task</span> label a customer message <strong>Urgent</strong> or <strong>Routine</strong>.
        <span class="k ch">Changed:</span> {{ c.change }}.
      </p>

      <Transition name="fade" mode="out-in">
        <div :key="c.id" class="pair">
          <section v-for="(v, j) in [c.a, c.b]" :key="j" class="card">
            <h3>{{ v.name }}</h3>
            <pre class="prompt mono"><template v-for="(l, k) in lines(v.prompt)" :key="k">{{ l }}
</template></pre>
            <div class="out">
              <span class="arrow" aria-hidden="true">→</span>
              <span class="ans mono" :class="{ long: v.output.length > 20 }">{{ v.output }}</span>
              <Status :state="v.state" :label="v.verdict" />
            </div>
          </section>
        </div>
      </Transition>

      <div class="why">
        <p class="mech"><strong>Why:</strong> {{ c.mechanism }}</p>
        <p class="find">{{ c.finding }}<Cite v-if="c.cite.length" :k="c.cite" /></p>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.tabs { display: inline-flex; gap: 6px; margin-right: auto; }
.tabs .btn { white-space: nowrap; padding: 7px 12px; }
.spacer { flex: 1; }
.we { display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 0; }
.task { margin: 0; font-size: var(--fs-label); color: var(--ink); }
.k { font-weight: 600; color: var(--ink-2); margin-right: 4px; }
.k.ch { margin-left: 14px; color: var(--accent); }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); padding: 8px 12px 10px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.card h3 { margin: 0; font-size: var(--fs-label); font-weight: 600; }
.prompt { margin: 0; font-size: 15px; line-height: 1.32; white-space: pre-wrap; background: var(--stage); border-radius: var(--radius-sm); padding: 8px 10px; min-height: 0; flex: 1; color: var(--ink); }
.out { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.arrow { color: var(--ink-3); }
.ans { font-size: 15px; font-weight: 600; color: var(--ink); max-width: 100%; }
.ans.long { font-weight: 400; font-size: 15px; }
.out :deep(.status) { margin-left: auto; }
.why { display: flex; flex-direction: column; gap: 4px; }
.why p { margin: 0; font-size: var(--fs-label); line-height: 1.35; }
.mech { color: var(--ink); }
.find { color: var(--ink-2); }
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
