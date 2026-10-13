<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ENCODINGS, TOKEN_PRESETS } from '../data/s2/tokenizer'
import { type EncId, countTokens, tokenize } from '../data/s2/tokenize'

// Slide 8 — REAL OpenAI tokenizers (GPT-4o, GPT-4, GPT-3 via gpt-tokenizer) running in the page.
const presetId = ref<string>('email')
const text = ref(TOKEN_PRESETS[0].text)
const enc = ref<EncId>('o200k')

const preset = computed(() => TOKEN_PRESETS.find(p => p.id === presetId.value))
const pieces = computed(() => tokenize(text.value, enc.value))
const encInfo = computed(() => ENCODINGS.find(e => e.id === enc.value)!)
// Same text through every tokenizer, so older and newer generations can be compared at a glance.
const counts = computed(() => ENCODINGS.map(e => ({ id: e.id, short: e.short, n: countTokens(text.value, e.id) })))

const seg = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null
const chars = computed(() => (seg ? [...seg.segment(text.value)].length : [...text.value].length))
const words = computed(() => text.value.trim() ? text.value.trim().split(/\s+/).length : 0)

function choose(id: string) {
  presetId.value = id
  text.value = TOKEN_PRESETS.find(p => p.id === id)!.text
}
function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value
  presetId.value = TOKEN_PRESETS.find(p => p.text === text.value)?.id ?? 'custom'
}
// The clicker walks through the five presets (so the PDF shows each one); buttons still work.
const { step } = useArtifactStep(TOKEN_PRESETS.length - 1)
watch(step, s => choose(TOKEN_PRESETS[s].id), { immediate: true })

const shown = (t: string) => t.replace(/^ /, '').replace(/\n/g, '↵').replace(/ /g, '·')
</script>

<template>
  <Stage task="Pick an example, or type your own text" :tag="false">
    <template #controls>
      <span class="live">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="currentColor" /></svg>
        Real tokenizer, running live in this page
      </span>
    </template>

    <div class="tk">
      <div class="tk-toolbar">
        <div class="presets" role="group" aria-label="Example texts">
          <button v-for="p in TOKEN_PRESETS" :key="p.id" class="btn" :aria-pressed="presetId === p.id" @click.stop="choose(p.id)">{{ p.label }}</button>
        </div>
      </div>

      <div class="tk-input">
        <label class="field">
          <span class="sr">Text to tokenize</span>
          <input class="mono" :value="text" maxlength="90" spellcheck="false" @input="onInput" @keydown.stop>
        </label>
        <div class="enc">
          <span class="enc-l">Tokenizer</span>
          <div class="seg" role="group" aria-label="Tokenizer">
            <button v-for="e in ENCODINGS" :key="e.id" class="btn" :aria-pressed="enc === e.id" @click.stop="enc = e.id">
              <span class="m">{{ e.models }}</span>
              <span class="e">{{ e.enc }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="chips" aria-live="polite">
        <TransitionGroup name="chip">
          <span v-for="(p, i) in pieces" :key="`${enc}-${i}-${p.id}`" class="chip" :class="{ alt: i % 2 === 1, part: p.partial }">
            <span class="ct mono"><span v-if="p.text.startsWith(' ')" class="sp">·</span>{{ p.partial ? 'byte' : shown(p.text) }}</span>
            <span class="cid mono">{{ p.id }}</span>
          </span>
        </TransitionGroup>
      </div>

      <div class="foot">
        <dl class="stats">
          <div><dt>Characters</dt><dd>{{ chars }}</dd></div>
          <div><dt>Words</dt><dd>{{ words }}</dd></div>
          <div class="tok"><dt>Tokens</dt><dd>{{ pieces.length }}</dd></div>
        </dl>
        <div class="explain">
          <p class="why">{{ preset?.why ?? 'Your own text: watch where the boundaries fall. They rarely match words exactly.' }}</p>
          <p class="cmp">
            Same text:
            <template v-for="(c, i) in counts" :key="c.id">
              <span :class="{ cur: c.id === enc }">{{ c.short }} <strong>{{ c.n }}</strong></span><span v-if="i < counts.length - 1" class="dot"> · </span>
            </template>
            tokens
          </p>
        </div>
      </div>
    </div>

    <template #notice>
      <span>{{ encInfo.models }} tokenizer (<span class="mono">{{ encInfo.enc }}</span>): {{ encInfo.note }}.<Cite :k="['s2tiktoken', 's2gpttokenizer']" /> Claude, Gemini and Llama use their own tokenizers.</span>
    </template>
  </Stage>
</template>

<style scoped>
.tk { display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 0; }
.live {
  display: inline-flex; align-items: center; gap: 6px;
  font: 500 var(--fs-label)/1 var(--font-sans); color: var(--ok);
  background: var(--ok-tint); border-radius: 999px; padding: 5px 10px 5px 8px;
}
.tk-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.tk-input { display: flex; align-items: center; gap: 10px; }
.tk-input .field { flex: 1 1 auto; min-width: 0; }
.presets { display: flex; gap: 6px; }
.presets .btn { padding: 6px 11px; }
.field input {
  width: 100%; box-sizing: border-box; font-size: 13.5px; padding: 6px 10px;
  border: 1.5px solid var(--rule-strong); border-radius: var(--radius-sm); background: var(--surface); color: var(--ink);
}
.field input:focus { outline: 2px solid var(--accent); outline-offset: 1px; border-color: var(--accent); }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.chips {
  display: flex; flex-wrap: wrap; gap: 4px 3px; align-content: flex-start;
  background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius);
  padding: 8px 10px; flex: 1; min-height: 0; overflow: hidden;
}
.chip {
  display: inline-flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 3px 5px 2px; border-radius: var(--radius-sm);
  background: var(--accent-tint); border-bottom: 2px solid var(--accent);
}
.chip.alt { background: var(--stage); border-bottom-color: var(--ink-3); }
.chip.part { background: transparent; border: 1px dashed var(--rule-strong); border-bottom-width: 2px; }
.chip.part .ct { color: var(--ink-3); font-style: italic; }
.ct { font-size: 15px; line-height: 1.15; white-space: pre; color: var(--ink); }
.sp { color: var(--ink-3); margin-right: 1px; }
.cid { font-size: 14px; line-height: 1.1; color: var(--ink-2); font-variant-numeric: tabular-nums; }
.foot { display: grid; grid-template-columns: auto 1fr; gap: 22px; align-items: center; }
.stats { display: flex; gap: 16px; margin: 0; }
.stats div { display: flex; flex-direction: column; }
.stats dt { font-size: var(--fs-label); color: var(--ink-2); line-height: 1.1; }
.stats dd { margin: 0; font-size: 32px; font-weight: 600; line-height: 1.05; font-variant-numeric: tabular-nums; }
.stats .tok dd { color: var(--accent); }
.explain { display: flex; flex-direction: column; gap: 2px; }
.why { margin: 0; font-size: var(--fs-label); line-height: 1.3; color: var(--ink); }
.enc { display: flex; align-items: center; gap: 8px; }
.enc-l { font-size: var(--fs-label); color: var(--ink-2); }
.seg { display: inline-flex; }
.seg .btn { border-radius: 0; padding: 4px 11px; display: inline-flex; flex-direction: column; align-items: center; gap: 1px; line-height: 1.15; }
.seg .btn .m { font: 600 13px/1.15 var(--font-sans); }
.seg .btn .e { font: 400 10.5px/1.15 var(--font-mono); opacity: 0.75; }
.seg .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.seg .btn + .btn { border-left: 0; }
.seg .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.cmp { margin: 0; font-size: var(--fs-label); color: var(--ink-2); }
.cmp strong { color: var(--ink); }
.cmp .cur { color: var(--accent); }
.cmp .cur strong { color: var(--accent); }
.cmp .dot { color: var(--ink-3); }
.muted { color: var(--ink-2); }
.chip-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.chip-enter-from { opacity: 0; transform: translateY(4px); }
</style>
