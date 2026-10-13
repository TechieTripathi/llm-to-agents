<script setup lang="ts">
// Frame for every interactive artifact: what to try, honesty tag, the artifact, what to notice.
withDefaults(defineProps<{
  task?: string
  notice?: string
  tag?: 'simulated' | 'illustrative' | 'fictional' | 'teaching' | false
  bare?: boolean
}>(), { tag: 'simulated' })
</script>

<template>
  <section class="stage" :class="{ bare }">
    <header v-if="task || tag || $slots.controls" class="bar">
      <span v-if="task" class="task">{{ task }}</span>
      <span class="spacer" />
      <slot name="controls" />
      <SimTag v-if="tag" :kind="tag" />
    </header>
    <div class="area"><slot /></div>
    <footer v-if="notice || $slots.notice" class="notice">
      <span class="notice-key">Notice</span>
      <span><slot name="notice">{{ notice }}</slot></span>
    </footer>
  </section>
</template>

<style scoped>
.stage {
  flex: 0 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--stage);
  border-radius: var(--radius);
  padding: 12px 16px 12px;
  gap: 10px;
}
.stage.bare { background: transparent; padding: 0; }
.bar { display: flex; align-items: center; gap: 10px; min-height: 26px; }
.task { font-size: var(--fs-label); color: var(--ink-2); }
.spacer { flex: 1; }
.area { flex: 1 1 auto; min-height: 0; position: relative; display: flex; flex-direction: column; }
.notice {
  display: flex;
  gap: 12px;
  align-items: baseline;
  font-size: var(--fs-label);
  color: var(--ink);
  border-top: 1px solid var(--rule);
  padding-top: 8px;
}
.notice-key { font-weight: 600; color: var(--accent); flex: 0 0 auto; }
</style>
