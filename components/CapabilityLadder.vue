<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { RUNGS } from '../data/s4/ladder'

// Slide 27: three rungs. Each click climbs one rung; rows show access, risk and the control it needs.
const { step, next, prev, reset, max } = useArtifactStep(2)
const ROWS = [
  { key: 'access', label: 'Works from' },
  { key: 'risk', label: 'New risk' },
  { key: 'control', label: 'Control you add' },
] as const
const labels = ['Conversation', 'Tool-assisted work', 'Multi-step execution']
</script>

<template>
  <Stage :tag="false" bare>
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="ladder" :style="{ '--on': step }">
      <!-- header row: the staircase -->
      <div class="corner">
        <svg viewBox="0 0 14 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="7" y1="100" x2="7" y2="3" stroke="var(--ink-3)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        </svg>
        <svg class="tip" viewBox="0 0 14 10" aria-hidden="true"><path d="M2 9 L7 2 L12 9" fill="none" stroke="var(--ink-3)" stroke-width="1.5" /></svg>
        <span class="axis">More reach</span>
      </div>
      <div
        v-for="(r, i) in RUNGS" :key="r.id"
        class="tread" :class="{ seen: i <= step, on: i === step }"
        :style="{ '--lift': `${i * 26}px` }"
      >
        <div class="riser" />
        <div class="th">
          <span class="name">{{ r.name }}</span>
          <span class="verb">{{ r.verb }}</span>
        </div>
      </div>

      <!-- body rows -->
      <template v-for="row in ROWS" :key="row.key">
        <div class="rowlab" :class="row.key">{{ row.label }}</div>
        <div
          v-for="(r, i) in RUNGS" :key="r.id + row.key"
          class="cell" :class="[row.key, { seen: i <= step, on: i === step }]"
        >
          <Transition name="s4fade" mode="out-in">
            <span v-if="i <= step" :key="'t' + i">{{ r[row.key] }}</span>
            <span v-else :key="'p' + i" class="placeholder" aria-hidden="true" />
          </Transition>
        </div>
      </template>
    </div>

    <div class="band">
      <span class="band-l">Each rung adds reach — and the risk you must control</span>
      <svg class="band-arrow" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="6" x2="392" y2="6" stroke="var(--ink)" stroke-width="1.5" />
        <path d="M386 1 L394 6 L386 11" fill="none" stroke="var(--ink)" stroke-width="1.5" />
      </svg>
    </div>
  </Stage>
</template>

<style scoped>
.ladder {
  display: grid;
  grid-template-columns: 112px repeat(3, 1fr);
  grid-template-rows: auto repeat(3, auto);
  column-gap: 0;
  margin-top: 4px;
}
.corner { position: relative; grid-row: 1; padding: 0 0 0 0; }
.corner svg { position: absolute; left: 0; top: 4px; bottom: 0; width: 14px; height: calc(100% - 4px); }
.corner svg.tip { top: 0; height: 10px; }
.axis { position: absolute; left: 22px; top: 0; font-size: var(--fs-label); color: var(--ink-3); line-height: 1.15; width: 70px; }

.tread {
  position: relative;
  align-self: end;
  min-height: calc(62px + var(--lift));
  border-top: 2.5px solid var(--rule-strong);
  padding: 8px 14px 0;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.tread .riser {
  position: absolute; left: -1.25px; top: -2.5px; bottom: 0;
  border-left: 2.5px solid var(--rule-strong);
  transition: border-color var(--dur) var(--ease);
}
.tread.seen { border-color: var(--ink); }
.tread.seen .riser { border-color: var(--ink); }
.tread.on { border-color: var(--accent); background: var(--accent-tint); }
.tread.on .riser { border-color: var(--accent); }
.th { display: flex; flex-direction: column; gap: 3px; }
.name { font-size: 21px; font-weight: 600; line-height: 1.15; color: var(--ink-3); transition: color var(--dur) var(--ease); }
.verb { font-size: var(--fs-label); color: var(--ink-3); line-height: 1.25; opacity: 0; transition: opacity var(--dur) var(--ease); }
.tread.seen .name { color: var(--ink); }
.tread.on .name { color: var(--accent-strong); }
.tread.seen .verb { opacity: 1; color: var(--ink-2); }

.rowlab {
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--ink-2);
  padding: 9px 10px 9px 0;
  border-top: 1px solid var(--rule);
  line-height: 1.25;
}
.cell {
  font-size: 15px;
  line-height: 1.28;
  padding: 9px 14px;
  border-top: 1px solid var(--rule);
  border-left: 1px solid var(--rule);
  min-height: 0;
  color: var(--ink);
  transition: background var(--dur) var(--ease);
}
.cell.on { background: var(--accent-tint); }
.cell.risk.seen span { color: var(--ink); }
.cell.control.seen { font-weight: 500; }
.rowlab.control, .cell.control { border-bottom: 1.5px solid var(--ink); }
.placeholder { display: block; height: 0; margin-top: 11px; width: 70%; border-top: 2px dashed var(--rule-strong); opacity: 0.6; }

.band { display: flex; align-items: center; gap: 14px; margin-top: 12px; padding-left: 112px; }
.band-l { font-size: var(--fs-label); color: var(--ink-2); white-space: nowrap; }
.band-arrow { flex: 1; height: 12px; }

.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
