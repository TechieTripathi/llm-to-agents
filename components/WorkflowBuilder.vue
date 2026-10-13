<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { PRESETS, STAGES, type StageId, type Who, warningsFor } from '../data/s5/workflow'

// Slide 45 — Artifact I. Clicks walk each stage, then remove safeguards. Cards are editable:
// select a stage, remove or restore it, or change who does it. Warnings explain what each change risks.
const { step } = useArtifactStep(PRESETS.length - 1)

const defaultWho = Object.fromEntries(STAGES.map(s => [s.id, s.who])) as Record<StageId, Who>
const selected = ref<StageId>('request')
const off = ref<StageId[]>([])
const who = ref<Record<StageId, Who>>({ ...defaultWho })

function applyPreset(i: number) {
  const p = PRESETS[i]
  selected.value = p.selected
  off.value = [...p.off]
  who.value = { ...defaultWho, ...(p.who ?? {}) }
}
watch(step, applyPreset, { immediate: true })

const sel = computed(() => STAGES.find(s => s.id === selected.value)!)
const isOff = (id: StageId) => off.value.includes(id)
function toggle(id: StageId) {
  selected.value = id
  off.value = isOff(id) ? off.value.filter(x => x !== id) : [...off.value, id]
}
function setWho(id: StageId, w: Who) { who.value = { ...who.value, [id]: w } }

const warnings = computed(() => warningsFor(off.value, who.value))
const safeguards = computed(() => {
  let n = 0
  if (!isOff('validate')) n++
  if (!isOff('approve') && who.value.approve === 'person') n++
  return n
})
const counts = computed(() => {
  const active = STAGES.filter(s => !isOff(s.id))
  return { agent: active.filter(s => who.value[s.id] === 'agent').length, person: active.filter(s => who.value[s.id] === 'person').length }
})
</script>

<template>
  <Stage task="Select a stage. Remove a safeguard and read the warning." tag="fictional" notice="Safeguards are stages with owners, inputs and failure rules, not a setting you switch on at the end.">
    <div class="wb">
      <ol class="pipe">
        <li
          v-for="(s, i) in STAGES" :key="s.id" class="stg"
          :class="{ sel: selected === s.id, off: isOff(s.id), person: who[s.id] === 'person' }"
        >
          <div class="stg-main" role="button" tabindex="0" :aria-pressed="selected === s.id" @click.stop="selected = s.id" @keydown.enter.stop="selected = s.id">
            <span class="stg-top">
              <span class="stg-n">{{ i + 1 }}</span>
              <button v-if="s.removable" class="rm" @click.stop="toggle(s.id)">{{ isOff(s.id) ? 'Restore' : 'Remove' }}</button>
              <span v-else class="rm-none">Required</span>
            </span>
            <span class="stg-name">{{ s.name }}</span>
            <span class="who" :class="who[s.id]">
              <svg v-if="who[s.id] === 'person'" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="4.2" r="2.8" fill="currentColor" /><path d="M1.5 13.5c0-3.2 2.4-5 5.5-5s5.5 1.8 5.5 5z" fill="currentColor" /></svg>
              <svg v-else width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M11.5 7a4.5 4.5 0 1 1-1.3-3.2" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="M10.6 1.2v3.2H7.4" fill="none" stroke="currentColor" stroke-width="1.8" /></svg>
              {{ isOff(s.id) ? 'Removed' : who[s.id] === 'person' ? 'Person' : 'Automated' }}
            </span>
          </div>
          <svg v-if="i < STAGES.length - 1" class="arrow" width="14" height="12" viewBox="0 0 14 12" aria-hidden="true"><path d="M0 6h11M8 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
        </li>
      </ol>

      <div class="lower">
        <Transition name="swap" mode="out-in">
          <section :key="sel.id + isOff(sel.id) + who[sel.id]" class="detail" :class="{ off: isOff(sel.id) }">
            <div class="d-h">
              <span class="d-name">{{ sel.name }}</span>
              <div v-if="sel.whoEditable && !isOff(sel.id)" class="seg" role="group" :aria-label="`Who does ${sel.name}`">
                <button class="btn" :aria-pressed="who[sel.id] === 'agent'" @click.stop="setWho(sel.id, 'agent')">Agent does it</button>
                <button class="btn" :aria-pressed="who[sel.id] === 'person'" @click.stop="setWho(sel.id, 'person')">Person does it</button>
              </div>
              <Status v-else-if="isOff(sel.id)" state="bad" label="Removed from the workflow" />
            </div>
            <dl class="kv">
              <dt>Needs</dt><dd>{{ sel.inputs }}</dd>
              <dt>Produces</dt><dd>{{ sel.output }}</dd>
              <dt>Fails when</dt><dd>{{ sel.fails }}</dd>
            </dl>
          </section>
        </Transition>

        <aside class="checks">
          <div class="sum">
            <Status :state="safeguards === 2 ? 'ok' : 'bad'" :label="`Safeguards ${safeguards} of 2`" />
            <span class="cnt">{{ counts.agent }} automated · {{ counts.person }} by a person</span>
          </div>
          <TransitionGroup name="ln" tag="ul" class="warns">
            <li v-if="!warnings.length" key="ok" class="warn-item ok">Validation and a human decision both stand before delivery.</li>
            <li v-for="w in warnings" :key="w.text" class="warn-item" :class="w.tone">{{ w.text }}</li>
          </TransitionGroup>
        </aside>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.wb { display: flex; flex-direction: column; gap: 12px; flex: 1 1 auto; min-height: 0; }
.pipe { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
.stg { position: relative; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.stg-main { font: inherit; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px 9px; background: var(--surface); border: 1.5px solid var(--rule-strong); border-radius: var(--radius-sm); min-height: 118px; height: 100%; color: var(--ink); transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease), opacity var(--dur) var(--ease); }
.stg.sel .stg-main { border-color: var(--accent); box-shadow: inset 0 -3px 0 var(--accent); }
.stg.off .stg-main { border-style: dashed; background: transparent; }
.stg.off .stg-name { text-decoration: line-through; color: var(--ink-3); }
.stg-n { font-size: 14px; font-weight: 600; color: var(--ink-3); }
.stg-name { font-size: var(--fs-label); font-weight: 600; line-height: 1.22; flex: 1; }
.rm-none { font-size: 14px; color: var(--ink-3); }
.stg-top { display: flex; justify-content: space-between; align-items: center; height: 28px; }
.who { display: inline-flex; align-items: center; gap: 5px; font-size: 14px; font-weight: 500; color: var(--accent); }
.who.person { color: var(--ink); }
.stg.off .who { color: var(--bad); }
.rm { font: 500 14px var(--font-sans); color: var(--ink-2); background: transparent; border: 1px solid var(--rule-strong); border-radius: var(--radius-sm); padding: 3px 6px; cursor: pointer; }
.rm:hover { border-color: var(--ink-2); }
.stg.off .rm { color: var(--accent); border-color: var(--accent); }
.arrow { position: absolute; right: -14px; top: 53px; color: var(--ink-3); }

.lower { display: grid; grid-template-columns: 1.15fr 1fr; gap: 16px; align-items: stretch; }
.detail { background: var(--surface); border: 1px solid var(--rule); border-top: 3px solid var(--accent); border-radius: var(--radius-sm); padding: 8px 14px 10px; display: flex; flex-direction: column; gap: 6px; }
.detail.off { border-top-color: var(--bad); }
.d-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.d-name { font-size: var(--fs-small); font-weight: 600; }
.seg { display: inline-flex; gap: 0; }
.seg .btn { padding: 5px 9px; font-size: 14px; border-radius: 0; }
.seg .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.seg .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-left: -1px; }
.kv { margin: 0; display: grid; grid-template-columns: 92px 1fr; gap: 3px 10px; font-size: var(--fs-label); line-height: 1.3; }
.kv dt { color: var(--ink-3); font-weight: 500; }
.kv dd { margin: 0; color: var(--ink); }
.detail.off .kv dd { color: var(--ink-3); }
.checks { display: flex; flex-direction: column; gap: 8px; }
.sum { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.cnt { font-size: 14px; color: var(--ink-2); }
.warns { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.warn-item { margin: 0; font-size: 15px; line-height: 1.3; padding: 3px 10px; border-left: 3px solid; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.warn-item.bad { border-color: var(--bad); background: var(--bad-tint); }
.warn-item.warn { border-color: var(--warn); background: var(--warn-tint); }
.warn-item.ok { border-color: var(--ok); background: var(--ok-tint); }
.swap-enter-active, .swap-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.swap-enter-from, .swap-leave-to { opacity: 0; }
.ln-enter-active, .ln-leave-active { transition: opacity var(--dur) var(--ease); }
.ln-enter-from, .ln-leave-to { opacity: 0; }
</style>
