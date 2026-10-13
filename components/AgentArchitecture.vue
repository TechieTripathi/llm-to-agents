<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { TOOLS } from '../data/s5/lark'
import { PEOPLE } from '../data/universe'

// Slide 35 — agent architecture, revealed in four clicks:
// 0 parts · 1 the loop · 2 the stop rule · 3 the application boundary · 4 workflow vs agent.
const { step } = useArtifactStep(4)

const toolY = [44, 104, 164, 224]
const accessLabel: Record<string, string> = { read: 'read', write: 'write', approval: 'send (approval)' }

const captions = [
  'The parts: a person sets a goal; the model reads its context and can ask to use tools.',
  'The loop: the model proposes an action, the result comes back, and it decides again.',
  'A stop rule ends the loop: the goal is met, or a person has to decide.',
  'The application — not the model — runs the tools and enforces the limits.',
]
const caption = computed(() => captions[Math.min(step.value, 3)])
</script>

<template>
  <div class="aa">
    <svg viewBox="0 0 868 292" class="diagram" role="img" aria-label="Agent architecture: a person sets a goal, the model reads context, proposes actions on tools, receives results, and stops when done or when a person must decide.">
      <defs>
        <marker id="s5aa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--ink-2)" />
        </marker>
        <marker id="s5aa-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--accent)" />
        </marker>
      </defs>

      <!-- Application boundary (step 3) -->
      <g class="fade" :class="{ off: step < 3 }">
        <rect x="198" y="10" width="404" height="272" rx="10" class="boundary" />
        <text x="216" y="270" class="t-label t-acc">Application: runs tools, enforces limits</text>
      </g>

      <!-- Person -->
      <rect x="0" y="104" width="150" height="104" rx="6" class="box" />
      <text x="16" y="134" class="t-head">Person</text>
      <text x="16" y="160" class="t-label">{{ PEOPLE.pm.name }}</text>
      <text x="16" y="182" class="t-label">sets the goal</text>

      <!-- goal arrow -->
      <path d="M150 156 H220" class="flow" marker-end="url(#s5aa-arrow)" />

      <!-- Context -->
      <rect x="222" y="58" width="160" height="196" rx="6" class="box" />
      <text x="238" y="84" class="t-head">Context</text>
      <g class="chips">
        <rect x="236" y="96" width="132" height="28" rx="3" class="chip" /><text x="248" y="115" class="t-label">Goal</text>
        <rect x="236" y="130" width="132" height="28" rx="3" class="chip" /><text x="248" y="149" class="t-label">Instructions</text>
        <rect x="236" y="164" width="132" height="28" rx="3" class="chip" /><text x="248" y="183" class="t-label">Tool list</text>
        <g class="fade" :class="{ off: step < 1 }">
          <rect x="236" y="198" width="132" height="28" rx="3" class="chip chip-acc" /><text x="248" y="217" class="t-label t-acc">Results so far</text>
        </g>
      </g>
      <path d="M382 156 H430" class="flow" marker-end="url(#s5aa-arrow)" />

      <!-- Model -->
      <rect x="432" y="112" width="140" height="88" rx="8" class="model" />
      <text x="502" y="149" text-anchor="middle" class="t-model">Model</text>
      <text x="502" y="174" text-anchor="middle" class="t-model-sub">picks next step</text>

      <!-- Tools -->
      <text x="676" y="28" class="t-head">Tools (other systems)</text>
      <g v-for="(t, i) in TOOLS" :key="t.id">
        <rect x="676" :y="toolY[i]" width="192" height="48" rx="6" class="box" :class="{ caution: t.access === 'approval' }" />
        <text x="690" :y="toolY[i] + 22" class="t-label t-strong">{{ t.name }}</text>
        <text x="690" :y="toolY[i] + 41" class="t-mono">{{ accessLabel[t.access] }}</text>
      </g>

      <!-- Loop: action + result (step 1) -->
      <g class="fade" :class="{ off: step < 1 }">
        <path d="M572 140 H672" class="flow acc" marker-end="url(#s5aa-arrow-acc)" />
        <text x="638" y="130" text-anchor="middle" class="t-label t-acc">action</text>
        <path d="M676 218 H386" class="flow acc" marker-end="url(#s5aa-arrow-acc)" />
        <text x="500" y="242" text-anchor="middle" class="t-label t-acc">result (observation)</text>
      </g>

      <!-- Stop rule (step 2) -->
      <g class="fade" :class="{ off: step < 2 }">
        <path d="M502 112 V40 H75 V100" class="flow stop" marker-end="url(#s5aa-arrow)" />
        <rect x="190" y="26" width="270" height="28" fill="var(--paper)" />
        <text x="325" y="46" text-anchor="middle" class="t-label t-strong">stop: done, or a person decides</text>
      </g>
    </svg>

    <Transition name="swap" mode="out-in">
      <div v-if="step < 4" :key="'c' + Math.min(step, 3)" class="caption">{{ caption }}</div>
      <div v-else key="cmp" class="compare">
        <div class="cmp">
          <span class="cmp-k">Workflow<Cite k="anthropic2024agents" /></span>
          <span>Steps fixed in code: fetch → draft → check → send. Predictable and easy to test.</span>
        </div>
        <div class="cmp is-agent">
          <span class="cmp-k">Agent</span>
          <span>The model chooses each next step from the last result. Flexible, so it needs limits.</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.aa { display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; }
.diagram { width: 100%; height: auto; max-height: 292px; overflow: visible; }
.box { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.box.caution { stroke: var(--warn); stroke-dasharray: 5 3; }
.chip { fill: var(--stage); stroke: none; }
.chip-acc { fill: var(--accent-tint); }
.model { fill: var(--accent); }
.boundary { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: 7 5; }
.flow { fill: none; stroke: var(--ink-2); stroke-width: 1.5; }
.flow.acc { stroke: var(--accent); }
.flow.stop { stroke: var(--ink); stroke-dasharray: 2 0; }
.t-head { font: 600 16px var(--font-sans); fill: var(--ink); }
.t-label { font: 400 16px var(--font-sans); fill: var(--ink-2); }
.t-strong { fill: var(--ink); font-weight: 500; }
.t-acc { fill: var(--accent); font-weight: 500; }
.t-mono { font: 400 15px var(--font-mono); fill: var(--ink-2); }
.t-model { font: 600 20px var(--font-sans); fill: #fff; }
.t-model-sub { font: 400 16px var(--font-sans); fill: #fff; }
.fade { transition: opacity var(--dur) var(--ease); }
.fade.off { opacity: 0; }

.caption { font-size: var(--fs-small); color: var(--ink); border-left: 3px solid var(--accent); padding: 4px 0 4px 14px; min-height: 58px; display: flex; align-items: center; }
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; min-height: 58px; }
.cmp { display: flex; flex-direction: column; gap: 2px; font-size: var(--fs-label); line-height: 1.35; color: var(--ink-2); border-top: 1.5px solid var(--ink); padding-top: 6px; }
.cmp.is-agent { border-color: var(--accent); }
.cmp-k { font-weight: 600; color: var(--ink); font-size: var(--fs-small); }
.is-agent .cmp-k { color: var(--accent); }
.swap-enter-active, .swap-leave-active { transition: opacity var(--dur) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
</style>
