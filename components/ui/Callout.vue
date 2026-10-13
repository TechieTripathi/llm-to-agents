<script setup lang="ts">
// Short emphasised note. `kind` sets the rule color: key idea, caution, or neutral note.
withDefaults(defineProps<{ kind?: 'key' | 'caution' | 'note', title?: string }>(), { kind: 'key' })
</script>

<template>
  <aside class="callout" :class="kind">
    <strong v-if="title" class="t">{{ title }}</strong>
    <div class="c"><slot /></div>
  </aside>
</template>

<style scoped>
.callout {
  border-left: 3px solid var(--accent);
  padding: 4px 0 4px 14px;
  font-size: var(--fs-small);
  line-height: 1.4;
  color: var(--ink);
}
.callout.caution { border-color: var(--warn); }
.callout.note { border-color: var(--rule-strong); color: var(--ink-2); }
.t { display: block; margin-bottom: 2px; }
.c :deep(p:last-child) { margin-bottom: 0; }
</style>
