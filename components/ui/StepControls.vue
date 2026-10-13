<script setup lang="ts">
// Prev / next / reset for artifacts driven by useArtifactStep. Labels describe the current step.
const props = defineProps<{ step: number, max: number, labels?: string[] }>()
const emit = defineEmits<{ prev: [], next: [], reset: [] }>()
</script>

<template>
  <div class="steps" role="group" aria-label="Step controls">
    <button class="btn" :disabled="props.step <= 0" aria-label="Previous step" @click.stop="emit('prev')">‹</button>
    <span class="pos">
      <span><strong>{{ props.step }}</strong>/{{ props.max }}</span>
      <span v-if="props.labels?.[props.step]" class="lab">{{ props.labels[props.step] }}</span>
    </span>
    <button class="btn" :disabled="props.step >= props.max" aria-label="Next step" @click.stop="emit('next')">›</button>
    <button class="btn ghost" aria-label="Reset" @click.stop="emit('reset')">Reset</button>
  </div>
</template>

<style scoped>
.steps { display: inline-flex; align-items: center; gap: 6px; }
.btn { padding: 5px 11px; font-size: 15px; line-height: 1; }
.ghost { font-size: 12.5px; padding: 7px 9px; border-color: transparent; background: transparent; color: var(--ink-2); }
.pos { font: 400 var(--fs-label)/1 var(--font-sans); color: var(--ink-2); font-variant-numeric: tabular-nums; min-width: 2.6em; text-align: center; display: inline-flex; gap: 8px; align-items: baseline; }
.pos strong { color: var(--ink); font-weight: 600; }
.lab { color: var(--ink); }
</style>
