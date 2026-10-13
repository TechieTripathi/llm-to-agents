<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { STATE_STEPS, STORES } from '../data/s5/state'

// Slide 41 — 0 overview · 1 compaction · 2 the caveat is lost · 3 the harness writes caveats to state.
const { step } = useArtifactStep(3)
const cur = computed(() => STATE_STEPS[step.value])
const compacted = computed(() => step.value >= 1)
const fill = computed(() => (compacted.value ? 34 : 91))

function itemView(storeId: string, item: { id: string, text: string, key?: boolean }) {
  if (storeId !== 'context' || !compacted.value)
    return { text: item.text, cls: item.key ? 'key' : '' }
  if (item.id === 'results')
    return { text: 'Summary of steps 1–8', cls: 'summary' }
  if (item.id === 'caveat')
    return { text: item.text, cls: 'lost' }
  return { text: item.text, cls: '' }
}
</script>

<template>
  <div class="sd">
    <div class="cols">
      <section v-for="(s, i) in STORES" :key="s.id" class="col" :class="s.id">
        <header class="h">
          <div class="name">{{ s.name }}</div>
          <div class="what">{{ s.what }}</div>
        </header>
        <div class="life">
          <span class="dur" :aria-label="`Durability ${i + 1} of 4`">
            <span v-for="n in 4" :key="n" class="seg" :class="{ on: n <= i + 1 }" />
          </span>
          <span>{{ s.lives }}</span>
        </div>
        <div v-if="s.id === 'context'" class="meter" :aria-label="`Context ${fill}% full`">
          <span class="meter-bar"><span class="meter-fill" :style="{ width: `${fill}%` }" :class="{ high: meter-fill > 80 }" /></span>
          <span class="pct">{{ fill }}% full</span>
        </div>
        <TransitionGroup tag="ul" name="it" class="items">
          <li v-for="it in s.items" :key="it.id" :class="itemView(s.id, it).cls">
            {{ itemView(s.id, it).text }}
            <span v-if="itemView(s.id, it).cls === 'lost'" class="lost-tag">dropped by summary</span>
          </li>
          <li v-if="s.id === 'state' && step >= 3" key="caveat" class="key added">
            Caveat: Oct spend is provisional
          </li>
        </TransitionGroup>
      </section>
    </div>

    <div class="foot">
      <Transition name="swap" mode="out-in">
        <p :key="step" class="event">{{ cur.event }}</p>
      </Transition>
      <div class="draft" :class="[cur.draft?.tone ?? 'idle']">
        <template v-if="cur.draft">
          <span class="d-k">Report draft, written after compaction</span>
          <span class="d-t">“{{ cur.draft.text }}”</span>
          <Status :state="cur.draft.tone" :label="cur.draft.verdict" />
        </template>
        <template v-else>
          <span class="d-k">Report draft</span>
          <span class="d-idle">Written at step 12</span>
          <SimTag kind="fictional" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sd { display: flex; flex-direction: column; gap: 12px; flex: 1 1 auto; min-height: 0; }
.cols { display: grid; grid-template-columns: 1.12fr 1fr 1fr 1fr; gap: 12px; }
.col { background: var(--surface); border: 1px solid var(--rule); border-top: 3px solid var(--ink-2); border-radius: var(--radius-sm); padding: 8px 12px 10px; display: flex; flex-direction: column; gap: 6px; }
.col.context { border-top-color: var(--accent); }
.name { font-size: var(--fs-small); font-weight: 600; color: var(--ink); line-height: 1.2; }
.context .name { color: var(--accent); }
.what { font-size: 15px; color: var(--ink-2); line-height: 1.3; }
.life { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--ink-2); line-height: 1.3; }
.dur { display: inline-flex; gap: 2px; flex: 0 0 auto; }
.seg { width: 9px; height: 9px; border-radius: 1px; background: var(--rule); }
.seg.on { background: var(--ink-2); }
.meter { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--ink-2); }
.meter-bar { flex: 1; height: 8px; background: var(--stage); border-radius: 4px; overflow: hidden; }
.meter-fill { display: block; height: 100%; background: var(--accent); transition: width calc(var(--dur) * 1.5) var(--ease); }
.meter-fill.high { background: var(--warn); }
.pct { font-variant-numeric: tabular-nums; min-width: 60px; }
.items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.items li { margin: 0; padding: 4px 8px; font-size: var(--fs-label); line-height: 1.3; background: var(--stage); border-radius: var(--radius-sm); border: 1px solid transparent; color: var(--ink); transition: opacity var(--dur) var(--ease), background var(--dur) var(--ease); }
.items li.key { background: var(--accent-tint); border-color: var(--accent-tint-2); }
.items li.summary { background: var(--surface); border: 1px dashed var(--rule-strong); color: var(--ink-2); }
.items li.lost { background: transparent; border: 1px dashed var(--bad); color: var(--ink-3); text-decoration: line-through; text-decoration-color: var(--bad); }
.lost-tag { display: block; text-decoration: none; color: var(--bad); font-size: 14px; font-weight: 500; }
.items li.added { border-color: var(--accent); }

.foot { display: grid; grid-template-columns: 1fr 1.3fr; gap: 16px; align-items: stretch; }
.event { margin: 0; font-size: var(--fs-label); color: var(--ink); border-left: 3px solid var(--accent); padding: 2px 0 2px 12px; line-height: 1.35; align-self: center; }
.draft { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; padding: 6px 12px 8px; border-radius: var(--radius-sm); background: var(--surface); border: 1px solid var(--rule); min-height: 74px; justify-content: center; }
.draft.bad { border-color: var(--bad); }
.draft.ok { border-color: var(--ok); }
.d-k { font-size: 14px; color: var(--ink-3); }
.d-t { font-size: var(--fs-label); font-style: italic; color: var(--ink); line-height: 1.3; }
.d-idle { font-size: var(--fs-label); color: var(--ink-3); }
.it-enter-active, .it-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.it-enter-from, .it-leave-to { opacity: 0; transform: translateY(6px); }
.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
