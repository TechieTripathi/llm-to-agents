<script setup lang="ts">
import { useArtifactStep } from '../composables/useArtifactStep'
import { STRUCTURED_OUTPUT, STRUCTURED_PROMPT, VERDICT, WEAK_OUTPUT, WEAK_PROMPT } from '../data/s3/beforeAfter'
import type { PartKey } from '../data/s3/beforeAfter'

// Slide 18: the same task asked two ways. Step 1 traces each output line back to the
// prompt part that caused it (and flags the weak draft's filler); step 2 shows the review effort.
const { step } = useArtifactStep(2)
const labelOf = (k: PartKey) => STRUCTURED_PROMPT.find(p => p.part === k)!.label
</script>

<template>
  <div class="ba">
    <h3 class="h">Weak request</h3>
    <h3 class="h">Structured request <SimTag kind="simulated" class="tag" /></h3>

    <div class="prompt weak-p">
      <span class="mono">{{ WEAK_PROMPT }}</span>
      <span class="empty">Four words. Reader, source, purpose and format are left to guesswork.</span>
    </div>
    <div class="prompt mono">
      <div v-for="p in STRUCTURED_PROMPT" :key="p.part" class="pline">
        <span class="k">{{ p.label }}:</span> {{ p.text }}
      </div>
    </div>

    <div class="out weak">
      <div class="oh">
        <span class="ol">Output</span>
        <Transition name="tag"><Status v-if="step >= 2" :state="VERDICT.weak.state" :label="VERDICT.weak.label" /></Transition>
      </div>
      <p v-for="(l, i) in WEAK_OUTPUT" :key="i" :class="{ first: i === 0 }">
        <span class="t" :class="{ flagged: step >= 1 && l.flag }">{{ l.text }}</span>
        <Transition name="tag"><span v-if="step >= 1 && l.flag" class="flag">{{ l.flag }}</span></Transition>
      </p>
    </div>
    <div class="out">
      <div class="oh">
        <span class="ol">Output</span>
        <Transition name="tag"><Status v-if="step >= 2" :state="VERDICT.structured.state" :label="VERDICT.structured.label" /></Transition>
      </div>
      <p v-for="(l, i) in STRUCTURED_OUTPUT" :key="i" :class="{ first: i === 0 }">
        <span class="t">{{ l.text }}</span>
        <Transition name="tag">
          <span v-if="step >= 1" class="from"><span v-for="f in l.from" :key="f" class="chip">← {{ labelOf(f) }}</span></span>
        </Transition>
      </p>
    </div>
  </div>
</template>

<style scoped>
.ba {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto 1fr;
  column-gap: 28px;
  row-gap: 8px;
  flex: 1 1 auto;
  min-height: 0;
}
.h { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); margin: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.tag { font-weight: 500; }
.prompt {
  font-size: var(--fs-label);
  line-height: 1.38;
  background: var(--surface);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  padding: 9px 12px;
  color: var(--ink);
}
.weak-p { display: flex; flex-direction: column; justify-content: space-between; }
.empty { font: 400 var(--fs-label)/1.35 var(--font-sans); color: var(--ink-3); }
.pline { padding-left: 1.2em; text-indent: -1.2em; }
.k { color: var(--accent); font-weight: 600; }
.out {
  background: var(--stage);
  border-radius: var(--radius);
  padding: 8px 12px 6px;
  font-size: var(--fs-label);
  line-height: 1.34;
  min-height: 0;
}
.oh { display: flex; align-items: center; justify-content: space-between; min-height: 26px; margin-bottom: 4px; }
.ol { font-size: 14px; font-weight: 600; color: var(--ink-3); }
.out p { margin: 0 0 5px; }
.out p.first .t { font-weight: 600; }
.weak .t { color: var(--ink-2); }
.flagged { text-decoration: underline wavy var(--warn); text-decoration-thickness: 1px; text-underline-offset: 3px; }
.flag, .chip {
  display: inline-block;
  margin-left: 6px;
  font-size: 14px; line-height: 1;
  padding: 3px 7px; border-radius: 999px; white-space: nowrap;
  vertical-align: 1px;
}
.flag { color: var(--warn); background: var(--warn-tint); font-weight: 500; }
.chip { color: var(--accent); background: var(--accent-tint); font-weight: 500; }
.tag-enter-active, .tag-leave-active { transition: opacity var(--dur) var(--ease); }
.tag-enter-from, .tag-leave-to { opacity: 0; }
</style>
