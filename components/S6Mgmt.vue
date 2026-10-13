<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { MGMT } from '../data/s6/examples'

// Slide 52 — Management: four team updates become a decision brief; every line must trace back.
// Visual form: source updates on the left, brief lines carrying source chips on the right.
const { step, next, prev, reset } = useArtifactStep(2)
const initials = (n: string) => n.split(' ').map(p => p[0]).join('')
</script>

<template>
  <S6DeptCase :step="step" owner="Helen Brooks (Director)" :checks="MGMT.checks" @prev="prev" @next="next" @reset="reset">
    <div class="g">
      <S6Panel title="Team updates — Project Lark" kind="source">
        <ul class="ups">
          <li v-for="u in MGMT.updates" :key="u.who">
            <span class="av" aria-hidden="true">{{ initials(u.who) }}</span>
            <span class="ub">
              <span class="um"><strong>{{ u.who }}</strong> · {{ u.role }} · {{ u.date }}</span>
              <span class="ut">{{ u.text }}</span>
            </span>
          </li>
        </ul>
      </S6Panel>

      <Transition name="swap" mode="out-in">
        <S6Panel v-if="step === 0" key="p" title="Instruction to the assistant">
          <pre class="prompt">{{ MGMT.prompt }}</pre>
        </S6Panel>
        <S6Panel v-else key="d" title="Decision brief for Helen" kind="draft">
          <p class="dec"><span class="dk">Decision</span>{{ MGMT.decision }}</p>
          <ul class="lines">
            <li v-for="l in MGMT.lines" :key="l.text" :class="step === 2 ? l.flag.state : ''">
              <span class="lt">{{ l.text }}</span>
              <span class="lm">
                <span v-if="l.owner" class="own">Owner: {{ l.owner }}</span>
                <span class="chips"><span v-for="c in l.src" :key="c" class="chip">{{ c }}</span></span>
                <Transition name="fade">
                  <Status v-if="step === 2" :state="l.flag.state" :label="l.flag.label" class="ls" />
                </Transition>
              </span>
            </li>
          </ul>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.g { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 372px 1fr; gap: 14px; }
.ups { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.ups li { display: grid; grid-template-columns: 30px 1fr; gap: 8px; margin: 0; padding: 0; }
.av {
  width: 30px; height: 30px; border-radius: 50%;
  display: grid; place-items: center;
  font: 600 14px/1 var(--font-sans);
  background: var(--surface); color: var(--ink-2); border: 1px solid var(--rule-strong);
}
.ub { display: flex; flex-direction: column; gap: 1px; }
.um { font-size: 14px; color: var(--ink-2); }
.um strong { color: var(--ink); font-weight: 600; }
.ut { font-size: 15px; line-height: 1.25; color: var(--ink); }

.prompt { margin: 0; font: 400 var(--fs-label)/1.5 var(--font-mono); white-space: pre-wrap; }
.dec { margin: 0 0 4px; font-weight: 600; display: flex; gap: 8px; align-items: baseline; }
.dk { font-size: 14px; font-weight: 600; color: #fff; background: var(--ink); padding: 2px 6px; border-radius: var(--radius-sm); }
.lines { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.lines li { margin: 0; padding: 3px 6px; line-height: 1.3; border-radius: var(--radius-sm); border-bottom: 1px solid var(--rule); display: flex; flex-direction: column; gap: 2px; transition: background var(--dur) var(--ease); }
.lines li.bad { background: var(--bad-tint); }
.lines li.warn { background: var(--warn-tint); }
.lt { color: var(--ink); }
.lm { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink-2); min-height: 22px; }
.chips { display: inline-flex; gap: 4px; }
.chip { font: 600 14px/1 var(--font-sans); color: var(--accent); border: 1px solid var(--accent-tint-2); background: var(--accent-tint); border-radius: 999px; padding: 3px 7px; }
.ls { margin-left: auto; font-size: 14px; padding: 1px 7px 1px 4px; background: transparent !important; }

.swap-enter-active, .swap-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
