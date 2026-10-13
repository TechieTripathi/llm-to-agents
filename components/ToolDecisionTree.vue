<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { EXAMPLES, FINAL_NO, LEAVES, QUESTIONS } from '../data/s4/tree'

// Slide 33: answer yes/no questions to reach a tool. Clicks walk the first example; chips and buttons let the room try others.
const { step, next, prev, reset, max } = useArtifactStep(QUESTIONS.length)

const exIdx = ref(0)
const manual = ref<boolean[] | null>(null)
watch(step, () => { manual.value = null; exIdx.value = 0 })

const answers = computed(() => manual.value ?? EXAMPLES[0].path.slice(0, step.value))
const leafId = computed(() => {
  const a = answers.value
  const yesAt = a.indexOf(true)
  if (yesAt >= 0) return QUESTIONS[yesAt].yes
  if (a.length === QUESTIONS.length) return FINAL_NO
  return null
})
const current = computed(() => (leafId.value ? -1 : answers.value.length))
const task = computed(() => (manual.value && exIdx.value < 0 ? 'Your own task' : EXAMPLES[Math.max(0, exIdx.value)].task))

function pickExample(i: number) { exIdx.value = i; manual.value = [...EXAMPLES[i].path] }
function answer(v: boolean) {
  const base = [...answers.value]
  if (!manual.value) exIdx.value = -1
  manual.value = [...base, v]
}
function restart() { exIdx.value = -1; manual.value = [] }
const state = (i: number) => (i < answers.value.length ? (answers.value[i] ? 'yes' : 'no') : i === current.value ? 'now' : 'later')
</script>

<template>
  <Stage :tag="false" bare notice="More than one yes? Take the first: it is the most predictable and the easiest to check.">
    <template #controls>
      <span class="chips" aria-label="Example tasks">
        <button v-for="(e, i) in EXAMPLES" :key="e.label" class="chip" :aria-pressed="manual !== null && exIdx === i" @click="pickExample(i)">{{ e.label }}</button>
        <button class="chip ghost" @click="restart">Your own</button>
      </span>
      <span class="spacer" />
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </template>

    <p class="task"><span class="tk">Task</span> {{ task }}</p>

    <div class="tree">
      <template v-for="(q, i) in QUESTIONS" :key="q.q">
        <div class="q" :class="state(i)">
          <span class="spine" aria-hidden="true" />
          <span class="qtext">{{ q.q }}</span>
          <span class="ans">
            <template v-if="state(i) === 'yes'"><Status state="active" label="Yes" /></template>
            <template v-else-if="state(i) === 'no'"><Status state="neutral" label="No" /></template>
            <template v-else-if="state(i) === 'now'">
              <button class="btn btn-primary yn" @click="answer(true)">Yes</button>
              <button class="btn yn" @click="answer(false)">No</button>
            </template>
          </span>
        </div>
        <svg class="link" :class="{ on: state(i) === 'yes' }" viewBox="0 0 60 20" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="10" x2="52" y2="10" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
          <path d="M46 4 L54 10 L46 16" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        </svg>
        <div class="leaf" :class="{ on: leafId === q.yes, dim: leafId && leafId !== q.yes }">
          <span class="lname">{{ LEAVES[q.yes].name }}</span>
          <span class="lhint">{{ LEAVES[q.yes].hint }}</span>
        </div>
      </template>
      <div class="q final" :class="{ no: leafId === FINAL_NO }">
        <span class="spine end" aria-hidden="true" />
        <span class="qtext">None of these</span>
      </div>
      <svg class="link" :class="{ on: leafId === FINAL_NO }" viewBox="0 0 60 20" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="10" x2="52" y2="10" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        <path d="M46 4 L54 10 L46 16" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="leaf" :class="{ on: leafId === FINAL_NO, dim: leafId && leafId !== FINAL_NO }">
        <span class="lname">{{ LEAVES[FINAL_NO].name }}</span>
        <span class="lhint">{{ LEAVES[FINAL_NO].hint }}</span>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.tryl { font-size: var(--fs-label); color: var(--ink-2); white-space: nowrap; }
.chips { display: inline-flex; flex-wrap: nowrap; gap: 5px; }
.chip { font: 500 15px/1 var(--font-sans); padding: 6px 10px; border-radius: 999px; white-space: nowrap; border: 1px solid var(--rule-strong); background: var(--surface); color: var(--ink); cursor: pointer; }
.chip[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: #fff; }
.chip.ghost { border-style: dashed; color: var(--ink-2); }
.chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.spacer { flex: 1; }

.task { margin: 0; font-size: var(--fs-small); line-height: 1.3; }
.tk { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); margin-right: 8px; }

.tree { display: grid; grid-template-columns: 0.95fr 44px 1.05fr; row-gap: 2px; align-items: center; }
.q { position: relative; display: flex; align-items: center; gap: 10px; padding: 5px 10px 5px 26px; min-height: 38px; border-radius: var(--radius-sm); transition: background var(--dur) var(--ease); }
.spine { position: absolute; left: 9px; top: 0; bottom: -2px; width: 0; border-left: 1.5px solid var(--rule-strong); }
.spine::before { content: ''; position: absolute; left: -5.5px; top: 50%; margin-top: -5px; width: 10px; height: 10px; border-radius: 50%; background: var(--paper); border: 1.5px solid var(--rule-strong); box-sizing: border-box; }
.spine.end { bottom: 50%; }
.qtext { flex: 1; font-size: 16.5px; line-height: 1.25; color: var(--ink-2); }
.ans { display: inline-flex; gap: 6px; flex: 0 0 auto; }
.yn { padding: 5px 12px; }
.q.now { background: var(--surface); box-shadow: inset 0 0 0 1.5px var(--accent); }
.q.now .qtext, .q.yes .qtext, .q.no .qtext { color: var(--ink); }
.q.now .spine::before { background: var(--accent); border-color: var(--accent); }
.q.no .spine, .q.yes .spine { border-color: var(--ink); }
.q.no .spine::before { background: var(--ink-3); border-color: var(--ink-3); }
.q.yes .spine::before { background: var(--accent); border-color: var(--accent); }
.q.final .qtext { font-style: italic; }
.q.final.no .qtext { color: var(--ink); }

.link { width: 44px; height: 14px; color: var(--rule-strong); transition: color var(--dur) var(--ease); }
.link.on { color: var(--accent); }

.leaf { display: flex; flex-direction: column; padding: 3px 10px; border-left: 3px solid var(--rule); transition: opacity var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.leaf.on { background: var(--accent); border-color: var(--accent-strong); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.leaf.on .lname, .leaf.on .lhint { color: #fff; }
.leaf.dim { opacity: 0.4; }
.lname { font-size: 15px; font-weight: 600; line-height: 1.2; }
.lhint { font-size: 15px; color: var(--ink-2); line-height: 1.25; }
</style>
