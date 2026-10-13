<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { APPROACHES, CLICK_TASKS, TASKS, TRAITS } from '../data/s1/taskFit'

// Slide 5: pick a task, see which approach fits and why.
// Clicks walk through three contrasting tasks (payroll → meeting notes → complaint reply);
// the presenter can also pick any task from the list.
const { step, next, prev, reset, max } = useArtifactStep(CLICK_TASKS.length - 1)
const picked = ref<string | null>(null)
watch(step, () => { picked.value = null })

const task = computed(() => TASKS.find(t => t.id === (picked.value ?? CLICK_TASKS[step.value]))!)
const fitLabel = { ok: 'Best fit', warn: 'Use with care', bad: 'Poor fit' }
</script>

<template>
  <Stage task="Pick a task" tag="fictional" notice="Fixed rules and one exact answer? Keep it in deterministic software.">
    <template #controls>
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="tf">
      <ul class="tasks" role="listbox" aria-label="Example tasks">
        <li v-for="t in TASKS" :key="t.id">
          <button
            class="task" role="option" :aria-selected="t.id === task.id"
            :class="{ on: t.id === task.id }" @click.stop="picked = t.id"
          >{{ t.name }}</button>
        </li>
      </ul>

      <div class="right">
        <div class="profile" aria-label="Task profile">
          <span
            v-for="tr in TRAITS" :key="tr.id" class="trait"
            :class="{ has: task.traits.includes(tr.id) }"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path v-if="task.traits.includes(tr.id)" d="M2 6.3l2.6 2.6L10 3.4" />
              <path v-else d="M3 6h6" />
            </svg>
            {{ tr.label }}
          </span>
        </div>

        <div class="rows">
          <section
            v-for="a in APPROACHES" :key="a.id" class="row"
            :class="task.fit[a.id].fit"
          >
            <header>
              <span class="a-n">{{ a.name }}</span>
              <span class="a-s">{{ a.sub }}</span>
            </header>
            <Transition name="fade" mode="out-in">
              <span :key="task.id + a.id" class="verdict">
                <Status :state="task.fit[a.id].fit" :label="fitLabel[task.fit[a.id].fit]" />
              </span>
            </Transition>
            <Transition name="fade" mode="out-in">
              <p :key="task.id + a.id" class="why">{{ task.fit[a.id].why }}</p>
            </Transition>
          </section>
        </div>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.tf { display: grid; grid-template-columns: 224px 1fr; gap: 16px; flex: 1 1 auto; min-height: 0; }

.tasks { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.tasks li { margin: 0; padding: 0; }
.task {
  width: 100%;
  text-align: left;
  font: 400 var(--fs-label)/1.2 var(--font-sans);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--rule);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.task:hover { border-left-color: var(--ink-2); }
.task:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.task.on { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 500; }

.right { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.profile { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
.trait {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 15px; line-height: 1;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px dashed var(--rule-strong);
  color: var(--ink-3);
  white-space: nowrap;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.trait svg { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.trait.has { border: 1px solid var(--ink); color: var(--ink); background: var(--surface); }

.rows { display: flex; flex-direction: column; gap: 6px; }
.row {
  display: grid;
  grid-template-columns: 186px 128px 1fr;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  padding: 6px 12px 6px 10px;
  min-height: 54px;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.row.ok { border-left-color: var(--ok); }
.row.warn { border-left-color: var(--warn); }
.row.bad { background: transparent; }
.row header { display: flex; flex-direction: column; gap: 2px; }
.a-n { font-size: 15px; font-weight: 600; line-height: 1.2; white-space: nowrap; }
.a-s { font-size: 14px; color: var(--ink-3); }
.why { margin: 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink); }
.row.bad .why { color: var(--ink-2); }

.fade-enter-active, .fade-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
