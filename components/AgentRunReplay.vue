<script setup lang="ts">
// Slide 59 — replay of a simulated, read-only agent run over the files in demos/.
// Each click adds one step's log lines; the side panel shows phase, retry budget, permissions,
// findings and, at the end, the approval hold. Nothing is executed and nothing is sent.
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { DRAFT, FINAL_CHECKS, PERMISSIONS, PHASES, RETRY_LIMIT, STEPS } from '../data/s7/agentRun'

const { step, next, prev, reset, max } = useArtifactStep(STEPS.length - 1)
const cur = computed(() => STEPS[step.value])
const done = computed(() => step.value === STEPS.length - 1)
const showDraft = ref(false)
watch(step, () => { showDraft.value = false })

const allLines = computed(() => STEPS.slice(0, step.value + 1).flatMap((s, si) =>
  s.lines.map((l, li) => ({ ...l, si, first: li === 0 }))))
// The log shows the latest lines, like a terminal; older lines are summarised at the top.
const KEEP = 10
const hidden = computed(() => Math.max(0, allLines.value.length - KEEP))
const lines = computed(() => allLines.value.slice(hidden.value))
const glyph = { call: '→', ok: '←', err: '✗', warn: '!', note: '·', stop: '■' } as const
</script>

<template>
  <div class="s7-run">
    <div class="bar">
      <ol class="phases" aria-label="Loop phase">
        <template v-for="(p, i) in PHASES" :key="p.id">
          <li :class="{ on: cur.phase === p.id, rec: p.id === 'recover' }">{{ p.label }}</li>
          <li v-if="i < PHASES.length - 2" class="arr" aria-hidden="true">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M0 5h12M8.5 1.5L12 5 8.5 8.5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
          </li>
          <li v-else-if="i === PHASES.length - 2" class="sep" aria-hidden="true">on failure</li>
        </template>
      </ol>
      <span class="spacer" />
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </div>

    <div class="s7grid">
      <!-- run log -->
      <section class="log">
        <header class="lh">
          <span class="mono">run · lark-w41-update</span>
          <SimTag kind="simulated" />
        </header>
        <div v-if="!showDraft" class="lines" aria-live="polite">
          <div v-if="hidden" class="earlier">{{ hidden }} earlier lines</div>
          <TransitionGroup name="s7line">
            <div v-for="(l, i) in lines" :key="`${l.si}-${l.text}`" class="ln" :class="[l.kind, { now: l.si === step, first: l.first && l.si > 0 }]">
              <span class="g">{{ glyph[l.kind] }}</span>
              <span class="t">{{ l.text }}</span>
            </div>
          </TransitionGroup>
        </div>
        <div v-else class="draft">
          <p v-for="(d, i) in DRAFT" :key="i" :class="{ dt: i === 0, flag: d.startsWith('Flag') }">{{ d }}</p>
        </div>
      </section>

      <!-- state -->
      <aside class="state">
        <div v-if="!done" class="blk">
          <span class="bh">Retry budget</span>
          <span class="retry">
            <i v-for="n in RETRY_LIMIT" :key="n" :class="{ used: n <= cur.retriesUsed }" />
            <span>{{ cur.retriesUsed }} of {{ RETRY_LIMIT }} used</span>
          </span>
        </div>

        <Transition name="s7swap" mode="out-in">
          <div v-if="!done" key="perm" class="blk">
            <span class="bh">Permissions</span>
            <ul class="perm">
              <li v-for="p in PERMISSIONS" :key="p.label"><span>{{ p.label }}</span><Status compact :state="p.state" :label="p.value" /></li>
            </ul>
          </div>
          <div v-else key="appr" class="blk appr">
            <span class="bh">Held for Priya’s approval</span>
            <span class="who">1 retry used · 1 flag attached</span>
            <ul class="fc">
              <li v-for="c in FINAL_CHECKS" :key="c"><Status compact state="ok" />{{ c }}</li>
            </ul>
            <div class="abtns">
              <button class="btn" @click.stop="showDraft = !showDraft">{{ showDraft ? 'Show log' : 'Show draft' }}</button>
              <button class="btn" disabled title="Simulated: only Priya can approve">Send to Helen</button>
            </div>
          </div>
        </Transition>

        <div class="blk">
          <span class="bh">Findings</span>
          <TransitionGroup name="s7line" tag="ul" class="find">
            <li v-for="f in cur.findings" :key="f.text"><Status compact :state="f.state" /><span>{{ f.text }}</span></li>
          </TransitionGroup>
          <span v-if="!cur.findings.length" class="none">None yet</span>
        </div>
      </aside>
    </div>

    <p class="say"><span class="sk">{{ PHASES.find(p => p.id === cur.phase)?.label }}</span>{{ cur.say }}</p>
  </div>
</template>

<style scoped>
.s7-run { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 8px; }
.bar { display: flex; align-items: center; gap: 12px; }
.spacer { flex: 1; }
.phases { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 6px; }
.phases li { margin: 0; padding: 4px 10px; font-size: var(--fs-label); border-radius: 999px; border: 1px solid var(--rule-strong); color: var(--ink-2); background: var(--surface); transition: background var(--dur) var(--ease), color var(--dur) var(--ease); }
.phases li.arr, .phases li.sep { border: none; background: none; padding: 0; color: var(--ink-3); display: inline-flex; }
.phases li.sep { margin-left: 10px; font-size: var(--fs-label); }
.phases li.rec { border-style: dashed; }
.phases li.on { background: var(--accent); border-color: var(--accent); color: #fff; }
.phases li.rec.on { background: var(--warn); border-color: var(--warn); }

.s7grid { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1fr 268px; grid-template-rows: minmax(0, 1fr); gap: 14px; }

.log { min-width: 0; min-height: 0; display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius); overflow: hidden; }
.lh { display: flex; align-items: center; justify-content: space-between; padding: 5px 10px; border-bottom: 1px solid var(--rule); background: var(--stage); font-size: var(--fs-label); color: var(--ink-2); }
.lines { flex: 1 1 auto; min-height: 0; overflow: hidden; display: flex; flex-direction: column; padding: 4px 0; }
.earlier { font-size: var(--fs-label); color: var(--ink-3); padding: 0 12px 2px; }
.ln { display: grid; grid-template-columns: 20px 1fr; align-items: baseline; padding: 1px 10px 1px 12px; font: 400 15px/1.38 var(--font-mono); color: var(--ink-2); }
.ln.now { background: var(--accent-tint); color: var(--ink); }
.ln.first { border-top: 1px dashed var(--rule); }
.g { font-weight: 600; }
.ln.call .g { color: var(--accent); }
.ln.call .t { color: var(--ink); }
.ln.ok .g { color: var(--ok); }
.ln.err .g, .ln.err .t { color: var(--bad); }
.ln.warn .g, .ln.warn .t { color: var(--warn); }
.ln.note .t { font-style: italic; }
.ln.stop .g, .ln.stop .t { color: var(--accent-strong); font-weight: 600; }

.draft { flex: 1 1 auto; overflow: hidden; padding: 4px 14px 2px; font-size: var(--fs-label); line-height: 1.3; }
.draft p { margin: 0 0 6px; }
.draft .dt { font-weight: 600; }
.draft .flag { background: var(--warn-tint); border-left: 3px solid var(--warn); padding: 2px 8px; }

.state { min-height: 0; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
.blk { display: flex; flex-direction: column; gap: 4px; }
.bh { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); }
.retry { display: inline-flex; align-items: center; gap: 6px; font-size: var(--fs-label); }
.retry i { width: 16px; height: 16px; border-radius: 3px; border: 1.5px solid var(--warn); display: inline-block; }
.retry i.used { background: var(--warn); }
.retry span { margin-left: 4px; }
.perm, .find, .fc { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.perm li { display: flex; justify-content: space-between; gap: 8px; margin: 0; padding: 0; font-size: var(--fs-label); line-height: 1.3; }
.find li, .fc li { display: flex; gap: 7px; align-items: baseline; margin: 0; padding: 0; font-size: var(--fs-label); line-height: 1.28; }
.none { font-size: var(--fs-label); color: var(--ink-3); }
.appr { border: 1.5px solid var(--accent); border-radius: var(--radius-sm); padding: 7px 10px; background: var(--accent-tint); }
.appr .bh { color: var(--accent-strong); }
.who { font-size: var(--fs-label); }
.abtns { display: flex; gap: 6px; margin-top: 4px; }
.abtns .btn { padding: 6px 9px; white-space: nowrap; }

.say { margin: 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink); border-left: 3px solid var(--accent); padding: 2px 0 2px 12px; min-height: 44px; }
.sk { font-weight: 600; color: var(--accent); margin-right: 10px; }

.s7line-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.s7line-enter-from { opacity: 0; transform: translateY(6px); }
.s7swap-enter-active, .s7swap-leave-active { transition: opacity var(--dur) var(--ease); }
.s7swap-enter-from, .s7swap-leave-to { opacity: 0; }
</style>
