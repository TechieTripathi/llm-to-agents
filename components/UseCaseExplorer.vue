<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { DEPARTMENTS, EXPLORER_TOUR, RISK_LABEL, TASK_TYPES, USE_CASES, useCase } from '../data/s6/useCases'
import type { DeptId, TaskType } from '../data/s6/useCases'

// Artifact J — department use-case explorer.
// A department × task-type map; selecting a marker shows the full use case.
// The clicker tours four contrasting use cases; on-screen selection overrides it.
const { step, next, prev, reset, max } = useArtifactStep(EXPLORER_TOUR.length - 1)

const picked = ref<string | null>(null)
const typeFilter = ref<TaskType | null>(null)
watch(step, () => { picked.value = null })

const selId = computed(() => picked.value ?? EXPLORER_TOUR[step.value])
const sel = computed(() => useCase(selId.value))
const selType = computed(() => TASK_TYPES.find(t => t.id === sel.value.type)!)
const selDept = computed(() => DEPARTMENTS.find(d => d.id === sel.value.dept)!)
const risk = computed(() => RISK_LABEL[sel.value.risk])

const cell = (d: DeptId, t: TaskType) => USE_CASES.find(u => u.dept === d && u.type === t)
const countFor = (t: TaskType) => USE_CASES.filter(u => u.type === t).length

function pick(id: string) { picked.value = id }
function pickDept(d: DeptId) {
  const first = USE_CASES.find(u => u.dept === d && (!typeFilter.value || u.type === typeFilter.value))
    ?? USE_CASES.find(u => u.dept === d)!
  picked.value = first.id
}
function toggleType(t: TaskType) {
  typeFilter.value = typeFilter.value === t ? null : t
  if (typeFilter.value && sel.value.type !== t)
    picked.value = USE_CASES.find(u => u.type === t)!.id
}
const tourLabels = EXPLORER_TOUR.map(id => DEPARTMENTS.find(d => d.id === useCase(id).dept)!.short)
</script>

<template>
  <Stage task="Select a marker, department or task type" tag="fictional">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="tourLabels" @prev="prev" @next="next" @reset="reset(); picked = null; typeFilter = null" />
    </template>

    <div class="ex">
      <!-- Map: departments × task types -->
      <div class="map" role="grid" aria-label="Use cases by department and task type">
        <div class="corner">
          <span class="corner-k">Task type</span>
          <span class="corner-d">Department</span>
        </div>
        <button
          v-for="t in TASK_TYPES" :key="t.id"
          class="colhead" :class="{ on: typeFilter === t.id, cur: sel.type === t.id }"
          :aria-pressed="typeFilter === t.id" :title="`${t.long}: ${t.hint}`"
          @click.stop="toggleType(t.id)"
        >
          <span class="rot">{{ t.label }} <span class="cnt">{{ countFor(t.id) }}</span></span>
        </button>

        <template v-for="d in DEPARTMENTS" :key="d.id">
          <button class="rowhead" :class="{ cur: sel.dept === d.id }" @click.stop="pickDept(d.id)">{{ d.name }}</button>
          <div
            v-for="t in TASK_TYPES" :key="d.id + t.id"
            class="cell" :class="{ xr: sel.dept === d.id, xc: sel.type === t.id }"
          >
            <button
              v-if="cell(d.id, t.id)"
              class="mk" :class="{
                sel: cell(d.id, t.id)!.id === selId,
                dim: typeFilter && typeFilter !== t.id,
                ex: !!cell(d.id, t.id)!.slide,
              }"
              :aria-label="`${d.name}: ${cell(d.id, t.id)!.task}`"
              :title="cell(d.id, t.id)!.task"
              @click.stop="pick(cell(d.id, t.id)!.id)"
            />
            <span v-else class="empty" aria-hidden="true" />
          </div>
        </template>

        <div class="legend">
          <span><i class="mk ex s6-static" /> worked example follows</span>
          <span><i class="mk s6-static" /> use case</span>
        </div>
      </div>

      <!-- Detail -->
      <Transition name="swap" mode="out-in">
        <article :key="sel.id" class="card">
          <header class="meta">
            <span><strong>{{ selDept.name }}</strong> · <span class="ty">{{ selType.long }}</span></span>
            <Status :state="risk.state" :label="risk.label" />
          </header>
          <h3 class="task">{{ sel.task }}</h3>
          <dl class="fields">
            <dt>Inputs</dt>
            <dd>{{ sel.inputs }}</dd>
            <dt>AI steps</dt>
            <dd>
              <ol class="steps">
                <li v-for="s in sel.steps" :key="s">{{ s }}</li>
              </ol>
            </dd>
            <dt>Output</dt>
            <dd>{{ sel.output }}</dd>
            <dt class="v">Verify</dt>
            <dd class="v">{{ sel.verify }}</dd>
            <dt>Data</dt>
            <dd class="risk">{{ sel.riskNote }}</dd>
          </dl>
        </article>
      </Transition>
    </div>

    <template #notice>
      The same five task types recur in every department. What changes is the input, and who checks the output.
    </template>
  </Stage>
</template>

<style scoped>
.ex {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: 394px 1fr;
  gap: 30px;
}

/* ---- map ---- */
.map {
  display: grid;
  grid-template-columns: 164px repeat(5, 46px);
  grid-template-rows: 70px repeat(8, 26px) auto;
  align-content: start;
}
.corner { position: relative; }
.corner-k, .corner-d { position: absolute; font-size: 14px; color: var(--ink-3); }
.corner-k { right: 8px; top: 4px; }
.corner-d { left: 0; bottom: 4px; }
.colhead {
  position: relative;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: var(--ink-2);
  font: 500 15px/1 var(--font-sans);
  border-bottom: 1.5px solid var(--ink);
}
.rot {
  position: absolute;
  left: 16px;
  bottom: 8px;
  transform-origin: left bottom;
  transform: rotate(-38deg);
  white-space: nowrap;
  padding: 3px 5px;
  border-radius: var(--radius-sm);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.cnt { color: var(--ink-3); font-weight: 400; margin-left: 2px; font-variant-numeric: tabular-nums; }
.colhead.cur .rot { color: var(--ink); font-weight: 600; }
.colhead.on .rot { background: var(--accent); color: #fff; }
.colhead.on .cnt { color: var(--accent-tint-2); }
.colhead:focus-visible .rot { outline: 2px solid var(--accent); }

.rowhead {
  border: 0;
  background: transparent;
  text-align: left;
  padding: 0 8px 0 0;
  font: 400 16px/1 var(--font-sans);
  color: var(--ink-2);
  cursor: pointer;
  border-bottom: 1px solid var(--rule);
  transition: color var(--dur) var(--ease);
}
.rowhead.cur { color: var(--ink); font-weight: 600; }
.rowhead:focus-visible { outline: 2px solid var(--accent); }

.cell {
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--rule);
  transition: background var(--dur) var(--ease);
}
.cell.xr, .cell.xc { background: var(--surface); }
.cell.xr.xc { background: var(--accent-tint); }
.empty { width: 5px; height: 5px; border-radius: 50%; background: var(--rule-strong); }

.mk {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--ink-2);
  background: var(--surface);
  padding: 0;
  cursor: pointer;
  transition: transform var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease), opacity var(--dur) var(--ease);
}
.mk.ex { border-color: var(--accent); border-width: 4px; }
.mk:hover { transform: scale(1.2); }
.mk.sel { background: var(--accent); border-color: var(--accent); transform: scale(1.3); box-shadow: 0 0 0 3px var(--accent-tint-2); }
.mk.dim { opacity: 0.22; }
.mk:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.mk.s6-static { display: inline-block; vertical-align: -2px; margin-right: 4px; cursor: default; width: 13px; height: 13px; }
.mk.s6-static.ex { border-width: 3.5px; }

.legend {
  grid-column: 1 / -1;
  display: flex;
  gap: 18px;
  margin-top: 7px;
  font-size: 14px;
  color: var(--ink-3);
}

/* ---- detail card ---- */
.card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 10px 14px 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--fs-label);
  color: var(--ink-2);
}
.meta strong { color: var(--ink); }
.ty { color: var(--accent); font-weight: 500; }
.task { font-size: 19px; line-height: 1.2; margin: 6px 0 8px; }
.fields {
  display: grid;
  grid-template-columns: 66px 1fr;
  column-gap: 10px;
  row-gap: 6px;
  margin: 0;
  font-size: var(--fs-label);
  line-height: 1.3;
}
dt { color: var(--ink-3); font-weight: 500; }
dd { margin: 0; color: var(--ink); }
.steps { margin: 0; padding-left: 1.2em; }
.fields .steps li { margin: 0; line-height: 1.3; }
.steps li::marker { color: var(--accent); font-weight: 600; }
dt.v { color: var(--accent); }
dd.v { font-weight: 500; }
.risk { color: var(--ink-2); }

.swap-enter-active, .swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateX(8px); }
.swap-leave-to { opacity: 0; }
</style>
