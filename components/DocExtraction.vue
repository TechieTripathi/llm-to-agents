<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { DOC, DOC_ID, DOC_TITLE, FIELDS } from '../data/s4/extraction'

// Slide 30: policy text → structured fields. Selecting a field highlights the text it came from.
const { step, next, prev, reset, max } = useArtifactStep(3)
const labels = ['A date, normalised', 'No invented names', 'Conflict flagged', 'Missing stays empty']
const DEFAULTS = ['effective_date', 'approver', 'approval_limit_eur', 'review_date']

const picked = ref<string | null>(null)
watch(step, () => { picked.value = null })
const selKey = computed(() => picked.value ?? DEFAULTS[step.value])
const sel = computed(() => FIELDS.find(f => f.key === selKey.value)!)

const paraOf = (span: string) => DOC.findIndex(p => p.some(s => s.span === span)) + 1
const paras = computed(() => [...new Set(sel.value.spans.map(paraOf))])
const isHit = (span?: string) => !!span && sel.value.spans.includes(span)

function fmt(v: string | number | null) {
  if (v === null) return 'null'
  return typeof v === 'number' ? String(v) : `"${v}"`
}
</script>

<template>
  <Stage tag="fictional" task="Click a field to see where it came from">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="s4grid">
      <!-- Source document -->
      <article class="doc" aria-label="Source document">
        <header class="doc-h">
          <span class="doc-t">{{ DOC_TITLE }}</span>
          <span class="doc-id mono">{{ DOC_ID }}</span>
        </header>
        <div v-for="(p, i) in DOC" :key="i" class="para" :class="{ last: i === DOC.length - 1, lit: paras.includes(i + 1) }">
          <span class="pnum mono">¶{{ i + 1 }}</span>
          <span class="ptext">
            <span
              v-for="(s, j) in p" :key="j"
              :class="{ hit: isHit(s.span), warn: isHit(s.span) && sel.state === 'warn' }"
            >{{ s.t }}</span>
          </span>
        </div>
      </article>

      <!-- Arrow -->
      <svg class="flow" viewBox="0 0 28 20" aria-hidden="true">
        <line x1="2" y1="10" x2="24" y2="10" stroke="var(--ink-2)" stroke-width="1.5" />
        <path d="M19 5 L25 10 L19 15" fill="none" stroke="var(--ink-2)" stroke-width="1.5" />
      </svg>

      <!-- Extracted fields -->
      <div class="out">
        <div class="json mono" role="listbox" aria-label="Extracted fields">
          <div class="brace">{</div>
          <button
            v-for="(f, i) in FIELDS" :key="f.key"
            class="jrow" :class="{ sel: f.key === selKey }"
            role="option" :aria-selected="f.key === selKey"
            @click="picked = f.key"
          >
            <span class="k">"{{ f.key }}"</span><span class="punc">: </span><span class="v" :class="{ nul: f.value === null, num: typeof f.value === 'number' }">{{ fmt(f.value) }}</span><span class="punc">{{ i < FIELDS.length - 1 ? ',' : '' }}</span>
            <Status class="st" :state="f.state" compact />
          </button>
          <div class="brace">}</div>
        </div>

        <Transition name="s4fade" mode="out-in">
          <div :key="selKey" class="trace" :class="sel.state">
            <div class="tr-h">
              <Status :state="sel.state" :label="sel.label" />
              <span class="tr-src">{{ paras.length ? 'from ' + paras.map(n => '¶' + n).join(' and ') : 'no source text' }}</span>
            </div>
            <p class="tr-n">{{ sel.note }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.s4grid { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 22px 1.08fr; gap: 10px; align-items: start; }
.flow { width: 22px; height: 16px; align-self: center; }

.doc {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  padding: 10px 14px 6px 8px;
}
.doc-h { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 0 0 5px 30px; border-bottom: 1px solid var(--rule); margin-bottom: 6px; }
.doc-t { font-weight: 600; font-size: var(--fs-label); }
.doc-id { font-size: 14px; color: var(--ink-3); }
.para { display: flex; gap: 6px; margin: 0 !important; padding: 2px 0; font-size: 15px; line-height: 1.3; color: var(--ink); }
.ptext { flex: 1; min-width: 0; }
.para.last { color: var(--ink-2); font-style: italic; border-top: 1px dashed var(--rule); margin-top: 3px; padding-top: 6px; }
.pnum { flex: 0 0 24px; font-size: 14px; color: var(--ink-3); padding-top: 1px; transition: color var(--dur) var(--ease); }
.para.lit .pnumum { color: var(--accent); font-weight: 600; }
.hit { background: var(--accent-tint); box-shadow: inset 0 -2px 0 var(--accent); transition: background var(--dur) var(--ease); }
.hit.warn { background: var(--warn-tint); box-shadow: inset 0 -2px 0 var(--warn); }

.out { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.json { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 5px 0; font-size: 15px; line-height: 1.28; letter-spacing: -0.01em; }
.brace { padding: 0 12px; color: var(--ink-3); }
.jrow {
  display: flex; flex-wrap: wrap; align-items: baseline;
  width: 100%; text-align: left;
  padding: 2px 32px 2px 22px; position: relative;
  background: transparent; border: 0; font: inherit; color: var(--ink); cursor: pointer;
  border-left: 3px solid transparent;
  transition: background var(--dur) var(--ease);
}
.jrow:hover { background: var(--stage); }
.jrow:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.jrow.sel { background: var(--accent-tint); border-left-color: var(--accent); }
.k { color: var(--accent-strong); }
.punc { color: var(--ink-3); }
.v { color: var(--ink); }
.v.num { color: var(--ok); }
.v.nul { color: var(--ink-3); font-style: italic; }
.st { position: absolute; right: 10px; top: 4px; }

.trace { background: var(--surface); border-left: 3px solid var(--ok); padding: 7px 12px 8px; }
.trace.warn { border-left-color: var(--warn); }
.trace.neutral { border-left-color: var(--neutral); }
.tr-h { display: flex; align-items: center; gap: 10px; }
.tr-src { font-size: var(--fs-label); color: var(--ink-2); }
.tr-n { margin: 5px 0 0; font-size: 15px; line-height: 1.32; }

.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
