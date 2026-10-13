<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ROWS } from '../data/s1/workflow'
import { ORG, PEOPLE } from '../data/universe'

// Slide 2: one weekly project update, done without and with an AI assistant.
// Clicks 1–5 reveal the AI-assisted steps; click 6 states where the human time went.
const { step } = useArtifactStep(6)
const shown = (i: number) => step.value > i
const done = computed(() => step.value >= 6)
const pm = PEOPLE.pm.name.split(' ')[0]
</script>

<template>
  <div class="wc">
    <div class="grid">
      <!-- header -->
      <div class="h stage-h" />
      <div class="h">
        <span class="h-t">Without AI</span>
        <span class="h-s">{{ pm }} does every step</span>
      </div>
      <div class="h">
        <span class="h-t">With an AI assistant</span>
        <span class="h-s">{{ pm }} directs and checks</span>
      </div>

      <!-- rows -->
      <template v-for="(r, i) in ROWS" :key="r.stage">
        <div class="stage">{{ r.stage }}</div>
        <div class="cell">
          <span class="who pm" :title="PEOPLE.pm.name">PN</span>
          <span class="txt">{{ r.before.text }}</span>
        </div>
        <div class="cell after" :class="[r.after.actor, { on: shown(i), review: r.after.review && shown(i) }]">
          <span class="who" :class="r.after.actor">{{ r.after.actor === 'ai' ? 'AI' : 'PN' }}</span>
          <span class="txt">{{ r.after.text }}</span>
          <span v-if="r.after.review" class="rv">
            <Status state="ok" label="Human review" />
          </span>
        </div>
      </template>

      <!-- shared deliverable -->
      <div class="stage out-l">Result</div>
      <div class="out">
        <svg class="merge" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M25 0 V7 H75 V0 M50 7 V14" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        </svg>
        <div class="out-box">
          <strong>Same deliverable:</strong> weekly {{ ORG.project.code }} update to {{ PEOPLE.director.name }}
          <span class="muted">· same standard · same owner</span>
        </div>
      </div>
    </div>

    <div class="foot">
      <p class="take" :class="{ on: done }">
        Human time moves from <strong>writing</strong> to <strong>checking and deciding</strong>.
      </p>
      <SimTag kind="fictional" />
    </div>
  </div>
</template>

<style scoped>
.wc { display: flex; flex-direction: column; gap: 8px; flex: 1 1 auto; min-height: 0; }
.grid {
  display: grid;
  grid-template-columns: 96px 1fr 1fr;
  column-gap: 14px;
  row-gap: 5px;
  align-items: stretch;
}
.h { display: flex; align-items: baseline; gap: 10px; padding: 0 0 4px; border-bottom: 1.5px solid var(--ink); position: relative; }
.stage-h { border-bottom-color: transparent; }
.h-t { font-size: var(--fs-small); font-weight: 600; }
.h-s { font-size: var(--fs-label); color: var(--ink-2); }

.stage {
  font-size: var(--fs-label);
  color: var(--ink-2);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--rule);
}
.cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 3px 8px 3px 5px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  font-size: 15px;
  line-height: 1.25;
  position: relative;
}
.who {
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
  font: 600 14px/1 var(--font-sans);
  border-radius: 50%;
  border: 1.5px solid var(--ink);
  color: var(--ink);
  background: var(--paper);
}
.who.ai { border-radius: var(--radius-sm); background: var(--accent); border-color: var(--accent); color: #fff; }
.txt { flex: 1 1 auto; }

/* AI-assisted column: placeholder until revealed */
.after { border-style: dashed; border-color: var(--rule-strong); background: transparent; }
.after > * { opacity: 0; transform: translateY(4px); transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.after.on { border-style: solid; border-color: var(--rule); background: var(--surface); }
.after.on > * { opacity: 1; transform: none; }
.after.on.ai { background: var(--accent-tint); border-color: var(--accent-tint-2); }
.after.review { border-color: var(--ok); box-shadow: inset 3px 0 0 var(--ok); }
.after, .after.on { transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.rv { flex: 0 0 auto; }
.rv :deep(.status) { font-size: 15px; padding: 2px 8px 2px 5px; }

.out-l { border-bottom: none; align-items: flex-start; padding-top: 16px; }
.out { grid-column: 2 / 4; display: flex; flex-direction: column; color: var(--ink-2); }
.merge { width: 100%; height: 12px; display: block; color: var(--rule-strong); }
.out-box {
  border: 1.5px solid var(--ink);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  font-size: var(--fs-label);
  color: var(--ink);
  background: var(--surface);
  text-align: center;
}

.foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.take {
  margin: 0;
  padding-left: 14px;
  border-left: 3px solid var(--accent);
  font-size: var(--fs-small);
  color: var(--ink);
  opacity: 0;
  transition: opacity var(--dur) var(--ease);
}
.take.on { opacity: 1; }
</style>
