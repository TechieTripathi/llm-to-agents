<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CLEVER, CONTEXT, GENERIC, GENERIC_CLEVER, QUESTION, RECOMMEND, RECOMMEND_AUDIENCE, STEPS } from '../data/s3/context'
import type { CtxKey } from '../data/s3/context'

// Slide 21: polishing the wording changes the tone; adding context changes the substance.
const MAX = STEPS.length - 1
const { step, next, prev, reset } = useArtifactStep(MAX)
const s = reactive<{ clever: boolean, ctx: CtxKey[] }>({ clever: false, ctx: [] })
watch(step, (n) => { s.clever = STEPS[n].clever; s.ctx = [...STEPS[n].ctx] }, { immediate: true })

const on = (k: CtxKey) => s.ctx.includes(k)
const toggle = (k: CtxKey) => { s.ctx = on(k) ? s.ctx.filter(c => c !== k) : [...s.ctx, k] }

const facts = computed(() => CONTEXT.filter(c => c.adds && on(c.key)))
const answer = computed(() => {
  if (!facts.value.length) return { lead: s.clever ? GENERIC_CLEVER : GENERIC, reasons: [] as { key: CtxKey, kind: string, text: string }[] }
  return {
    lead: on('audience') ? RECOMMEND_AUDIENCE : RECOMMEND,
    reasons: facts.value.map(f => ({ key: f.key, kind: f.kind, text: f.adds })),
  }
})
const verdict = computed(() => {
  const n = facts.value.length
  if (n === 0) return { state: 'bad' as const, label: 'Nothing to act on' }
  if (n < 3) return { state: 'warn' as const, label: 'Partly grounded' }
  return { state: 'ok' as const, label: on('audience') ? 'Ready for Helen' : 'Grounded in facts' }
})
</script>

<template>
  <Stage task="Add wording or context." tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="MAX" :labels="STEPS.map(x => x.label)" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="cc">
      <div class="q"><span class="ql">Question</span><span class="mono">{{ QUESTION }}</span></div>
      <div class="left">
        <div class="ctxh">Wording</div>

        <button class="item clever" :aria-pressed="s.clever" @click="s.clever = !s.clever">
          <span class="box" aria-hidden="true"><svg v-if="s.clever" viewBox="0 0 12 12"><path d="M2.5 6.2l2.2 2.2 4.8-5" /></svg></span>
          <span class="kind">Polish</span>
          <span class="txt mono">{{ CLEVER }}</span>
        </button>

        <div class="ctxh">Context</div>
        <button v-for="c in CONTEXT" :key="c.key" class="item" :aria-pressed="on(c.key)" @click="toggle(c.key)">
          <span class="box" aria-hidden="true"><svg v-if="on(c.key)" viewBox="0 0 12 12"><path d="M2.5 6.2l2.2 2.2 4.8-5" /></svg></span>
          <span class="kind">{{ c.kind }}</span>
          <span class="txt">{{ c.text }}</span>
        </button>
      </div>

      <div class="right">
        <div class="ah">
          <span>Answer</span>
          <span class="count">{{ facts.length }} checkable {{ facts.length === 1 ? 'fact' : 'facts' }}</span>
        </div>
        <Transition name="fade" mode="out-in">
          <div :key="`${s.clever}-${s.ctx.join()}`" class="ans">
            <p class="lead" :class="{ generic: !facts.length }">{{ answer.lead }}</p>
            <ul v-if="answer.reasons.length" class="why">
              <li v-for="r in answer.reasons" :key="r.key">
                <span class="src">{{ r.kind }}</span> {{ r.text }}
              </li>
            </ul>
          </div>
        </Transition>
        <div class="foot">
          <Status :state="verdict.state" :label="verdict.label" />
        </div>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.cc { display: grid; grid-template-columns: 1.12fr 1fr; grid-template-rows: auto 1fr; gap: 8px 20px; flex: 1 1 auto; min-height: 0; }
.left { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.q { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 12px; font-size: var(--fs-label); line-height: 1.3; padding: 6px 12px; background: var(--surface); border: 1px solid var(--rule-strong); border-radius: var(--radius); }
.ql, .ctxh { font-size: 14px; font-weight: 600; color: var(--ink-3); }
.ctxh { margin-top: 2px; }
.item {
  all: unset;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 16px 100px 1fr;
  align-items: baseline;
  gap: 8px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--rule);
  background: var(--surface);
  font-size: var(--fs-label);
  line-height: 1.25;
  cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.item:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.item[aria-pressed='true'] { border-color: var(--accent); background: var(--accent-tint); }
.item.clever { border-style: dashed; }
.item.clever .txt { color: var(--ink-2); font-style: italic; }
.item.clever[aria-pressed='true'] { background: var(--surface); border-color: var(--ink-3); }
.box { width: 14px; height: 14px; border: 1.5px solid var(--rule-strong); border-radius: 2px; align-self: center; display: grid; place-items: center; background: var(--surface); }
.item[aria-pressed='true'] .box { border-color: var(--accent); background: var(--accent); }
.item.clever[aria-pressed='true'] .box { border-color: var(--ink-2); background: var(--ink-2); }
.box svg { width: 12px; height: 12px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kind { font-weight: 600; color: var(--ink-2); font-size: 15px; }
.item[aria-pressed='true'] .kind { color: var(--accent); }
.item.clever[aria-pressed='true'] .kind { color: var(--ink); }

.right { display: flex; flex-direction: column; background: var(--paper); border: 1px solid var(--rule); border-radius: var(--radius); padding: 8px 14px 10px; min-height: 0; }
.ah { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: var(--ink-3); margin-bottom: 6px; }
.count { color: var(--accent); font-variant-numeric: tabular-nums; }
.ans { flex: 1 1 auto; font-size: var(--fs-label); line-height: 1.35; }
.lead { font-weight: 600; margin: 0 0 6px; font-size: var(--fs-small); line-height: 1.3; }
.lead.generic { font-weight: 400; color: var(--ink-2); font-size: var(--fs-small); }
.why { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.why li { margin: 0; padding: 0 0 0 10px; border-left: 2px solid var(--accent-tint-2); line-height: 1.3; }
.src { font-size: 14px; font-weight: 600; color: var(--accent); background: var(--accent-tint); border-radius: 999px; padding: 1px 7px; margin-right: 2px; }
.foot { padding-top: 6px; }
.fade-enter-active, .fade-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
