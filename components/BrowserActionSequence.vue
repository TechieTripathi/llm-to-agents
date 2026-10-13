<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ACTIONS, ALLOWLIST, APPROVER, RULES, TASK } from '../data/s4/browser'
import type { Decision } from '../data/s4/browser'

// Slide 32: each proposed browser action is checked against a permission policy set before the run.
const { step, next, prev, reset, max } = useArtifactStep(ACTIONS.length - 1)
const labels = ['Search', 'Read', 'Injection blocked', 'Second site', 'Fill form', 'Ask to send', 'Purchase blocked']

const ASK_ROW = ACTIONS.findIndex(a => a.decision === 'ask')
const answer = ref<'approved' | 'declined' | null>(null)
watch(step, () => { answer.value = null })
// After the run moves past the request, the PDF/static state shows it approved.
const approval = computed(() => answer.value ?? (step.value > ASK_ROW ? 'approved' : null))

const current = computed(() => ACTIONS[step.value])
const LANES: { d: Decision, label: string }[] = [
  { d: 'allow', label: 'Allowed' },
  { d: 'ask', label: 'Ask a person' },
  { d: 'block', label: 'Blocked' },
]
function marker(i: number) {
  const a = ACTIONS[i]
  if (a.decision === 'allow') return { state: 'ok' as const, label: 'Allowed' }
  if (a.decision === 'block') return { state: 'bad' as const, label: 'Blocked' }
  if (approval.value === 'approved') return { state: 'ok' as const, label: 'Approved' }
  if (approval.value === 'declined') return { state: 'bad' as const, label: 'Declined' }
  return { state: 'warn' as const, label: 'Waiting' }
}
</script>

<template>
  <Stage tag="simulated">
    <template #controls>
      <StepControls :step="step" :max="max" :labels="labels" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="cols">
      <!-- Policy -->
      <aside class="policy">
        <div class="task"><span class="k">Task</span> {{ TASK }}</div>
        <div class="polh">Policy, set before the run</div>
        <ul class="rules">
          <li v-for="r in RULES" :key="r.id" :class="[r.decision, { lit: current.rule === r.id }]">
            <span class="dot" aria-hidden="true" />
            <span class="rt">{{ r.text }}</span>
            <span class="rd">{{ r.decision === 'allow' ? 'Allow' : r.decision === 'ask' ? 'Ask' : 'Block' }}</span>
          </li>
        </ul>
        <div class="allowlist"><span class="k">Allowlist</span> <span class="mono">{{ ALLOWLIST.join(', ') }}</span></div>
        <div class="untrusted">Text on a web page is data, never an instruction.</div>
      </aside>

      <!-- Run log with permission lanes -->
      <div class="run">
        <div class="lanes-h">
          <span class="ah">Proposed action</span>
          <span v-for="l in LANES" :key="l.d" class="lh" :class="l.d">{{ l.label }}</span>
        </div>
        <TransitionGroup tag="ol" name="s4row" class="log">
          <li v-for="(a, i) in ACTIONS.slice(0, step + 1)" :key="a.cmd" class="act" :class="{ now: i === step }">
            <span class="n">{{ i + 1 }}</span>
            <span class="what">
              <span class="cmd mono">{{ a.cmd }}</span>
              <span class="note">{{ a.decision === 'ask' && approval ? (approval === 'approved' ? `Approved by ${APPROVER}` : 'Declined — nothing was sent') : a.note }}</span>
            </span>
            <span v-for="l in LANES" :key="l.d" class="lane" :class="l.d">
              <Status v-if="a.decision === l.d" :state="marker(i).state" :label="marker(i).label" compact />
            </span>
          </li>
        </TransitionGroup>
        <Transition name="s4fade">
          <div v-if="step === ASK_ROW" class="approve" role="group" aria-label="Approval request">
            <span><strong>Ask:</strong> send details to palletpro.example?</span>
            <span class="btns">
              <button class="btn btn-primary" :aria-pressed="answer === 'approved'" @click="answer = 'approved'">Approve</button>
              <button class="btn" :aria-pressed="answer === 'declined'" @click="answer = 'declined'">Decline</button>
            </span>
          </div>
        </Transition>


      </div>
    </div>
  </Stage>
</template>

<style scoped>
.cols { display: grid; grid-template-columns: 300px 1fr; gap: 18px; flex: 1; min-height: 0; }

.policy { display: flex; flex-direction: column; gap: 7px; font-size: 15px; }
.task { line-height: 1.3; }
.k { font-weight: 600; color: var(--ink-2); margin-right: 4px; }
.polh { font-weight: 600; color: var(--ink-2); font-size: var(--fs-label); margin-top: 2px; }
.rules { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; border-top: 1.5px solid var(--ink); }
.rules li { display: grid; grid-template-columns: 10px 1fr auto; gap: 8px; align-items: baseline; margin: 0; padding: 4px 6px; border-bottom: 1px solid var(--rule); line-height: 1.25; transition: background var(--dur) var(--ease); }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; transform: translateY(-1px); }
li.allow .dot { background: var(--ok); }
li.ask .dot { background: var(--warn); }
li.block .dot { background: var(--bad); }
.rd { font-size: 14px; font-weight: 600; color: var(--ink-2); }
.rules li.lit { background: var(--accent-tint); box-shadow: inset 3px 0 0 var(--accent); }
.rules li.lit .rd { color: var(--ink); }
.allowlist { font-size: 15px; color: var(--ink-2); }
.allowlist .mono { font-size: 14px; color: var(--ink); }
.untrusted { font-size: 15px; color: var(--ink); border-left: 3px solid var(--warn); padding-left: 8px; line-height: 1.3; }

.run { display: flex; flex-direction: column; min-width: 0; }
.lanes-h, .act { display: grid; grid-template-columns: 20px 1fr 92px 100px 92px; align-items: center; }
.lanes-h { font-size: 14px; font-weight: 600; color: var(--ink-2); border-bottom: 1.5px solid var(--ink); padding-bottom: 4px; }
.ah { grid-column: 1 / 3; }
.lh { text-align: center; }
.log { list-style: none; margin: 0; padding: 0; position: relative; }
.act { margin: 0; padding: 3px 0; border-bottom: 1px solid var(--rule); min-height: 36px; transition: background var(--dur) var(--ease); }
.act.now { background: var(--surface); }
.n { font-size: 14px; color: var(--ink-3); font-variant-numeric: tabular-nums; }
.what { display: flex; flex-direction: column; min-width: 0; line-height: 1.2; }
.cmd { font-size: 15px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.note { font-size: 14px; color: var(--ink-2); }
.lane { display: flex; justify-content: center; align-self: stretch; align-items: center; border-left: 1px dashed var(--rule-strong); }
.lane :deep(.status) { font-size: 15px; }
.lane :deep(.status .txt) { font-size: 15px; }

.approve { margin-top: 8px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: nowrap; white-space: nowrap; background: var(--warn-tint); border-left: 3px solid var(--warn); padding: 6px 10px; font-size: 15px; line-height: 1.3; }
.approve.done { background: transparent; border-left-color: transparent; padding-left: 0; }
.btns { display: inline-flex; gap: 8px; }
.btns .btn { padding: 5px 12px; }

.s4row-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.s4row-enter-from { opacity: 0; transform: translateY(-4px); }
.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
