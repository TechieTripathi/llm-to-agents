<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { SALES } from '../data/s6/examples'

// Slide 49 — Sales & marketing: a public-source account brief (left) and campaign variants (right).
// Visual form: a source-freshness timeline, and claims checked against brand rules and the fact sheet.
const { step, next, prev, reset } = useArtifactStep(2)

const T0 = Date.parse('2024-01-01')
const T1 = Date.parse(SALES.today)
const W = 334
const x = (d: string) => 10 + ((Date.parse(d) - T0) / (T1 - T0)) * (W - 20)
const yearTicks = ['2024-01-01', '2025-01-01', '2026-01-01'].map(d => ({ d, x: x(d), label: d.slice(0, 4) }))
const recentX = x('2025-10-13')
const monthsOld = (d: string) => Math.floor((T1 - Date.parse(d)) / (1000 * 60 * 60 * 24 * 30.44))
const dated = computed(() => SALES.facts.filter(f => f.date).map(f => ({ ...f, x: x(f.date!), age: monthsOld(f.date!) })))
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'no date'
</script>

<template>
  <S6DeptCase :step="step" owner="Arjun Mehta (Sales)" :checks="SALES.checks" @prev="prev" @next="next" @reset="reset">
    <div class="g">
      <S6Panel :title="`Brief: ${SALES.prospect}`" :kind="step === 0 ? 'source' : 'draft'">
        <svg class="tl" :width="W" height="58" :viewBox="`0 0 ${W} 58`" role="img" aria-label="Source dates on a timeline ending today">
          <rect :x="recentX" y="6" :width="W - 10 - recentX" height="30" class="recent" />
          <text :x="recentX + 6" y="20" class="rl">last 12 months</text>
          <line x1="10" :x2="W - 10" y1="36" y2="36" class="axis" />
          <g v-for="t in yearTicks" :key="t.d">
            <line :x1="t.x" :x2="t.x" y1="32" y2="40" class="axis" />
            <text :x="t.x" y="54" class="yr">{{ t.label }}</text>
          </g>
          <line :x1="W - 10" :x2="W - 10" y1="6" y2="40" class="today" />
          <text :x="W - 12" y="54" class="yr s6-end">today</text>
          <circle
            v-for="f in dated" :key="f.text" :cx="f.x" cy="36" r="6"
            class="s6-pt" :class="step === 2 ? f.flag.state : ''"
          />
        </svg>

        <Transition name="swap" mode="out-in">
          <ul v-if="step === 0" key="s" class="srcs">
            <li v-for="f in dated" :key="f.text"><span>{{ f.src }}</span><span class="dt">{{ fmtDate(f.date) }}</span></li>
            <li class="pub"><Status state="neutral" compact /> Public sources only; no CRM notes</li>
          </ul>
          <ul v-else key="f" class="facts">
            <li v-for="f in SALES.facts" :key="f.text" :class="step === 2 ? f.flag.state : ''">
              <span class="ft">{{ f.text }}</span>
              <span class="fm">
                <span>{{ f.src ?? 'source?' }} · {{ fmtDate(f.date) }}</span>
                <Status
                  v-if="step === 2" :state="f.flag.state"
                  :label="f.flag.state === 'warn' ? `${monthsOld(f.date!)} months old` : f.flag.label"
                />
              </span>
            </li>
          </ul>
        </Transition>
      </S6Panel>

      <Transition name="swap" mode="out-in">
        <div v-if="step === 0" key="in" class="rcol">
          <S6Panel title="Brand rules" kind="source">
            <ul class="plain"><li v-for="r in SALES.rules" :key="r">{{ r }}</li></ul>
          </S6Panel>
          <S6Panel title="Approved fact sheet" kind="source">
            <ul class="plain"><li v-for="r in SALES.factSheet" :key="r">{{ r }}</li></ul>
          </S6Panel>
        </div>
        <S6Panel v-else key="v" title="Campaign variants" kind="draft">
          <ul class="vars">
            <li v-for="v in SALES.variants" :key="v.segment" :class="step === 2 ? v.flag.state : ''">
              <span class="seg">{{ v.segment }}</span>
              <span class="vb">
                <span class="vt">“{{ v.text }}”</span>
                <Transition name="fade">
                  <Status v-if="step === 2" :state="v.flag.state" :label="v.flag.label" class="vs" />
                </Transition>
              </span>
            </li>
          </ul>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.g { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 364px 1fr; gap: 14px; }
.tl { display: block; overflow: visible; }
.recent { fill: var(--accent-tint); }
.rl { font: 500 14px var(--font-sans); fill: var(--accent); }
.axis { stroke: var(--ink-3); stroke-width: 1.5; }
.today { stroke: var(--ink); stroke-width: 1.5; stroke-dasharray: 3 3; }
.yr { font: 400 14px var(--font-sans); fill: var(--ink-2); text-anchor: middle; }
.yr.s6-end { text-anchor: end; fill: var(--ink); font-weight: 500; }
.s6-pt { fill: var(--surface); stroke: var(--ink); stroke-width: 1.5; transition: fill var(--dur) var(--ease), stroke var(--dur) var(--ease); }
.s6-pt.ok { fill: var(--ok); stroke: var(--ok); }
.s6-pt.warn { fill: var(--warn); stroke: var(--warn); }

.srcs, .facts, .plain, .vars { list-style: none; margin: 0; padding: 0; }
.srcs li { display: flex; justify-content: space-between; margin: 0; padding: 6px 0; border-bottom: 1px solid var(--rule); }
.srcs .dt { color: var(--ink-2); font-variant-numeric: tabular-nums; }
.srcs .pub { border: 0; justify-content: flex-start; gap: 6px; color: var(--ink-2); font-size: 15px; }
.facts li { margin: 0 0 2px; padding: 3px 6px; line-height: 1.3; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 2px; transition: background var(--dur) var(--ease); }
.facts li.warn, .vars li.warn { background: var(--warn-tint); }
.facts li.bad, .vars li.bad { background: var(--bad-tint); }
.ft { color: var(--ink); }
.fm { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 14px; color: var(--ink-2); min-height: 22px; }
.fm :deep(.status) { font-size: 14px; padding: 1px 7px 1px 4px; background: transparent; }

.rcol { display: flex; flex-direction: column; gap: 10px; min-height: 0; }
.plain li { margin: 0 0 4px; padding-left: 14px; position: relative; }
.plain li::before { content: ''; position: absolute; left: 0; top: 0.72em; width: 6px; height: 1.5px; background: var(--ink-3); }

.vars { display: flex; flex-direction: column; gap: 6px; }
.vars li { margin: 0; padding: 5px 8px; border-radius: var(--radius-sm); border-bottom: 1px solid var(--rule); display: flex; flex-direction: column; gap: 1px; transition: background var(--dur) var(--ease); }
.seg { font-size: 14px; font-weight: 600; color: var(--ink-2); line-height: 1.25; padding-top: 2px; }
.vb { display: flex; flex-direction: column; gap: 2px; }
.vt { font-size: var(--fs-label); color: var(--ink); }
.vs { align-self: flex-start; font-size: 15px; background: transparent !important; padding-left: 0; }

.swap-enter-active, .swap-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
