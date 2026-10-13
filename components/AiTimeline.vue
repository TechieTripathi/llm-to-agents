<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { BANDS, ERAS, RULER } from '../data/s1/timeline'

// Slide 3 (required artifact: AI evolution timeline).
// Top: a true-scale ruler of years. Fan lines connect each era's real date to an evenly spaced column,
// so the audience sees how compressed recent history is. Step 0 = overview; steps 1–8 select an era.
const { step, go, next, prev, reset, max } = useArtifactStep(ERAS.length)
const sel = computed(() => (step.value > 0 ? ERAS[step.value - 1] : null))

const pct = (year: number) => ((year - RULER.from) / (RULER.to - RULER.from)) * 100
const colX = (i: number) => ((i + 0.5) / ERAS.length) * 100
const ticks = [1950, 1970, 1990, 2010]

// Band spans in column units: [startIndex, endIndex]
const bandSpans = computed(() => BANDS.map((label, b) => {
  const idx = ERAS.map((e, i) => (e.band === b ? i : -1)).filter(i => i >= 0)
  return { label, b, from: idx[0], to: idx[idx.length - 1] }
}))
const labels = ['Overview', ...ERAS.map(e => e.name)]
</script>

<template>
  <Stage task="Select an era, or step through with the clicker" :tag="false" notice="On a true time scale, six of these eight shifts crowd into the last fourteen years.">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="tl">
      <!-- true-scale ruler -->
      <div class="ruler">
        <div class="axis" />
        <span v-for="t in ticks" :key="t" class="tick" :style="{ left: pct(t) + '%' }">{{ t }}</span>
        <span class="tick today" :style="{ left: '100%' }">2026</span>
        <span
          v-for="(e, i) in ERAS" :key="e.id" class="dot"
          :class="{ on: sel?.id === e.id }" :style="{ left: pct(e.at) + '%' }"
        />
      </div>

      <!-- fan: real date → evenly spaced column -->
      <svg class="fan" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <path
          v-for="(e, i) in ERAS" :key="e.id"
          :d="`M${pct(e.at)} 0 C${pct(e.at)} 16 ${colX(i)} 14 ${colX(i)} 30`"
          :class="{ on: sel?.id === e.id }"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <!-- era columns -->
      <div class="eras" role="tablist" aria-label="Eras of AI">
        <button
          v-for="(e, i) in ERAS" :key="e.id"
          class="era" role="tab" :aria-selected="sel?.id === e.id"
          :class="{ on: sel?.id === e.id, past: step > i + 1 }"
          @click.stop="go(i + 1)"
        >
          <span class="yr">{{ e.year }}</span>
          <span class="nm">{{ e.name }}</span>
        </button>
      </div>

      <!-- how the system gets its knowledge -->
      <div class="bands">
        <div
          v-for="s in bandSpans" :key="s.b" class="band"
          :class="{ on: sel && sel.band === s.b }"
          :style="{ gridColumn: `${s.from + 1} / ${s.to + 2}` }"
        >
          <span class="bl">{{ s.label }}</span>
        </div>
      </div>

      <!-- detail -->
      <div class="detail">
        <Transition name="swap" mode="out-in">
          <div v-if="sel" :key="sel.id" class="d-era">
            <div class="d-head">
              <span class="d-yr">{{ sel.year }}</span>
              <span class="d-nm">{{ sel.name }}</span>
            </div>
            <dl class="d-body">
              <dt>What changed</dt>
              <dd>{{ sel.changed }}</dd>
              <dt>At work</dt>
              <dd>{{ sel.work }}</dd>
              <dt class="ev">Evidence</dt>
              <dd class="ev">{{ sel.evidence }}<Cite :k="sel.refs" /></dd>
            </dl>
          </div>
          <div v-else key="overview" class="d-over">
            <p class="ov-lead">Seventy years of AI, read as one question:<br><strong>where does the system’s knowledge come from?</strong></p>
            <p class="ov-hint">Rules people write → patterns learned from examples → one large pre-trained model steered by language → connected to your data and tools.</p>
          </div>
        </Transition>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.tl { display: flex; flex-direction: column; justify-content: center; flex: 1 1 auto; min-height: 0; padding: 0 6px; }

.ruler { position: relative; height: 30px; margin: 0 14px 0 0; }
.axis { position: absolute; left: 0; right: 0; top: 24px; border-top: 1.5px solid var(--ink-3); }
.tick {
  position: absolute; top: 0; transform: translateX(-50%);
  font-size: 14px; color: var(--ink-3); font-variant-numeric: tabular-nums;
}
.tick::before { content: ''; position: absolute; left: 50%; top: 19px; height: 5px; border-left: 1.5px solid var(--ink-3); }
.tick.today { color: var(--ink-2); }
.dot {
  position: absolute; top: 20px; width: 9px; height: 9px; margin-left: -4.5px;
  border-radius: 50%; background: var(--stage); border: 1.5px solid var(--ink);
  transition: background var(--dur) var(--ease), transform var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.dot.on { background: var(--accent); border-color: var(--accent); transform: scale(1.35); z-index: 2; }

.fan { width: calc(100% - 14px); height: 24px; display: block; overflow: visible; }
.fan path { fill: none; stroke: var(--rule-strong); stroke-width: 1.2; transition: stroke var(--dur) var(--ease); }
.fan path.on { stroke: var(--accent); stroke-width: 2; }

.eras { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; margin-right: 14px; }
.era {
  font: inherit; text-align: left; cursor: pointer;
  display: flex; flex-direction: column; gap: 3px;
  padding: 6px 8px 7px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-top: 3px solid var(--rule-strong);
  border-radius: var(--radius-sm);
  color: var(--ink);
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.era:hover { border-top-color: var(--ink-2); }
.era:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.era.past { border-top-color: var(--ink); }
.era.on { border-color: var(--accent); border-top-color: var(--accent); background: var(--accent-tint); }
.yr { font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; white-space: nowrap; }
.era.on .yr { color: var(--accent); }
.nm { font-size: var(--fs-label); line-height: 1.2; color: var(--ink-2); }
.era.on .nm { color: var(--ink); }

.bands { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; margin: 6px 14px 0 0; }
.band {
  border-top: 1.5px solid var(--rule-strong);
  padding-top: 3px;
  text-align: center;
  position: relative;
  transition: border-color var(--dur) var(--ease);
}
.band::before, .band::after { content: ''; position: absolute; top: -6px; height: 5px; border-left: 1.5px solid var(--rule-strong); }
.band::before { left: 0; }
.band::after { right: 0; }
.bl { font-size: 14px; color: var(--ink-3); line-height: 1.15; display: block; white-space: nowrap; }
.band.on { border-top-color: var(--accent); }
.band.on::before, .band.on::after { border-color: var(--accent); }
.band.on .bl { color: var(--accent); font-weight: 500; }

.detail {
  flex: 0 0 auto; min-height: 104px;
  margin: 12px 14px 0 0;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 9px 14px;
  overflow: hidden;
}
.d-era { display: grid; grid-template-columns: 118px 1fr; gap: 14px; }
.d-head { display: flex; flex-direction: column; gap: 4px; border-right: 1px solid var(--rule); padding-right: 12px; }
.d-yr { font-size: 28px; font-weight: 600; color: var(--accent); letter-spacing: -0.02em; line-height: 1; font-variant-numeric: tabular-nums; }
.d-nm { font-size: var(--fs-label); font-weight: 500; line-height: 1.25; }
.d-body { display: grid; grid-template-columns: 112px 1fr; column-gap: 10px; row-gap: 3px; margin: 0; }
.d-body dt { font-size: var(--fs-label); color: var(--ink-2); padding-top: 2px; }
.d-body dd { margin: 0; font-size: 15px; line-height: 1.28; }
.d-body .ev { font-size: 15px; color: var(--ink-3); }
.d-body dd.ev { color: var(--ink-2); }

.d-over { display: flex; flex-direction: column; gap: 8px; }
.ov-lead { margin: 0; font-size: 20px; line-height: 1.35; }
.ov-lead strong { color: var(--accent); font-weight: 600; }
.ov-hint { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.4; }

.swap-enter-active, .swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(4px); }
.swap-leave-to { opacity: 0; }
</style>
