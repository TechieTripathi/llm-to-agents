<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ERRORS, ORIGINS } from '../data/s2/errors'

// Slide 15 — six error types grouped by where they originate, each with a workplace example.
const { step, max, go, next, prev, reset } = useArtifactStep(ERRORS.length - 1)
const e = computed(() => ERRORS[step.value])
const groups = ORIGINS.map(o => ({ ...o, items: ERRORS.map((x, i) => ({ ...x, i })).filter(x => x.origin === o.id) }))
</script>

<template>
  <div class="et">
    <nav class="map" aria-label="Error types">
      <div v-for="g in groups" :key="g.id" class="grp" :class="{ cur: e.origin === g.id }">
        <h3 class="gh">{{ g.name }}</h3>
        <button v-for="x in g.items" :key="x.id" class="it" :class="{ on: step === x.i }" :aria-pressed="step === x.i" @click.stop="go(x.i)">
          {{ x.name }}
        </button>
      </div>
      <StepControls :step="step" :max="max" @prev="prev" @next="next" @reset="reset" />
    </nav>

    <Transition name="fade" mode="out-in">
      <article :key="e.id" class="card">
        <header class="ch">
          <h2>{{ e.name }}</h2>
          <SimTag kind="fictional" />
        </header>
        <div class="ex">
          <div class="ex-line">
            <span class="k">Request</span>
            <span class="mono v">{{ e.request }}</span>
          </div>
          <div class="ex-line">
            <span class="k">Answer</span>
            <span class="mono v out">{{ e.output }}</span>
          </div>
        </div>
        <div class="diag">
          <p><Status state="bad" compact label="What went wrong" /><span class="t">{{ e.why }}<Cite v-if="e.cite" :k="e.cite" /></span></p>
          <p><Status state="ok" compact label="What helps" /><span class="t">{{ e.helps }}</span></p>
        </div>
      </article>
    </Transition>
  </div>
</template>

<style scoped>
.et { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 28px; flex: 1; min-height: 0; }
.map { display: flex; flex-direction: column; gap: 10px; }
.grp { display: flex; flex-direction: column; gap: 4px; padding-left: 12px; border-left: 2px solid var(--rule); transition: border-color var(--dur) var(--ease); }
.grp.cur { border-color: var(--accent); }
.gh { margin: 0 0 2px; font-size: var(--fs-label); font-weight: 500; color: var(--ink-3); }
.grp.cur .gh { color: var(--accent); }
.it {
  text-align: left; font: 500 var(--fs-small)/1.2 var(--font-sans); color: var(--ink);
  background: transparent; border: 1px solid transparent; border-radius: var(--radius-sm);
  padding: 6px 10px; cursor: pointer; transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.it:hover { background: var(--stage); }
.it.on { background: var(--accent); color: #fff; }
.it:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.map :deep(.steps) { margin-top: auto; }

.card { background: var(--stage); border-radius: var(--radius); padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
.ch { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ch h2 { margin: 0; font-size: 28px; }
.ex { display: flex; flex-direction: column; gap: 8px; }
.ex-line { display: grid; grid-template-columns: 82px 1fr; gap: 10px; align-items: baseline; }
.k { font-size: var(--fs-label); color: var(--ink-2); }
.v { font-size: 15px; line-height: 1.4; background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 6px 10px; }
.v.out { border-style: dashed; }
.diag { display: flex; flex-direction: column; gap: 10px; }
.diag p { margin: 0; display: flex; flex-direction: column; gap: 3px; }
.diag :deep(.status .txt) { font-weight: 600; }
.t { font-size: var(--fs-small); line-height: 1.4; color: var(--ink); }
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
