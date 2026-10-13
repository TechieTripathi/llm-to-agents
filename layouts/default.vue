<script setup lang="ts">
// Standard content slide: title (markdown `#`), optional <p class="lede">, then content.
</script>

<template>
  <div class="slidev-layout l-default">
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.l-default {
  height: 100%;
  padding: 50px var(--gutter) 40px;
  display: flex;
  flex-direction: column;
}
.body { flex: 1 1 auto; display: flex; flex-direction: column; gap: var(--s4); min-height: 0; }
.body :deep(> h1) { margin-bottom: 0; }
</style>
