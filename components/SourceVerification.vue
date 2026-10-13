<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CLAIMS, DOCS, RAG_STEPS, VERDICT_UI } from '../data/s3/grounding'
import type { Verdict } from '../data/s3/grounding'

// Slide 22 (Artifact E): a drafted summary split into claims; each claim is checked against the
// supplied documents. Clicker: check claims one by one. Click a claim to make your own call first.
const MAX = CLAIMS.length
const { step, next, prev, reset } = useArtifactStep(MAX)

const sel = ref<number | null>(null)
const extra = reactive(new Set<number>())
const calls = reactive(new Map<number, Verdict>())
watch(step, () => { sel.value = null; extra.clear(); calls.clear() })

const selected = computed(() => sel.value ?? (step.value > 0 ? step.value - 1 : null))
const isChecked = (i: number) => i < step.value || extra.has(i)
const current = computed(() => (selected.value === null ? null : CLAIMS[selected.value]))
const currentChecked = computed(() => selected.value !== null && isChecked(selected.value))

function choose(i: number) { sel.value = i }
function call(v: Verdict) { if (selected.value === null) return; calls.set(selected.value, v); extra.add(selected.value) }
function reveal() { if (selected.value !== null) extra.add(selected.value) }

const isEvidence = (doc: string, line: number) =>
  currentChecked.value && current.value?.evidence?.doc === doc && current.value?.evidence?.line === line

const tally = computed(() => {
  const t = { supported: 0, contradicted: 0, unsupported: 0 }
  CLAIMS.forEach((c, i) => { if (isChecked(i)) t[c.verdict]++ })
  return t
})
const checkedCount = computed(() => CLAIMS.filter((_, i) => isChecked(i)).length)
const VERDICTS: Verdict[] = ['supported', 'contradicted', 'unsupported']
</script>

<template>
  <Stage task="Check each claim against the sources." tag="fictional">
    <template #controls>
      <StepControls :step="step" :max="MAX" @prev="prev" @next="next" @reset="reset" />
    </template>

    <ol class="rag" aria-label="Retrieval-augmented generation, simplified">
      <li v-for="(r, i) in RAG_STEPS" :key="r" :class="{ last: i === RAG_STEPS.length - 1 }">
        <span class="n">{{ i + 1 }}</span>{{ r }}
        <svg v-if="i < RAG_STEPS.length - 1" class="arr" width="18" height="10" viewBox="0 0 18 10" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
      </li>
    </ol>

    <div class="sv">
      <section class="claims">
        <header class="ch">
          <span>Drafted summary, split into claims</span>
          <span class="cnt">{{ checkedCount }}/{{ MAX }} checked</span>
        </header>
        <button
          v-for="(c, i) in CLAIMS"
          :key="i"
          class="claim"
          :class="{ on: selected === i, [c.verdict]: isChecked(i) }"
          :aria-pressed="selected === i"
          @click="choose(i)"
        >
          <span class="ct">{{ c.text }}</span>
          <Transition name="fade" mode="out-in">
            <Status v-if="isChecked(i)" :key="'v' + i" :state="VERDICT_UI[c.verdict].state" :label="VERDICT_UI[c.verdict].label" />
            <Status v-else :key="'n' + i" state="neutral" label="Not checked" />
          </Transition>
        </button>
      </section>

      <section class="docs" :class="{ nothing: currentChecked && current?.verdict === 'unsupported' }">
        <header class="ch"><span>Supplied sources</span></header>
        <article v-for="d in DOCS" :key="d.id" class="doc">
          <h4 class="mono">{{ d.title }}</h4>
          <p
            v-for="(l, li) in d.lines"
            :key="li"
            class="line"
            :class="isEvidence(d.id, li) ? ['ev', current!.verdict] : []"
          >{{ l }}</p>
        </article>
      </section>
    </div>

    <div class="bar" aria-live="polite">
      <template v-if="current && !currentChecked">
        <span class="bl">Your call:</span>
        <button v-for="v in VERDICTS" :key="v" class="btn" @click="call(v)">{{ VERDICT_UI[v].label }}</button>
        <button class="btn btn-primary" @click="reveal">Show evidence</button>
      </template>
      <template v-else-if="current">
        <Status :state="VERDICT_UI[current.verdict].state" :label="VERDICT_UI[current.verdict].label" />
        <span class="why">{{ current.why }}</span>
        <span v-if="calls.has(selected!)" class="you" :class="{ match: calls.get(selected!) === current.verdict }">
          Your call: {{ VERDICT_UI[calls.get(selected!)!].label }} ({{ calls.get(selected!) === current.verdict ? 'matches' : 'differs' }})
        </span>
      </template>
      <template v-else>
        <span class="hint">Select a claim, make your call, then check the evidence.</span>
      </template>
      <span class="spacer" />
      <span class="tally" aria-label="Tally of checked claims">
        <Status state="ok" compact :label="String(tally.supported)" title="supported" />
        <Status state="bad" compact :label="String(tally.contradicted)" title="contradicted" />
        <Status state="warn" compact :label="String(tally.unsupported)" title="unsupported" />
      </span>
    </div>
  </Stage>
</template>

<style scoped>
.rag { list-style: none; margin: 0 0 4px; padding: 0; display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
.rag li { margin: 0; padding: 0; display: inline-flex; align-items: center; gap: 6px; font-size: var(--fs-label); line-height: 1.2; color: var(--ink-2); white-space: nowrap; }
.rag .n { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; line-height: 1; border-radius: 50%; border: 1.5px solid var(--rule-strong); font-size: 13px; font-weight: 600; color: var(--ink-2); box-sizing: border-box; }
.rag li.last { color: var(--accent); font-weight: 600; }
.rag li.last .n { border-color: var(--accent); background: var(--accent); color: #fff; }
.arr { color: var(--rule-strong); margin-left: 2px; }

.sv { display: grid; grid-template-columns: 1.18fr 1fr; gap: 18px; flex: 1 1 auto; min-height: 0; }
.ch { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 600; color: var(--ink-3); margin-bottom: 4px; }
.cnt { font-variant-numeric: tabular-nums; }
.claims { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.claim {
  all: unset;
  box-sizing: border-box;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 4px 6px 4px 10px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-label);
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.claim:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.claim.supported { border-left-color: var(--ok); }
.claim.contradicted { border-left-color: var(--bad); }
.claim.unsupported { border-left-color: var(--warn); }
.claim.on { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.ct { color: var(--ink); }

.docs { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.doc { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 3px 10px 4px; }
.doc h4 { margin: 0 0 1px; font-size: 14px; line-height: 1.3; font-weight: 600; color: var(--ink-2); }
.line { margin: 0; padding: 1px 6px; margin-left: -6px; font-size: var(--fs-label); line-height: 1.28; border-radius: var(--radius-sm); transition: background var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.line.ev.supported { background: var(--ok-tint); box-shadow: inset 3px 0 0 var(--ok); }
.line.ev.contradicted { background: var(--bad-tint); box-shadow: inset 3px 0 0 var(--bad); }
.docs.nothing .doc { opacity: 0.45; }
.doc { transition: opacity var(--dur) var(--ease); }
.none { margin: 0; font-size: var(--fs-label); color: var(--warn); border: 1px dashed var(--warn); border-radius: var(--radius-sm); padding: 3px 8px; background: var(--warn-tint); }

.bar { display: flex; align-items: center; gap: 8px; min-height: 36px; border-top: 1px solid var(--rule); padding-top: 6px; font-size: var(--fs-label); }
.bar .btn { padding: 6px 10px; }
.bl { font-weight: 600; color: var(--ink-2); white-space: nowrap; }
.bar .btn { white-space: nowrap; }
.why { color: var(--ink); }
.you { color: var(--bad); font-size: 15px; white-space: nowrap; }
.you.match { color: var(--ok); }
.hint { color: var(--ink-2); }
.spacer { flex: 1; }
.tally { display: inline-flex; gap: 10px; white-space: nowrap; flex: 0 0 auto; }
.tally b { font-weight: 700; }
.t-ok { color: var(--ok); } .t-bad { color: var(--bad); } .t-warn { color: var(--warn); }
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
