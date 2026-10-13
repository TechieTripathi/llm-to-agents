<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { IT } from '../data/s6/examples'

// Slide 51 — IT & engineering: synthetic log → AI summary → failing test → explained fix.
// Visual form: log excerpt, test and diff as real-looking code; the test run is the arbiter.
const { step, next, prev, reset } = useArtifactStep(2)
</script>

<template>
  <S6DeptCase :step="step" owner="Daniel Okafor (IT)" :checks="IT.checks" @prev="prev" @next="next" @reset="reset">
    <div class="g">
      <div class="lcol">
        <S6Panel title="Portal error log" note="synthetic" kind="source">
          <pre class="log"><span v-for="(l, i) in IT.log" :key="i" class="ln" :class="{ err: l.lvl === 'ERROR', hl: step >= 1 && l.lvl === 'ERROR' }"><span class="lv">{{ l.lvl.padEnd(5) }}</span> {{ l.text }}</span></pre>
        </S6Panel>
        <Transition name="fade">
          <S6Panel v-if="step >= 1" title="AI summary" kind="draft">
            <p class="sum">{{ IT.summary }}</p>
            <p class="sum fx"><strong>Fix:</strong> {{ IT.explain }}</p>
          </S6Panel>
        </Transition>
      </div>

      <Transition name="swap" mode="out-in">
        <S6Panel v-if="step === 0" key="p" title="Instruction to the assistant">
          <pre class="prompt">{{ IT.prompt }}</pre>
        </S6Panel>
        <S6Panel v-else key="r" title="Proposed test and change" kind="draft">
          <pre class="code"><span v-for="(t, i) in IT.test" :key="i" class="ln">{{ t }}</span></pre>
          <div class="runs" :class="{ off: step < 2 }">
            <Status v-for="r in IT.runs.slice(0, 2)" :key="r.label" :state="r.state" :label="`${r.label}: ${r.text}`" />
          </div>
          <pre class="code diff"><span
            v-for="(d, i) in IT.diff" :key="i" class="ln"
            :class="[d.op === '+' ? 'add' : 'del', { flagged: step === 2 && d.flag }]"
          >{{ d.op }} {{ d.text }}</span></pre>
          <div class="runs" :class="{ off: step < 2 }">
            <Status v-for="d in IT.diff.filter(x => x.flag)" :key="d.text" :state="d.flag!.state" :label="`Review: ${d.flag!.label}`" />
            <Status :state="IT.runs[2].state" :label="`${IT.runs[2].label}: ${IT.runs[2].text}`" />
          </div>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.g { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 340px 1fr; gap: 14px; }
.lcol, .rcol { display: flex; flex-direction: column; gap: 8px; min-height: 0; min-width: 0; }
pre { margin: 0; white-space: pre; }
.log, .code { font: 400 15px/1.5 var(--font-mono); color: var(--ink); }
.log .ln { display: block; padding: 0 4px; border-radius: 2px; transition: background var(--dur) var(--ease); }
.lv { color: var(--ink-3); }
.err .lv { color: var(--bad); font-weight: 600; }
.hl { background: var(--bad-tint); }
.sum { margin: 0; font-size: var(--fs-label); }
.prompt { margin: 0; font: 400 var(--fs-label)/1.5 var(--font-mono); white-space: pre-wrap; }

.code .ln { display: block; padding: 0 6px; border-radius: 2px; }
.diff .add { background: var(--ok-tint); }
.diff .del { background: var(--bad-tint); color: var(--ink-2); text-decoration: line-through; text-decoration-color: var(--ink-3); }
.diff .flagged { background: var(--bad-tint); text-decoration: line-through; text-decoration-color: var(--bad); color: var(--ink-2); }
.runs { display: flex; gap: 6px; flex-wrap: wrap; margin: 4px 0 6px; transition: opacity var(--dur) var(--ease); }
.runs :deep(.status) { font-size: 14px; padding: 2px 8px 2px 5px; }
.off { opacity: 0; }
.fx { margin-top: 4px; }

.swap-enter-active, .swap-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
