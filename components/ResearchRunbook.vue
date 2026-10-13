<script setup lang="ts">
// Slide 58 — browser research runbook: ask, collect, compare, cite, verify.
// Clicks step through the runbook. The toggle switches between LIVE (instructions for a real run in a
// separate browser window, plus a scorecard to tick) and PREPARED (evidence captured and checked
// on 13 Oct 2026 from real public sources; the example AI draft is simulated).
import { computed, ref } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import {
  BRIEF, CHECKED, COMPARE, DRAFT_CLAIMS, EVIDENCE, LIVE_PROMPT, LIVE_SCORECARD, LIVE_STEPS,
  QUESTION, SOURCES, TOPICS, VERIFY_CHECKS,
} from '../data/s7/research'

const { step, go } = useArtifactStep(4)
const mode = ref<'live' | 'prepared'>('prepared')
const live = computed(() => mode.value === 'live')
const pick = ref(0)
const ticks = ref<boolean[]>(LIVE_SCORECARD.map(() => false))
const ticked = computed(() => ticks.value.filter(Boolean).length)
const copied = ref(false)

const src = (id: string) => SOURCES.find(s => s.id === id)!
const statusState = { current: 'ok', withdrawn: 'bad', archived: 'warn' } as const
const verdict = {
  outdated: { state: 'warn', label: 'Outdated' },
  contradicted: { state: 'bad', label: 'Contradicted' },
  supported: { state: 'ok', label: 'Supported' },
} as const
const claim = computed(() => DRAFT_CLAIMS[pick.value])

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(LIVE_PROMPT.join(' '))
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
  catch { copied.value = false }
}
</script>

<template>
  <div class="s7-rr">
    <div class="top">
      <p class="q"><span class="qk">Question</span>{{ QUESTION }}</p>
      <div class="mode" role="group" aria-label="Demo mode">
        <button class="btn" :aria-pressed="live" @click.stop="mode = 'live'"><span class="dot" />Live in browser</button>
        <button class="btn" :aria-pressed="!live" @click.stop="mode = 'prepared'">Prepared evidence</button>
      </div>
    </div>

    <div class="body">
      <!-- runbook rail -->
      <ol class="rail">
        <li v-for="(s, i) in LIVE_STEPS" :key="s.name" :class="{ cur: step === i, done: step > i }" @click.stop="go(i)">
          <span class="num">{{ step > i ? '✓' : i + 1 }}</span>
          <span class="nm">{{ s.name }}</span>
        </li>
      </ol>

      <!-- panel -->
      <section class="panel" :class="mode">
        <header class="pbar">
          <span v-if="live" class="badge live"><span class="dot" />Live: results will differ from the prepared run</span>
          <span v-else class="badge prep">Prepared: sources opened and checked {{ CHECKED }}</span>
        </header>

        <Transition name="s7swap" mode="out-in">
          <!-- ───────── LIVE ───────── -->
          <div v-if="live" :key="`l${step}`" class="livegrid">
            <div class="ldo">
              <p class="lstep"><strong>{{ LIVE_STEPS[step].name }}.</strong> {{ LIVE_STEPS[step].do }}</p>
              <p class="llook"><span class="lk">Look for</span>{{ LIVE_STEPS[step].look }}</p>
              <div v-if="step === 0" class="prompt">
                <span class="phead"><span class="plab">Prompt</span><button class="btn copy" @click.stop="copyPrompt">{{ copied ? 'Copied' : 'Copy the prompt' }}</button></span>
                <p>{{ LIVE_PROMPT.join(' ') }}</p>
              </div>
              <ul v-if="step === 1 || step === 4" class="links">
                <li v-for="s in SOURCES.filter(x => step === 1 || x.id === 'nist4')" :key="s.id">
                  <a :href="s.url" target="_blank" rel="noopener">Open {{ s.publisher }}: {{ s.title }}</a>
                </li>
              </ul>
            </div>
            <div class="score">
              <span class="sh">Live scorecard <span class="cnt">{{ ticked }}/{{ LIVE_SCORECARD.length }}</span></span>
              <label v-for="(t, i) in LIVE_SCORECARD" :key="i" class="tick">
                <input v-model="ticks[i]" type="checkbox" @click.stop>
                <span>{{ t }}</span>
              </label>
            </div>
          </div>

          <!-- ───────── PREPARED ───────── -->
          <div v-else-if="step === 0" key="p0" class="p-ask">
            <div class="prompt">
              <span class="plab">Prompt</span>
              <p>{{ LIVE_PROMPT.join(' ') }}</p>
            </div>
            <ul class="rules">
              <li><Status compact state="active" /> Primary sources first: standards bodies and government agencies</li>
              <li><Status compact state="active" /> Note each source’s date and whether it is still current</li>
              <li><Status compact state="active" /> Ask for the exact sentence, then find it yourself</li>
            </ul>
          </div>

          <div v-else-if="step === 1" key="p1" class="p-collect">
            <div v-for="s in SOURCES" :key="s.id" class="srow">
              <div class="sinfo">
                <span class="stitle">{{ s.title }}<Cite :k="s.refKey" /></span>
                <span class="smeta">{{ s.publisher }} · {{ s.kind }} · {{ s.date }} · <a :href="s.url" target="_blank" rel="noopener" class="host">{{ s.host.split('/')[0] }}</a></span>
              </div>
              <Status :state="statusState[s.status]" :label="s.statusNote" />
            </div>
          </div>

          <div v-else-if="step === 2" key="p2" class="p-compare">
            <div class="mrow mhead">
              <span />
              <span v-for="k in (['nist4', 'ncsc', 'cisa'] as const)" :key="k">{{ src(k).short }}</span>
            </div>
            <div v-for="(t, ti) in TOPICS" :key="t" class="mrow">
              <span class="mtopic">{{ t }}</span>
              <span v-for="k in (['nist4', 'ncsc', 'cisa'] as const)" :key="k" class="mcell" :class="COMPARE[k][ti].tone">{{ COMPARE[k][ti].text }}</span>
            </div>
            <p class="mnote"><span class="sw differs" /> differs from NIST 2025 — ask why before you choose. CISA advises individuals; NIST sets rules for systems.</p>
          </div>

          <div v-else-if="step === 3" key="p3" class="p-cite">
            <div class="dhead"><span>Example AI draft, claim by claim</span><SimTag kind="simulated" /></div>
            <ul class="dclaims">
              <li v-for="(c, i) in DRAFT_CLAIMS" :key="i" :class="{ sel: pick === i }" @click.stop="pick = i">
                <span class="dct">{{ c.text }}</span>
                <Status :state="verdict[c.verdict].state" :label="verdict[c.verdict].label" />
              </li>
            </ul>
            <div class="quotes">
              <figure v-for="e in claim.evidence" :key="e" class="quote" :class="src(EVIDENCE[e].src).status">
                <figcaption>{{ src(EVIDENCE[e].src).short }}<span v-if="src(EVIDENCE[e].src).status === 'withdrawn'">, withdrawn</span><span v-else-if="src(EVIDENCE[e].src).status === 'archived'">, archived page</span><span v-else>, current</span><Cite :k="src(EVIDENCE[e].src).refKey" /></figcaption>
                <blockquote>“{{ EVIDENCE[e].quote }}”</blockquote>
              </figure>
            </div>
          </div>

          <div v-else key="p4" class="p-verify">
            <ul class="checks">
              <li v-for="c in VERIFY_CHECKS" :key="c.label">
                <Status compact :state="c.state" />
                <span><strong>{{ c.label }}</strong> {{ c.detail }}</span>
              </li>
            </ul>
            <div class="brief">
              <span class="bh">Verified brief</span>
              <ul>
                <li v-for="(b, i) in BRIEF" :key="i">{{ b }}<Cite :k="i === 2 ? ['s7nist2025sp80063b4', 's7ncsc2018passwords'] : 's7nist2025sp80063b4'" /></li>
              </ul>
            </div>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
.s7-rr { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 10px; }
.top { display: flex; align-items: center; gap: 16px; }
.q { margin: 0; flex: 1; font-size: var(--fs-label); line-height: 1.3; color: var(--ink); }
.qk { color: var(--ink-2); margin-right: 10px; }
.mode { display: inline-flex; flex: 0 0 auto; }
.mode .btn { border-radius: 0; padding: 7px 12px; display: inline-flex; align-items: center; gap: 7px; }
.mode .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.mode .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-left: -1px; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--bad); display: inline-block; }
.mode .btn[aria-pressed='true'] .dot { background: #fff; }

.body { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 132px 1fr; grid-template-rows: minmax(0, 1fr); gap: 16px; }

.rail { align-self: start; list-style: none; margin: 0; padding: 4px 0 0; display: flex; flex-direction: column; gap: 0; position: relative; }
.rail::before { content: ''; position: absolute; left: 13px; top: 24px; bottom: 24px; width: 1.5px; background: var(--rule-strong); }
.rail li { position: relative; display: flex; align-items: center; gap: 10px; margin: 0; padding: 7px 0; cursor: pointer; font-size: var(--fs-small); color: var(--ink-2); }
.num { width: 28px; height: 28px; border-radius: 50%; display: inline-grid; place-items: center; font: 600 var(--fs-label)/1 var(--font-sans); background: var(--paper); border: 1.5px solid var(--rule-strong); color: var(--ink-2); z-index: 1; transition: background var(--dur) var(--ease); }
.rail li.done .num { background: var(--ink); border-color: var(--ink); color: #fff; }
.rail li.cur .num { background: var(--accent); border-color: var(--accent); color: #fff; }
.rail li.cur .nm { color: var(--ink); font-weight: 600; }

.panel { min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 8px; border-radius: var(--radius); padding: 10px 14px 12px; background: var(--surface); overflow: hidden; }
.panel.prepared { border: 1.5px dashed var(--rule-strong); }
.panel.live { border: 2px solid var(--accent); }
.pbar { display: flex; }
.badge { display: inline-flex; align-items: center; gap: 7px; font: 500 var(--fs-label)/1 var(--font-sans); padding: 5px 10px; border-radius: 999px; }
.badge.prep { color: var(--ink-2); border: 1px dashed var(--rule-strong); }
.badge.live { color: #fff; background: var(--accent); }
.badge.live .dot { background: #fff; }

/* live */
.livegrid { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1fr 226px; gap: 16px; }
.ldo { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.lstep { margin: 0; font-size: var(--fs-label); line-height: 1.35; }
.llook { margin: 0; font-size: var(--fs-label); color: var(--ink); line-height: 1.35; }
.lk { color: var(--accent); font-weight: 600; margin-right: 8px; }
.links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; font-size: var(--fs-label); }
.links li { margin: 0; padding: 0; }
.score { display: flex; flex-direction: column; gap: 6px; border-left: 1px solid var(--rule); padding-left: 16px; }
.sh { font-size: var(--fs-label); font-weight: 600; display: flex; justify-content: space-between; }
.cnt { color: var(--accent); font-variant-numeric: tabular-nums; }
.tick { display: flex; gap: 8px; align-items: flex-start; font-size: var(--fs-label); line-height: 1.28; cursor: pointer; }
.tick input { width: 17px; height: 17px; margin-top: 2px; accent-color: var(--accent); flex: 0 0 auto; }

/* prepared: ask */
.prompt { background: var(--stage); border-radius: var(--radius-sm); padding: 6px 12px; font: 400 15px/1.4 var(--font-mono); color: var(--ink); }
.prompt p { margin: 0; }
.plab { display: block; font: 600 var(--fs-label)/1.4 var(--font-sans); color: var(--ink-2); margin-bottom: 2px; }
.phead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
.copy { font-size: var(--fs-label); padding: 4px 9px; }
.p-ask { display: flex; flex-direction: column; gap: 12px; }
.rules { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; font-size: var(--fs-label); }
.rules li { display: flex; gap: 8px; align-items: center; margin: 0; padding: 0; }

/* prepared: collect */
.p-collect { display: flex; flex-direction: column; }
.srow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--rule); }
.srow:last-child { border-bottom: none; }
.sinfo { display: flex; flex-direction: column; min-width: 0; }
.stitle { font-size: var(--fs-label); font-weight: 600; line-height: 1.25; }
.smeta { font-size: var(--fs-label); color: var(--ink-2); line-height: 1.3; }
.host { font-family: var(--font-mono); font-size: 15px; color: var(--accent); }

/* prepared: compare */
.p-compare { display: flex; flex-direction: column; }
.mrow { display: grid; grid-template-columns: 150px 1fr 1fr 1fr; gap: 0; border-bottom: 1px solid var(--rule); font-size: var(--fs-label); line-height: 1.25; }
.mrow > span { padding: 5px 8px; }
.mhead { font-weight: 600; border-bottom: 1.5px solid var(--ink); }
.mtopic { color: var(--ink-2); padding-left: 0 !important; }
.mcell.differs { background: var(--warn-tint); }
.mcell.silent { color: var(--ink-3); font-style: italic; }
.mnote { margin: 8px 0 0; font-size: var(--fs-label); color: var(--ink-2); display: flex; gap: 8px; align-items: baseline; }
.sw { display: inline-block; width: 14px; height: 12px; flex: 0 0 auto; }
.sw.differs { background: var(--warn-tint); border: 1px solid var(--warn); }

/* prepared: cite */
.p-cite { display: flex; flex-direction: column; gap: 6px; min-height: 0; }
.dhead { display: flex; justify-content: space-between; align-items: center; font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); }
.dclaims { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3px 14px; }
.dclaims li { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 0; padding: 3px 6px; border-radius: var(--radius-sm); font-size: var(--fs-label); line-height: 1.2; cursor: pointer; border: 1px solid transparent; }
.dclaims li.sel { border-color: var(--accent); background: var(--accent-tint); }
.dct { min-width: 0; }
.quotes { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 12px; margin-top: 2px; }
.quote { margin: 0; border-left: 3px solid var(--ok); padding: 2px 0 2px 10px; }
.quote.withdrawn { border-color: var(--bad); }
.quote.archived { border-color: var(--warn); }
.quote figcaption { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); }
.quote blockquote { border: none; background: none; padding: 0; margin: 2px 0 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink); }

/* prepared: verify */
.p-verify { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.checks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.checks li { display: flex; gap: 8px; align-items: baseline; margin: 0; padding: 0; font-size: var(--fs-label); line-height: 1.3; }
.checks strong { display: block; }
.brief { background: var(--ok-tint); border-left: 3px solid var(--ok); padding: 8px 12px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; align-self: start; }
.bh { font-weight: 600; font-size: var(--fs-label); }
.brief ul { margin: 4px 0 0; padding-left: 1em; }
.brief li { font-size: var(--fs-label); line-height: 1.32; margin: 0 0 4px; }

.s7swap-enter-active, .s7swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.s7swap-enter-from { opacity: 0; transform: translateY(6px); }
.s7swap-leave-to { opacity: 0; }
</style>
