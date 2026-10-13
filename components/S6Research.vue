<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { RES } from '../data/s6/examples'

// Slide 53 — Research & learning: compare claims across three real studies.
// Visual form: an evidence table (who, measure, result, limitation) and a summary that must survive it.
const { step, next, prev, reset } = useArtifactStep(2)
</script>

<template>
  <S6DeptCase :step="step" owner="whoever cites it" owner-label="Accountable" :fictional="false" :checks="RES.checks" @prev="prev" @next="next" @reset="reset">
    <div class="wrap">
      <Transition name="swap" mode="out-in">
        <div v-if="step === 0" key="p" class="s6-p0">
          <S6Panel :title="`Question: ${RES.question}`" kind="source">
            <ul class="srcs">
              <li v-for="s in RES.studies" :key="s.key">
                <strong>{{ s.study }}</strong><Cite :k="s.key" />
                <span class="muted"> · {{ s.kind }}</span>
              </li>
            </ul>
            <Callout kind="caution" title="Why open the originals" class="why">
              In a 2023 audit, 55% of GPT-3.5 and 18% of GPT-4 citations were fabricated<Cite k="walters2023citations" />.
            </Callout>
          </S6Panel>
          <S6Panel title="Instruction to the assistant">
            <pre class="prompt">{{ RES.prompt }}</pre>
          </S6Panel>
        </div>

        <S6Panel v-else key="d" :title="RES.question" kind="draft">
          <table class="et">
            <thead><tr><th>Study</th><th>Who and what</th><th>Measured</th><th>Result</th><th>Main limitation</th></tr></thead>
            <tbody>
              <tr v-for="s in RES.studies" :key="s.key">
                <td class="st">{{ s.study }}<Cite :k="s.key" /></td>
                <td>{{ s.who }}</td>
                <td>{{ s.measured }}</td>
                <td class="res">
                  <span :class="{ wrong: step === 2 && s.ai !== s.truth }">{{ s.ai }}</span>
                  <template v-if="step === 2">
                    <Status v-if="s.ai !== s.truth" state="bad" :label="s.truth" class="fix" />
                    <Status v-else state="ok" compact class="fix" />
                  </template>
                </td>
                <td>{{ s.limit }}</td>
              </tr>
            </tbody>
          </table>
          <p class="sk">Summary</p>
          <ul class="sum">
            <li v-for="c in RES.summary" :key="c.text" :class="step === 2 ? c.flag.state : ''">
              <span>{{ c.text }}</span>
              <Transition name="fade">
                <Status v-if="step === 2" :state="c.flag.state" :label="c.flag.label" class="ss" />
              </Transition>
            </li>
          </ul>
        </S6Panel>
      </Transition>
    </div>
  </S6DeptCase>
</template>

<style scoped>
.wrap { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 8px; }
.q { margin: 0; display: flex; gap: 10px; align-items: baseline; font-size: var(--fs-small); font-weight: 600; }
.qk { font-size: 14px; font-weight: 600; color: #fff; background: var(--ink); padding: 2px 6px; border-radius: var(--radius-sm); }
.s6-p0 { flex: 1 1 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; min-height: 0; }
.srcs { list-style: none; margin: 0; padding: 0; }
.srcs li { margin: 0; padding: 7px 0; border-bottom: 1px solid var(--rule); }
.why { margin-top: auto; }
.prompt { margin: 0; font: 400 var(--fs-label)/1.5 var(--font-mono); white-space: pre-wrap; }

.et { font-size: 15px; line-height: 1.25; }
.et th { font-size: 14px; color: var(--ink-2); padding: 2px 8px 4px 0; border-bottom: 1.5px solid var(--ink-2); }
.et td { padding: 3px 8px 3px 0; }
.et th:nth-child(1) { width: 13%; }
.et th:nth-child(2) { width: 32%; }
.et th:nth-child(3) { width: 14%; }
.et th:nth-child(4) { width: 15%; }
.st { font-weight: 600; white-space: nowrap; }
.sk { margin: 4px 0 1px; font-size: 14px; font-weight: 600; color: var(--ink-2); }
.res { font-weight: 600; color: var(--accent); }
.wrong { text-decoration: line-through; text-decoration-color: var(--bad); color: var(--ink-2); }
.fix { display: inline-flex; margin-top: 2px; font-size: 14px; padding: 1px 7px 1px 4px; }

.sum { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.sum li { margin: 0; padding: 2px 6px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; gap: 10px; transition: background var(--dur) var(--ease); }
.sum li.bad { background: var(--bad-tint); }
.sum li.ok { background: var(--ok-tint); }
.ss { font-size: 14px; padding: 1px 7px 1px 4px; background: transparent !important; }

.swap-enter-active, .swap-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(6px); }
.swap-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
