<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { QUESTIONS, TAKEAWAYS } from '../data/s8/takeaways'

// Slide 65 — the journey strip from the top of every slide, enlarged into the closing picture.
// Step 0: the five stages. Steps 1–5: one takeaway each. Step 6: accountability spans it all + questions.
const N = TAKEAWAYS.length
const { step } = useArtifactStep(N + 1)
const all = computed(() => step.value > N)
const state = (i: number) => (all.value ? (i === N - 1 ? 'on' : 'past') : step.value === i + 1 ? 'on' : step.value > i + 1 ? 'past' : 'future')
</script>

<template>
  <div class="tj">
    <ol class="row" aria-label="From model to verified workflow">
      <li v-for="(t, i) in TAKEAWAYS" :key="t.stage" class="col" :class="state(i)">
        <div class="node">
          <span class="nm">{{ t.stage }}</span>
        </div>
        <svg v-if="i < N - 1" class="arrow" width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
          <path d="M1 6h22M18 1.5l5 4.5-5 4.5" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <p class="tk">
          {{ t.text[0] }}<strong>{{ t.text[1] }}</strong>{{ t.text[2] }}
        </p>
      </li>
    </ol>

    <div class="span" :class="{ on: all }" aria-hidden="true">
      <span class="rule" />
      <span class="lbl">You stay accountable at every step</span>
      <span class="rule" />
    </div>

    <section class="qa" :class="{ on: all }">
      <h2 class="q">Questions</h2>
      <ul class="prompts">
        <li v-for="q in QUESTIONS" :key="q">{{ q }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tj { flex: 1 1 auto; display: flex; flex-direction: column; gap: 14px; min-height: 0; }

.row { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); column-gap: 30px; }
.col { position: relative; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; min-width: 0; }

.node {
  height: 52px;
  display: flex; align-items: center; justify-content: center; text-align: center;
  border: 1.5px solid var(--rule-strong);
  border-radius: var(--radius);
  background: var(--paper);
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.nm { font: 600 20px/1.1 var(--font-sans); color: var(--ink-3); transition: color var(--dur) var(--ease); padding: 0 6px; }
.past .node { border-color: var(--accent); background: var(--surface); }
.past .nm { color: var(--accent); }
.on .node { background: var(--accent); border-color: var(--accent); }
.on .nm { color: #fff; }

.arrow { position: absolute; top: 20px; right: -28px; color: var(--rule-strong); transition: color var(--dur) var(--ease); }
.past .arrow, .on .arrow { color: var(--accent); }

.tk {
  margin: 0; font-size: var(--fs-small); line-height: 1.38; color: var(--ink-2);
  opacity: 0; transform: translateY(6px);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.tk strong { color: var(--ink); font-weight: 600; }
.on .tk, .past .tk { opacity: 1; transform: none; }

.span { display: flex; align-items: center; gap: 12px; opacity: 0; transition: opacity var(--dur) var(--ease); }
.span.on { opacity: 1; }
.rule { flex: 1; height: 1.5px; background: var(--accent); }
.lbl { font: 500 var(--fs-label)/1 var(--font-sans); color: var(--accent); white-space: nowrap; }

.qa {
  margin-top: auto;
  display: grid; grid-template-columns: auto 1fr; align-items: baseline; column-gap: 40px;
  opacity: 0; transform: translateY(6px);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.qa.on { opacity: 1; transform: none; }
.q { margin: 0; font: 600 36px/1 var(--font-sans); letter-spacing: -0.015em; color: var(--ink); }
.prompts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.prompts li { margin: 0 !important; padding: 0; font-size: var(--fs-small); color: var(--ink-2); line-height: 1.35; }

@media (prefers-reduced-motion: reduce) {
  .tk, .qa { transform: none; }
}
</style>
