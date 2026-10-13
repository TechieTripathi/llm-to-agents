<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CHECKS, DATA_TYPES, TOOLS, TOUR, type ToolId } from '../data/s8/dataGuide'

// Slide 61 — pick a data type and a tool type; the guide shows OK / conditional / don't.
// Clicks walk a short tour (TOUR); clicking any cell overrides it until the next click.
const { step, next, prev, reset, max } = useArtifactStep(TOUR.length - 1)
const picked = ref<{ d: string, t: ToolId } | null>(null)
watch(step, () => { picked.value = null })

const sel = computed(() => picked.value ?? { d: TOUR[step.value][0], t: TOUR[step.value][1] })
const row = computed(() => DATA_TYPES.find(d => d.id === sel.value.d)!)
const tool = computed(() => TOOLS.find(t => t.id === sel.value.t)!)
const g = computed(() => row.value.guidance[sel.value.t])

function pick(d: string, t: ToolId) { picked.value = { d, t } }
function pickTool(t: ToolId) { picked.value = { d: sel.value.d, t } }

const SHORT = { ok: 'OK', warn: 'Check first', bad: 'Don\'t' } as const
const labels = ['Internal, approved', 'Internal, consumer', 'Personal data', 'Secrets']
</script>

<template>
  <Stage task="Pick a data type, then a tool" tag="fictional">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="guide">
      <div class="matrix" role="grid" aria-label="Data type by tool type">
        <div class="hd corner">What you want to paste</div>
        <button
          v-for="t in TOOLS" :key="t.id" class="hd tool" :class="{ on: sel.t === t.id }"
          :aria-pressed="sel.t === t.id" :title="t.hint" @click.stop="pickTool(t.id)"
        >
          <span class="tl">{{ t.label }}</span>
        </button>

        <template v-for="d in DATA_TYPES" :key="d.id">
          <div class="rl" :class="{ on: sel.d === d.id }">
            <span class="dl">{{ d.label }}</span>
            <span class="de">{{ d.example }}</span>
          </div>
          <button
            v-for="t in TOOLS" :key="t.id" class="cell"
            :class="[d.guidance[t.id].state, { on: sel.d === d.id && sel.t === t.id, rowon: sel.d === d.id }]"
            :aria-label="`${d.label} in ${t.label}: ${d.guidance[t.id].label}`"
            @click.stop="pick(d.id, t.id)"
          >
            <Status :state="d.guidance[t.id].state" :label="SHORT[d.guidance[t.id].state]" />
          </button>
        </template>
      </div>

      <aside class="detail" aria-live="polite">
        <Transition name="swap" mode="out-in">
          <div :key="`${sel.d}-${sel.t}`" class="inner">
            <p class="ctx"><strong>{{ row.label }}</strong> in an <strong>{{ tool.label.toLowerCase() }}</strong></p>
            <div class="verdict" :class="g.state">
              <Status :state="g.state" :label="g.label" />
            </div>
            <p class="why">{{ g.why }}</p>
            <p v-if="g.instead" class="instead"><span class="k">Safer move</span>{{ g.instead }}</p>
          </div>
        </Transition>
      </aside>
    </div>

    <template #notice>
      <span class="checks">
        Before you paste, ask:
        <template v-for="(c, i) in CHECKS" :key="c.term">
          <span class="chk" :title="c.q">{{ c.term }}</span><span v-if="i < CHECKS.length - 1" class="dot">·</span>
        </template>
      </span>
    </template>
  </Stage>
</template>

<style scoped>
.guide {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 272px;
  gap: 18px;
}

/* Matrix */
.matrix {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  grid-template-rows: auto;
  grid-auto-rows: 42px;
  column-gap: 6px;
  row-gap: 5px;
  align-items: stretch;
  align-content: start;
}
.hd { font: 500 var(--fs-label)/1.2 var(--font-sans); color: var(--ink-2); padding: 0 8px 6px; text-align: left; }
.corner { align-self: end; }
.tool {
  display: flex; flex-direction: column; gap: 2px;
  background: transparent; border: 0; border-bottom: 2px solid var(--rule-strong);
  cursor: pointer; transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.tool .tl { color: var(--ink); font-weight: 600; }
.tool .th { font-size: 14px; color: var(--ink-3); font-weight: 400; }
.tool.on { border-bottom-color: var(--accent); }
.tool.on .tl { color: var(--accent); }
.tool:focus-visible, .cell:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.rl {
  display: flex; flex-direction: column; justify-content: center; gap: 1px;
  padding: 4px 8px; border-left: 3px solid transparent;
  transition: border-color var(--dur) var(--ease);
}
.rl.on { border-left-color: var(--accent); }
.dl { font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink); }
.de { font: 400 14px/1.25 var(--font-sans); color: var(--ink-2); }

.cell {
  display: flex; align-items: center; padding: 0 10px;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease), opacity var(--dur) var(--ease);
}
.cell:hover { border-color: var(--ink-3); }
.cell.on { border-color: var(--accent); box-shadow: 0 0 0 1.5px var(--accent); }
.cell :deep(.status) { font-size: 15px; }

/* Detail */
.detail {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.inner { display: flex; flex-direction: column; gap: 9px; }
.ctx { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.35; }
.ctx strong { color: var(--ink); font-weight: 600; }
.verdict :deep(.status) { font-size: 20px; padding: 5px 13px 5px 9px; gap: 8px; }
.verdict :deep(svg) { width: 18px; height: 18px; }
.why { margin: 0; font-size: 15px; line-height: 1.36; color: var(--ink); }
.instead { margin: 0; font-size: var(--fs-label); line-height: 1.36; color: var(--ink-2); border-top: 1px solid var(--rule); padding-top: 8px; }
.instead .k { display: block; font-weight: 600; color: var(--ink); margin-bottom: 2px; }

.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease), transform calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(4px); }
.swap-leave-to { opacity: 0; }

/* Notice line */
.checks { display: inline-flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
.chk { font-weight: 600; }
.dot { color: var(--ink-3); }
</style>
