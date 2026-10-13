<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ACTION, APPROVER, CLICK_PATH, EV, type EvKind, TIMES } from '../data/s5/approval'

// Slide 44 — a consequential action is held at a gate until a named person decides.
// Clicks: held → agent tries anyway (blocked) → changes requested → v2 held → approved and sent (simulated).
// Buttons let the presenter choose any outcome from a held state.
const { step } = useArtifactStep(CLICK_PATH.length - 1)
const custom = ref<EvKind[] | null>(null)
watch(step, () => { custom.value = null })

const events = computed<EvKind[]>(() => custom.value ?? CLICK_PATH[step.value])
const last = computed(() => events.value[events.value.length - 1])
const status = computed(() => {
  const k = last.value
  if (k === 'sent' || k === 'approved') return 'sent'
  if (k === 'rejected') return 'rejected'
  if (k === 'changes') return 'changes'
  return 'held'
})
const version = computed(() => 1 + events.value.filter(e => e === 'revised').length)
const blockedNow = computed(() => last.value === 'blocked')

const log = computed(() => {
  let v = 1
  return events.value.map((k, i) => {
    if (k === 'revised') v += 1
    const text = EV[k].text.replace('the current version', `v${v}`)
    return { t: TIMES[i] ?? '', who: EV[k].who, text, kind: k }
  })
})

function act(kinds: EvKind[]) {
  if (status.value !== 'held') return
  custom.value = [...events.value, ...kinds]
}
const approve = () => act(['approved', 'sent'])
const changes = () => act(['changes', 'revised'])
const reject = () => act(['rejected'])
const bypass = () => act(['blocked'])
const restart = () => { custom.value = ['proposed'] }

const gateLabel = computed(() => ({
  held: blockedNow.value ? 'Blocked' : 'Locked',
  changes: 'Locked',
  sent: 'Opened by approval',
  rejected: 'Closed for good',
}[status.value]))
const outcome = computed(() => ({
  held: { tone: 'active', text: `Waiting for ${APPROVER.name}` },
  changes: { tone: 'warn', text: 'Back to the agent with a note' },
  sent: { tone: 'ok', text: `Sent to ${ACTION.to.split(' · ')[0]} (simulated)` },
  rejected: { tone: 'bad', text: 'Cancelled. Nothing was sent.' },
}[status.value]) as { tone: 'active' | 'warn' | 'ok' | 'bad', text: string })
</script>

<template>
  <Stage task="Decide as the approver, or let the agent try to send." tag="simulated">
    <div class="ag">
      <div class="ag-top">
        <!-- Proposed action -->
        <section class="card prop" :class="{ dimmed: status === 'rejected' }">
          <div class="card-h">
            <span class="who">Agent proposes</span>
            <span class="ver">v{{ version }}</span>
          </div>
          <dl class="kv">
            <dt>action</dt><dd>{{ ACTION.fn }}</dd>
            <dt>to</dt><dd>{{ ACTION.to }}</dd>
            <dt>file</dt><dd>{{ ACTION.file(version) }}</dd>
            <dt>checks</dt><dd>figures validated ✓</dd>
          </dl>
          <Status state="warn" :label="ACTION.risk" />
          <button class="btn bypass" :disabled="status !== 'held'" @click.stop="bypass">Let the agent try to send</button>
        </section>

        <!-- Gate -->
        <div class="gate" :class="[status, { hit: blockedNow }]" aria-live="polite">
          <svg viewBox="0 0 120 170" width="120" height="170" aria-hidden="true">
            <defs>
              <marker id="s5ag-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker>
            </defs>
            <path d="M0 85 H116" class="lane" marker-end="url(#s5ag-a)" />
            <rect x="52" y="14" width="16" height="142" rx="3" class="gate-bar" />
            <g class="lock" transform="translate(48 66)">
              <rect x="0" y="12" width="24" height="20" rx="3" />
              <path :d="status === 'sent' ? 'M5 12 V6 a7 7 0 0 1 14 0' : 'M5 12 V6 a7 7 0 0 1 14 0 V12'" fill="none" stroke-width="2.5" class="shackle" />
            </g>
            <g v-if="blockedNow" class="xmark"><path d="M30 70l14 14M44 70l-14 14" /></g>
          </svg>
          <span class="gate-l">{{ gateLabel }}</span>
        </div>

        <!-- Approver -->
        <section class="card appr">
          <div class="card-h">
            <span class="who">Approver: {{ APPROVER.name }}</span>
            <button v-if="status === 'sent' || status === 'rejected'" class="btn ghost" @click.stop="restart">Start again</button>
          </div>
          <p class="rule">Only a named person can approve. The agent cannot approve itself.<Cite k="s8owasp2025llm06" /></p>
          <div class="btns">
            <button class="btn btn-primary" :disabled="status !== 'held'" @click.stop="approve">Approve and send</button>
            <button class="btn" :disabled="status !== 'held'" @click.stop="changes">Request changes</button>
            <button class="btn" :disabled="status !== 'held'" @click.stop="reject">Reject</button>
          </div>
          <div class="outcome">
            <Status :state="outcome.tone" :label="outcome.text" />
          </div>
        </section>
      </div>

      <!-- Audit log -->
      <div class="log" role="log" aria-label="Audit log">
        <div class="log-h">Audit log</div>
        <TransitionGroup name="ln" tag="ol">
          <li v-for="(l, i) in log.slice(-3)" :key="l.t + l.kind + i" :class="l.kind">
            <span class="log-t">{{ l.t }}</span><span class="log-w">{{ l.who }}</span><span class="log-x">{{ l.text }}</span>
          </li>
        </TransitionGroup>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.ag { display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; }
.ag-top { display: grid; grid-template-columns: 1fr 120px 1fr; gap: 8px; align-items: stretch; }
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 8px 14px 10px; display: flex; flex-direction: column; gap: 7px; align-items: flex-start; transition: opacity var(--dur) var(--ease); }
.card.dimmed { opacity: 0.45; }
.card-h { display: flex; justify-content: space-between; width: 100%; align-items: baseline; }
.who { font-size: var(--fs-label); font-weight: 600; color: var(--ink); }
.ver { font: 500 15px var(--font-mono); color: var(--accent); }
.kv { margin: 0; display: grid; grid-template-columns: 56px 1fr; gap: 2px 8px; font: 400 15px/1.35 var(--font-mono); width: 100%; }
.kv dt { color: var(--ink-3); }
.kv dd { margin: 0; color: var(--ink); }
.bypass { font-size: 15px; padding: 6px 10px; border-style: dashed; }
.rule { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.35; }
.btns { display: flex; flex-wrap: wrap; gap: 6px; }
.btns .btn { padding: 7px 10px; }
.outcome { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: auto; }
.ghost { font-size: 14px; padding: 2px 4px; border-color: transparent; background: transparent; color: var(--ink-2); }

.gate { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--ink-2); }
.lane { stroke: currentColor; stroke-width: 2; stroke-dasharray: 5 4; fill: none; }
.gate-bar { fill: var(--ink); transition: transform var(--dur) var(--ease), opacity var(--dur) var(--ease), fill var(--dur) var(--ease); transform-origin: 60px 156px; }
.lock rect { fill: var(--surface); stroke: var(--ink); stroke-width: 2; }
.shackle { stroke: var(--ink); }
.xmark path { stroke: var(--bad); stroke-width: 3; stroke-linecap: round; }
.gate.hit .gate-bar { fill: var(--bad); }
.gate.sent { color: var(--ok); }
.gate.sent .lane { stroke-dasharray: none; }
.gate.sent .gate-bar { transform: translateY(-24px); opacity: 0; }
.gate.sent .lock rect, .gate.sent .shackle { stroke: var(--ok); }
.gate.rejected .gate-bar { fill: var(--bad); }
.gate-l { font-size: 15px; font-weight: 600; color: var(--ink); text-align: center; line-height: 1.2; }
.gate.hit .gate-l, .gate.rejected .gate-l { color: var(--bad); }
.gate.sent .gate-l { color: var(--ok); }

.log { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 6px 12px 8px; }
.log-h { font-size: 14px; color: var(--ink-3); font-weight: 600; margin-bottom: 2px; }
.log ol { list-style: none; margin: 0; padding: 0; font: 400 14.5px/1.45 var(--font-mono); min-height: 63px; }
.log li { margin: 0; padding: 0; display: grid; grid-template-columns: 78px 66px 1fr; gap: 8px; color: var(--ink); white-space: nowrap; overflow: hidden; }
.log .log-t { color: var(--ink-3); }
.log .log-w { color: var(--ink-2); }
.log li.blocked .log-x, .log li.rejected .log-x { color: var(--bad); }
.log li.sent .log-x, .log li.approved .log-x { color: var(--ok); }
.log li.changes .log-x { color: var(--warn); }
.ln-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.ln-enter-from { opacity: 0; transform: translateY(4px); }
</style>
