<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'

// Artifact H — productivity calculator (spec §8 H). Formulas:
//   AI-assisted total = AI execution + review + correction/rework
//   Net time saved    = baseline − AI-assisted total
//   % saved           = net saved / baseline × 100   (only when baseline > 0)
// Clicker: step 0 = "Good fit" preset, step 1 = "Poor fit" preset. Sliders override.
// All values are illustrative, not measured.
type Inputs = { baseline: number, ai: number, review: number, rework: number, freq: number }
const PRESETS: { id: string, label: string, v: Inputs }[] = [
  { id: 'good', label: 'Good fit', v: { baseline: 60, ai: 5, review: 12, rework: 5, freq: 20 } },
  { id: 'poor', label: 'Poor fit', v: { baseline: 30, ai: 4, review: 15, rework: 20, freq: 20 } },
]
const { step, go } = useArtifactStep(1)

const v = reactive<Inputs>({ ...PRESETS[0].v })
watch(step, s => Object.assign(v, PRESETS[s].v), { immediate: true })
const activePreset = computed(() => PRESETS.find(p => (Object.keys(p.v) as (keyof Inputs)[]).every(k => p.v[k] === v[k]))?.id)

const FIELDS: { k: keyof Inputs, label: string, max: number, unit: string, seg?: 'ai' | 'review' | 'rework' | 's6-base' }[] = [
  { k: 'baseline', label: 'Without AI (baseline)', max: 120, unit: 'min', seg: 's6-base' },
  { k: 'ai', label: 'AI execution', max: 60, unit: 'min', seg: 'ai' },
  { k: 'review', label: 'Human review', max: 60, unit: 'min', seg: 'review' },
  { k: 'rework', label: 'Correction / rework', max: 60, unit: 'min', seg: 'rework' },
  { k: 'freq', label: 'Times per month', max: 60, unit: '×' },
]

const withAi = computed(() => v.ai + v.review + v.rework)
const saved = computed(() => v.baseline - withAi.value)
const pct = computed(() => (v.baseline > 0 ? (saved.value / v.baseline) * 100 : null))
const monthlyH = computed(() => (saved.value * v.freq) / 60)
const scale = computed(() => Math.max(v.baseline, withAi.value, 1))
const w = (m: number) => `${(m / scale.value) * 100}%`
const sign = (n: number, d = 0) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(d)}`
const verdict = computed(() => (saved.value > 0 ? 'ok' : saved.value < 0 ? 'bad' : 'neutral'))
</script>

<template>
  <Stage task="Drag a slider or pick a preset" tag="illustrative">
    <template #controls>
      <div class="presets" role="group" aria-label="Presets">
        <button
          v-for="(p, i) in PRESETS" :key="p.id" class="btn"
          :aria-pressed="activePreset === p.id" @click.stop="go(i); Object.assign(v, p.v)"
        >{{ p.label }}</button>
      </div>
    </template>

    <div class="calc-wrap">
    <div class="calc">
      <!-- inputs -->
      <div class="inputs">
        <label v-for="f in FIELDS" :key="f.k" class="s6-row">
          <span class="lab"><i v-if="f.seg" class="sw" :class="f.seg" aria-hidden="true" />{{ f.label }}</span>
          <input v-model.number="v[f.k]" type="range" min="0" :max="f.max" step="1" :aria-label="f.label" @click.stop @keydown.stop>
          <span class="val"><strong>{{ v[f.k] }}</strong> {{ f.unit }}</span>
        </label>
      </div>

      <!-- bars on one time scale -->
      <div class="bars" aria-label="Time per task">
        <div class="bar-row">
          <span class="bl">Without AI</span>
          <div class="track"><div class="seg s6-base" :style="{ width: w(v.baseline) }" /></div>
          <span class="bt">{{ v.baseline }} min</span>
        </div>
        <div class="bar-row">
          <span class="bl">With AI</span>
          <div class="track">
            <div class="seg ai" :style="{ width: w(v.ai) }" />
            <div class="seg review" :style="{ width: w(v.review) }" />
            <div class="seg rework" :style="{ width: w(v.rework) }" />
            <div class="mark" :style="{ left: w(v.baseline) }" aria-hidden="true" />
          </div>
          <span class="bt">{{ withAi }} min</span>
        </div>
        <div class="fline">
          <p class="formula mono">{{ v.ai }} + {{ v.review }} + {{ v.rework }} = {{ withAi }} min with AI</p>
          <Status :state="verdict" :label="saved > 0 ? 'Net gain' : saved < 0 ? 'Net loss' : 'No net change'" />
        </div>
      </div>

      <!-- results -->
      <div class="results" :class="verdict">
        <div class="r">
          <span class="rk">{{ saved >= 0 ? 'Saved per task' : 'Lost per task' }}</span>
          <span class="rv">{{ sign(saved) }} min</span>
        </div>
        <div class="r">
          <span class="rk">Change vs baseline</span>
          <span class="rv">{{ pct === null ? 'n/a' : `${sign(pct)}%` }}</span>
        </div>
        <div class="r">
          <span class="rk">Per month ({{ v.freq }}×)</span>
          <span class="rv">{{ sign(monthlyH, 1) }} h</span>
        </div>
      </div>
    </div>
    <slot name="aside" />
    </div>

    <template #notice>
      Fast drafts pay off only if review and rework stay small — and time saved is not quality.
    </template>
  </Stage>
</template>

<style scoped>
.presets { display: inline-flex; gap: 6px; }
.calc-wrap { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1fr 360px; gap: 18px; }
.calc { min-height: 0; min-width: 0; display: flex; flex-direction: column; gap: 8px; }

.inputs { display: flex; flex-direction: column; gap: 2px; }
.s6-row { display: grid; grid-template-columns: 178px 1fr 58px; align-items: center; gap: 10px; min-height: 24px; cursor: pointer; }
.lab { font-size: var(--fs-label); color: var(--ink); display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; }
.val { font-size: var(--fs-label); color: var(--ink-2); text-align: right; font-variant-numeric: tabular-nums; }
.val strong { color: var(--ink); }
.sw { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

input[type='range'] { width: 100%; accent-color: var(--accent); height: 20px; margin: 0; }

.bars { display: flex; flex-direction: column; gap: 5px; padding-top: 4px; border-top: 1px solid var(--rule); }
.bar-row { display: grid; grid-template-columns: 86px 1fr 64px; align-items: center; gap: 10px; }
.bl { font-size: var(--fs-label); color: var(--ink-2); }
.bt { font-size: var(--fs-label); font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
.track { position: relative; height: 20px; display: flex; }
.seg { height: 100%; transition: width var(--dur) var(--ease); }
.s6-base, .sw.s6-base { background: var(--ink-2); }
.ai, .sw.ai { background: var(--accent); }
.review, .sw.review { background: var(--accent-tint-2); box-shadow: inset 0 0 0 1.5px var(--accent); }
.rework, .sw.rework { background: var(--warn-tint); box-shadow: inset 0 0 0 1.5px var(--warn); }
.mark { position: absolute; top: -27px; bottom: -3px; width: 0; border-left: 1.5px dashed var(--ink); transition: left var(--dur) var(--ease); }
.fline { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-left: 96px; }
.formula { margin: 0; font-size: 15px; color: var(--ink-2); }

.results { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 6px; border-top: 1px solid var(--rule); }
.r { display: flex; flex-direction: column; gap: 1px; white-space: nowrap; }
.rk { font-size: 14px; color: var(--ink-2); }
.rv { font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; line-height: 1.1; transition: color var(--dur) var(--ease); }
.results.ok .rv { color: var(--ok); }
.results.bad .rv { color: var(--bad); }
</style>
