<script setup lang="ts">
import { computed } from 'vue'

// Shared frame for the department worked examples (slides 47–53).
// Same skeleton every time — input → AI steps → draft → human check — while the
// default slot holds the department-specific visual (table, log, checklist …).
// Honesty tags: 'fictional' in the footer here; 'simulated' in the slide's title row (<S6Tags>).
const props = withDefaults(defineProps<{
  step: number
  max?: number
  owner: string
  checks: string[]
  ownerLabel?: string
  fictional?: boolean
}>(), { max: 2, ownerLabel: 'Signs off', fictional: true })
const emit = defineEmits<{ prev: [], next: [], reset: [] }>()

const STAGES = ['Input', 'AI steps', 'Draft', 'Human check']
// step 0 → input + AI steps shown; 1 → draft; 2 → human check
const lit = computed(() => props.step + 1)
</script>

<template>
  <section class="dc">
    <header class="bar">
      <ol class="rail" aria-label="Workflow stage">
        <li
          v-for="(s, i) in STAGES" :key="s"
          :class="{ done: i < lit, now: i === lit || (step === 0 && i === 1) }"
        >
          <span class="dot" aria-hidden="true" />{{ s }}
          <svg v-if="i < STAGES.length - 1" class="arr" width="14" height="8" viewBox="0 0 14 8" aria-hidden="true"><path d="M0 4h12M9 1l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
        </li>
      </ol>
      <span class="sp" />
      <span class="owner">{{ ownerLabel }}: <strong>{{ owner }}</strong></span>
      <StepControls :step="step" :max="max" @prev="emit('prev')" @next="emit('next')" @reset="emit('reset')" />
    </header>

    <div class="body"><slot /></div>

    <footer class="foot" :class="{ on: step >= max }">
      <span class="k">Check</span>
      <span class="checks">
        <span v-for="c in checks" :key="c" class="chk">
          <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true"><rect x="0.75" y="0.75" width="11.5" height="11.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" /><path v-if="step >= max" d="M3.2 6.6l2.2 2.2 4.4-4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          {{ c }}
        </span>
      </span>
      <SimTag v-if="fictional" kind="fictional" />
    </footer>
  </section>
</template>

<style scoped>
.dc { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 8px; position: relative; }
.bar { display: flex; align-items: center; gap: 10px; }
.sp { flex: 1; }
.rail { list-style: none; display: flex; align-items: center; gap: 4px; margin: 0; padding: 0; font: 500 var(--fs-label)/1 var(--font-sans); }
.rail li { white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; margin: 0; padding: 0; color: var(--ink-3); transition: color var(--dur) var(--ease); }
.rail li.done { color: var(--ink); }
.rail li.now { color: var(--accent); font-weight: 600; }
.dot { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid currentColor; background: transparent; transition: background var(--dur) var(--ease); }
.rail li.done .dot { background: currentColor; }
.arr { color: var(--rule-strong); margin: 0 2px 0 4px; }

.body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }

.foot {
  display: flex;
  align-items: center;
  gap: 14px;
  border-top: 1.5px solid var(--rule);
  padding-top: 6px;
  font-size: var(--fs-label);
  color: var(--ink-2);
  transition: border-color var(--dur) var(--ease);
}
.foot.on { border-color: var(--accent); }
.k { font-weight: 600; color: var(--accent); }
.checks { display: flex; flex-wrap: wrap; gap: 4px 14px; flex: 1 1 auto; }
.chk { display: inline-flex; align-items: center; gap: 5px; color: var(--ink); white-space: nowrap; }
.chk svg { color: var(--ink-3); }
.foot.on .chk svg { color: var(--ok); }
.owner { white-space: nowrap; color: var(--ink-2); font-size: var(--fs-label); }
.owner strong { color: var(--ink); font-weight: 500; }
</style>
