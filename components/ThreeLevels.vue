<script setup lang="ts">
// Slide 55 — one task at three levels of assistance. Clicks reveal level 2 and level 3.
// The on-time figure row is the thread: invented → stale → checked.
import { useArtifactStep } from '../composables/useArtifactStep'
import { LEVELS, TASK } from '../data/s7/levels'

const { step, next, prev, reset, max } = useArtifactStep(2)
const shown = (i: number) => step.value >= i
const rise = [16, 8, 0]
</script>

<template>
  <div class="s7-levels">
    <div class="topbar">
      <span class="task"><span class="tk">Task</span>{{ TASK }}</span>
      <span class="spacer" />
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
      <SimTag kind="fictional" />
    </div>

    <div class="s7grid">
      <!-- header row: a rising stair line, one tread per level -->
      <div class="rowlab head-lab" />
      <div v-for="(lv, i) in LEVELS" :key="lv.id" class="head" :class="{ off: !shown(i), first: i === 0, last: i === LEVELS.length - 1 }" :style="{ '--rise': `${rise[i]}px` }">
        <span class="tread" aria-hidden="true" />
        <span v-if="i > 0" class="riser" aria-hidden="true" />
        <span class="lvname"><span class="lvno">{{ i + 1 }}</span>{{ lv.name }}</span>
      </div>

      <div class="rowlab">You give</div>
      <div v-for="(lv, i) in LEVELS" :key="`g${i}`" class="cell give" :class="{ off: !shown(i) }">
        <span>{{ lv.give }}</span>
        <span v-if="lv.files" class="files">
          <span v-for="f in lv.files" :key="f" class="file">
            <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M1 .75h6l3.25 3.25v8.25H1z M7 .75V4h3.25" fill="none" stroke="currentColor" stroke-width="1.2" /></svg>{{ f }}
          </span>
        </span>
      </div>

      <div class="rowlab">You get</div>
      <div v-for="(lv, i) in LEVELS" :key="`r${i}`" class="cell" :class="{ off: !shown(i) }">{{ lv.get }}</div>

      <div class="rowlab">On-time figure in the draft</div>
      <div v-for="(lv, i) in LEVELS" :key="`f${i}`" class="cell fig" :class="[lv.figure.state, { off: !shown(i) }]">
        <span class="figline">
          <span class="num" :class="{ struck: lv.figure.state === 'bad' }">{{ lv.figure.value }}</span>
          <Status :state="lv.figure.state" :label="lv.figure.label" />
        </span>
        <span class="fignote">{{ lv.figure.note }}</span>
      </div>

      <div class="rowlab">Checks</div>
      <div v-for="(lv, i) in LEVELS" :key="`c${i}`" class="cell" :class="{ off: !shown(i) }">{{ lv.checks }}</div>

      <div class="rowlab">Effort <span class="ill">(illustrative)</span></div>
      <div v-for="(lv, i) in LEVELS" :key="`e${i}`" class="cell effort" :class="{ off: !shown(i) }">
        <span class="meter" :aria-label="`Set-up effort ${lv.setup} of 5`">
          <span class="mlab">Set-up</span>
          <i v-for="d in 5" :key="d" :class="{ on: d <= lv.setup }" />
        </span>
        <span class="meter" :aria-label="`Review effort ${lv.review} of 5`">
          <span class="mlab">Review</span>
          <i v-for="d in 5" :key="d" :class="{ on: d <= lv.review }" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s7-levels { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 6px; }
.topbar { display: flex; align-items: center; gap: 12px; padding-bottom: 4px; }
.task { font-size: var(--fs-label); color: var(--ink); }
.tk { color: var(--ink-2); margin-right: 10px; }
.spacer { flex: 1; }

.s7grid {
  display: grid;
  grid-template-columns: 108px repeat(3, 1fr);
  column-gap: 22px;
  row-gap: 0;
  font-size: var(--fs-label);
  line-height: 1.3;
}
.rowlab {
  color: var(--ink-2);
  font-size: var(--fs-label);
  padding: 7px 0;
  border-top: 1px solid var(--rule);
  line-height: 1.25;
}
.rowlab.head-lab, .head { border-top: none; }
.ill { display: block; color: var(--ink-3); }

.head {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-bottom: 8px;
  transition: opacity var(--dur) var(--ease);
}
.head { padding-top: calc(var(--rise) + 10px); }
.tread, .riser { position: absolute; background: var(--accent); transition: background var(--dur) var(--ease); }
.tread { top: var(--rise); left: -11px; right: -11px; height: 3px; }
.head.first .tread { left: 0; }
.head.last .tread { right: 0; }
.riser { left: -11px; top: var(--rise); width: 3px; height: 11px; }
.head.off .tread, .head.off .riser { background: var(--rule-strong); }
.lvno { color: var(--accent); font-weight: 600; margin-right: 8px; font-variant-numeric: tabular-nums; }
.lvname { font-size: var(--fs-small); font-weight: 600; color: var(--ink); }
.lvfit { font-size: var(--fs-label); color: var(--ink-2); }
.head.off { opacity: 0.45; }
.head.off .lvno { color: var(--ink-3); }
.head { padding-bottom: 6px; }
.head.off .lvfit { visibility: hidden; }

.cell {
  padding: 7px 0;
  border-top: 1px solid var(--rule);
  color: var(--ink);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.cell.off { opacity: 0; transform: translateY(6px); }

.give .files { display: inline; }
.give .file { margin: 2px 4px 0 0; }
.file {
  display: inline-flex; align-items: center; gap: 5px; vertical-align: baseline;
  font-size: var(--fs-label); line-height: 1.25;
  padding: 0 6px;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--ink-2);
}

.fig { display: flex; flex-direction: column; gap: 2px; }
.figline { display: flex; align-items: center; gap: 10px; }
.num { font: 600 26px/1.05 var(--font-sans); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.fig.bad .num { color: var(--bad); }
.fig.warn .num { color: var(--warn); }
.fig.ok .num { color: var(--ok); }
.num.struck { text-decoration: line-through; text-decoration-thickness: 2px; }
.fignote { color: var(--ink-2); }

.effort { display: flex; flex-wrap: wrap; gap: 4px 16px; }
.meter { display: inline-flex; align-items: center; gap: 4px; }
.mlab { color: var(--ink-2); margin-right: 3px; }
.meter i { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid var(--ink-3); display: inline-block; }
.meter i.on { background: var(--ink); border-color: var(--ink); }
</style>
