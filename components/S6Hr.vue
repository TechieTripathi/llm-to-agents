<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { HR } from '../data/s6/examples'

// Slide 47 — HR: onboarding checklist drafted only from approved policies, then checked line by line.
// Visual form: a checklist whose every line carries a policy reference.
const { step, next, prev, reset } = useArtifactStep(2)
</script>

<template>
  <S6DeptCase :step="step" owner="Sara Lindqvist (HR)" :checks="HR.checks" @prev="prev" @next="next" @reset="reset">
    <div class="wrap">
      <div class="inputs">
        <span class="k">Input</span>
        <span v-for="d in HR.docs" :key="d.file" class="doc">
          <svg width="13" height="16" viewBox="0 0 14 17" aria-hidden="true"><path d="M1 1h8l4 4v11H1z M9 1v4h4" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
          <span class="mono">{{ d.file }}</span>
        </span>
        <span class="nopd"><Status state="neutral" compact /> No employee records</span>
      </div>

      <Transition name="swap" mode="out-in">
        <div v-if="step === 0" key="p" class="s6-p0">
          <S6Panel title="Instruction to the assistant">
            <pre class="prompt">{{ HR.prompt }}</pre>
          </S6Panel>
          <S6Panel title="Why this instruction">
            <ul class="why">
              <li><strong>Only</strong> approved policies, not general knowledge</li>
              <li>A section reference makes every line checkable</li>
              <li>Permission to say “not in the policies”</li>
            </ul>
          </S6Panel>
        </div>
        <S6Panel v-else key="d" title="Onboarding checklist — new depot driver" kind="draft">
          <div class="list">
            <template v-for="g in HR.groups" :key="g.when">
              <div class="when" :style="{ gridRow: `span ${g.items.length}` }">{{ g.when }}</div>
              <div v-for="it in g.items" :key="it.text" class="item" :class="step === 2 && it.flag ? it.flag.state : ''">
                <svg class="s6-box" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="0.75" y="0.75" width="12.5" height="12.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.4" /></svg>
                <span class="txt" :class="{ strike: step === 2 && it.flag?.state === 'bad' }">{{ it.text }}</span>
                <span class="src mono" :class="{ none: !it.src }">{{ it.src ?? '—' }}</span>
                <span class="verdict">
                  <Transition name="fade">
                    <Status v-if="step === 2 && it.flag" :state="it.flag.state" :label="it.flag.label" />
                    <Status v-else-if="step === 2" state="ok" label="Matches policy" />
                  </Transition>
                </span>
              </div>
            </template>
          </div>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.wrap { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 10px; }
.inputs { display: flex; align-items: center; gap: 10px; flex-wrap: nowrap; }
.k { font: 600 var(--fs-label)/1 var(--font-sans); color: var(--ink-2); margin-right: 2px; }
.doc {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--stage); border-radius: var(--radius-sm); padding: 5px 8px;
  font-size: 14px; color: var(--ink);
  white-space: nowrap;
}
.doc svg { color: var(--ink-2); }
.nopd { display: inline-flex; align-items: center; gap: 6px; margin-left: auto; font-size: 15px; color: var(--ink-2); white-space: nowrap; }

.s6-p0 { flex: 1 1 auto; display: grid; grid-template-columns: 1.25fr 1fr; gap: 14px; min-height: 0; }
.prompt {
  margin: 0;
  font: 400 var(--fs-label)/1.5 var(--font-mono);
  white-space: pre-wrap;
  color: var(--ink);
}
.why { margin: 0; padding-left: 1.1em; }
.why li { margin: 0 0 8px; }

.list { display: grid; grid-template-columns: 76px 1fr; column-gap: 8px; }
.when { grid-column: 1; font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); padding-top: 8px; border-top: 1px solid var(--rule); }
.item {
  grid-column: 2;
  display: grid;
  grid-template-columns: 16px 1fr 96px 236px;
  align-items: center;
  column-gap: 10px;
  min-height: 36px;
  padding: 0 6px;
  border-top: 1px solid var(--rule);
  transition: background var(--dur) var(--ease);
}
.when:first-child, .item:nth-child(2) { border-top: 0; }
.item.bad { background: var(--bad-tint); }
.item.warn { background: var(--warn-tint); }
.s6-box { color: var(--ink-3); }
.txt { color: var(--ink); }
.strike { text-decoration: line-through; text-decoration-color: var(--bad); color: var(--ink-2); }
.src { font-size: 15px; color: var(--accent); }
.src.none { color: var(--bad); }
.verdict { display: inline-flex; justify-content: flex-end; }

.swap-enter-active, .swap-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
