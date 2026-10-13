<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CLAIMS, SOURCES } from '../data/s4/comparison'
import type { Stance } from '../data/s4/comparison'

// Slide 29: a claims × sources matrix. Each click adds a source column; the last adds the verdict.
const { step, next, prev, reset, max } = useArtifactStep(3)
const labels = ['Vendor claims', 'Add analyst', 'Add reference call', 'Verdict']

const STANCE: Record<Stance, { state: 'ok' | 'bad' | 'neutral', label: string }> = {
  supports: { state: 'ok', label: 'Supports' },
  contradicts: { state: 'bad', label: 'Contradicts' },
  silent: { state: 'neutral', label: 'Silent' },
}

// Selected cell: a sensible default per step (so every PDF state shows evidence), overridable by clicking.
const DEFAULTS = [['fuel', 'S1'], ['fuel', 'S2'], ['golive', 'S3'], ['fuel', 'S2']]
const picked = ref<[string, string] | null>(null)
watch(step, () => { picked.value = null })
const sel = computed(() => picked.value ?? DEFAULTS[step.value] as [string, string])
const selClaim = computed(() => CLAIMS.find(c => c.id === sel.value[0])!)
const selSource = computed(() => SOURCES.find(s => s.id === sel.value[1])!)
const selCell = computed(() => selClaim.value.cells[sel.value[1]])

const visible = (i: number) => i <= step.value
function pick(c: string, s: string, i: number) { if (visible(i)) picked.value = [c, s] }
</script>

<template>
  <Stage tag="fictional" task="Click a cell to see its evidence">
    <template #notice>Silence is not support. And AI-search citations often fail to back their sentences.<Cite k="s3liu2023verifiability" /></template>
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="matrix" role="table" aria-label="Claims compared across sources">
      <div class="h claim-h" role="columnheader">Claim</div>
      <div
        v-for="(s, i) in SOURCES" :key="s.id" class="h src-h" role="columnheader"
        :class="{ off: !visible(i) }"
      >
        <span class="sname"><span class="sid mono">{{ s.id }}</span> {{ s.short }}</span>
        <span class="skind">{{ s.kind }}</span>
      </div>
      <div class="h verdict-h" role="columnheader" :class="{ off: step < 3 }">Verdict</div>

      <template v-for="c in CLAIMS" :key="c.id">
        <div class="claim" role="cell" :class="{ rowsel: sel[0] === c.id }">{{ c.text }}</div>
        <button
          v-for="(s, i) in SOURCES" :key="c.id + s.id"
          class="cell" role="cell"
          :class="{ off: !visible(i), sel: sel[0] === c.id && sel[1] === s.id }"
          :tabindex="visible(i) ? 0 : -1"
          :aria-label="`${c.text} — ${s.short}: ${STANCE[c.cells[s.id].stance].label}`"
          @click="pick(c.id, s.id, i)"
        >
          <Status :state="STANCE[c.cells[s.id].stance].state" :label="STANCE[c.cells[s.id].stance].label" compact />
        </button>
        <div class="verdict" role="cell" :class="{ off: step < 3 }">
          <Status :state="c.verdict === 'agreed' ? 'ok' : 'warn'" :label="c.verdict === 'agreed' ? 'Agreed' : 'Disputed'" />
        </div>
      </template>
    </div>

    <Transition name="s4fade" mode="out-in">
      <div :key="sel.join() + (step === 3)" class="evidence">
        <p class="ev-quote" :class="{ none: !selCell.quote }">
          <span class="mono sid">{{ selSource.id }}</span>
          {{ selCell.quote ?? 'This source does not address the claim. Silence is not support.' }}
          <span class="ev-src">{{ selSource.name }}<template v-if="selCell.loc">, {{ selCell.loc }}</template></span>
        </p>
        <p v-if="step === 3" class="ev-brief">
          <span class="brief-k">In the brief</span>
          {{ selClaim.brief }}
          <span class="cites mono">[{{ Object.entries(selClaim.cells).filter(([, v]) => v.stance !== 'silent').map(([k]) => k).join('][') }}]</span>
        </p>
      </div>
    </Transition>
  </Stage>
</template>

<style scoped>
.q { margin: 0; font-size: var(--fs-small); color: var(--ink); }
.q-k { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); margin-right: 8px; }

.matrix {
  display: grid;
  grid-template-columns: 1.35fr repeat(3, 1fr) 0.85fr;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
}
.h {
  padding: 6px 12px 5px;
  font-size: var(--fs-label);
  font-weight: 600;
  border-bottom: 1.5px solid var(--ink);
  display: flex; flex-direction: column; justify-content: flex-end; gap: 1px;
  line-height: 1.2;
}
.src-h { border-left: 1px solid var(--rule); }
.sid { font-size: 15px; color: var(--accent); font-weight: 600; margin-right: 2px; }
.sname { color: var(--ink); }
.skind { font-weight: 400; color: var(--ink-3); font-size: 14px; }
.verdict-h { border-left: 1.5px solid var(--ink); }

.claim, .cell, .verdict {
  border-top: 1px solid var(--rule);
  padding: 8px 12px;
  display: flex; align-items: center;
  font-size: 15px; line-height: 1.2;
  min-height: 40px;
  padding-top: 6px; padding-bottom: 6px;
}
.claim { color: var(--ink); }
.claim.rowsel { box-shadow: inset 3px 0 0 var(--accent); }
.cell {
  border-left: 1px solid var(--rule);
  background: transparent;
  border-right: 0; border-bottom: 0;
  font: inherit; font-size: 15px; text-align: left;
  cursor: pointer;
  transition: background var(--dur) var(--ease), opacity var(--dur) var(--ease);
}
.cell:hover { background: var(--stage); }
.cell:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.cell.sel { background: var(--accent-tint); box-shadow: inset 0 0 0 2px var(--accent); }
.verdict { border-left: 1.5px solid var(--ink); }
.off { opacity: 0; pointer-events: none; }
.h.off { opacity: 0.25; }

.evidence {
  background: var(--surface);
  border-left: 3px solid var(--accent);
  padding: 8px 14px;
  display: flex; flex-direction: column; gap: 3px;
}
.ev-src { display: block; font-size: var(--fs-label); color: var(--ink-2); }
.ev-quote { margin: 0; font-size: var(--fs-small); color: var(--ink); line-height: 1.3; }
.ev-quote.none { color: var(--ink-2); font-style: italic; }
.ev-brief { margin: 2px 0 0; font-size: var(--fs-label); color: var(--ink); line-height: 1.3; }
.brief-k { font-weight: 600; color: var(--accent); margin-right: 6px; }
.cites { color: var(--accent); font-size: 15px; margin-left: 4px; }

.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
