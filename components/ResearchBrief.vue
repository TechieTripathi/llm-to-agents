<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CHECKED, CLAIMS, QUESTION, SOURCES } from '../data/s4/brief'

// Slide 34: question → official sources → claim-by-claim check → brief with citations.
// The sources are real; the AI draft is a prepared, simulated fallback (not a live run).
const { step, next, prev, reset, max } = useArtifactStep(3)
const STAGES = ['Question and plan', 'Collect sources', 'Check each claim', 'Write the brief']

const openSrc = ref<string | null>(null)
watch(step, () => { openSrc.value = null })
const contradicted = computed(() => CLAIMS.filter(c => c.verdict === 'contradicted').length)
const srcById = (id: string) => SOURCES.find(s => s.id === id)!
</script>

<template>
  <Stage tag="simulated">
    <template #controls>
      <span class="prep">Prepared fallback — not live</span>
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </template>

    <div class="ws">
      <!-- Progress rail -->
      <ol class="rail" aria-label="Research stages">
        <li v-for="(s, i) in STAGES" :key="s" :class="{ done: i < step, now: i === step }">
          <span class="dot" aria-hidden="true" />
          <span>{{ s }}</span>
        </li>
        <li class="q">
          <span class="qk">Question</span>
          {{ QUESTION }}
        </li>
      </ol>

      <!-- Panel -->
      <div class="panel">
        <Transition name="s4fade" mode="out-in">
          <!-- 0: plan -->
          <div v-if="step === 0" key="p0" class="plan">
            <h3>Plan</h3>
            <ol class="steps">
              <li>Search official EU sources first: the law on EUR-Lex, then Commission pages.</li>
              <li>Open every source. Note the article or sentence that supports each date.</li>
              <li>Ask the assistant for a draft, then check every claim against the sources.</li>
              <li>Keep only checked claims. Cite each one. Date the brief.</li>
            </ol>
            <Callout kind="caution" title="Why official sources?">Summaries of new laws go stale fast. This law was amended in July 2026.</Callout>
          </div>

          <!-- 1: sources -->
          <div v-else-if="step === 1" key="p1" class="sources">
            <h3>Sources opened</h3>
            <ul>
              <li v-for="s in SOURCES" :key="s.id">
                <span class="sid mono">{{ s.id }}</span>
                <span class="st">{{ s.title }}<span class="site mono">{{ s.site }}</span></span>
                <span class="kind" :class="s.kind === 'Law' ? 'law' : 'guid'">{{ s.kind }}</span>
                <Status state="ok" label="Opened" compact />
              </li>
            </ul>
          </div>

          <!-- 2: verification -->
          <div v-else-if="step === 2" key="p2" class="verify">
            <h3>AI draft, checked claim by claim <span class="count">{{ contradicted }} of {{ CLAIMS.length }} wrong</span></h3>
            <ul>
              <li v-for="c in CLAIMS" :key="c.draft" :class="c.verdict">
                <Status :state="c.verdict === 'supported' ? 'ok' : 'bad'" :label="c.verdict === 'supported' ? 'Supported' : 'Contradicted'" compact />
                <span class="cl">
                  <span class="draft">{{ c.draft }}</span>
                  <span class="ev">{{ c.evidence }} <span class="cites mono">[{{ c.cites.join('][') }}]</span></span>
                </span>
              </li>
            </ul>
          </div>

          <!-- 3: brief -->
          <div v-else key="p3" class="brief">
            <div class="brief-h">
              <h3>Brief: when GPAI obligations apply</h3>
              <span class="asof">Checked {{ CHECKED }}</span>
            </div>
            <ul>
              <li v-for="c in CLAIMS" :key="c.final" :class="{ fixed: c.verdict === 'contradicted' }">
                {{ c.final }}
                <span class="cgroup"><button v-for="id in c.cites" :key="id" class="cbtn mono" :aria-pressed="openSrc === id" :aria-label="`Show source ${id}`" @click="openSrc = openSrc === id ? null : id">[{{ id }}]</button></span>
                <span v-if="c.verdict === 'contradicted'" class="fixtag">corrected</span>
              </li>
            </ul>
            <p class="srcline">
              <template v-if="openSrc">
                <span class="mono sid">{{ openSrc }}</span> {{ srcById(openSrc).title }} — <span class="mono">{{ srcById(openSrc).site }}</span>
              </template>
              <template v-else>Click a citation to see its source. Not legal advice.</template>
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </Stage>
</template>

<style scoped>
.prep { font-size: 15px; font-weight: 600; color: var(--warn); border: 1.5px solid var(--warn); border-radius: var(--radius-sm); padding: 4px 8px; background: var(--warn-tint); white-space: nowrap; }
.spacer { flex: 1; }

.ws { display: grid; grid-template-columns: 206px 1fr; gap: 16px; flex: 1; min-height: 0; }
.rail { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.rail li { display: flex; align-items: center; gap: 10px; margin: 0; padding: 6px 8px; font-size: 15px; color: var(--ink-3); border-radius: var(--radius-sm); position: relative; }
.rail li .dot { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--rule-strong); background: var(--paper); flex: 0 0 auto; box-sizing: border-box; }
.rail li.done { color: var(--ink-2); }
.rail li.done .dot { background: var(--ink-2); border-color: var(--ink-2); }
.rail li.now { color: var(--ink); font-weight: 600; background: var(--surface); box-shadow: inset 3px 0 0 var(--accent); }
.rail li.now .dot { background: var(--accent); border-color: var(--accent); }
.rail li.q { display: block; margin-top: 10px; padding: 8px 10px; font-size: 15px; line-height: 1.3; color: var(--ink); background: var(--surface); border: 1px solid var(--rule); }
.qk { display: block; font-size: 14px; font-weight: 600; color: var(--ink-2); margin-bottom: 2px; }

.panel { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 8px 14px; min-width: 0; }
.panel h3 { font-size: 15px; margin: 0 0 6px; display: flex; align-items: baseline; gap: 10px; }
.panel ul { list-style: none; margin: 0; padding: 0; }
.panel li { margin: 0; }

.steps { margin: 0 0 12px; padding-left: 1.3em; }
.steps li { font-size: 15px; line-height: 1.35; margin: 0 0 6px; }
.plan :deep(.callout) { font-size: 15px; }

.sources li { display: grid; grid-template-columns: 22px 1fr auto auto; gap: 10px; align-items: center; padding: 6px 0; border-top: 1px solid var(--rule); }
.sid { font-weight: 600; color: var(--accent); font-size: 15px; }
.st { font-size: 15px; line-height: 1.25; display: flex; flex-direction: column; }
.site { font-size: 14px; color: var(--ink-3); }
.kind { font-size: 14px; font-weight: 600; padding: 3px 8px; line-height: 1.2; border-radius: 999px; white-space: nowrap; align-self: center; }
.kind.law { background: var(--ink); color: var(--paper); }
.kind.guid { background: var(--accent-tint); color: var(--accent-strong); }

.count { font-size: 15px; font-weight: 600; color: var(--bad); }
.verify li { display: grid; grid-template-columns: 126px 1fr; gap: 10px; align-items: start; padding: 5px 0; border-top: 1px solid var(--rule); }
.verify li :deep(.status) { justify-self: start; margin-top: 1px; }
.cl { display: flex; flex-direction: column; gap: 1px; }
.draft { font-size: 15px; line-height: 1.25; }
.contradicted .draft { text-decoration: line-through; text-decoration-color: var(--bad); }
.ev { font-size: 15px; color: var(--ink-2); line-height: 1.25; }
.cites { color: var(--accent); font-size: 14px; white-space: nowrap; }

.brief-h { display: flex; justify-content: space-between; align-items: baseline; }
.asof { font-size: 14px; color: var(--ink-2); }
.brief li { font-size: 15px; line-height: 1.28; padding: 3px 0 3px 14px; border-top: 1px solid var(--rule); position: relative; }
.brief li::before { content: ''; position: absolute; left: 0; top: 13px; width: 6px; height: 6px; background: var(--ink); border-radius: 50%; }
.brief li.fixed { background: var(--ok-tint); }
.cgroup { white-space: nowrap; }
.cbtn { font-size: 14px; color: var(--accent); background: none; border: 0; padding: 0 1px; cursor: pointer; }
.cbtn[aria-pressed='true'] { background: var(--accent); color: #fff; border-radius: 2px; }
.fixtag { font-size: 14px; font-weight: 600; color: var(--ok); margin-left: 6px; }
.srcline { margin: 5px 0 0; font-size: 15px; color: var(--ink-2); }

.s4fade-enter-active, .s4fade-leave-active { transition: opacity var(--dur) var(--ease); }
.s4fade-enter-from, .s4fade-leave-to { opacity: 0; }
</style>
