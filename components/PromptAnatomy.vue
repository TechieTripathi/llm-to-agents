<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { ANATOMY } from '../data/s3/anatomy'

// Slide 19: a labelled prompt. The clicker walks the parts (objective first, optional role last);
// clicking a label or a block selects that part directly.
const { step, go } = useArtifactStep(6)
const active = computed(() => ANATOMY.find(p => p.order === step.value))
const select = (order: number) => go(step.value === order ? 0 : order)
</script>

<template>
  <div class="anat">
    <div class="prompt" role="list" aria-label="Prompt, split into its parts">
      <div
        v-for="p in ANATOMY"
        :key="p.key"
        role="listitem"
        class="part"
        :class="{ on: active?.key === p.key, off: active && active.key !== p.key, opt: p.optional }"
        @click="select(p.order)"
      >
        <button class="lab" :aria-pressed="active?.key === p.key" @click.stop="select(p.order)">
          {{ p.name }}<span v-if="p.optional" class="o">optional</span>
        </button>
        <span class="txt mono">{{ p.text }}</span>
      </div>
    </div>

    <aside class="card" aria-live="polite">
      <Transition name="fade" mode="out-in">
        <div v-if="active" :key="active.key" class="inner">
          <div class="name">{{ active.optional ? 'Role or perspective' : active.name }}<span v-if="active.optional" class="tagopt">optional</span></div>
          <div class="arow"><span class="k">What it does</span><span>{{ active.does }}</span></div>
          <div class="arow"><span class="k">Without it</span><span>{{ active.without }}</span></div>
        </div>
        <div v-else key="overview" class="inner">
          <div class="name">Five working parts</div>
          <p class="ov">Objective, context, constraints, output format and verification.</p>
          <p class="ov muted">A role or perspective can help with tone, but it is optional.</p>
          <p class="hint">Select a part to see what it contributes.</p>
        </div>
      </Transition>
      <SimTag kind="fictional" class="tag" />
    </aside>
  </div>
</template>

<style scoped>
.anat { display: grid; grid-template-columns: 1fr 250px; gap: 24px; flex: 1 1 auto; min-height: 0; }
.prompt {
  background: var(--surface);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  padding: 6px 0;
  display: flex; flex-direction: column;
  align-self: start;
}
.part {
  display: grid; grid-template-columns: 112px 1fr; gap: 12px;
  padding: 6px 14px 6px 0;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background var(--dur) var(--ease), opacity var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.part + .part { border-top: 1px dashed var(--rule); }
.part.on { background: var(--accent-tint); border-left-color: var(--accent); }
.part.off { opacity: 0.5; }
.lab {
  all: unset;
  cursor: pointer;
  font: 600 var(--fs-label)/1.25 var(--font-sans);
  color: var(--ink-2);
  text-align: right;
  padding-top: 1px;
  display: flex; flex-direction: column; align-items: flex-end;
}
.lab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.on .lab { color: var(--accent); }
.lab .o { font-weight: 400; font-size: 14px; color: var(--ink-3); }
.opt .txt { color: var(--ink-2); }
.txt { font-size: var(--fs-label); line-height: 1.36; color: var(--ink); }
.card {
  border-top: 2px solid var(--accent);
  padding-top: 12px;
  display: flex; flex-direction: column;
  min-height: 0;
}
.inner { display: flex; flex-direction: column; gap: 14px; }
.name { font-size: var(--fs-lead); font-weight: 600; line-height: 1.15; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.tagopt { font-size: 14px; font-weight: 500; color: var(--ink-2); border: 1px dashed var(--rule-strong); border-radius: 999px; padding: 2px 8px; }
.arow { display: flex; flex-direction: column; gap: 2px; font-size: var(--fs-small); line-height: 1.35; }
.k { font-size: var(--fs-label); font-weight: 600; color: var(--ink-2); }
.ov { margin: 0; font-size: var(--fs-small); line-height: 1.35; }
.hint { margin: 0; font-size: var(--fs-label); color: var(--accent); }
.tag { margin-top: auto; align-self: flex-start; }
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur) var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
