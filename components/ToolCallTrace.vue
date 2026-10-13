<script setup lang="ts">
import { computed, ref } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ALLOWED, FORBIDDEN, type Lane } from '../data/s5/toolcall'

// Slide 37 — a tool call as a sequence diagram: model proposes, application checks and runs, result returns.
// Toggle "Try a call it is not allowed to make" to see the application refuse it.
const { step, next, prev, reset } = useArtifactStep(ALLOWED.length - 1)
const forbidden = ref(false)
const rows = computed(() => (forbidden.value ? FORBIDDEN : ALLOWED))
const cur = computed(() => rows.value[step.value])

const X: Record<Lane, number> = { model: 78, app: 262, ext: 420 }
const Y0 = 70
const DY = 35
const y = (i: number) => Y0 + i * DY
const labels = ['Request sent', 'Call proposed', 'Checked', 'Executed', 'Result', 'Returned', 'Continues']

function selfBox(l: Lane) {
  return l === 'model' ? { x: 0, w: 236 } : { x: 132, w: 260 }
}
</script>

<template>
  <Stage tag="simulated">
    <template #controls>
      <button class="btn toggle" :aria-pressed="forbidden" @click.stop="forbidden = !forbidden">
        {{ forbidden ? 'Back to the allowed call' : 'Try a forbidden call' }}
      </button>
      <span class="sep" />
      <StepControls :step="step" :max="ALLOWED.length - 1" :labels="labels" @next="next" @prev="prev" @reset="reset" />
    </template>

    <div class="tc">
      <svg viewBox="0 0 480 312" class="seq" role="img" aria-label="Sequence diagram of a tool call between model, application and tracker">
        <defs>
          <marker id="s5tc-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--ink-2)" /></marker>
          <marker id="s5tc-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)" /></marker>
          <marker id="s5tc-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--bad)" /></marker>
        </defs>

        <!-- Lane heads and lifelines -->
        <g v-for="(lx, lane) in X" :key="lane">
          <line :x1="lx" :x2="lx" y1="40" y2="306" class="life" />
          <rect :x="lx - (lane === 'app' ? 74 : 58)" y="2" :width="lane === 'app' ? 148 : 116" height="34" rx="5" :class="['head', lane]" />
          <text :x="lx" y="25" text-anchor="middle" :class="['head-t', lane]">{{ { model: 'Model', app: 'Your application', ext: 'Tracker' }[lane] }}</text>
        </g>

        <!-- Messages -->
        <g v-for="(r, i) in rows" :key="(forbidden ? 'f' : 'a') + i" class="msg" :class="[{ 'is-hidden': i > step, current: i === step }, r.state]">
          <template v-if="r.from === r.to">
            <rect :x="selfBox(r.from).x" :y="y(i) - 14" :width="selfBox(r.from).w" height="28" rx="4" class="selfbox" />
            <text :x="selfBox(r.from).x + selfBox(r.from).w / 2" :y="y(i) + 5" text-anchor="middle" class="m-t">
              {{ r.state === 'ok' ? '✓ ' : r.state === 'bad' ? '✗ ' : '' }}{{ r.label }}
            </text>
          </template>
          <template v-else>
            <line
              :x1="X[r.from]" :x2="X[r.to] + (X[r.to] > X[r.from] ? -3 : 3)" :y1="y(i) + 6" :y2="y(i) + 6"
              class="m-line"
              :marker-end="r.state === 'bad' ? 'url(#s5tc-bad)' : i === step ? 'url(#s5tc-acc)' : 'url(#s5tc-a)'"
            />
            <text :x="(X[r.from] + X[r.to]) / 2" :y="y(i) - 2" text-anchor="middle" class="m-t">{{ r.label }}</text>
          </template>
        </g>
      </svg>

      <div class="side">
        <Transition name="swap" mode="out-in">
          <div :key="(forbidden ? 'f' : 'a') + step" class="payload" :class="cur.state">
            <div class="p-title">{{ cur.payloadTitle }}</div>
            <pre class="p-body">{{ cur.payload }}</pre>
            <div class="p-note">{{ cur.note }}</div>
          </div>
        </Transition>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.tc { display: grid; grid-template-columns: 480px 1fr; gap: 18px; flex: 1 1 auto; min-height: 0; align-items: start; }
.seq { width: 480px; height: auto; overflow: visible; }
.life { stroke: var(--rule-strong); stroke-width: 1; stroke-dasharray: 3 4; }
.head { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.head.model { fill: var(--accent); stroke: var(--accent); }
.head.ext { stroke-dasharray: 5 3; }
.head-t { font: 600 16px var(--font-sans); fill: var(--ink); }
.head-t.model { fill: #fff; }
.msg { transition: opacity var(--dur) var(--ease); }
.msg.is-hidden { opacity: 0; }
.m-line { stroke: var(--ink-2); stroke-width: 1.5; }
.m-t { font: 400 16px var(--font-sans); fill: var(--ink-2); }
.selfbox { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.msg.current .m-line { stroke: var(--accent); }
.msg.current .m-t { fill: var(--accent); font-weight: 500; }
.msg.current .selfbox { stroke: var(--accent); fill: var(--accent-tint); }
.msg.ok .selfbox { stroke: var(--ok); fill: var(--ok-tint); }
.msg.ok .m-t { fill: var(--ok); font-weight: 500; }
.msg.bad .selfbox { stroke: var(--bad); fill: var(--bad-tint); }
.msg.bad .m-line { stroke: var(--bad); }
.msg.bad .m-t { fill: var(--bad); font-weight: 500; }
.msg.neutral .m-line { stroke: var(--rule-strong); stroke-dasharray: 4 4; }
.msg.neutral .m-t { fill: var(--ink-3); }

.payload { background: var(--surface); border: 1px solid var(--rule); border-top: 3px solid var(--accent); border-radius: var(--radius-sm); padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 8px; }
.payload.bad { border-top-color: var(--bad); }
.payload.ok { border-top-color: var(--ok); }
.p-title { font-size: var(--fs-label); font-weight: 600; color: var(--ink); }
.p-body { margin: 0; font: 400 15.5px/1.35 var(--font-mono); color: var(--ink); white-space: pre; background: var(--stage); padding: 8px 10px; border-radius: var(--radius-sm); overflow: hidden; }
.p-note { font-size: var(--fs-label); color: var(--ink-2); line-height: 1.35; }
.side { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.sep { width: 14px; }
.toggle { align-self: center; font-size: var(--fs-label); padding: 6px 10px; }
.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
