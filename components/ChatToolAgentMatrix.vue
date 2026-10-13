<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { ROWS, SYSTEMS } from '../data/s5/matrix'

// Slide 36 — each click answers one question for all three kinds of system.
const { step } = useArtifactStep(ROWS.length)
</script>

<template>
  <div class="mx" role="table" aria-label="Chat assistant versus tool-using system versus agent">
    <div class="mx-row names" role="row">
      <div class="q" role="columnheader" />
      <div v-for="s in SYSTEMS" :key="s.id" class="cell name" :class="{ agent: s.id === 'agent' }" role="columnheader">{{ s.name }}</div>
    </div>
    <div class="mx-row meta" role="row">
      <div class="q mx-k" role="rowheader">How much it decides</div>
      <div v-for="s in SYSTEMS" :key="s.id" class="cell" :class="{ agent: s.id === 'agent' }" role="cell">
        <span class="meter" :aria-label="`${s.autonomy} of 3`">
          <span v-for="n in 3" :key="n" class="seg" :class="{ on: n <= s.autonomy }" />
        </span>
      </div>
    </div>
    <div class="mx-row meta ex-row" role="row">
      <div class="q mx-k" role="rowheader">Example at Kestrel</div>
      <div v-for="s in SYSTEMS" :key="s.id" class="cell ex" :class="{ agent: s.id === 'agent' }" role="cell">{{ s.example }}</div>
    </div>
    <div
      v-for="(r, i) in ROWS" :key="r.q" class="mx-row ans" role="row"
      :class="{ shown: step > i, current: step === i + 1 }"
    >
      <div class="q" role="rowheader">{{ r.q }}</div>
      <div v-for="(c, j) in r.cells" :key="j" class="cell val" :class="{ agent: j === 2 }" role="cell">{{ c }}</div>
    </div>
  </div>
</template>

<style scoped>
.mx { display: flex; flex-direction: column; font-size: var(--fs-label); line-height: 1.28; }
.mx-row { display: grid; grid-template-columns: 184px 1fr 1fr 1fr; }
.cell, .q { padding: 6px 12px; }
.cell.agent { background: var(--accent-tint); }
.names .cell { font-weight: 600; font-size: var(--fs-small); color: var(--ink); padding-top: 8px; padding-bottom: 2px; }
.names .cell.agent { color: var(--accent); }
.meta .cell, .meta .q { padding-top: 3px; padding-bottom: 3px; }
.ex-row { border-bottom: 1.5px solid var(--ink); }
.ex-row .cell, .ex-row .q { padding-bottom: 9px; }
.mx-k { color: var(--ink-3); font-size: var(--fs-label); }
.meter { display: inline-flex; align-items: center; gap: 3px; height: 21px; }
.seg { width: 22px; height: 7px; border-radius: 1px; background: var(--rule); }
.seg.on { background: var(--ink-2); }
.agent .seg.on { background: var(--accent); }
.ex { color: var(--ink-2); font-style: italic; }
.ans { border-bottom: 1px solid var(--rule); }
.ans .cell, .ans .q { padding-top: 7px; padding-bottom: 7px; }
.ans .q { color: var(--ink-3); font-weight: 500; transition: color var(--dur) var(--ease); position: relative; }
.ans.shown .q { color: var(--ink); }
.ans.current .q::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; background: var(--accent); }
.val { color: var(--ink); opacity: 0; transform: translateY(4px); transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.ans.shown .val { opacity: 1; transform: none; }
.ans.current .val.agent { font-weight: 500; }
</style>
