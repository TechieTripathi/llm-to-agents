<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { LOOP, RUN_START, STATIONS, type Station } from '../data/s5/loop'

// Slide 39 — Artifact G. Clicks walk Run A (success) and then Run B (failure → bounded retry → escalation).
const { step, next, prev, reset, go } = useArtifactStep(LOOP.length - 1)
const cur = computed(() => LOOP[step.value])
const run = computed(() => cur.value.run)

// Ring geometry: Validate at the bottom so the stop exit can leave downwards.
const C = { x: 160, y: 124 }
const R = 104
const ANG: Record<Station, number> = { observe: 162, decide: 234, act: 306, inspect: 18, validate: 90 }
const pos = (s: Station) => {
  const a = (ANG[s] * Math.PI) / 180
  return { x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a) }
}
// Arrowheads between consecutive stations, placed mid-arc.
const arrows = STATIONS.map((s, i) => {
  const a0 = ANG[s.id]
  let a1 = ANG[STATIONS[(i + 1) % STATIONS.length].id]
  if (a1 < a0) a1 += 360
  const mid = ((a0 + a1) / 2) * Math.PI / 180
  const x = C.x + R * Math.cos(mid)
  const y = C.y + R * Math.sin(mid)
  const rot = ((a0 + a1) / 2) + 90
  return { x, y, rot }
})
const retrying = computed(() => cur.value.run === 'B' && cur.value.retries > 0 && !cur.value.stop)
const labels = LOOP.map(s => s.short)
const haveItems = [
  { k: 'tickets', l: 'Tickets' },
  { k: 'budget', l: 'Budget' },
  { k: 'dates', l: 'Dates' },
  { k: 'draft', l: 'Draft' },
] as const
</script>

<template>
  <Stage task="Click through run A, then run B." tag="simulated" notice="Every result is checked before the loop goes on, and the loop always has a way to stop.">
    <template #controls>
      <StepControls :step="step" :max="LOOP.length - 1" :labels="labels" @next="next" @prev="prev" @reset="reset" />
    </template>

    <div class="ls">
      <!-- Ring -->
      <svg viewBox="0 0 320 306" class="loopsvg" role="img" :aria-label="`Agent loop, current station: ${cur.station}`">
        <defs>
          <marker id="s5ls-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink-2)" /></marker>
          <marker id="s5ls-w" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--warn)" /></marker>
        </defs>
        <circle :cx="C.x" :cy="C.y" :r="R" class="ring-track" />
        <path
          v-for="(a, i) in arrows" :key="i" :transform="`translate(${a.x} ${a.y}) rotate(${a.rot})`"
          d="M-5 -5 L0 0 L-5 5" class="chev"
        />
        <!-- retry chord: validate → act -->
        <path
          :d="`M${pos('validate').x + 18} ${pos('validate').y - 17} Q ${C.x + 44} ${C.y + 20} ${pos('act').x - 8} ${pos('act').y + 19}`"
          class="retry" :class="{ on: retrying }" :marker-end="retrying ? 'url(#s5ls-w)' : 'url(#s5ls-a)'"
        />
        <text :x="C.x + 42" :y="C.y + 66" class="retry-t" :class="{ on: retrying }">retry</text>

        <!-- centre counters -->
        <text :x="C.x - 18" :y="C.y - 26" text-anchor="middle" class="c-big">Run {{ run }}</text>
        <text :x="C.x - 18" :y="C.y - 4" text-anchor="middle" class="c-sm">loop {{ cur.iter }}</text>
        <text :x="C.x - 18" :y="C.y + 16" text-anchor="middle" class="c-sm">calls {{ cur.calls }}/30</text>

        <!-- stations -->
        <g v-for="s in STATIONS" :key="s.id" class="st" :class="{ on: cur.station === s.id && !cur.stop }">
          <rect :x="pos(s.id).x - 46" :y="pos(s.id).y - 17" width="92" height="34" rx="17" />
          <text :x="pos(s.id).x" :y="pos(s.id).y + 5.5" text-anchor="middle">{{ s.label }}</text>
        </g>

        <!-- stop exit -->
        <path :d="`M${C.x} ${pos('validate').y + 17} V ${260}`" class="exit" :class="{ on: !!cur.stop }" marker-end="url(#s5ls-a)" />
        <g class="stop" :class="[cur.stop ?? 'idle']">
          <rect :x="C.x - 100" y="262" width="200" height="36" rx="5" />
          <text :x="C.x" y="286" text-anchor="middle">
            {{ cur.stop === 'done' ? 'Stop: goal met' : cur.stop === 'escalate' ? 'Stop: ask a person' : 'Stop rule: met or blocked' }}
          </text>
        </g>
      </svg>

      <!-- Detail -->
      <div class="detail">
        <div class="runs" role="group" aria-label="Choose a run">
          <button class="btn" :aria-pressed="run === 'A'" @click.stop="go(RUN_START.A)">Run A: tools respond</button>
          <button class="btn" :aria-pressed="run === 'B'" @click.stop="go(RUN_START.B)">Run B: budget system down</button>
        </div>
        <Transition name="swap" mode="out-in">
          <div :key="step" class="card">
            <div class="station">{{ STATIONS.find(s => s.id === cur.station)?.label }}<span v-if="cur.stop"> → stop</span></div>
            <div class="title">{{ cur.title }}</div>
            <div class="desc">{{ cur.detail }}</div>
            <div v-if="cur.call" class="io call"><span class="dir">call</span><code>{{ cur.call }}</code></div>
            <div v-if="cur.response" class="io resp" :class="cur.response.tone"><span class="dir">result</span><code>{{ cur.response.text }}</code></div>
            <Status v-if="cur.verdict" :state="cur.verdict.tone" :label="cur.verdict.label" />
          </div>
        </Transition>
        <div class="state">
          <span class="state-k">Task state</span>
          <Status v-for="h in haveItems" :key="h.k" :state="cur.have[h.k]" :label="h.l" />
        </div>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.ls { display: grid; grid-template-columns: 320px 1fr; gap: 20px; flex: 1 1 auto; min-height: 0; align-items: start; }
.loopsvg { width: 320px; height: auto; overflow: visible; }
.ring-track { fill: none; stroke: var(--rule-strong); stroke-width: 1.5; }
.chev { fill: none; stroke: var(--ink-2); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.retry { fill: none; stroke: var(--rule-strong); stroke-width: 1.5; stroke-dasharray: 5 4; transition: stroke var(--dur) var(--ease); }
.retry.on { stroke: var(--warn); stroke-width: 2; }
.retry-t { font: 400 15px var(--font-sans); fill: var(--ink-3); }
.retry-t.on { fill: var(--warn); font-weight: 600; }
.c-big { font: 600 18px var(--font-sans); fill: var(--ink); }
.c-sm { font: 400 15px var(--font-mono); fill: var(--ink-2); }
.st rect { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; transition: fill var(--dur) var(--ease), stroke var(--dur) var(--ease); }
.st text { font: 500 16px var(--font-sans); fill: var(--ink); transition: fill var(--dur) var(--ease); }
.st.on rect { fill: var(--accent); stroke: var(--accent); }
.st.on text { fill: #fff; font-weight: 600; }
.exit { stroke: var(--rule-strong); stroke-width: 1.5; }
.exit.on { stroke: var(--ink); stroke-width: 2; }
.stop rect { fill: var(--paper); stroke: var(--rule-strong); stroke-width: 1.5; stroke-dasharray: 4 3; transition: fill var(--dur) var(--ease); }
.stop text { font: 500 16px var(--font-sans); fill: var(--ink-3); }
.stop.done rect { fill: var(--ok-tint); stroke: var(--ok); stroke-dasharray: none; }
.stop.done text { fill: var(--ok); font-weight: 600; }
.stop.escalate rect { fill: var(--warn-tint); stroke: var(--warn); stroke-dasharray: none; }
.stop.escalate text { fill: var(--warn); font-weight: 600; }

.detail { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.runs { display: flex; gap: 8px; }
.runs .btn { font-size: var(--fs-label); padding: 7px 12px; }
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; min-height: 196px; }
.station { font-size: 14px; font-weight: 600; color: var(--accent); }
.title { font-size: var(--fs-small); font-weight: 600; color: var(--ink); line-height: 1.25; }
.desc { font-size: var(--fs-label); color: var(--ink-2); line-height: 1.35; }
.io { display: flex; gap: 10px; align-items: baseline; width: 100%; }
.io code { font: 400 15px/1.35 var(--font-mono); background: var(--stage); padding: 4px 8px; border-radius: var(--radius-sm); white-space: pre-wrap; flex: 1; }
.dir { font-size: 14px; color: var(--ink-3); flex: 0 0 44px; }
.resp.ok code { background: var(--ok-tint); }
.resp.bad code { background: var(--bad-tint); color: var(--bad); }
.state { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.state-k { font-size: 14px; color: var(--ink-3); margin-right: 4px; }
.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
