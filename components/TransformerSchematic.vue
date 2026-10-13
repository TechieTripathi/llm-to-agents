<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'

// Slide 9 — progressive, deliberately simplified schematic of a decoder-only transformer.
const { step, next, prev, reset, max } = useArtifactStep(5)

const TOKENS = ['The', ' meeting', ' is', ' moved', ' to']
const X = TOKENS.map((_, i) => 160 + i * 94)
const LAST = X[X.length - 1]

// Embedding strips: deterministic bar heights per token.
const bars = TOKENS.map((_, c) => Array.from({ length: 8 }, (_, k) => {
  const v = Math.sin((c + 1) * 7.31 + k * 2.17) * 0.5 + 0.5
  return 4 + v * 22
}))

// Attention arcs (causal: each position looks back). Stronger for " to" → " moved"/" meeting".
const ARCS: { from: number, to: number, w: number }[] = [
  { from: 4, to: 3, w: 1 },
  { from: 4, to: 1, w: 0.8 },
  { from: 4, to: 2, w: 0.35 },
  { from: 3, to: 1, w: 0.7 },
  { from: 2, to: 1, w: 0.45 },
  { from: 1, to: 0, w: 0.4 },
]
const arcPath = (a: { from: number, to: number }) => {
  const x1 = X[a.from]; const x2 = X[a.to]
  const h = 14 + Math.abs(a.from - a.to) * 9
  return `M${x1} 250 C ${x1} ${250 - h}, ${x2} ${250 - h}, ${x2} 250`
}

const OUT = [
  { t: ' Friday', p: 0.31 },
  { t: ' next', p: 0.18 },
  { t: ' Monday', p: 0.12 },
]

const STEPS = [
  { title: 'Text arrives as tokens', body: 'The context is split into tokens, exactly as on the previous slide.', term: 'Tokens' },
  { title: 'Each token becomes numbers', body: 'Every token is looked up as a long list of numbers — a vector. Information about its position is added too.', term: 'Embeddings' },
  { title: 'Positions share information', body: 'Each position gathers information from the positions before it. Here “to” draws on “moved” and “meeting”.', term: 'Attention' },
  { title: 'Each position is transformed', body: 'A small network then processes each position separately. Research suggests these layers hold many learned associations.', term: 'Feed-forward network' },
  { title: 'Repeat, many layers deep', body: 'Attention plus feed-forward make one layer. Large models stack dozens: GPT-3 has 96.', term: 'Layers' },
  { title: 'Read off the next token', body: 'The final vector at the last position is turned into a probability for every token in the vocabulary.', term: 'Output distribution' },
]
const s = computed(() => STEPS[step.value])
// Visual state of each part: 'on' (current), 'done' (seen), 'todo' (not yet).
const part = (i: number) => (step.value === i ? 'on' : step.value > i ? 'done' : 'todo')
const cites = computed(() => (step.value === 3 ? ['geva2021ff'] : step.value === 4 ? ['brown2020'] : step.value === 2 ? ['vaswani2017'] : []))
</script>

<template>
  <div class="ts">
    <svg class="dia" viewBox="0 0 590 372" role="img" aria-label="Simplified transformer: tokens, embeddings, attention, feed-forward, stacked layers, output probabilities">
      <!-- stacked layers (shadows) -->
      <g class="stack" :class="part(4)">
        <rect x="132" y="102" width="448" height="146" rx="6" />
        <rect x="124" y="110" width="448" height="146" rx="6" />
        <text x="118" y="72" class="lab-s">× many layers</text>
        <text x="118" y="93" class="lab-s2">GPT-3 has 96</text>
      </g>

      <!-- layer frame -->
      <rect class="frame" :class="{ hot: step === 2 || step === 3 || step === 4 }" x="116" y="118" width="448" height="146" rx="6" />
      <text x="128" y="138" class="lab-f">One layer</text>

      <!-- left gutter labels -->
      <g class="gut">
        <text x="6" y="353" :class="part(0)">Tokens</text>
        <text x="6" y="303" :class="part(1)">Embeddings</text>
        <text x="6" y="238" :class="part(2)">Attention</text>
        <text x="6" y="174" :class="part(3)">Feed-</text>
        <text x="6" y="193" :class="part(3)">forward</text>
        <text x="6" y="56" :class="part(5)">Output</text>
      </g>

      <!-- tokens -->
      <g :class="['grp', part(0)]">
        <g v-for="(t, i) in TOKENS" :key="t">
          <rect class="tok" :x="X[i] - 45" y="334" width="90" height="30" rx="3" />
          <text :x="X[i]" y="354" text-anchor="middle" class="tok-t">{{ t.trim() }}</text>
        </g>
      </g>

      <!-- arrows token → embedding → layer -->
      <g class="flow">
        <path v-for="(x, i) in X" :key="`a${i}`" :d="`M${x} 332 V320`" :class="part(1)" />
        <path v-for="(x, i) in X" :key="`b${i}`" :d="`M${x} 278 V266`" :class="part(2)" />
      </g>

      <!-- embeddings -->
      <g :class="['grp', part(1)]">
        <g v-for="(x, i) in X" :key="`e${i}`">
          <rect class="emb" :x="x - 36" y="282" width="72" height="36" rx="3" />
          <rect v-for="(h, k) in bars[i]" :key="k" class="bar" :x="x - 30 + k * 8" :y="314 - h" width="5" :height="h" />
        </g>
      </g>

      <!-- attention arcs -->
      <g :class="['grp', 'att', part(2)]">
        <path v-for="(a, i) in ARCS" :key="`arc${i}`" :d="arcPath(a)" :style="{ strokeWidth: 1 + a.w * 2.5, opacity: 0.35 + a.w * 0.65 }" />
        <circle v-for="(x, i) in X" :key="`d${i}`" :cx="x" cy="250" r="4" />
      </g>

      <!-- feed-forward boxes -->
      <g :class="['grp', part(3)]">
        <g v-for="(x, i) in X" :key="`f${i}`">
          <path class="link" :d="`M${x} 246 V186`" />
          <rect class="ff" :x="x - 30" y="152" width="60" height="32" rx="4" />
          <path class="ffi" :d="`M${x - 18} 172 l8 -8 l8 8 l8 -8 l8 8`" />
        </g>
      </g>

      <!-- output -->
      <g :class="['grp', part(5)]">
        <path class="flow-o" :d="`M${LAST} 118 V100`" />
        <rect class="outp" x="334" y="10" width="244" height="88" rx="5" />
        <g v-for="(o, i) in OUT" :key="o.t">
          <text x="348" :y="36 + i * 24" class="out-t">{{ o.t.replace(/^ /, '·') }}</text>
          <rect x="438" :y="25 + i * 24" :width="o.p * 300" height="12" rx="2" :class="['ob', { top: i === 0 }]" />
          <text x="572" :y="36 + i * 24" text-anchor="end" class="out-p">{{ Math.round(o.p * 100) }}%</text>
        </g>
      </g>
    </svg>

    <aside class="side">
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
      <Transition name="fade" mode="out-in">
        <div :key="step" class="exp">
          <span class="term">{{ s.term }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}<Cite v-if="cites.length" :k="cites" /></p>
        </div>
      </Transition>
      <div class="caveat">
        <SimTag kind="teaching" />
        <p>Simplified. Real models add residual connections, normalisation and many attention heads per layer.</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.ts { display: grid; grid-template-columns: 1.65fr 1fr; gap: 20px; flex: 1; min-height: 0; align-items: stretch; }
.dia { width: 100%; height: 100%; max-height: 400px; }
text { font-family: var(--font-sans); }
.gut text { font-size: 15px; fill: var(--ink-3); transition: fill var(--dur) var(--ease); }
.gut text.on { fill: var(--accent); font-weight: 600; }
.gut text.done { fill: var(--ink); }
.grp { transition: opacity var(--dur) var(--ease); }
.grp.todo { opacity: 0.16; }
.tok { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.tok-t { font-family: var(--font-mono); font-size: 15px; fill: var(--ink); }
.on .tok { stroke: var(--accent); fill: var(--accent-tint); }
.emb { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.bar { fill: var(--ink-3); }
.on .bar { fill: var(--accent); }
.flow path { stroke: var(--ink-3); stroke-width: 1.5; transition: opacity var(--dur) var(--ease); }
.flow path.todo { opacity: 0.16; }
.frame { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; transition: stroke var(--dur) var(--ease); }
.frame.hot { stroke: var(--accent); }
.lab-f { font-size: 15px; fill: var(--ink-2); }
.stack rect { fill: var(--stage); stroke: var(--rule-strong); stroke-width: 1.5; transition: opacity var(--dur) var(--ease), stroke var(--dur) var(--ease); }
.stack.todo rect, .stack.todo text { opacity: 0; }
.stack text { transition: opacity var(--dur) var(--ease); }
.stack.on rect { stroke: var(--accent); }
.lab-s { font-size: 15px; fill: var(--accent); font-weight: 600; }
.lab-s2 { font-size: 15px; fill: var(--ink-2); }
.stack.done .lab-s { fill: var(--ink-2); font-weight: 400; }
.att path { fill: none; stroke: var(--ink-2); }
.att.on path { stroke: var(--accent); }
.att circle { fill: var(--ink-2); }
.att.on circle { fill: var(--accent); }
.link { stroke: var(--rule-strong); stroke-width: 1.5; stroke-dasharray: 3 3; }
.ff { fill: var(--surface); stroke: var(--ink-2); stroke-width: 1.5; }
.on .ff { stroke: var(--accent); fill: var(--accent-tint); }
.ffi { fill: none; stroke: var(--ink-2); stroke-width: 1.5; }
.on .ffi { stroke: var(--accent); }
.flow-o { stroke: var(--ink-2); stroke-width: 1.5; }
.outp { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.5; }
.on .outp { stroke: var(--accent); }
.out-t { font-family: var(--font-mono); font-size: 15px; fill: var(--ink); }
.out-p { font-size: 15px; fill: var(--ink-2); font-variant-numeric: tabular-nums; }
.ob { fill: var(--ink-3); }
.ob.top { fill: var(--accent); }

.side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.exp { display: flex; flex-direction: column; gap: 6px; }
.term { align-self: flex-start; font: 500 var(--fs-label)/1 var(--font-sans); color: var(--accent); background: var(--accent-tint); padding: 5px 9px; border-radius: 999px; }
.exp h3 { font-size: 22px; margin: 4px 0 0; line-height: 1.2; }
.exp p { margin: 0; font-size: var(--fs-small); line-height: 1.4; color: var(--ink); }
.caveat { margin-top: auto; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.caveat p { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.35; }
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
