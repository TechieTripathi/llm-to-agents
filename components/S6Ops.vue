<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { OPS } from '../data/s6/examples'

// Slide 50 — Operations: messy shift-log notes become a numbered SOP draft; the process owner
// adds the missing safety step. Visual form: raw notes → ordered procedure, each step traced to a note.
const { step, next, prev, reset } = useArtifactStep(2)
const sop = computed(() => OPS.sop.filter(s => step.value === 2 || !s.added))
</script>

<template>
  <S6DeptCase :step="step" owner="Tomás Ruiz (Operations)" :checks="OPS.checks" @prev="prev" @next="next" @reset="reset">
    <div class="g">
      <S6Panel title="Shift log, Depot 4" note="night of 2 Oct" kind="source">
        <ol class="notes">
          <li v-for="n in OPS.notes" :key="n.t">
            <span class="t">{{ n.t }}</span><span class="nt">{{ n.text }}</span>
          </li>
        </ol>
      </S6Panel>

      <svg class="arrow" width="30" height="24" viewBox="0 0 34 24" aria-hidden="true"><path d="M2 12h28M23 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>

      <Transition name="swap" mode="out-in">
        <S6Panel v-if="step === 0" key="p" title="Instruction to the assistant">
          <pre class="prompt">{{ OPS.prompt }}</pre>
        </S6Panel>
        <S6Panel v-else key="d" title="SOP draft: dock door fails to close" kind="draft">
          <TransitionGroup tag="ol" name="ins" class="sop">
            <li v-for="(s, i) in sop" :key="s.text" :class="[step === 2 && s.flag ? s.flag.state : '', { added: s.added }]">
              <span class="no">{{ i + 1 }}</span>
              <span class="st">
                {{ s.text }}
                <Status v-if="step === 2 && s.flag" :state="s.flag.state" :label="s.flag.label" class="fs" />
              </span>
              <span class="from mono">{{ s.from ?? 'new' }}</span>
            </li>
          </TransitionGroup>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.g { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 262px 28px 1fr; gap: 8px; align-items: stretch; }
.arrow { align-self: center; color: var(--ink-3); }
.notes { list-style: none; margin: 0; padding: 0; font: 400 15px/1.35 var(--font-mono); }
.notes li { display: grid; grid-template-columns: 52px 1fr; gap: 6px; margin: 0; padding: 7px 0; border-bottom: 1px dashed var(--rule-strong); }
.notes li:last-child { border-bottom: 0; }
.t { color: var(--ink-2); }
.nt { color: var(--ink); }

.prompt { margin: 0; font: 400 var(--fs-label)/1.5 var(--font-mono); white-space: pre-wrap; color: var(--ink); }

.sop { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.sop li {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: start;
  column-gap: 8px;
  margin: 0;
  padding: 4px 6px;
  line-height: 1.3;
  border-bottom: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  transition: background var(--dur) var(--ease);
}
.no { font-weight: 600; color: var(--accent); font-variant-numeric: tabular-nums; text-align: right; }
.st { color: var(--ink); }
.fs { display: flex; width: fit-content; margin: 2px 0 1px -4px; font-size: 14px; padding: 1px 7px 1px 4px; background: transparent !important; }
.from { font-size: 14px; color: var(--ink-3); padding-top: 2px; }
.sop li.warn { background: var(--warn-tint); }
.sop li.bad { background: var(--bad-tint); }
.sop li.ok.added { background: var(--ok-tint); }
.added .from { color: var(--ok); font-weight: 600; }

.ins-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.ins-enter-from { opacity: 0; transform: translateX(-10px); }
.ins-move { transition: transform var(--dur) var(--ease); }

.swap-enter-active, .swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to { opacity: 0; }
</style>
