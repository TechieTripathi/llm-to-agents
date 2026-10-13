<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { AUDIENCES, FORMATS, LENGTHS, PRESETS, RULES } from '../data/s3/builder'
import type { AudienceKey, BuilderState, FormatKey, LengthKey, RuleKey } from '../data/s3/builder'

// Slide 20: selectable fields assemble the prompt and reshape the (simulated) deliverable.
// The clicker walks presets that each change one field; the buttons allow free exploration.
const MAX = PRESETS.length - 1
const { step, next, prev, reset } = useArtifactStep(MAX)

type Field = 'audience' | 'format' | 'length' | 'rules'
const s = reactive<BuilderState>({ ...PRESETS[0].state, rules: [...PRESETS[0].state.rules] })
const changed = ref<Field | null>(null)

watch(step, (n) => {
  const p = PRESETS[n]
  Object.assign(s, { ...p.state, rules: [...p.state.rules] })
  changed.value = p.changed
}, { immediate: true })

function setAudience(k: AudienceKey) { s.audience = k; changed.value = 'audience' }
function setFormat(k: FormatKey) { s.format = k; changed.value = 'format' }
function setLength(k: LengthKey) { s.length = k; changed.value = 'length' }
function toggleRule(k: RuleKey) {
  s.rules = s.rules.includes(k) ? s.rules.filter(r => r !== k) : [...s.rules, k]
  changed.value = 'rules'
}

const aud = computed(() => AUDIENCES.find(a => a.key === s.audience)!)
const fmt = computed(() => FORMATS.find(f => f.key === s.format)!)
const len = computed(() => LENGTHS.find(l => l.key === s.length)!)
const has = (k: RuleKey) => s.rules.includes(k)

const promptLines = computed(() => [
  { key: null, k: 'Task', v: 'draft the Project Lark week 41 update' },
  { key: 'audience', k: 'Audience', v: aud.value.prompt },
  { key: 'format', k: 'Format', v: fmt.value.prompt },
  { key: 'length', k: 'Length', v: len.value.prompt },
  { key: 'rules', k: 'Rules', v: RULES.filter(r => has(r.key)).map(r => r.prompt).join('; ') || 'none' },
])

const facts = computed(() => aud.value.facts.slice(0, len.value.facts).map(f => ({
  item: f.item,
  value: has('plain') ? (f.valuePlain ?? f.value) : f.value,
  say: has('plain') ? (f.sayPlain ?? f.say) : f.say,
  cite: has('cite') ? f.cite : '',
})))

const words = computed(() => {
  const parts: string[] = []
  if (s.format === 'email') parts.push(aud.value.subject, aud.value.greeting)
  for (const f of facts.value) parts.push(s.format === 'email' ? f.say : `${f.item} ${f.value}`)
  if (has('decision')) parts.push(aud.value.closing)
  return parts.join(' ').split(/\s+/).filter(Boolean).length
})
</script>

<template>
  <Stage task="Change a field; watch both panels." tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="MAX" :labels="PRESETS.map(p => p.label)" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="s3pb">
      <div class="fields">
        <div class="field" :class="{ hot: changed === 'audience' }">
          <span class="fl">Audience</span>
          <div class="seg">
            <button v-for="a in AUDIENCES" :key="a.key" class="btn" :aria-pressed="s.audience === a.key" @click="setAudience(a.key)">{{ a.button }}</button>
          </div>
        </div>
        <div class="field" :class="{ hot: changed === 'format' }">
          <span class="fl">Format</span>
          <div class="seg">
            <button v-for="f in FORMATS" :key="f.key" class="btn" :aria-pressed="s.format === f.key" @click="setFormat(f.key)">{{ f.button }}</button>
          </div>
        </div>
        <div class="field" :class="{ hot: changed === 'length' }">
          <span class="fl">Length</span>
          <div class="seg">
            <button v-for="l in LENGTHS" :key="l.key" class="btn" :aria-pressed="s.length === l.key" @click="setLength(l.key)">{{ l.button }}</button>
          </div>
        </div>
        <div class="field" :class="{ hot: changed === 'rules' }">
          <span class="fl">Rules</span>
          <div class="checks">
            <label v-for="r in RULES" :key="r.key" class="chk">
              <input type="checkbox" :checked="has(r.key)" @change="toggleRule(r.key)">
              <span>{{ r.button }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="prompt mono" aria-label="Assembled prompt">
          <div v-for="l in promptLines" :key="l.k" class="pline" :class="{ hot: l.key && l.key === changed }">
            <span class="k">{{ l.k }}:</span> {{ l.v }}
          </div>
        </div>

        <div class="draft">
          <div class="dh">
            <span>Draft · {{ aud.button.toLowerCase() }} · {{ fmt.button.toLowerCase() }}</span>
            <span class="wc">{{ words }} words</span>
          </div>
          <Transition name="fade" mode="out-in">
            <div :key="`${s.audience}-${s.format}-${s.length}-${s.rules.join()}`" class="dbody">
              <template v-if="s.format === 'brief'">
                <p class="title">{{ aud.subject }}</p>
                <ul>
                  <li v-for="f in facts" :key="f.item"><strong>{{ f.item }}:</strong> {{ f.value }}<span v-if="f.cite" class="cite"> [{{ f.cite }}]</span></li>
                </ul>
                <p v-if="has('decision')" class="ask">{{ aud.closing }}</p>
              </template>

              <template v-else-if="s.format === 'email'">
                <p class="subj"><span class="muted">Subject:</span> {{ aud.subject }}</p>
                <p>{{ aud.greeting }}</p>
                <p>
                  <template v-for="f in facts" :key="f.item">{{ f.say }}<span v-if="f.cite" class="cite"> [{{ f.cite }}]</span>{{ ' ' }}</template>
                </p>
                <p v-if="has('decision')" class="ask">{{ aud.closing }}</p>
              </template>

              <template v-else>
                <table>
                  <tbody>
                    <tr v-for="f in facts" :key="f.item">
                      <th>{{ f.item }}</th>
                      <td>{{ f.value }}<span v-if="f.cite" class="cite"> [{{ f.cite }}]</span></td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="has('decision')" class="ask">{{ aud.closing }}</p>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.s3pb { display: grid; grid-template-columns: 284px 1fr; gap: 18px; flex: 1 1 auto; min-height: 0; }
.fields { display: flex; flex-direction: column; gap: 8px; }
.field { display: flex; flex-direction: column; gap: 4px; padding: 4px 6px 6px; margin: 0 -6px; border-radius: var(--radius-sm); transition: background var(--dur) var(--ease); }
.field.hot { background: var(--accent-tint); }
.fl { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); }
.seg { display: flex; flex-wrap: wrap; gap: 4px; }
.seg .btn { padding: 7px 9px; }
.checks { display: flex; flex-direction: column; gap: 3px; }
.chk { display: flex; align-items: center; gap: 8px; font-size: var(--fs-label); cursor: pointer; }
.chk input { width: 16px; height: 16px; accent-color: var(--accent); margin: 0; cursor: pointer; }

.right { display: flex; flex-direction: column; gap: 8px; min-width: 0; min-height: 0; }
.prompt {
  background: var(--surface);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  padding: 6px 0;
  font-size: var(--fs-label);
  line-height: 1.3;
}
.pline { padding: 2px 12px 2px calc(12px + 1.2em); text-indent: -1.2em; border-left: 3px solid transparent; transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.pline.hot { background: var(--accent-tint); border-left-color: var(--accent); }
.k { color: var(--accent); font-weight: 600; }

.draft { flex: 1 1 auto; min-height: 0; background: var(--paper); border: 1px solid var(--rule); border-radius: var(--radius); padding: 7px 12px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.dh { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: var(--ink-3); }
.wc { font-weight: 500; font-variant-numeric: tabular-nums; }
.dbody { font-size: var(--fs-label); line-height: 1.3; }
.dbody p { margin: 0 0 4px; }
.dbody ul { margin: 0 0 4px; padding-left: 1.1em; }
.dbody li { margin: 0 0 2px; }
.title { font-weight: 600; }
.subj { font-weight: 500; }
.ask { font-weight: 600; color: var(--ink); }
.cite { color: var(--accent); font-size: 14px; }
.dbody table { font-size: var(--fs-label); margin-bottom: 4px; }
.dbody th { border-bottom: 1px solid var(--rule); font-weight: 600; width: 26%; padding: 3px 8px 3px 0; vertical-align: top; }
.dbody td { padding: 3px 0; }
.fade-enter-active, .fade-leave-active { transition: opacity calc(var(--dur) * 0.6) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
