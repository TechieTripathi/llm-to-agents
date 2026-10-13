<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ATTN_SENTENCES, DECIDER_INDEX, IT_INDEX } from '../data/s2/attention'

// Slide 10 (Artifact B) — select a token to see ILLUSTRATIVE attention to earlier tokens.
// Click states: 0 = "it" (ambiguous), 1 = "big" resolves to "file", 2 = "small" resolves to "drive".
const { step, max, next, prev, reset } = useArtifactStep(2)

const sentenceId = ref<'big' | 'small'>('big')
const selected = ref(IT_INDEX)
watch(step, (s) => {
  sentenceId.value = s === 2 ? 'small' : 'big'
  selected.value = s === 0 ? IT_INDEX : DECIDER_INDEX
}, { immediate: true })

const sent = computed(() => ATTN_SENTENCES.find(s => s.id === sentenceId.value)!)
const tokens = computed(() => sent.value.tokens)

// Geometry: IBM Plex Mono advance ≈ 0.6em.
const FS = 19
const CW = FS * 0.6
const PAD = 8
const GAP = 7
const ROW_Y = 88
const layout = computed(() => {
  let x = 4
  return tokens.value.map((t) => {
    const w = t.trim().length * CW + PAD * 2
    const box = { x, w, cx: x + w / 2 }
    x += w + GAP
    return box
  })
})
const width = computed(() => { const l = layout.value[layout.value.length - 1]; return l.x + l.w + 4 })

const weights = computed(() => {
  const raw = sent.value.weights[selected.value] ?? { [selected.value]: 1 }
  const sum = Object.values(raw).reduce((a, b) => a + b, 0)
  return Object.entries(raw).map(([k, v]) => ({ i: Number(k), w: v / sum })).sort((a, b) => b.w - a.w)
})
const maxW = computed(() => Math.max(...weights.value.filter(w => w.i !== selected.value).map(w => w.w), 0.01))
const arcs = computed(() => weights.value.filter(w => w.i !== selected.value).map((w) => {
  const a = layout.value[selected.value].cx
  const b = layout.value[w.i].cx
  const h = 16 + Math.min(92, Math.abs(a - b) * 0.2)
  return { ...w, d: `M${a} ${ROW_Y - 4} C ${a} ${ROW_Y - h}, ${b} ${ROW_Y - h}, ${b} ${ROW_Y - 4}`, rel: w.w / maxW.value }
}))
const top = computed(() => weights.value.filter(w => w.i !== selected.value).slice(0, 3))
const weightOf = (i: number) => weights.value.find(w => w.i === i)?.w ?? 0

function pick(i: number) { selected.value = i }
function setSentence(id: 'big' | 'small') { sentenceId.value = id }

const word = (i: number) => `“${tokens.value[i].trim()}”`
const insight = computed(() => {
  const i = selected.value
  if (i === IT_INDEX)
    return `At ${word(i)}, both nouns are still candidates. The deciding word has not arrived yet.`
  if (i === DECIDER_INDEX)
    return `${word(i)} looks back at “it” and “${sent.value.referent.trim()}”. Here the reference gets resolved.`
  if (i > DECIDER_INDEX)
    return `${word(i)} draws on the end of the sentence and on what “it” now refers to.`
  return `${word(i)} draws mostly on ${word(top.value[0]?.i ?? i)}. It cannot see any later word.`
})
</script>

<template>
  <Stage task="Select any word" tag="teaching">
    <template #controls>
      <div class="seg" role="group" aria-label="Sentence ending">
        <button v-for="s in ATTN_SENTENCES" :key="s.id" class="btn" :aria-pressed="sentenceId === s.id" @click.stop="setSentence(s.id)">{{ s.label }}</button>
      </div>
    </template>

    <svg class="ae" :viewBox="`0 0 ${width} 128`" role="group" aria-label="Sentence with illustrative attention arcs">
      <!-- arcs -->
      <g class="arcs">
        <TransitionGroup name="arc">
          <path v-for="a in arcs" :key="`${sentenceId}-${selected}-${a.i}`" :d="a.d" :style="{ strokeWidth: 1.2 + a.rel * 5.5, opacity: 0.25 + a.rel * 0.75 }" />
        </TransitionGroup>
      </g>
      <!-- tokens -->
      <g v-for="(t, i) in tokens" :key="`${sentenceId}-${i}`" class="t" :class="{ sel: i === selected, later: i > selected, src: i < selected && weightOf(i) > 0.09 }"
         role="button" tabindex="0" :aria-label="`Select ${t.trim()}`" @click.stop="pick(i)" @keydown.enter.stop="pick(i)">
        <rect :x="layout[i].x" :y="ROW_Y - 2" :width="layout[i].w" height="34" rx="3" />
        <text :x="layout[i].cx" :y="ROW_Y + 21" text-anchor="middle" :style="{ fontSize: `${FS}px` }">{{ t.trim() }}</text>
      </g>
      <!-- later tokens bracket -->
      <g v-if="selected < tokens.length - 1" class="mask">
        <path :d="`M${layout[selected + 1].x} 127 V121 H${width - 4} V127`" />
      </g>
    </svg>
    <p class="mask-l" :class="{ off: selected >= tokens.length - 1 }">Later words: not visible yet</p>

    <div class="below">
      <div class="draws">
        <h3 class="ins">{{ insight }}</h3>
        <ul>
          <li v-for="w in top" :key="w.i">
            <span class="mono wl">{{ tokens[w.i].trim() }}</span>
            <span class="wb"><span :style="{ width: `${(w.w / maxW) * 100}%` }" /></span>
          </li>
        </ul>
      </div>
      <div class="limits">
        <div>
          <h3><Status state="ok" compact label="This picture can show" /></h3>
          <p>Each word’s meaning is updated from a weighted mix of earlier words.</p>
        </div>
        <div>
          <h3><Status state="warn" compact label="It cannot show" /></h3>
          <p>Why a model answered as it did. Real models have many attention heads in many layers, and the weights alone do not explain an output.<Cite :k="['jain2019attention', 'wiegreffe2019attention']" /></p>
        </div>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.seg { display: inline-flex; margin-right: 8px; }
.seg .btn { border-radius: 0; font-family: var(--font-mono); padding: 6px 10px; white-space: nowrap; }
.seg .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.seg .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; border-left: 0; }
.ae { width: 100%; height: auto; display: block; overflow: visible; }
.arcs path { fill: none; stroke: var(--accent); stroke-linecap: round; }
.arc-enter-active { transition: opacity var(--dur) var(--ease); }
.arc-enter-from { opacity: 0 !important; }
.t { cursor: pointer; }
.t rect { fill: var(--surface); stroke: var(--rule-strong); stroke-width: 1.2; transition: fill var(--dur) var(--ease), stroke var(--dur) var(--ease), opacity var(--dur) var(--ease); }
.t text { font-family: var(--font-mono); fill: var(--ink); transition: fill var(--dur) var(--ease), opacity var(--dur) var(--ease); }
.t:hover rect { stroke: var(--ink-2); }
.t:focus-visible { outline: none; }
.t:focus-visible rect { stroke: var(--accent); stroke-width: 2; }
.t.src rect { fill: var(--accent-tint); stroke: var(--accent); }
.t.sel rect { fill: var(--accent); stroke: var(--accent); }
.t.sel text { fill: #fff; }
.t.later rect { fill: var(--stage); stroke-dasharray: 3 3; }
.t.later text { opacity: 0.4; }
.mask path { fill: none; stroke: var(--ink-3); stroke-width: 1.2; }
.mask-l { margin: 2px 0 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1; white-space: nowrap; text-align: right; }
.mask-l.off { visibility: hidden; }

.below { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; margin-top: 8px; }
.below h3 { font-size: var(--fs-label); margin: 0 0 6px; font-weight: 600; }
.draws ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.draws li { display: grid; grid-template-columns: 90px 1fr; align-items: center; gap: 8px; margin: 0; padding: 0; line-height: 1.25; }
.wl { font-size: 15px; }
.wb { height: 12px; background: var(--surface); border-radius: 2px; overflow: hidden; }
.wb span { display: block; height: 100%; background: var(--accent); transition: width var(--dur) var(--ease); }
.draws h3.ins { margin: 0 0 6px; font-size: var(--fs-label); line-height: 1.35; color: var(--ink); font-weight: 600; min-height: 2.7em; }
.limits { display: flex; flex-direction: column; gap: 6px; border-left: 1px solid var(--rule); padding-left: 20px; }
.limits h3 { margin: 0 0 3px; }
.limits h3 :deep(.txt) { font-weight: 600; }
.limits p { margin: 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink-2); }
</style>
