<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { LAYERS, MODEL_DETAIL, TASK, TRACE, TRACE_EMPTY } from '../data/s3/harness'

// Slide 25 (Artifact F): the system around ONE model call. Solid boxes are application code;
// the dashed band is the model, which only proposes. Each click adds one layer and its trace line.
const MAX = Math.max(...LAYERS.map(l => l.at))
const { step, next, prev, reset } = useArtifactStep(MAX)

// Geometry (SVG user units = px at the 868 px content width)
const W = 868
const GAP = 14
const BW = (W - 5 * GAP) / 6
const BH = 48
const BAND_Y = 82
const BAND_H = 34
const BOT_Y = 132
const BOT_H = 32
const H = BOT_Y + BOT_H + 2
const bx = (col: number) => col * (BW + GAP)
const cx = (col: number) => bx(col) + BW / 2

const shown = (at: number) => step.value >= at
const layer = (key: string) => LAYERS.find(l => l.key === key)!
const top = LAYERS.filter(l => l.lane === 'top')
const bottom = LAYERS.filter(l => l.lane === 'bottom')

const picked = ref<string | null>(null)
watch(step, () => { picked.value = null })
const latest = computed(() => LAYERS.filter(l => l.at <= step.value).sort((a, b) => b.at - a.at)[0])
const detail = computed(() => {
  const k = picked.value ?? latest.value?.key
  return k ? layer(k).detail : MODEL_DETAIL
})
const trace = computed(() => TRACE.filter(t => t.at <= step.value))
const pick = (k: string) => { if (shown(layer(k).at)) picked.value = picked.value === k ? null : k }
</script>

<template>
  <div class="hd">
    <div class="bar">
      <span class="task"><span class="muted">One assisted task:</span> {{ TASK }}</span>
      <span class="legend">
        <span class="lg solid" />application code
        <span class="lg dashed" />model
      </span>
      <StepControls :step="step" :max="MAX" @prev="prev" @next="next" @reset="reset" />
    </div>

    <svg class="dia" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Harness architecture around a single model call">
      <defs>
        <marker id="s3h-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L8 4L0 8z" class="ah" />
        </marker>
      </defs>

      <!-- Model band: always present -->
      <g>
        <rect :x="0.75" :y="BAND_Y" :width="W - 1.5" :height="BAND_H" rx="5" class="band" />
        <text :x="14" :y="BAND_Y + 22" class="bandt">
          <tspan class="strong">Model</tspan>
          <tspan class="soft" dx="10">{{ step >= 3 ? 'proposes text and tool calls; it cannot run tools or check itself' : 'text in, text out' }}</tspan>
        </text>
      </g>

      <!-- Arrows between application lane and model band -->
      <g class="arrows">
        <g :class="['fx', { on: shown(layer('instructions').at) }]">
          <line :x1="cx(0)" :y1="BH" :x2="cx(0)" :y2="BAND_Y - 2" marker-end="url(#s3h-arr)" />
        </g>
        <g :class="['fx', { on: shown(layer('retrieval').at) }]">
          <line :x1="cx(1)" :y1="BH" :x2="cx(1)" :y2="BAND_Y - 2" marker-end="url(#s3h-arr)" />
        </g>
        <g :class="['fx', { on: shown(layer('tools').at) }]">
          <!-- tool call goes up through permissions (or straight to tools before permissions exist) -->
          <line v-if="shown(layer('permissions').at)" :x1="cx(2)" :y1="BAND_Y" :x2="cx(2)" :y2="BH + 2" marker-end="url(#s3h-arr)" />
          <text v-if="shown(layer('permissions').at)" :x="cx(2) + 9" :y="BH + 21" class="al">tool call</text>
          <line v-if="shown(layer('permissions').at)" :x1="bx(2) + BW" :y1="BH / 2" :x2="bx(3) - 1" :y2="BH / 2" marker-end="url(#s3h-arr)" />
          <line v-if="!shown(layer('permissions').at)" :x1="cx(3) - 30" :y1="BAND_Y" :x2="cx(3) - 30" :y2="BH + 2" marker-end="url(#s3h-arr)" />
          <text v-if="!shown(layer('permissions').at)" :x="cx(3) - 102" :y="BH + 21" class="al">tool call</text>
          <line :x1="cx(3) + 20" :y1="BH" :x2="cx(3) + 20" :y2="BAND_Y - 2" marker-end="url(#s3h-arr)" />
          <text :x="cx(3) + 26" :y="BH + 21" class="al">result</text>
        </g>
        <g :class="['fx', { on: shown(layer('validation').at) }]">
          <line :x1="cx(4) - 16" :y1="BAND_Y" :x2="cx(4) - 16" :y2="BH + 2" marker-end="url(#s3h-arr)" />
          <text :x="cx(4) - 62" :y="BH + 21" class="al">draft</text>
          <line :x1="cx(4) + 16" :y1="BH" :x2="cx(4) + 16" :y2="BAND_Y - 2" class="dash" marker-end="url(#s3h-arr)" />
          <text :x="cx(4) + 22" :y="BH + 21" class="al bad">fix</text>
        </g>
        <g :class="['fx', { on: shown(layer('approval').at) }]">
          <line :x1="bx(4) + BW" :y1="BH / 2" :x2="bx(5) - 1" :y2="BH / 2" marker-end="url(#s3h-arr)" />
        </g>
      </g>

      <!-- Application boxes (top lane) -->
      <g v-for="l in top" :key="l.key" :class="['box', { ghost: !shown(l.at), picked: picked === l.key }]" @click="pick(l.key)">
        <rect :x="bx(l.col) + 0.75" :y="0.75" :width="BW - 1.5" :height="BH - 1.5" rx="4" />
        <text :x="bx(l.col) + 10" :y="20" class="bt">{{ l.name }}</text>
        <text :x="bx(l.col) + 10" :y="38" :class="['bs', { mono: l.key === 'tools' }]">{{ l.sub }}</text>
      </g>

      <!-- State and logging (cross-cutting) -->
      <g v-for="l in bottom" :key="l.key" :class="['box', 'base', { ghost: !shown(l.at), picked: picked === l.key }]" @click="pick(l.key)">
        <rect :x="l.col * (W / 2 + GAP / 2) + 0.75" :y="BOT_Y" :width="W / 2 - GAP / 2 - 1.5" :height="BOT_H" rx="4" />
        <text :x="l.col * (W / 2 + GAP / 2) + 12" :y="BOT_Y + 21" class="bt">{{ l.name }}<tspan class="bs" dx="10">{{ l.sub }}</tspan></text>
      </g>
    </svg>

    <p class="detail" aria-live="polite">{{ detail }}</p>

    <div class="trace mono" aria-label="Example trace">
      <div class="th"><span>Example trace</span><SimTag kind="simulated" /></div>
      <p v-if="!trace.length" class="empty">{{ TRACE_EMPTY }}</p>
      <TransitionGroup name="tl" tag="ol">
        <li v-for="(t, i) in trace" :key="t.who + t.at + i" :class="t.state">
          <span class="who">{{ t.who }}</span>
          <span class="what">{{ t.text }}<span v-if="t.state === 'ok' && t.who === 'validation' && step >= 6" class="st"> · state: draft v2 saved</span></span>
          <span class="log" :class="{ on: step >= 7 }">logged</span>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.hd { display: flex; flex-direction: column; gap: 6px; flex: 1 1 auto; min-height: 0; }
.bar { display: flex; align-items: center; gap: 14px; font-size: var(--fs-label); }
.task { flex: 1 1 auto; }
.legend { display: inline-flex; align-items: center; gap: 6px; color: var(--ink-2); font-size: 14px; }
.lg { display: inline-block; width: 18px; height: 11px; border-radius: 2px; margin-left: 6px; }
.lg.solid { border: 1.5px solid var(--ink); background: var(--surface); }
.lg.dashed { border: 1.5px dashed var(--accent); background: var(--accent-tint); }

.dia { width: 100%; height: auto; display: block; overflow: visible; }
.band { fill: var(--accent-tint); stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: 6 4; }
.bandt { font: 400 16px var(--font-sans); fill: var(--ink-2); }
.bandt .strong { font-weight: 600; fill: var(--accent); }
.fx { opacity: 0; transition: opacity var(--dur) var(--ease); }
.fx.on { opacity: 1; }
.box { cursor: pointer; }
.box text { transition: opacity var(--dur) var(--ease); }
.box.ghost { cursor: default; }
.box.ghost rect { fill: none; stroke: var(--rule-strong); stroke-dasharray: 3 4; stroke-width: 1; }
.box.ghost text { opacity: 0; }
.box.base.ghost rect { fill: none; }
.box rect { fill: var(--surface); stroke: var(--ink); stroke-width: 1.5; transition: fill var(--dur) var(--ease); }
.box.base rect { fill: var(--stage); stroke: var(--ink-2); }
.box.picked rect { fill: var(--accent-tint); stroke: var(--accent); }
.bt { font: 600 16px var(--font-sans); fill: var(--ink); }
.bs { font: 400 14px var(--font-sans); fill: var(--ink-2); }
.bs.mono { font-family: var(--font-mono); }
.arrows line { stroke: var(--ink-2); stroke-width: 1.5; }
.arrows line.dash { stroke: var(--bad); stroke-dasharray: 4 3; }
.ah { fill: var(--ink-2); }
.al { font: 500 14px var(--font-sans); fill: var(--ink-2); }
.al.bad { fill: var(--bad); }

.detail { margin: 0; font-size: var(--fs-label); color: var(--ink); min-height: 22px; border-left: 3px solid var(--accent); padding-left: 10px; }

.trace { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); padding: 6px 12px 6px; font-size: 15px; line-height: 1.3; flex: 1 1 auto; min-height: 0; }
.th { display: flex; justify-content: space-between; align-items: center; font: 600 14px var(--font-sans); color: var(--ink-3); margin-bottom: 2px; }
.trace ol { list-style: none; margin: 0; padding: 0; position: relative; }
.trace li { display: grid; grid-template-columns: 140px 1fr auto; gap: 10px; margin: 0; padding: 0; line-height: 1.3; }
.empty { margin: 0; font: 400 var(--fs-label)/1.35 var(--font-sans); color: var(--ink-2); }
.who { color: var(--ink-3); }
.what { color: var(--ink); }
.ok .what { color: var(--ok); }
.bad .what { color: var(--bad); }
.st { color: var(--ink-2); }
.log { color: var(--ink-3); opacity: 0; font-size: 14px; font-family: var(--font-sans); transition: opacity var(--dur) var(--ease); }
.log.on { opacity: 1; }
.tl-enter-active { transition: opacity var(--dur) var(--ease); }
.tl-enter-from { opacity: 0; }
.tl-leave-active { display: none; }
.tl-move { transition: transform var(--dur) var(--ease); }
</style>
