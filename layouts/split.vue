<script setup lang="ts">
// Two-column slide. Default slot = title + intro; `::left::` and `::right::` named slots.
// `ratio` frontmatter sets the grid columns, e.g. '1fr 1.4fr'.
withDefaults(defineProps<{ ratio?: string }>(), { ratio: '1fr 1fr' })
</script>

<template>
  <div class="slidev-layout l-split">
    <div class="head"><slot /></div>
    <div class="cols" :style="{ gridTemplateColumns: ratio }">
      <div class="col"><slot name="left" /></div>
      <div class="col"><slot name="right" /></div>
    </div>
  </div>
</template>

<style scoped>
.l-split {
  height: 100%;
  padding: 50px var(--gutter) 40px;
  display: flex;
  flex-direction: column;
  gap: var(--s5);
}
.head { display: flex; flex-direction: column; gap: var(--s3); }
.cols { flex: 1 1 auto; display: grid; gap: var(--s6); min-height: 0; }
.col { min-width: 0; display: flex; flex-direction: column; gap: var(--s3); }
</style>
