<script setup lang="ts">
// Titled panel used inside the department worked examples.
// kind="draft" marks AI output (accent rule + 'AI draft' label; the frame carries the simulated tag); kind="source" marks human/source input.
withDefaults(defineProps<{ title: string, kind?: 'source' | 'draft' | 'plain', note?: string }>(), { kind: 'plain' })
</script>

<template>
  <section class="s6-pn" :class="kind">
    <header class="s6-ph">
      <span class="s6-pt">{{ title }}</span>
      <span v-if="note" class="pnote">{{ note }}</span>
      <span class="sp" />
      <span v-if="kind === 'draft'" class="ai">AI draft</span>
      <slot name="aside" />
    </header>
    <div class="s6-pc"><slot /></div>
  </section>
</template>

<style scoped>
.s6-pn {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  padding: 7px 13px 8px;
  gap: 5px;
}
.s6-pn.source { background: var(--stage); border-color: transparent; }
.s6-pn.draft { border-color: var(--accent-tint-2); box-shadow: inset 3px 0 0 var(--accent); }
.s6-ph { display: flex; align-items: baseline; gap: 8px; min-height: 24px; }
.s6-pt { font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink); }
.draft .s6-pt { color: var(--accent); }
.pnote { font-size: 14px; color: var(--ink-3); }
.sp { flex: 1; }
.ai { font: 500 14px/1 var(--font-sans); color: var(--accent); border: 1px solid var(--accent-tint-2); background: var(--accent-tint); border-radius: 999px; padding: 4px 9px; white-space: nowrap; }
.s6-pc :deep(li) { line-height: 1.32; }
.s6-pc { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; font-size: var(--fs-label); line-height: 1.35; }
</style>
