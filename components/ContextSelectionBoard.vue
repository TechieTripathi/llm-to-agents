<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CANDIDATES, HIERARCHY } from '../data/s3/selection'

// Slide 24: sort candidate material into what goes into the model's context and what stays out,
// with a reason for each, and resolve a conflict using a source hierarchy.
const MAX = CANDIDATES.length
const { step, next, prev, reset } = useArtifactStep(MAX)

const sorted = ref<string[]>([])
watch(step, (n) => { sorted.value = CANDIDATES.slice(0, n).map(c => c.key) }, { immediate: true })
const lastKey = computed(() => sorted.value[sorted.value.length - 1] ?? null)

const pending = computed(() => CANDIDATES.filter(c => !sorted.value.includes(c.key)))
const included = computed(() => sorted.value.map(k => CANDIDATES.find(c => c.key === k)!).filter(c => c.bucket === 'include'))
const excluded = computed(() => sorted.value.map(k => CANDIDATES.find(c => c.key === k)!).filter(c => c.bucket === 'exclude'))

function sort(k: string) { sorted.value = [...sorted.value, k] }
function unsort(k: string) { sorted.value = sorted.value.filter(x => x !== k) }

const conflictShown = computed(() => sorted.value.includes('email'))
const usedTiers = computed(() => new Set(included.value.map(c => c.tier).filter((t): t is number => t !== undefined)))
</script>

<template>
  <Stage task="Sort each item: into the context, or out. Click a card to sort it." tag="fictional">
    <template #controls>
      <StepControls :step="step" :max="MAX" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="board">
      <section class="col cand">
        <header><span>Candidates</span><span class="n">{{ pending.length }}</span></header>
        <TransitionGroup name="card" tag="div" class="stack">
          <button v-for="c in pending" :key="c.key" class="card" @click="sort(c.key)">
            <span class="t">{{ c.title }}</span>
          </button>
        </TransitionGroup>
        <p v-if="!pending.length" class="empty">All sorted.</p>
      </section>

      <svg class="flow" viewBox="0 0 24 60" aria-hidden="true"><path d="M2 30h18M15 24l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>

      <section class="col inc">
        <header><span>Into the context</span><span class="n">{{ included.length }}</span></header>
        <TransitionGroup name="card" tag="div" class="stack">
          <button v-for="c in included" :key="c.key" class="card sorted in" :class="{ fresh: c.key === lastKey }" @click="unsort(c.key)">
            <span class="t">{{ c.title }}</span>
            <span class="r"><Status state="ok" compact :label="c.reason" /></span>
          </button>
        </TransitionGroup>
        <p v-if="!included.length" class="empty">Nothing yet. The model would only have the question.</p>
      </section>

      <section class="col exc">
        <header><span>Left out</span><span class="n">{{ excluded.length }}</span></header>
        <TransitionGroup name="card" tag="div" class="stack">
          <button v-for="c in excluded" :key="c.key" class="card sorted out" :class="{ fresh: c.key === lastKey }" @click="unsort(c.key)">
            <span class="t">{{ c.title }}</span>
            <span class="r"><Status :state="c.key === 'sick' ? 'bad' : 'warn'" compact :label="c.reason" /></span>
          </button>
        </TransitionGroup>
        <p v-if="!excluded.length" class="empty">Nothing yet.</p>
      </section>
    </div>

    <div class="hier" aria-label="Source hierarchy">
      <span class="hl">When sources conflict</span>
      <template v-for="(h, i) in HIERARCHY" :key="h">
        <span class="tier" :class="{ used: usedTiers.has(i), win: conflictShown && i === 1, lose: conflictShown && i === 3 }">{{ h }}</span>
        <span v-if="i < HIERARCHY.length - 1" class="gt" aria-label="outranks">›</span>
      </template>
    </div>
  </Stage>
</template>

<style scoped>
.board { display: grid; grid-template-columns: 1fr 22px 1.12fr 1.12fr; gap: 10px; flex: 1 1 auto; min-height: 0; }
.col { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.col header { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 600; color: var(--ink-3); padding: 0 2px 4px; border-bottom: 1.5px solid var(--rule-strong); margin-bottom: 6px; }
.inc header { color: var(--ok); border-color: var(--ok); }
.exc header { color: var(--ink-2); }
.n { font-variant-numeric: tabular-nums; }
.stack { display: flex; flex-direction: column; gap: 4px; position: relative; }
.card {
  all: unset;
  box-sizing: border-box;
  display: flex; flex-direction: column; gap: 1px;
  padding: 4px 9px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  cursor: pointer;
  width: 100%;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.card:hover { border-color: var(--ink-3); }
.cand .card { flex-direction: row; justify-content: space-between; align-items: baseline; gap: 8px; }
.t { font-size: var(--fs-label); font-weight: 500; line-height: 1.25; color: var(--ink); }
.m { font-size: 14px; color: var(--ink-3); white-space: nowrap; }
.r :deep(.status) { font-size: 15px; white-space: normal; align-items: flex-start; }
.r :deep(.status svg) { margin-top: 2px; flex: 0 0 auto; }
.r :deep(.txt) { color: var(--ink-2); }
.in { border-left: 3px solid var(--ok); }
.out { border-left: 3px solid var(--rule-strong); }
.out .t { color: var(--ink-2); }
.fresh { border-color: var(--accent); background: var(--accent-tint); }
.empty { font-size: var(--fs-label); color: var(--ink-3); margin: 4px 2px; }
.flow { color: var(--rule-strong); align-self: center; width: 22px; }

.hier { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; border-top: 1px solid var(--rule); padding-top: 7px; font-size: 15px; }
.hl { font-weight: 600; color: var(--ink-2); margin-right: 4px; white-space: nowrap; }
.tier { padding: 2px 8px; border-radius: 999px; border: 1px solid var(--rule-strong); color: var(--ink-2); white-space: nowrap; transition: all var(--dur) var(--ease); }
.tier.used { border-color: var(--ok); color: var(--ink); }
.tier.win { background: var(--ok-tint); border-color: var(--ok); color: var(--ok); font-weight: 600; }
.tier.lose { border-style: dashed; color: var(--ink-3); text-decoration: line-through; }
.gt { color: var(--ink-3); font-size: 15px; }

.card-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.card-leave-active { transition: opacity calc(var(--dur) * 0.5) var(--ease); position: absolute; width: 100%; }
.card-enter-from { opacity: 0; transform: translateX(-12px); }
.card-leave-to { opacity: 0; }
.card-move { transition: transform var(--dur) var(--ease); }
</style>
