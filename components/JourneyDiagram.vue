<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { LAYERS } from '../data/s1/journey'
import type { LayerId } from '../data/s1/journey'

/**
 * The course path as nested layers: Model → Context → Tools → Agent → Workflow.
 * Each layer wraps the previous one; the model in the middle never changes size or place.
 *
 * Reuse:
 *   <JourneyDiagram />                         step-driven (pair with `clicks: 4`), step 0 = Model only
 *   <JourneyDiagram up-to="Tools" />           static: layers up to Tools, Tools highlighted
 *   <JourneyDiagram :up-to="4" focus="Agent" /> all layers, Agent highlighted
 *   <JourneyDiagram up-to="Workflow" :notes="false" />  diagram only (no side notes)
 * Clicking a layer highlights it.
 */
const props = withDefaults(defineProps<{
  upTo?: number | LayerId
  focus?: number | LayerId
  notes?: boolean
}>(), { notes: true })

const idx = (v: number | LayerId | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? v : LAYERS.findIndex(l => l.id === v)

const { step } = useArtifactStep(LAYERS.length - 1)
const shown = computed(() => idx(props.upTo) ?? step.value)
const picked = ref<number | null>(null)
watch(shown, () => { picked.value = null })
const focusIdx = computed(() => picked.value ?? idx(props.focus) ?? shown.value)

const cls = (i: number) => ({
  on: i <= shown.value,
  focus: i === focusIdx.value && i <= shown.value,
})
const pick = (i: number) => { if (i <= shown.value) picked.value = i }
const L = LAYERS
</script>

<template>
  <div class="jd" :class="{ 'no-notes': !notes }">
    <div class="rings" role="group" aria-label="Model, context, tools, agent and workflow as nested layers">
      <div class="L L4" :class="cls(4)" @click.self.stop="pick(4)">
        <div class="hd" @click.stop="pick(4)">
          <span class="nm">{{ L[4].id }}</span>
          <span class="it">
            <template v-for="(t, k) in L[4].items" :key="t"><span v-if="k" class="sep">·</span>{{ t }}</template>
          </span>
        </div>
        <div class="L L3" :class="cls(3)" @click.self.stop="pick(3)">
          <div class="hd" @click.stop="pick(3)">
            <span class="nm">{{ L[3].id }}</span>
            <span class="it loop">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13.5 8A5.5 5.5 0 1 1 11.6 3.8" /><path d="M12.2 1.2l-.4 2.9-2.9-.3" />
              </svg>
              <template v-for="(t, k) in L[3].items" :key="t"><span v-if="k" class="sep">→</span>{{ t }}</template>
            </span>
          </div>
          <div class="L L2" :class="cls(2)" @click.self.stop="pick(2)">
            <div class="hd" @click.stop="pick(2)">
              <span class="nm">{{ L[2].id }}</span>
              <span class="it">
                <template v-for="(t, k) in L[2].items" :key="t"><span v-if="k" class="sep">·</span>{{ t }}</template>
              </span>
            </div>
            <div class="L L1" :class="cls(1)" @click.self.stop="pick(1)">
              <div class="hd" @click.stop="pick(1)">
                <span class="nm">{{ L[1].id }}</span>
                <span class="it">
                  <template v-for="(t, k) in L[1].items" :key="t"><span v-if="k" class="sep">·</span>{{ t }}</template>
                </span>
              </div>
              <div class="L L0 core" :class="cls(0)" @click.stop="pick(0)">
                <span class="nm">{{ L[0].id }}</span>
                <span class="it">{{ L[0].items[0] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ol v-if="notes" class="notes">
      <li
        v-for="(l, i) in L" :key="l.id" class="n"
        :class="{ on: i <= shown, focus: i === focusIdx && i <= shown }"
        @click.stop="pick(i)"
      >
        <span class="n-top">
          <span class="n-nm">{{ l.id }}</span>
          <span class="n-where">{{ l.where }}</span>
        </span>
        <span class="n-say">{{ l.says }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.jd { display: grid; grid-template-columns: 1.3fr 1fr; grid-template-rows: minmax(0, 1fr); gap: 26px; flex: 1 1 auto; min-height: 0; }
.jd.no-notes { grid-template-columns: 1fr; }

.rings { display: flex; min-height: 0; }
.L {
  flex: 1;
  display: flex; flex-direction: column;
  border: 1.5px solid transparent;
  border-radius: 8px;
  padding: 0 12px 12px;
  background: transparent;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
  cursor: default;
}
.L.on { border-color: var(--ink-3); background: var(--paper); cursor: pointer; }
.L.focus { border-color: var(--accent); border-width: 1.5px; background: var(--accent-tint); }
.L.focus > .hd .nm { color: var(--accent); }

.hd {
  display: flex; align-items: baseline; gap: 10px;
  height: 32px; padding-top: 7px;
  white-space: nowrap; overflow: hidden;
  opacity: 0; transform: translateY(3px);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.L.on > .hd { opacity: 1; transform: none; }
.nm { font-size: var(--fs-label); font-weight: 600; color: var(--ink); }
.it { font-size: 15px; color: var(--ink-2); display: inline-flex; align-items: baseline; gap: 6px; }
.sep { color: var(--ink-3); }
.loop svg { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; align-self: center; }

.core {
  flex: 1;
  align-items: center; justify-content: center; gap: 4px;
  padding: 10px;
  border: 2px solid var(--accent) !important;
  background: var(--surface) !important;
  cursor: pointer;
}
.core .nm { font-size: 22px; color: var(--accent); }
.core .it { font-size: 15px; }
.core.focus { background: var(--accent) !important; }
.core.focus .nm, .core.focus .it { color: #fff; }

.notes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; min-height: 0; }
.n {
  margin: 0 !important;
  display: flex; flex-direction: column; gap: 1px;
  padding: 6px 0 7px 14px;
  border-left: 3px solid var(--rule);
  opacity: 0.32;
  cursor: pointer;
  line-height: 1.3;
  transition: opacity var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.n.on { opacity: 1; }
.n.focus { border-left-color: var(--accent); }
.n-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.n-nm { font-size: 15px; font-weight: 600; }
.n.focus .n-nm { color: var(--accent); }
.n-where { font-size: 14px; color: var(--ink-3); }
.n-say { font-size: var(--fs-label); color: var(--ink-2); }
</style>
