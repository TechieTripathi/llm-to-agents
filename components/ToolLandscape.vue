<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CAPS, CATEGORIES, CHANGED_2026 } from '../data/s4/landscape'
import type { Level } from '../data/s4/landscape'

// Slide 28: three categories × five capabilities. Rows appear one per click; the last click shows what changed in 2026.
const { step, next, prev, reset, max } = useArtifactStep(3)
const labels = ['AI-enhanced search', 'Research assistants', 'Browser-integrated AI', 'Changed in 2026']

const picked = ref<string | null>(null)
watch(step, () => { picked.value = null })
const shown = (i: number) => i <= step.value
const selId = computed(() => picked.value ?? (step.value < 3 ? CATEGORIES[step.value].id : null))
const sel = computed(() => CATEGORIES.find(c => c.id === selId.value) ?? null)
const LEVEL_TEXT: Record<Level, string> = { core: 'Core', some: 'In some products', no: 'Not typical' }
</script>

<template>
  <Stage :tag="false" bare>
    <template #controls>
      <span class="legendbar" aria-label="Legend">
        <span class="legend"><i class="g core" />Core</span>
        <span class="legend"><i class="g some" />In some products</span>
        <span class="legend"><i class="g no" />Not typical</span>
      </span>
      <span class="spacer" />
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="map" role="table" aria-label="Tool categories and capabilities">
      <div class="corner" role="columnheader">Category · examples as of Oct 2026<br><span class="hint">Click a row for when to use it</span></div>
      <div v-for="(c, j) in CAPS" :key="c" class="cap" role="columnheader" :class="{ act: j === 4 }">{{ c }}</div>

      <template v-for="(cat, i) in CATEGORIES" :key="cat.id">
        <button
          class="catrow" :class="{ off: !shown(i), sel: selId === cat.id }" :tabindex="shown(i) ? 0 : -1"
          :aria-pressed="selId === cat.id" @click="picked = cat.id"
        >
          <span class="cname">{{ cat.name }}</span>
          <span class="ex">{{ cat.examples }}</span>
        </button>
        <div
          v-for="(lv, j) in cat.levels" :key="cat.id + j" role="cell"
          class="cell" :class="{ off: !shown(i), sel: selId === cat.id, act: j === 4 }"
          :aria-label="`${cat.name}: ${CAPS[j]} — ${LEVEL_TEXT[lv]}`"
        >
          <i class="g" :class="lv" />
        </div>
      </template>
    </div>

    <Transition name="s4fade" mode="out-in">
      <div v-if="sel" :key="sel.id" class="detail">
        <div><span class="dk">Use it for</span> {{ sel.useWhen }}</div>
        <div><span class="dk warn">Watch for</span> {{ sel.watch }}</div>
      </div>
      <div v-else key="changes" class="detail changes">
        <span class="dk">Changed in 2026 alone</span>
        <ul>
          <li v-for="c in CHANGED_2026" :key="c">{{ c }}</li>
        </ul>
      </div>
    </Transition>
  </Stage>
</template>

<style scoped>
.map {
  display: grid;
  grid-template-columns: 1fr repeat(5, 92px);
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
}
.corner { display: flex; flex-direction: column; justify-content: flex-end; padding: 5px 12px; border-bottom: 1.5px solid var(--ink); font-size: 15px; font-weight: 600; color: var(--ink-2); line-height: 1.25; }
.hint { font-weight: 400; color: var(--ink-3); font-size: 14px; }
.legendbar { display: inline-flex; gap: 16px; }
.spacer { flex: 1; }
.legend { display: inline-flex; align-items: center; gap: 7px; font-size: 14px; color: var(--ink-2); }
.cap {
  font-size: 14px; line-height: 1.2; font-weight: 600; color: var(--ink-2);
  padding: 5px 6px; display: flex; align-items: flex-end; justify-content: center; text-align: center;
  border-bottom: 1.5px solid var(--ink); border-left: 1px solid var(--rule);
}
.cap.act, .cell.act { background: var(--stage); }
.cap.act { color: var(--ink); }

.catrow {
  display: flex; flex-direction: column; gap: 2px; align-items: flex-start; text-align: left;
  font: inherit; color: var(--ink); background: transparent; border: 0; border-top: 1px solid var(--rule);
  padding: 5px 12px; cursor: pointer;
  border-left: 3px solid transparent;
  transition: opacity var(--dur) var(--ease), background var(--dur) var(--ease);
}
.catrow:first-of-type { border-top: 0; }
.catrow:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.catrow.sel { background: var(--accent-tint); border-left-color: var(--accent); }
.cname { font-size: 15px; font-weight: 600; line-height: 1.2; }
.ex { font-size: 15px; color: var(--ink-2); line-height: 1.25; }
.cell { display: flex; align-items: center; justify-content: center; border-top: 1px solid var(--rule); border-left: 1px solid var(--rule); transition: opacity var(--dur) var(--ease), background var(--dur) var(--ease); }
.cell.sel { background: var(--accent-tint); }
.off { opacity: 0.12; pointer-events: none; }

.g { display: inline-block; width: 18px; height: 18px; border-radius: 50%; box-sizing: border-box; flex: 0 0 auto; }
.legend .g { width: 13px; height: 13px; }
.g.core { background: var(--accent); }
.g.some { border: 2px solid var(--accent); background: linear-gradient(90deg, var(--accent) 50%, transparent 50%); }
.g.no { border: 1.5px solid var(--rule-strong); transform: scale(0.6); }

.detail { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; font-size: 15px; line-height: 1.32; padding: 8px 12px; background: var(--surface); border-left: 3px solid var(--accent); }
.dk { display: block; font-weight: 600; color: var(--accent-strong); font-size: var(--fs-label); margin-bottom: 1px; }
.dk.warn { color: var(--warn); }
.changes { display: block; border-left-color: var(--warn); }
.changes .dk { color: var(--warn); }
.changes ul { margin: 2px 0 0; padding-left: 1.1em; columns: 2; column-gap: 28px; }
.changes li { margin: 0 !important; font-size: 15px; line-height: 1.35; break-inside: avoid; }

.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
