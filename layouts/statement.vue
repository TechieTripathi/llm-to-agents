<script setup lang="ts">
// Big-idea slide on the inverted (dark) surface. Use sparingly: one per section at most.
</script>

<template>
  <div class="slidev-layout l-statement">
    <div class="inner"><slot /></div>
  </div>
</template>

<style scoped>
.l-statement {
  height: 100%;
  background: var(--night);
  color: var(--ink-inverse);
  padding: 60px var(--gutter) 48px;
  display: flex;
  align-items: center;
}
.inner { max-width: 760px; display: flex; flex-direction: column; gap: var(--s5); }
.inner :deep(h1) { color: #fff; font-size: var(--fs-display); max-width: 18ch; line-height: 1.05; }
.inner :deep(p) { color: #c9cdd3; font-size: var(--fs-lead); max-width: 40ch; }
.inner :deep(strong) { color: #fff; }
</style>
