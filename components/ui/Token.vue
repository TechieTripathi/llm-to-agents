<script setup lang="ts">
// A single token chip. Leading spaces are part of many tokens; `space` shows them as a faint dot.
withDefaults(defineProps<{
  text: string
  state?: 'context' | 'new' | 'candidate' | 'chosen' | 'dim' | 'focus'
  space?: boolean
  id?: number | string
}>(), { state: 'context' })
</script>

<template>
  <span class="tok" :class="state"><span v-if="space" class="sp" aria-hidden="true">·</span>{{ text }}<sub v-if="id !== undefined" class="tid">{{ id }}</sub></span>
</template>

<style scoped>
.tok {
  display: inline-flex;
  align-items: baseline;
  font: 400 var(--fs-small)/1 var(--font-mono);
  padding: 6px 7px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--rule);
  background: var(--surface);
  color: var(--ink);
  white-space: pre;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease), opacity var(--dur) var(--ease);
}
.sp { color: var(--ink-3); margin-right: 1px; }
.tid { font-size: 10px; color: var(--ink-3); margin-left: 4px; }
.new { background: var(--accent); border-color: var(--accent); color: #fff; }
.new .sp, .new .tid { color: var(--accent-tint-2); }
.focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.candidate { border-style: dashed; color: var(--ink-2); background: transparent; }
.chosen { border-color: var(--accent); color: var(--accent); background: var(--accent-tint); font-weight: 500; }
.dim { opacity: 0.35; }
</style>
