<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { PIPELINE_EXAMPLE } from '../data/s2/generation'

// Slide 7 (mode="overview"): input context → model (parameters) → output, with the training lane.
// Slide 11 (mode="generation"): one pass of the generation loop, revealed stage by stage.
const props = withDefaults(defineProps<{ mode?: 'overview' | 'generation' }>(), { mode: 'overview' })

const MAX = props.mode === 'overview' ? 3 : 5
const { step, next, prev, reset } = useArtifactStep(MAX)

// Deterministic "parameter" matrix: intensities look varied but never change between renders.
const COLS = 15
const ROWS = 6
const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
  const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453
  return 0.12 + 0.88 * (x - Math.floor(x)) ** 1.6
})

// ----- overview -----
const focus = computed(() => (props.mode === 'overview' ? (['all', 'input', 'model', 'output'] as const)[step.value] : 'all'))
const OVERVIEW_CAPTIONS = [
  'Three parts: what you give it, the trained network, and what it writes back.',
  'Input context: the only information the model has about your task — nothing else is “looked up” unless a tool adds it.',
  'Parameters: numbers set during training. Using the model does not change them; your chat is not “learning” in that sense.',
  'Output: text produced one token at a time, each one a prediction of what is most likely to come next.',
]
const outTokens = ['Launch', ' moves', ' to', ' 3', ' Nov']

// ----- generation -----
const STAGES = [
  { name: 'Context', detail: 'Everything so far becomes tokens: instructions, documents, and the answer written so far.' },
  { name: 'Model', detail: 'The network processes all context tokens together, layer by layer, in one pass.' },
  { name: 'Next-token odds', detail: 'It outputs a score for every token in its vocabulary — about 200,000 for o200k_base — turned into probabilities.' },
  { name: 'Decode', detail: 'A decoding rule picks one token: greedy takes the top; sampling draws at random, weighted by probability. Temperature sharpens or flattens the odds.' },
  { name: 'Append', detail: 'The chosen token is added to the context, and the whole loop runs again.' },
]
const genActive = computed(() => Math.min(step.value, 4))
const loopOn = computed(() => step.value >= 5)
const genDetail = computed(() => loopOn.value
  ? 'Repeat: one token per pass, until the model emits an end token or hits a length limit.'
  : STAGES[genActive.value].detail)
const stageState = (i: number) => (loopOn.value ? 'done' : i === genActive.value ? 'on' : i < genActive.value ? 'done' : 'todo')
const ex = PIPELINE_EXAMPLE
const pct = (p: number) => `${Math.round(p * 100)}%`
</script>

<template>
  <!-- ======================= OVERVIEW (slide 7) ======================= -->
  <div v-if="mode === 'overview'" class="ov">
    <div class="ov-row">
      <section class="part" :class="{ dim: focus !== 'all' && focus !== 'input', lit: focus === 'input' }">
        <h3 class="part-h">Input context</h3>
        <div class="doc mono">
          <p>Summarise this meeting note in three bullets.</p>
          <p class="att">+ meeting_note.docx</p>
        </div>
        <p class="cap">Your instructions, pasted documents, earlier messages.</p>
      </section>

      <svg class="arr" viewBox="0 0 40 20" aria-hidden="true"><path d="M2 10h32M28 4l6 6-6 6" /></svg>

      <section class="part model" :class="{ dim: focus !== 'all' && focus !== 'model', lit: focus === 'model' }">
        <h3 class="part-h">Model <span class="sub">a neural network</span></h3>
        <svg class="param-grid" :viewBox="`0 0 ${COLS * 12} ${ROWS * 12}`" role="img" aria-label="A grid standing for the model's learned parameters">
          <rect v-for="(v, i) in cells" :key="i" :x="(i % COLS) * 12 + 1" :y="Math.floor(i / COLS) * 12 + 1" width="10" height="10" rx="1.5" :style="{ opacity: v }" />
        </svg>
        <p class="cap"><strong>Parameters:</strong> billions of numbers learned in training, then fixed.</p>
      </section>

      <svg class="arr" viewBox="0 0 40 20" aria-hidden="true"><path d="M2 10h32M28 4l6 6-6 6" /></svg>

      <section class="part" :class="{ dim: focus !== 'all' && focus !== 'output', lit: focus === 'output' }">
        <h3 class="part-h">Generated output</h3>
        <div class="out">
          <Token v-for="(t, i) in outTokens" :key="i" :text="t.trimStart()" :space="t.startsWith(' ')" :state="i === outTokens.length - 1 ? 'new' : 'context'" />
          <span class="more">…</span>
        </div>
        <p class="cap">Written one token at a time, each a prediction of what comes next.</p>
      </section>
    </div>

    <div class="train" :class="{ dim: focus !== 'all' && focus !== 'model', lit: focus === 'model' }">
      <svg class="train-arr" viewBox="0 0 24 34" aria-hidden="true"><path d="M12 32V4M6 10l6-6 6 6" /></svg>
      <p><strong>Earlier, in training:</strong> predict the next token across a huge body of text, adjusting the parameters after each miss. Chat assistants are then tuned to follow instructions.<Cite :k="['brown2020', 'ouyang2022']" /></p>
    </div>

    <div class="ov-foot">
      <p class="caption"><Transition name="fade" mode="out-in"><span :key="step">{{ OVERVIEW_CAPTIONS[step] }}</span></Transition></p>
      <StepControls :step="step" :max="MAX" :labels="['Overview', 'Input', 'Parameters', 'Output']" @prev="prev" @next="next" @reset="reset" />
    </div>
  </div>

  <!-- ======================= GENERATION (slide 11) ======================= -->
  <Stage v-else task="Step through one pass of the loop" tag="illustrative">
    <template #controls>
      <StepControls :step="step" :max="MAX" :labels="['Context', 'Model', 'Odds', 'Decode', 'Append', 'Repeat']" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="gen">
      <div class="lanes">
        <!-- 1 context -->
        <section class="st" :class="stageState(0)">
          <h3 class="st-h"><span class="n">1</span>Context</h3>
          <div class="chips">
            <span class="ell">Kestrel’s new</span>
            <Token v-for="(t, i) in ex.tail" :key="i" :text="t.trimStart()" :space="t.startsWith(' ')" />
            <Token v-if="step >= 4" text="March" space state="new" />
          </div>
        </section>
        <svg class="garr" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 10h16M13 5l5 5-5 5" /></svg>

        <!-- 2 model -->
        <section class="st" :class="stageState(1)">
          <h3 class="st-h"><span class="n">2</span>Model</h3>
          <div class="layers" aria-hidden="true">
            <span v-for="k in 5" :key="k" class="layer" :style="{ '--k': k }" />
          </div>
          <p class="st-cap">Processes all tokens, layer by layer</p>
        </section>
        <svg class="garr" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 10h16M13 5l5 5-5 5" /></svg>

        <!-- 3 probabilities -->
        <section class="st wide" :class="stageState(2)">
          <h3 class="st-h"><span class="n">3</span>Next-token odds</h3>
          <ul class="bars">
            <li v-for="(c, i) in ex.candidates" :key="c.t" :class="{ pick: step >= 3 && i === ex.chosen }">
              <span class="bt mono">{{ c.t.replace(/^ /, '·') }}</span>
              <span class="bb"><span class="bf" :style="{ width: `${c.p * 100 / 0.34 * 0.92}%` }" /></span>
              <span class="bp">{{ pct(c.p) }}</span>
            </li>
          </ul>
          <p class="st-cap">+ ~200,000 others</p>
        </section>
        <svg class="garr" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 10h16M13 5l5 5-5 5" /></svg>

        <!-- 4 decode -->
        <section class="st" :class="stageState(3)">
          <h3 class="st-h"><span class="n">4</span>Decode</h3>
          <div class="rule">
            <span class="r"><strong>Greedy</strong> top choice</span>
            <span class="r"><strong>Sampling</strong> weighted draw</span>
          </div>
          <div class="picked">
            <Token text="March" space :state="step >= 3 ? 'chosen' : 'candidate'" />
          </div>
        </section>
        <svg class="garr" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 10h16M13 5l5 5-5 5" /></svg>

        <!-- 5 append -->
        <section class="st" :class="stageState(4)">
          <h3 class="st-h"><span class="n">5</span>Append</h3>
          <p class="st-cap">Context grows by one token:</p>
          <p class="mono grown">… launch in<span class="add">·March</span></p>
        </section>
      </div>

      <!-- loop back arrow: from Append (right) back to Context (left) -->
      <div class="loopwrap" :class="{ on: loopOn }">
        <svg class="loop" viewBox="0 0 1000 30" preserveAspectRatio="none" aria-hidden="true">
          <path d="M930 0 V18 H70 V2" vector-effect="non-scaling-stroke" />
        </svg>
        <svg class="loop-head" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 7 L6 1 L11 7" /></svg>
        <span class="loop-l">Repeat with the longer context</span>
      </div>

      <div class="detail">
        <Transition name="fade" mode="out-in">
          <p :key="step">{{ genDetail }}</p>
        </Transition>
      </div>
    </div>

    <template #notice>The model only ever predicts one next token. A long answer is this loop, run hundreds of times.</template>
  </Stage>
</template>

<style scoped>
/* ---------- overview ---------- */
.ov { display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; }
.ov-row { display: grid; grid-template-columns: 1fr 40px 1.05fr 40px 1fr; align-items: stretch; gap: 6px; }
.part {
  display: flex; flex-direction: column; gap: 8px;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius);
  padding: 10px 14px;
  transition: opacity var(--dur) var(--ease), border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.part.model { border-color: var(--accent); border-width: 1.5px; }
.part.lit { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-tint-2); }
.dim { opacity: 0.35; }
.part-h { margin: 0; font-size: var(--fs-small); font-weight: 600; }
.part-h .sub { font-weight: 400; color: var(--ink-3); font-size: var(--fs-label); margin-left: 4px; }
.doc { font-size: 15px; line-height: 1.35; background: var(--stage); border-radius: var(--radius-sm); padding: 8px 10px; flex: 1; }
.doc p { margin: 0 0 6px; }
.doc .att { color: var(--accent); margin: 0; }
.cap { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.35; }
.param-grid { width: 100%; height: auto; flex: 1; }
.param-grid rect { fill: var(--accent); }
.out { display: flex; flex-wrap: wrap; gap: 4px; align-content: flex-start; flex: 1; }
.out .more { color: var(--ink-3); align-self: center; }
.arr { width: 40px; align-self: center; }
.arr path { fill: none; stroke: var(--ink-2); stroke-width: 1.5; }
.train {
  display: flex; align-items: center; gap: 10px;
  border: 1.5px dashed var(--rule-strong); border-radius: var(--radius);
  padding: 6px 14px; margin: 0 6% 0 6%;
  transition: opacity var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.train.lit { border-color: var(--accent); }
.train p { margin: 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink); }
.train-arr { width: 20px; height: 30px; flex: 0 0 auto; }
.train-arr path { fill: none; stroke: var(--ink-2); stroke-width: 1.5; }
.ov-foot { display: flex; align-items: center; gap: 16px; margin-top: auto; }
.caption { margin: 0; flex: 1; font-size: var(--fs-label); color: var(--ink); min-height: 2.8em; line-height: 1.35; display: flex; align-items: center; }

/* ---------- generation ---------- */
.gen { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.lanes { display: grid; grid-template-columns: 1.05fr 22px 0.85fr 22px 1.3fr 22px 1fr 22px 0.95fr; align-items: stretch; }
.st {
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius);
  padding: 10px 10px 10px; display: flex; flex-direction: column; gap: 8px; min-width: 0;
  transition: opacity var(--dur) var(--ease), border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.st.todo { opacity: 0.3; }
.st.on { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-tint-2); }
.st-h { margin: 0; font-size: var(--fs-label); font-weight: 600; display: flex; align-items: center; gap: 6px; }
.n { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--ink); color: var(--paper); font-size: 13px; font-weight: 600; }
.st.on .n { background: var(--accent); color: #fff; }
.st-cap { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.3; }
.chips { display: flex; flex-wrap: wrap; gap: 3px; }
.chips :deep(.tok) { font-size: 15px; padding: 4px 5px; }
.garr { width: 22px; align-self: center; }
.garr path { fill: none; stroke: var(--ink-2); stroke-width: 1.5; }
.layers { position: relative; height: 70px; }
.layer {
  position: absolute; left: calc(var(--k) * 6px - 6px); top: calc(var(--k) * 9px - 9px);
  width: calc(100% - 30px); height: 30px; border: 1.5px solid var(--accent); border-radius: var(--radius-sm);
  background: var(--accent-tint);
}
.bars { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
.bars li { display: grid; grid-template-columns: 74px 1fr 38px; align-items: center; gap: 6px; margin: 0; padding: 0; font-size: 15px; line-height: 1.3; border-radius: var(--radius-sm); }
.bt { white-space: pre; overflow: hidden; }
.bb { height: 12px; background: var(--stage); border-radius: 2px; overflow: hidden; }
.bf { display: block; height: 100%; background: var(--ink-3); transition: background var(--dur) var(--ease); }
.bp { text-align: right; font-variant-numeric: tabular-nums; color: var(--ink-2); }
.bars li.pick .bf { background: var(--accent); }
.bars li.pick .bt, .bars li.pick .bp { color: var(--accent); font-weight: 600; }
.rule { display: flex; flex-direction: column; gap: 4px; font-size: var(--fs-label); line-height: 1.25; }
.rule .r strong { display: block; font-weight: 600; }
.rule .r { color: var(--ink-2); }
.picked { margin-top: auto; }
.grown { font-size: 15px; margin: 0; line-height: 1.4; }
.add { color: #fff; background: var(--accent); border-radius: var(--radius-sm); padding: 1px 4px; margin-left: 2px; }
.loopwrap { position: relative; height: 30px; margin-top: 2px; }
.loop { position: absolute; inset: 0; width: 100%; height: 100%; }
.loop path { fill: none; stroke: var(--rule-strong); stroke-width: 1.5; stroke-dasharray: 4 4; transition: stroke var(--dur) var(--ease); }
.loop-head { position: absolute; left: calc(7% - 6px); top: -2px; width: 12px; height: 8px; }
.loop-head path { fill: none; stroke: var(--rule-strong); stroke-width: 1.5; }
.loopwrap.on .loop path { stroke: var(--accent); stroke-dasharray: none; }
.loopwrap.on .loop-head path { stroke: var(--accent); }
.loop-l { position: absolute; left: 50%; top: 9px; transform: translateX(-50%); background: var(--stage); padding: 0 10px; font-size: var(--fs-label); line-height: 1; color: var(--ink-3); white-space: nowrap; transition: color var(--dur) var(--ease); }
.loopwrap.on .loop-l { color: var(--accent); font-weight: 600; }
.ell { font: 400 16px/1 var(--font-sans); color: var(--ink-3); align-self: center; margin-right: 2px; }
.detail { margin-top: 6px; min-height: 46px; }
.detail p { margin: 0; font-size: var(--fs-label); line-height: 1.4; }

.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
