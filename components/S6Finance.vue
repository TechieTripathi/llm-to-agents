<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { FIN } from '../data/s6/examples'

// Slide 48 — Finance: the AI explains variances; the human recomputes every figure first.
// Visual form: the variance table itself. The "Recomputed" column is calculated here, live,
// from budget and actual — the same check a spreadsheet formula would do.
const { step, next, prev, reset } = useArtifactStep(2)

const pct = (b: number, a: number) => ((a - b) / b) * 100
const rows = computed(() => FIN.rows.map(r => {
  const v = r.actual - r.budget
  const p = pct(r.budget, r.actual)
  return { ...r, v, p, ok: Math.abs(p - r.aiPct) < 0.05 }
}))
const tb = FIN.rows.reduce((s, r) => s + r.budget, 0)
const ta = FIN.rows.reduce((s, r) => s + r.actual, 0)
const tp = pct(tb, ta)
const fmtV = (v: number) => (v > 0 ? `+${v}` : `${v}`)
const fmtP = (p: number) => `${p > 0 ? '+' : ''}${p.toFixed(1)}%`
</script>

<template>
  <S6DeptCase :step="step" owner="Mei Chen (Finance)" :checks="FIN.checks" @prev="prev" @next="next" @reset="reset">
    <div class="g">
      <S6Panel title="Budget versus actual" :note="FIN.period" kind="source">
        <table class="vt">
          <thead>
            <tr>
              <th>Cost line</th><th class="n">Budget</th><th class="n">Actual</th>
              <th class="n">Var.</th>
              <th class="n ai" :class="{ hide: step < 1 }">AI %</th>
              <th class="n chk" :class="{ hide: step < 2 }">Check</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.line" :class="{ badrow: step === 2 && !r.ok }">
              <td>{{ r.line }}</td>
              <td class="n">{{ r.budget }}</td>
              <td class="n">{{ r.actual }}</td>
              <td class="n" :class="r.v > 0 ? 'adv' : 'fav'">{{ fmtV(r.v) }}</td>
              <td class="n ai" :class="{ hide: step < 1 }">{{ fmtP(r.aiPct) }}</td>
              <td class="n chk" :class="{ hide: step < 2 }">
                <span class="rc">{{ fmtP(r.p) }}</span>
                <Status :state="r.ok ? 'ok' : 'bad'" compact />
              </td>
            </tr>
            <tr class="tot">
              <td>Total</td>
              <td class="n">{{ tb }}</td>
              <td class="n">{{ ta }}</td>
              <td class="n adv">{{ fmtV(ta - tb) }}</td>
              <td class="n ai" :class="{ hide: step < 1 }">{{ fmtP(FIN.totalAiPct) }}</td>
              <td class="n chk" :class="{ hide: step < 2 }">
                <span class="rc">{{ fmtP(tp) }}</span>
                <Status :state="Math.abs(tp - FIN.totalAiPct) < 0.05 ? 'ok' : 'bad'" compact />
              </td>
            </tr>
          </tbody>
        </table>
        <p class="def"><span class="mono">Var. = Actual − Budget</span> · for costs, positive is adverse</p>
      </S6Panel>

      <Transition name="swap" mode="out-in">
        <S6Panel v-if="step === 0" key="p" title="Instruction to the assistant">
          <pre class="prompt">{{ FIN.prompt }}</pre>
        </S6Panel>
        <S6Panel v-else key="d" title="Variance commentary" kind="draft">
          <ul class="cm">
            <li v-for="c in FIN.commentary" :key="c.text" :class="step === 2 ? c.flag.state : ''">
              <span class="ct">{{ c.text }}</span>
              <Transition name="fade">
                <Status v-if="step === 2" :state="c.flag.state" :label="c.flag.label" class="cs" />
              </Transition>
            </li>
          </ul>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.g { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 488px 1fr; gap: 14px; }
.vt { font-size: var(--fs-label); width: 100%; }
.vt th { font-size: 15px; font-weight: 600; color: var(--ink-2); padding: 4px 6px; border-bottom: 1.5px solid var(--ink-2); white-space: nowrap; }
.vt td { padding: 6px 6px; border-bottom: 1px solid var(--rule); white-space: nowrap; }
.n { text-align: right; font-variant-numeric: tabular-nums; }
.adv { color: var(--ink); }
.fav { color: var(--ink-2); }
.ai { color: var(--accent); transition: opacity var(--dur) var(--ease); }
th.ai { color: var(--accent); }
.chk { transition: opacity var(--dur) var(--ease); }
td.chk { display: flex; justify-content: flex-end; align-items: center; gap: 6px; }
.rc { font-weight: 600; }
.hide { opacity: 0; }
.badrow td { background: var(--bad-tint); }
.tot td { font-weight: 600; border-bottom: 0; border-top: 1.5px solid var(--ink-2); }
.def { margin: 6px 0 0; font-size: 14px; color: var(--ink-2); }
.def .mono { font-size: 14px; }

.prompt { margin: 0; font: 400 var(--fs-label)/1.5 var(--font-mono); white-space: pre-wrap; color: var(--ink); }
.cm { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.cm li { margin: 0; padding: 5px 8px; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 3px; transition: background var(--dur) var(--ease); }
.cm li.bad { background: var(--bad-tint); }
.cm li.warn { background: var(--warn-tint); }
.ct { color: var(--ink); }
.cs { align-self: flex-start; font-size: 15px; background: transparent !important; padding-left: 0; }

.swap-enter-active, .swap-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
