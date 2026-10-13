<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { CONTROLS } from '../data/s5/harness'

// Slide 43 — a bare agent loop; each click attaches one runtime control where it acts, with what it prevents.
const { step } = useArtifactStep(CONTROLS.length)
const on = (n: number) => step.value >= n
</script>

<template>
  <div class="hs">
    <svg viewBox="0 0 400 340" class="loopd" role="img" aria-label="Agent loop with runtime controls attached where they act">
      <defs>
        <marker id="s5hs-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--ink-2)" /></marker>
      </defs>

      <!-- 4 Budgets: a meter across the whole loop -->
      <g class="ctl" :class="{ off: !on(4) }">
        <rect x="0" y="6" width="400" height="40" rx="5" class="band" />
        <text x="12" y="31" class="lbl">Budget</text>
        <rect x="80" y="20" width="200" height="12" rx="6" class="meter-track" />
        <rect x="80" y="20" width="80" height="12" rx="6" class="meter-fill" />
        <text x="292" y="31" class="mono">12/30 calls</text>
        <circle cx="400" cy="6" r="11" class="badge" /><text x="400" y="11" text-anchor="middle" class="bn">4</text>
      </g>

      <!-- 6 Error handling: branch off the tool step -->
      <g class="ctl" :class="{ off: !on(6) }">
        <path d="M200 112 V74" class="ln warnln" marker-end="url(#s5hs-a)" />
        <text x="210" y="84" class="lbl warn">retry, change, escalate</text>
        <circle cx="186" cy="88" r="11" class="badge" /><text x="186" y="93" text-anchor="middle" class="bn">6</text>
      </g>

      <!-- Core loop -->
      <g class="core">
        <rect x="0" y="114" width="100" height="62" rx="6" class="node model" />
        <text x="50" y="140" text-anchor="middle" class="nt inv">Model</text>
        <text x="50" y="162" text-anchor="middle" class="ns inv">decides</text>
        <rect x="150" y="114" width="100" height="62" rx="6" class="node" />
        <text x="200" y="140" text-anchor="middle" class="nt">Tool</text>
        <text x="200" y="162" text-anchor="middle" class="ns">runs</text>
        <rect x="300" y="114" width="100" height="62" rx="6" class="node" />
        <text x="350" y="140" text-anchor="middle" class="nt">Result</text>
        <text x="350" y="162" text-anchor="middle" class="ns">comes back</text>
        <path d="M100 145 H148" class="ln" marker-end="url(#s5hs-a)" />
        <path d="M250 145 H298" class="ln" marker-end="url(#s5hs-a)" />
        <path d="M350 176 V206 H50 V178" class="ln" marker-end="url(#s5hs-a)" />
        <text x="200" y="200" text-anchor="middle" class="lbl">next step</text>
      </g>

      <!-- 1 Permissions + 2 Schemas: gates on the call edge -->
      <g class="ctl" :class="{ off: !on(1) }">
        <rect x="112" y="128" width="5" height="34" class="gate" />
        <circle cx="114" cy="106" r="11" class="badge" /><text x="114" y="111" text-anchor="middle" class="bn">1</text>
      </g>
      <g class="ctl" :class="{ off: !on(2) }">
        <rect x="131" y="128" width="5" height="34" class="gate" />
        <circle cx="134" cy="186" r="11" class="badge" /><text x="134" y="191" text-anchor="middle" class="bn">2</text>
      </g>

      <!-- 3 Validation: on the result -->
      <g class="ctl" :class="{ off: !on(3) }">
        <rect x="296" y="110" width="108" height="70" rx="8" class="check" />
        <circle cx="400" cy="110" r="11" class="badge" /><text x="400" y="115" text-anchor="middle" class="bn">3</text>
      </g>

      <!-- 5 State: written every step -->
      <g class="ctl" :class="{ off: !on(5) }">
        <path d="M200 208 V236" class="ln" marker-end="url(#s5hs-a)" />
        <rect x="110" y="238" width="180" height="40" rx="5" class="store" />
        <text x="200" y="263" text-anchor="middle" class="lbl strong">State: task record</text>
        <circle cx="290" cy="238" r="11" class="badge" /><text x="290" y="243" text-anchor="middle" class="bn">5</text>
      </g>

      <!-- Step 0: the bare loop -->
      <g class="ctl" :class="{ off: step > 0 }">
        <text x="200" y="262" text-anchor="middle" class="lbl strong">No controls yet: the loop runs</text>
        <text x="200" y="284" text-anchor="middle" class="lbl">until the model decides to stop.</text>
      </g>

      <!-- 7 Logs: under everything -->
      <g class="ctl" :class="{ off: !on(7) }">
        <path d="M14 176 V296" class="ln tap" />
        <path d="M386 176 V296" class="ln tap" />
        <rect x="0" y="296" width="400" height="38" rx="5" class="band" />
        <text x="200" y="320" text-anchor="middle" class="lbl strong">Audit log: every call, result, decision</text>
        <circle cx="400" cy="296" r="11" class="badge" /><text x="400" y="301" text-anchor="middle" class="bn">7</text>
      </g>
    </svg>

    <ol class="ctl-list">
      <li v-for="c in CONTROLS" :key="c.n" :class="{ shown: on(c.n), current: step === c.n }">
        <span class="num">{{ c.n }}</span>
        <span class="body">
          <span class="name">{{ c.name }}<span class="cfg"> · {{ c.config }}</span></span>
          <span class="prev">Prevents {{ c.prevents }}</span>
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.hs { display: grid; grid-template-columns: 400px 1fr; gap: 28px; flex: 1 1 auto; min-height: 0; align-items: start; }
.loopd { width: 400px; height: auto; overflow: visible; margin-top: 6px; }
.node { fill: var(--surface); stroke: var(--ink-2); stroke-width: 1.5; }
.node.model { fill: var(--accent); stroke: var(--accent); }
.nt { font: 600 16px var(--font-sans); fill: var(--ink); }
.ns { font: 400 15px var(--font-sans); fill: var(--ink-2); }
.inv { fill: #fff; }
.ln { fill: none; stroke: var(--ink-2); stroke-width: 1.5; }
.ln.tap { stroke-dasharray: 2 4; stroke: var(--rule-strong); }
.warnln { stroke: var(--warn); }
.lbl { font: 400 15px var(--font-sans); fill: var(--ink-2); }
.lbl.strong { fill: var(--ink); font-weight: 500; }
.lbl.warn { fill: var(--warn); font-weight: 500; }
.mono { font: 400 14px var(--font-mono); fill: var(--ink-2); }
.band { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.meter-track { fill: var(--stage); }
.meter-fill { fill: var(--accent); }
.gate { fill: var(--ink); }
.check { fill: none; stroke: var(--ok); stroke-width: 2; stroke-dasharray: 5 3; }
.store { fill: var(--accent-tint); stroke: var(--accent); stroke-width: 1.5; }
.badge { fill: var(--ink); }
.bn { font: 600 13.5px var(--font-sans); fill: #fff; }
.ctl { transition: opacity var(--dur) var(--ease); }
.ctl.off { opacity: 0; }

.ctl-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.ctl-list li { display: flex; gap: 12px; padding: 4px 0 5px; margin: 0; border-bottom: 1px solid var(--rule); align-items: baseline; }
.num { flex: 0 0 22px; height: 22px; border-radius: 11px; background: var(--rule); color: var(--ink-2); font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; transition: background var(--dur) var(--ease); transform: translateY(3px); }
.shown .num { background: var(--ink); color: #fff; }
.current .num { background: var(--accent); }
.body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.name { font-size: var(--fs-label); font-weight: 600; color: var(--ink-3); line-height: 1.3; }
.shown .name { color: var(--ink); }
.cfg { font-weight: 400; color: var(--ink-2); opacity: 0; transition: opacity var(--dur) var(--ease); }
.prev { font-size: var(--fs-label); color: var(--ink-2); line-height: 1.3; opacity: 0; transition: opacity var(--dur) var(--ease); }
.shown .cfg, .shown .prev { opacity: 1; }
.current .prev { color: var(--accent); font-weight: 500; }
</style>
