<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { GOAL, NEW_INFO, PLAN, PLAN_CAPTIONS } from '../data/s5/plan'

// Slide 38 — 0 goal + steps · 1 "done when" checks · 2 new information · 3 revised plan.
const { step } = useArtifactStep(3)

const TOP = 30
const ROW = 52
const H = 44
const GOAL_MID = TOP + 48

const rows = computed(() => {
  const list = PLAN.filter(p => !p.added || step.value >= 3)
  return PLAN.map((p) => {
    const idx = list.indexOf(p)
    const revised = step.value >= 3 && !!p.revised
    return {
      ...p,
      visible: idx >= 0,
      top: TOP + Math.max(idx, 0) * ROW,
      n: idx + 1,
      shownText: revised ? p.revised!.text : p.text,
      shownCheck: revised ? p.revised!.check : p.check,
      revisedNow: revised,
      affected: step.value === 2 && !!p.revised,
      isNew: !!p.added && step.value >= 3,
    }
  })
})
</script>

<template>
  <div class="td">
    <div class="canvas">
      <div class="colhead" style="left: 236px">Steps</div>
      <div class="colhead fade" :class="{ off: step < 1 }" style="left: 556px">Done when…</div>

      <svg class="wires" width="240" height="340" viewBox="0 0 240 340" aria-hidden="true">
        <path
          v-for="r in rows" v-show="r.visible" :key="r.id"
          :d="`M190 ${GOAL_MID} C 214 ${GOAL_MID}, 212 ${r.top + H / 2}, 234 ${r.top + H / 2}`"
          class="wire" :class="{ isnew: r.isNew }"
        />
      </svg>

      <div class="goal" :style="{ top: `${TOP}px` }">
        <span class="g-k">Goal</span>
        <span class="g-t">{{ GOAL.text }}</span>
        <span class="g-d">{{ GOAL.due }}</span>
      </div>

      <Transition name="fade-t">
        <div v-if="step >= 2" class="news" :style="{ top: `${TOP + 132}px` }">
          <Status state="warn" label="New information" />
          <span class="n-s">{{ NEW_INFO.source }}</span>
          <span class="n-t">{{ NEW_INFO.text }}</span>
        </div>
      </Transition>

      <template v-for="r in rows" :key="r.id">
        <div
          class="node" :class="{ 'is-hidden': !r.visible, affected: r.affected, revised: r.revisedNow, isnew: r.isNew }"
          :style="{ top: `${r.top}px` }"
        >
          <span class="num">{{ r.visible ? r.n : '' }}</span>
          <span class="txt">{{ r.shownText }}</span>
          <span v-if="r.isNew" class="tag">added</span>
          <span v-else-if="r.revisedNow" class="tag">revised</span>
        </div>
        <div
          class="check" :class="{ 'is-hidden': !r.visible || step < 1, affected: r.affected }"
          :style="{ top: `${r.top}px` }"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" class="ck">
            <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path v-if="!r.affected" d="M4.5 8.3l2.2 2.2 4.6-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path v-else d="M8 4.5v4.2M8 11v.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <span>{{ r.affected ? 'Check no longer holds: M3 date is stale' : r.shownCheck }}</span>
        </div>
      </template>
    </div>

    <Transition name="fade-t" mode="out-in">
      <p :key="step" class="cap">{{ PLAN_CAPTIONS[step] }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.td { display: flex; flex-direction: column; gap: 6px; flex: 1 1 auto; min-height: 0; }
.canvas { position: relative; height: 344px; width: 868px; }
.colhead { position: absolute; top: 0; font-size: var(--fs-label); color: var(--ink-3); font-weight: 500; }
.wires { position: absolute; left: 0; top: 0; overflow: visible; }
.wire { fill: none; stroke: var(--rule-strong); stroke-width: 1.5; transition: d var(--dur) var(--ease); }
.wire.isnew { stroke: var(--accent); }

.goal { position: absolute; left: 0; width: 190px; padding: 10px 14px; background: var(--ink); color: var(--ink-inverse); border-radius: var(--radius); display: flex; flex-direction: column; gap: 2px; }
.g-k { font-size: 14px; color: var(--rule-strong); }
.g-t { font-size: var(--fs-label); font-weight: 600; line-height: 1.25; color: #fff; }
.g-d { font-size: 14px; color: var(--rule); }

.news { position: absolute; left: 0; width: 190px; padding: 10px 12px; background: var(--warn-tint); border-left: 3px solid var(--warn); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.news :deep(.status) { padding-left: 0; background: none; }
.n-s { font-size: 14px; color: var(--ink-2); }
.n-t { font-size: var(--fs-label); line-height: 1.3; color: var(--ink); }

.node, .check { position: absolute; height: 44px; display: flex; align-items: center; transition: top var(--dur) var(--ease), opacity var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.node { left: 236px; width: 296px; gap: 10px; padding: 0 12px; background: var(--surface); border: 1.5px solid var(--rule-strong); border-radius: var(--radius-sm); font-size: var(--fs-label); }
.num { font-weight: 600; color: var(--ink-3); min-width: 12px; font-variant-numeric: tabular-nums; }
.txt { flex: 1; color: var(--ink); line-height: 1.2; }
.tag { font-size: 14px; color: var(--accent); font-weight: 600; }
.node.affected { border-color: var(--warn); background: var(--warn-tint); }
.node.revised { border-color: var(--accent); }
.node.isnew { border-color: var(--accent); background: var(--accent-tint); }
.check { left: 556px; width: 312px; gap: 10px; font-size: var(--fs-label); color: var(--ink); line-height: 1.25; border-bottom: 1px solid var(--rule); }
.ck { flex: 0 0 auto; color: var(--ok); }
.check.affected { color: var(--warn); }
.check.affected .ck { color: var(--warn); }
.is-hidden { opacity: 0; }
.fade { transition: opacity var(--dur) var(--ease); }
.fade.off { opacity: 0; }
.cap { margin: 0; font-size: var(--fs-small); color: var(--ink); border-left: 3px solid var(--accent); padding: 2px 0 2px 14px; }
.fade-t-enter-active, .fade-t-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-t-enter-from, .fade-t-leave-to { opacity: 0; }
</style>
