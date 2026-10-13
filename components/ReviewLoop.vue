<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { CHECKS, RETRY, STEP_LABELS, TARGETED, V1 } from '../data/s3/review'
import type { Draft } from '../data/s3/review'

// Slide 26: the same failing draft, two kinds of feedback. Vague "try again" re-rolls everything;
// a targeted correction names the error and the source, and leaves the rest alone.
const MAX = STEP_LABELS.length - 1
const { step, next, prev, reset } = useArtifactStep(MAX)
const passes = (d: Draft, k: string) => d.pass.includes(k as any)
const failCount = (d: Draft) => CHECKS.length - d.pass.length
</script>

<template>
  <div class="rl">
    <div class="bar">
      <span class="label">One failing draft, two kinds of feedback</span>
      <span class="spacer" />
      <StepControls :step="step" :max="MAX" :labels="STEP_LABELS" @prev="prev" @next="next" @reset="reset" />
      <SimTag kind="simulated" />
    </div>

    <!-- Shared starting point -->
    <div class="card v1">
      <div class="ch">
        <span class="vl">{{ V1.label }}</span>
        <span class="checks">
          <Status v-for="c in CHECKS" :key="c.key" compact :state="passes(V1, c.key) ? 'ok' : 'bad'" :label="c.label" />
        </span>
        <span class="fails">{{ failCount(V1) }} checks fail</span>
      </div>
      <p class="txt"><span v-for="(s, i) in V1.text" :key="i" :class="s.mark">{{ s.t }}</span></p>
    </div>

    <svg class="fork" viewBox="0 0 868 18" preserveAspectRatio="none" aria-hidden="true">
      <path d="M434 0v6M434 6H217v12M434 6H651v12" fill="none" stroke="currentColor" stroke-width="1.5" />
    </svg>

    <div class="cols">
      <!-- Retry lane -->
      <section class="lane bad-lane">
        <h4>{{ RETRY.title }}</h4>
        <p v-if="step < 1" class="ask">What happens if you just say “try again”?</p>
        <Transition name="in"><p v-if="step >= 1" class="fb">{{ RETRY.fb1 }}</p></Transition>
        <Transition name="in">
          <div v-if="step >= 2" class="card">
            <div class="ch">
              <span class="vl">{{ RETRY.v2.label }}</span>
              <span class="checks"><Status v-for="c in CHECKS" :key="c.key" compact :state="passes(RETRY.v2, c.key) ? 'ok' : 'bad'" :label="c.label" /></span>
            </div>
            <p class="txt"><span v-for="(s, i) in RETRY.v2.text" :key="i" :class="s.mark">{{ s.t }}</span></p>
            <p class="note bad">{{ RETRY.v2.note }}</p>
          </div>
        </Transition>
        <Transition name="in">
          <div v-if="step >= 3" class="card">
            <p class="fb tight">{{ RETRY.fb2 }}</p>
            <div class="ch">
              <span class="vl">{{ RETRY.v3.label }}</span>
              <span class="checks"><Status v-for="c in CHECKS" :key="c.key" compact :state="passes(RETRY.v3, c.key) ? 'ok' : 'bad'" :label="c.label" /></span>
            </div>
            <p class="txt"><span v-for="(s, i) in RETRY.v3.text" :key="i" :class="s.mark">{{ s.t }}</span></p>
            <p class="note bad">{{ RETRY.v3.note }}</p>
          </div>
        </Transition>
      </section>

      <!-- Targeted lane -->
      <section class="lane ok-lane">
        <h4>{{ TARGETED.title }}</h4>
        <p v-if="step < 1" class="ask">What if you name the error and its source?</p>
        <Transition name="in"><p v-if="step >= 1" class="fb mono">{{ TARGETED.fb1 }}</p></Transition>
        <Transition name="in">
          <div v-if="step >= 2" class="card">
            <div class="ch">
              <span class="vl">{{ TARGETED.v2.label }}</span>
              <span class="checks"><Status v-for="c in CHECKS" :key="c.key" compact :state="passes(TARGETED.v2, c.key) ? 'ok' : 'bad'" :label="c.label" /></span>
            </div>
            <p class="txt"><span v-for="(s, i) in TARGETED.v2.text" :key="i" :class="s.mark">{{ s.t }}</span></p>
            <p class="note ok">{{ TARGETED.v2.note }}</p>
          </div>
        </Transition>
        <Transition name="in">
          <div v-if="step >= 3" class="approve">
            <Status state="ok" label="Human review" />
            <span>{{ TARGETED.review }}</span>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
.rl { display: flex; flex-direction: column; gap: 6px; flex: 1 1 auto; min-height: 0; }
.bar { display: flex; align-items: center; gap: 12px; }
.bar .label { font-size: 15px; color: var(--ink-2); }
.spacer { flex: 1; }
.card { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 5px 10px 6px; display: flex; flex-direction: column; gap: 2px; }
.card.v1 { border-color: var(--rule-strong); }
.ch { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.vl { font-weight: 600; font-size: var(--fs-label); min-width: 2.2em; }
.checks { display: inline-flex; gap: 10px; flex-wrap: wrap; }
.checks :deep(.status) { font-size: 15px; }
.fails { margin-left: auto; font-size: 15px; color: var(--bad); font-weight: 600; }
.txt { margin: 0; font-size: var(--fs-label); line-height: 1.35; color: var(--ink); }
.txt .m-bad { background: var(--bad-tint); color: var(--bad); border-radius: 2px; padding: 0 2px; }
.txt .m-fix { background: var(--ok-tint); color: var(--ok); border-radius: 2px; padding: 0 2px; }
.fork { width: 100%; height: 18px; color: var(--rule-strong); display: block; margin: -4px 0 -2px; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1 1 auto; min-height: 0; }
.lane { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.lane h4 { margin: 0; font-size: var(--fs-label); font-weight: 600; padding-bottom: 3px; border-bottom: 2px solid; }
.bad-lane h4 { color: var(--bad); border-color: var(--bad); }
.ok-lane h4 { color: var(--ok); border-color: var(--ok); }
.fb { margin: 0; font-size: var(--fs-label); line-height: 1.32; padding: 4px 10px; border-radius: var(--radius-sm); background: var(--stage); border-left: 3px solid var(--ink-3); color: var(--ink); }
.ok-lane .fb { border-left-color: var(--accent); background: var(--accent-tint); }
.fb.tight { margin: 0 0 4px; padding: 2px 8px; }
.ask { margin: 0; font-size: var(--fs-small); color: var(--ink-2); }
.note { margin: 0; font-size: 15px; font-weight: 600; }
.note.bad { color: var(--bad); }
.note.ok { color: var(--ok); }
.approve { display: flex; align-items: center; gap: 10px; font-size: var(--fs-label); padding: 6px 10px; border: 1.5px solid var(--ok); border-radius: var(--radius-sm); background: var(--ok-tint); }
.in-enter-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.in-enter-from { opacity: 0; transform: translateY(-4px); }
</style>
