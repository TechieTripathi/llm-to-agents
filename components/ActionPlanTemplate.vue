<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { BLANK, EXAMPLE, FIELDS, RISKS, STORAGE_KEY, type Plan } from '../data/s8/actionPlan'

// Slide 64 — fillable personal action plan. Local state; persisted to localStorage when available.
// Default (and PDF) state is the filled-in Kestrel example.
const plan = reactive<Plan>({ ...EXAMPLE })
const isExample = computed(() => (Object.keys(EXAMPLE) as (keyof Plan)[]).every(k => plan[k] === EXAMPLE[k]))
const saved = ref(false)

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) Object.assign(plan, { ...BLANK, ...JSON.parse(raw) })
  }
  catch { /* storage unavailable: keep the example */ }
}
function persist() {
  try {
    if (isExample.value) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    saved.value = !isExample.value
  }
  catch { saved.value = false }
}
onMounted(load)
watch(plan, persist, { deep: true })

const clearAll = () => Object.assign(plan, BLANK)
const restore = () => Object.assign(plan, EXAMPLE)

const risk = computed(() => RISKS.find(r => r.id === plan.risk)!)
const filled = (v: string) => v.trim().length > 2
const checks = computed(() => [
  { id: 'task', ok: filled(plan.task), done: 'Task chosen', todo: 'Name one recurring task' },
  { id: 'inputs', ok: filled(plan.inputs), done: 'Inputs listed', todo: 'List the inputs it needs' },
  { id: 'output', ok: filled(plan.output), done: 'Output described', todo: 'Describe the output you want' },
  { id: 'verify', ok: filled(plan.verify), done: 'Verification planned', todo: 'Say how you will check it' },
  { id: 'measure', ok: /\d/.test(plan.measure), done: 'Success is measurable', todo: 'Add a number: minutes, errors, rework' },
])
const byId = (k: string) => FIELDS.find(f => f.key === k)!
</script>

<template>
  <Stage task="Try it with your own task" :tag="isExample ? 'fictional' : false">
    <template #controls>
      <button class="btn" @click.stop="clearAll">Clear the form</button>
      <button class="btn" :disabled="isExample" @click.stop="restore">Restore example</button>
    </template>

    <div class="plan" @keydown.stop @keyup.stop>
      <form class="form" autocomplete="off" @submit.prevent>
        <label class="f wide">
          <span class="l">{{ byId('task').label }}</span>
          <input v-model="plan.task" type="text" :placeholder="byId('task').placeholder">
        </label>
        <label v-for="k in ['inputs', 'output']" :key="k" class="f">
          <span class="l">{{ byId(k).label }}</span>
          <textarea v-model="plan[k as 'inputs' | 'output']" :rows="byId(k).rows" :placeholder="byId(k).placeholder" />
        </label>
        <div class="f">
          <span class="l" id="risk-l">Risk level</span>
          <div class="seg" role="radiogroup" aria-labelledby="risk-l">
            <button
              v-for="r in RISKS" :key="r.id" type="button" class="btn sb" role="radio"
              :aria-checked="plan.risk === r.id" :aria-pressed="plan.risk === r.id" @click.stop="plan.risk = r.id"
            >{{ r.label }}</button>
          </div>
        </div>
        <label class="f">
          <span class="l">{{ byId('measure').label }}</span>
          <textarea v-model="plan.measure" :rows="byId('measure').rows" :placeholder="byId('measure').placeholder" />
        </label>
        <label class="f wide">
          <span class="l">{{ byId('verify').label }}</span>
          <input v-model="plan.verify" type="text" :placeholder="byId('verify').placeholder">
        </label>
      </form>

      <aside class="card" aria-live="polite">
        <p class="ck">Is the plan ready?</p>
        <ul class="checks">
          <li v-for="c in checks" :key="c.id"><Status :state="c.ok ? 'ok' : 'warn'" compact /><span :class="{ miss: !c.ok }">{{ c.ok ? c.done : c.todo }}</span></li>
        </ul>
        <div class="risk">
          <Status :state="risk.state" :label="`${risk.label} risk: ${risk.advice}`" />
        </div>
        <p class="tool">Use only a tool approved for this task's data.</p>
      </aside>
    </div>

    <template #notice>
      <span>Write it down now, try it this week, and measure it against how you do it today.<span v-if="saved" class="sv"> Saved in this browser.</span></span>
    </template>
  </Stage>
</template>

<style scoped>
.plan { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1.45fr 1fr; gap: 18px; }

.form { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; align-content: start; margin: 0; }
.f { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.f.wide { grid-column: 1 / -1; }
.l { font: 500 15px/1.2 var(--font-sans); color: var(--ink-2); }
input, textarea {
  font: 400 var(--fs-label)/1.35 var(--font-sans);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  padding: 6px 9px;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
input::placeholder, textarea::placeholder { color: var(--ink-3); }
input:focus, textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-tint-2); }
.seg { display: flex; }
.sb { flex: 1; border-radius: 0; padding: 8px 6px; }
.sb:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.sb:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.sb + .sb { margin-left: -1px; }

.card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-top: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 10px 14px 12px;
  display: flex; flex-direction: column; gap: 7px;
  min-height: 0;
}
.ck { margin: 0; font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink); }
.checks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.checks li { margin: 0; padding: 0; display: flex; align-items: center; gap: 9px; font-size: var(--fs-label); color: var(--ink); }
.checks .miss { color: var(--warn); }
.tool { margin: 0; font-size: 15px; color: var(--ink-2); }
.risk { margin-top: auto; padding-top: 4px; border-top: 1px solid var(--rule); padding-top: 10px; }
.risk :deep(.status) { white-space: normal; }
.sv { color: var(--ink-3); }
</style>
