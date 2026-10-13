<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { BASE_PROMPT, SAFEGUARDS } from '../data/s3/hardening'

// Slide 23 (required artifact 7): each ticked safeguard adds a clause to the prompt and turns
// one edge-case test from a silent failure into a handled case.
const MAX = SAFEGUARDS.length
const { step, next, prev, reset } = useArtifactStep(MAX)

const on = ref<string[]>([])
const last = ref<string | null>(null)
watch(step, (n) => {
  on.value = SAFEGUARDS.slice(0, n).map(s => s.key)
  last.value = n > 0 ? SAFEGUARDS[n - 1].key : null
}, { immediate: true })

function toggle(k: string) {
  on.value = on.value.includes(k) ? on.value.filter(x => x !== k) : [...on.value, k]
  last.value = on.value.includes(k) ? k : null
}
const active = computed(() => SAFEGUARDS.filter(s => on.value.includes(s.key)))
const handled = computed(() => active.value.length)
</script>

<template>
  <Stage task="Tick a safeguard. Watch the prompt and the tests." tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="MAX" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="ph">
      <section class="list">
        <header class="lh">
          <span>Safeguard and its edge-case test</span>
          <span class="score"><b>{{ handled }}</b>/{{ MAX }} handled</span>
        </header>
        <label v-for="s in SAFEGUARDS" :key="s.key" class="hrow" :class="{ on: on.includes(s.key) }">
          <input type="checkbox" :checked="on.includes(s.key)" @change="toggle(s.key)">
          <span class="txt">
            <span class="name">{{ s.name }}</span>
            <span class="test">Test: {{ s.test }}</span>
          </span>
          <Transition name="fade" mode="out-in">
            <Status v-if="on.includes(s.key)" :key="'ok' + s.key" state="ok" :label="s.after" />
            <Status v-else :key="'bad' + s.key" state="bad" :label="s.before" />
          </Transition>
        </label>
      </section>

      <section class="prompt mono" aria-label="Prompt being hardened">
        <div class="ph-h">Prompt</div>
        <p class="base">{{ BASE_PROMPT }}</p>
        <TransitionGroup name="clause" tag="div" class="clauses">
          <p v-for="s in active" :key="s.key" class="clause" :class="{ fresh: s.key === last }">{{ s.clause }}</p>
        </TransitionGroup>
      </section>
    </div>
  </Stage>
</template>

<style scoped>
.ph { display: grid; grid-template-columns: 1.06fr 1fr; gap: 18px; flex: 1 1 auto; min-height: 0; }
.list { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.lh { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 600; color: var(--ink-3); margin-bottom: 2px; }
.score { font-size: var(--fs-label); color: var(--ink-2); font-weight: 500; font-variant-numeric: tabular-nums; }
.score b { color: var(--accent); font-weight: 700; }
.hrow {
  display: grid; grid-template-columns: 18px 1fr auto; align-items: center; gap: 10px;
  padding: 5px 8px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--dur) var(--ease);
}
.hrow.on { border-color: var(--ok); }
.hrow input { width: 16px; height: 16px; margin: 0; accent-color: var(--accent); cursor: pointer; }
.txt { display: flex; flex-direction: column; line-height: 1.25; min-width: 0; }
.name { font-size: var(--fs-label); font-weight: 600; }
.test { font-size: var(--fs-label); color: var(--ink-2); }

.prompt {
  background: var(--surface);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: var(--fs-label);
  line-height: 1.32;
  min-height: 0;
  overflow: hidden;
}
.ph-h { font: 600 14px/1.2 var(--font-sans); color: var(--ink-3); margin-bottom: 4px; }
.base { margin: 0 0 6px; line-height: 1.3; }
.clauses { display: flex; flex-direction: column; gap: 5px; }
.clause { margin: 0; line-height: 1.3; padding: 1px 6px 1px 8px; border-left: 3px solid var(--ok); transition: background var(--dur) var(--ease); }
.clause.fresh { background: var(--accent-tint); border-left-color: var(--accent); }
.clause-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.clause-leave-active { transition: opacity calc(var(--dur) * 0.5) var(--ease); position: absolute; }
.clause-enter-from { opacity: 0; transform: translateY(-4px); }
.clause-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
