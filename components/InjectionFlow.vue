<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { LANES, PAGE, TASK, TRIFECTA } from '../data/s8/injection'

// Slide 62 — the same poisoned page meets two agent set-ups.
// Steps: 0 page + task · 1 unsafe reads/permissions · 2 unsafe acts · 3 safer reads/permissions · 4 safer approval.
const { step, next, prev, reset, max } = useArtifactStep(4)

// How many nodes of each lane are visible at the current step.
const shown = computed(() => ({
  unsafe: step.value >= 2 ? 3 : step.value >= 1 ? 2 : 0,
  safe: step.value >= 4 ? 3 : step.value >= 3 ? 2 : 0,
}))
const done = (id: 'unsafe' | 'safe') => shown.value[id] === 3
const hiddenHot = computed(() => step.value === 1 || step.value === 2)

const GHOST = ['How does it read the page?', 'What can it reach?', 'What does it do next?']
const labels = ['The poisoned page', 'Unsafe: obeys', 'Unsafe: acts', 'Safer: data only', 'Safer: approval']
</script>

<template>
  <Stage task="Same page, two agent set-ups" tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="flow">
      <!-- Source: the user's task and the retrieved page with a hidden instruction -->
      <div class="src">
        <div class="ask">
          <span class="who">{{ TASK.who }}</span>
          <span class="said">“{{ TASK.text }}”</span>
        </div>
        <svg class="arr" width="26" height="12" viewBox="0 0 26 12" aria-hidden="true"><path d="M1 6h22M18 1.5l5 4.5-5 4.5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
        <div class="page">
          <div class="ptext"><span class="url mono">{{ PAGE.url }}</span> <strong>{{ PAGE.title }}</strong></div>
          <div class="hidden" :class="{ hot: hiddenHot }">
            <span class="hk">Hidden text: invisible to Mei, read by the model</span>
            <span class="mono ht">{{ PAGE.hidden }}</span>
          </div>
        </div>
      </div>

      <!-- Two lanes -->
      <div class="lanes">
        <div v-for="lane in LANES" :key="lane.id" class="lane" :class="[lane.id, { live: shown[lane.id] > 0 }]">
          <div class="lh">
            <Status :state="shown[lane.id] ? lane.state : 'neutral'" :label="lane.title" />
            <span class="spacer" />
            <span class="tri-k" :class="{ on: done(lane.id) }">Lethal trifecta<Cite k="s8willison2025trifecta" /></span>
            <ul class="tri" :class="{ on: done(lane.id) }" aria-label="Lethal trifecta check">
              <li v-for="(m, i) in lane.trifecta" :key="i" :class="m">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <circle v-if="m === 'have'" cx="6" cy="6" r="5" fill="currentColor" />
                  <circle v-else-if="m === 'gated'" cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" stroke-width="1.6" />
                  <path v-else d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                </svg>
                {{ TRIFECTA[i][m] }}
              </li>
            </ul>
          </div>
          <div class="nodes">
          <template v-for="(n, i) in lane.nodes" :key="i">
            <svg v-if="i > 0" class="arr link" :class="{ on: shown[lane.id] > i }" width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h14M11 1.5l4.5 4.5L11 10.5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
            <div class="node" :class="{ on: shown[lane.id] > i }">
              <div class="ghost" aria-hidden="true">{{ GHOST[i] }}</div>
              <div class="real">
                <div class="nt">
                  <Status v-if="i === lane.nodes.length - 1" :state="lane.outcome.state" compact />
                  {{ n.title }}
                </div>
                <div v-if="n.mono" class="nm mono">{{ n.mono }}</div>
                <div v-if="n.chips" class="chips">
                  <span v-for="c in n.chips" :key="c.text" class="chip" :class="{ off: !c.on }">
                    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
                      <path v-if="c.on" d="M1.5 5.8l2.6 2.6 5.4-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                      <path v-else d="M2 2l7 7M9 2l-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                    {{ c.text }}
                  </span>
                </div>
                <div v-if="n.body" class="nb">{{ n.body }}</div>
              </div>
            </div>
          </template>
          </div>
        </div>
      </div>
    </div>

    <template #notice>
      <span>No complete technical fix exists today. Design so a fooled agent can reach little and do less.<Cite :k="['s8owasp2025llm01', 's8ncsc2025injection']" /></span>
    </template>
  </Stage>
</template>

<style scoped>
.flow { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 10px; }

/* Source row */
.src { display: grid; grid-template-columns: 196px 22px 1fr; align-items: center; gap: 6px; }
.ask {
  display: flex; flex-direction: column; gap: 3px;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius) var(--radius) var(--radius) 0;
  padding: 8px 12px;
}
.who { font-size: 14px; color: var(--ink-2); }
.said { font-size: var(--fs-label); line-height: 1.3; color: var(--ink); }
.arr { color: var(--ink-3); flex: 0 0 auto; }
.page {
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius);
  padding: 6px 12px 8px; display: flex; flex-direction: column; gap: 4px; min-width: 0;
}
.url { font-size: 14px; color: var(--ink-3); margin-right: 6px; }
.ptext { font-size: 15px; line-height: 1.3; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ptext strong { color: var(--ink); }
.hidden {
  position: relative; margin-top: 8px;
  border: 1.5px dashed var(--rule-strong); border-radius: var(--radius-sm);
  padding: 9px 8px 4px; display: flex; flex-direction: column;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.hidden.hot { border-color: var(--bad); background: var(--bad-tint); }
.hk { position: absolute; top: -9px; left: 8px; padding: 0 5px; background: var(--surface); font-size: 14px; line-height: 16px; font-weight: 600; color: var(--bad); }
.hidden.hot .hk { background: var(--surface); }
.ht { font-size: 14px; line-height: 1.3; color: var(--ink); }

/* Lanes */
.lanes { flex: 1 1 auto; min-height: 0; display: grid; grid-template-rows: 1fr 1fr; gap: 6px; }
.lane { display: flex; flex-direction: column; gap: 5px; border-top: 1px solid var(--rule); padding-top: 6px; min-height: 0; }
.lh { display: flex; align-items: center; gap: 10px; }
.spacer { flex: 1; }
.tri-k { font-size: 14px; color: var(--ink-3); opacity: 0; transition: opacity var(--dur) var(--ease); }
.tri { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; opacity: 0; transition: opacity var(--dur) var(--ease); }
.tri.on, .tri-k.on { opacity: 1; }
.tri li {
  margin: 0; display: inline-flex; align-items: center; gap: 5px;
  font-size: 14px; line-height: 1; padding: 4px 8px; border-radius: 999px; border: 1px solid currentColor;
}
.tri li.have { color: var(--bad); background: var(--bad-tint); font-weight: 500; }
.tri li.none { color: var(--ink-3); border-style: dashed; }
.tri li.gated { color: var(--warn); background: var(--warn-tint); font-weight: 500; }
.nodes { flex: 1 1 auto; display: grid; grid-template-columns: 1fr 18px 1fr 18px 1.1fr; column-gap: 6px; align-items: stretch; }

.link { align-self: center; color: var(--rule-strong); transition: color var(--dur) var(--ease); }
.link.on { color: var(--ink-2); }

.node {
  position: relative;
  border: 1px dashed var(--rule-strong);
  border-left-width: 3px;
  border-radius: var(--radius-sm);
  min-width: 0;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.node.on { background: var(--surface); border-style: solid; border-color: var(--rule); }
.ghost {
  position: absolute; inset: 0; display: flex; align-items: center; padding: 0 12px;
  font-size: var(--fs-label); color: var(--ink-3);
  transition: opacity var(--dur) var(--ease);
}
.node.on .ghost { opacity: 0; }
.real {
  padding: 5px 10px 6px;
  display: flex; flex-direction: column; gap: 4px;
  opacity: 0;
  clip-path: inset(0 100% 0 0);
  transition: opacity var(--dur) var(--ease), clip-path calc(var(--dur) * 1.3) var(--ease);
}
.node.on .real { opacity: 1; clip-path: inset(0 0 0 0); }
.unsafe .node.on { border-left-color: var(--bad); }
.safe .node.on { border-left-color: var(--ok); }
.nt { display: flex; align-items: center; gap: 6px; font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink); }
.nb { font-size: 15px; line-height: 1.3; color: var(--ink-2); }
.nm { font-size: 14px; line-height: 1.3; color: var(--ink); background: var(--stage); border-radius: var(--radius-sm); padding: 2px 5px; overflow-wrap: anywhere; }
.chips { display: flex; flex-wrap: wrap; gap: 4px; }
.chip {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 14px; line-height: 1; padding: 4px 7px; border-radius: 999px;
  border: 1px solid var(--rule-strong); color: var(--ink);
}
.chip.off { color: var(--ink-3); border-style: dashed; text-decoration: line-through; }

@media (prefers-reduced-motion: reduce) {
  .real { clip-path: none; }
}
</style>
