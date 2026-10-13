<script setup lang="ts">
import { computed } from 'vue'

// Honest labelling: every invented, simulated or illustrative output carries one of these.
const props = withDefaults(defineProps<{ kind?: 'simulated' | 'illustrative' | 'fictional' | 'teaching' }>(), { kind: 'simulated' })
const text = computed(() => ({
  simulated: 'Simulated — no real system was called',
  illustrative: 'Illustrative values, not measured',
  fictional: 'Fictional example data',
  teaching: 'Teaching visualization, not real model internals',
}[props.kind]))
</script>

<template>
  <span class="simtag" :title="text">
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.2 1.6" /></svg>
    {{ text }}
  </span>
</template>

<style scoped>
.simtag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 500 12.5px/1 var(--font-sans);
  color: var(--ink-2);
  border: 1px dashed var(--rule-strong);
  border-radius: 999px;
  padding: 4px 9px;
  white-space: nowrap;
  background: var(--paper);
}
</style>
