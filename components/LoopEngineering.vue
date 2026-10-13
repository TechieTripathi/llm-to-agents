<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { type EdgeId, PATHS, SPEC } from '../data/s5/loopspec'

// Slide 42 — the loop as a flowchart with four ways a run can go. Clicks (or buttons) light one path.
const { step, go } = useArtifactStep(PATHS.length)
const path = computed(() => (step.value > 0 ? PATHS[step.value - 1] : null))
const lit = (e: EdgeId) => !!path.value?.edges.includes(e)
const end = computed(() => path.value?.end)

interface Node { id: string, x: number, y: number, w: number, h: number, t: string, s?: string, kind: 'act' | 'ask' | 'end' }
const NODES: Node[] = [
  { id: 'B', x: 0, y: 0, w: 140, h: 48, t: 'Budget left?', s: 'calls, time', kind: 'ask' },
  { id: 'D', x: 190, y: 0, w: 150, h: 48, t: 'Do next step', kind: 'act' },
  { id: 'E', x: 190, y: 84, w: 150, h: 48, t: 'Check result', s: 'against criteria', kind: 'act' },
  { id: 'R', x: 390, y: 84, w: 130, h: 48, t: 'Retries left?', kind: 'ask' },
  { id: 'G', x: 190, y: 168, w: 150, h: 48, t: 'All criteria met?', kind: 'ask' },
  { id: 'S', x: 190, y: 246, w: 150, h: 40, t: 'Stop: success', kind: 'end' },
  { id: 'X', x: 390, y: 246, w: 130, h: 40, t: 'Escalate', kind: 'end' },
  { id: 'T', x: 0, y: 246, w: 140, h: 40, t: 'Safe stop', kind: 'end' },
]
const EDGES: { id: EdgeId, d: string, l?: string, lx?: number, ly?: number, anchor?: string }[] = [
  { id: 'bd', d: 'M140 24 H186', l: 'yes', lx: 163, ly: 16, anchor: 'middle' },
  { id: 'de', d: 'M265 48 V80' },
  { id: 'eg', d: 'M265 132 V164', l: 'pass', lx: 274, ly: 153 },
  { id: 'er', d: 'M340 108 H386', l: 'fail', lx: 363, ly: 100, anchor: 'middle' },
  { id: 'rd', d: 'M455 84 V24 H344', l: 'yes: retry', lx: 400, ly: 16, anchor: 'middle' },
  { id: 'rx', d: 'M455 132 V242', l: 'no', lx: 464, ly: 192 },
  { id: 'gs', d: 'M265 216 V242', l: 'yes', lx: 274, ly: 235 },
  { id: 'gb', d: 'M190 192 H105 V52', l: 'no', lx: 148, ly: 184, anchor: 'middle' },
  { id: 'bt', d: 'M35 48 V242', l: 'no', lx: 44, ly: 150 },
]
const endTone: Record<string, string> = { S: 'ok', X: 'warn', T: 'ink' }
const intro = 'Decide before the run: what counts as done, what is checked, and every way the loop can end.'
</script>

<template>
  <Stage tag="illustrative">
    <template #notice>
      <Transition name="swap" mode="out-in">
        <span :key="step">{{ path?.story ?? intro }}</span>
      </Transition>
    </template>
    <template #controls>
      <div class="paths" role="group" aria-label="Show a path">
        <span class="paths-k">Show a run that:</span>
        <button v-for="(p, i) in PATHS" :key="p.id" class="btn" :aria-pressed="step === i + 1" @click.stop="go(step === i + 1 ? 0 : i + 1)">{{ p.label }}</button>
      </div>
    </template>

    <div class="le">
      <svg viewBox="0 -4 520 292" class="flow" role="img" aria-label="Loop flowchart with success, retry, escalation and safe-stop branches">
        <defs>
          <marker id="s5le-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--rule-strong)" /></marker>
          <marker id="s5le-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)" /></marker>
        </defs>
        <g v-for="e in EDGES" :key="e.id" class="edge" :class="{ on: lit(e.id), dim: path && !lit(e.id) }">
          <path :d="e.d" :marker-end="lit(e.id) ? 'url(#s5le-on)' : 'url(#s5le-a)'" />
          <text v-if="e.l" :x="e.lx" :y="e.ly" :text-anchor="e.anchor ?? 'start'">{{ e.l }}</text>
        </g>
        <g
          v-for="n in NODES" :key="n.id" class="node" :class="[n.kind, n.kind === 'end' && end === n.id ? `hit ${endTone[n.id]}` : '', { dim: path && n.kind === 'end' && end !== n.id }]"
        >
          <rect :x="n.x" :y="n.y" :width="n.w" :height="n.h" :rx="n.kind === 'ask' ? 14 : 5" />
          <text :x="n.x + n.w / 2" :y="n.y + (n.s ? 20 : n.h / 2 + 6)" text-anchor="middle" class="nt">{{ n.t }}</text>
          <text v-if="n.s" :x="n.x + n.w / 2" :y="n.y + 39" text-anchor="middle" class="ns">{{ n.s }}</text>
        </g>
      </svg>

      <aside class="spec">
        <div class="spec-h">Loop spec: weekly Lark report</div>
        <dl>
          <template v-for="r in SPEC" :key="r.id">
            <div class="spec-row" :class="{ on: path?.spec.includes(r.id) }">
              <dt>{{ r.k }}</dt>
              <dd>{{ r.v }}</dd>
            </div>
          </template>
        </dl>
      </aside>
    </div>
  </Stage>
</template>

<style scoped>
.le { display: grid; grid-template-columns: 520px 1fr; gap: 20px; flex: 1 1 auto; min-height: 0; align-items: start; }
.flow { width: 520px; height: auto; overflow: visible; }
.edge path { fill: none; stroke: var(--rule-strong); stroke-width: 1.5; transition: stroke var(--dur) var(--ease), opacity var(--dur) var(--ease); }
.edge text { font: 500 15px var(--font-sans); fill: var(--ink-3); }
.edge.on path { stroke: var(--accent); stroke-width: 2.5; }
.edge.on text { fill: var(--accent); font-weight: 600; }
.edge.dim { opacity: 0.45; }
.node rect { fill: var(--surface); stroke: var(--ink-2); stroke-width: 1.5; transition: fill var(--dur) var(--ease), stroke var(--dur) var(--ease); }
.node.ask rect { fill: var(--stage); stroke: var(--rule-strong); }
.node.end rect { fill: var(--paper); stroke: var(--rule-strong); stroke-dasharray: 4 3; }
.nt { font: 600 16px var(--font-sans); fill: var(--ink); }
.ns { font: 400 15px var(--font-sans); fill: var(--ink-2); }
.node.end .nt { fill: var(--ink-2); }
.node.hit rect { stroke-dasharray: none; stroke-width: 2; }
.node.hit.ok rect { fill: var(--ok-tint); stroke: var(--ok); }
.node.hit.ok .nt { fill: var(--ok); }
.node.hit.warn rect { fill: var(--warn-tint); stroke: var(--warn); }
.node.hit.warn .nt { fill: var(--warn); }
.node.hit.ink rect { fill: var(--surface); stroke: var(--ink); }
.node.hit.ink .nt { fill: var(--ink); }
.node.dim { opacity: 0.5; }

.paths { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.paths-k { font-size: var(--fs-label); color: var(--ink-2); margin-right: 4px; }
.paths .btn { padding: 6px 10px; }
.spec { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.spec-h { font-size: var(--fs-label); font-weight: 600; color: var(--ink); border-bottom: 1.5px solid var(--ink); padding-bottom: 4px; }
dl { margin: 0; display: flex; flex-direction: column; }
.spec-row { padding: 3px 8px; border-left: 3px solid transparent; transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.spec-row.on { background: var(--accent-tint); border-left-color: var(--accent); }
dt { font-size: 14px; color: var(--ink-3); font-weight: 500; }
dd { margin: 0; font-size: var(--fs-label); color: var(--ink); line-height: 1.3; }
.story { margin: 0; font-size: var(--fs-label); color: var(--ink); line-height: 1.35; border-left: 3px solid var(--accent); padding-left: 10px; }
.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
