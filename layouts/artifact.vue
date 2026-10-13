<script setup lang="ts">
// Artifact slide: compact title row, then an artifact that fills the remaining space.
// Optional `lede` frontmatter shows one sentence beside the title.
// The artifact is sized to its content and centred vertically. Optional `scale` frontmatter
// (e.g. 0.96) overrides the default --artifact-scale for sparse slides.
const props = defineProps<{ lede?: string, scale?: number | string }>()
</script>

<template>
  <div class="slidev-layout l-artifact">
    <header class="head">
      <slot name="title" />
      <p v-if="lede" class="lede-side">{{ lede }}</p>
    </header>
    <div class="body" :style="props.scale ? { zoom: String(props.scale) } : undefined">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.l-artifact {
  height: 100%;
  padding: 46px var(--gutter) 36px;
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}
.head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--s6); }
.head :deep(h1) { font-size: 26px; max-width: none; flex: 1 1 auto; }
.head:has(.lede-side) :deep(h1) { max-width: 26ch; }
.lede-side { margin: 0; flex: 0 1 34ch; max-width: 34ch; font-size: var(--fs-small); color: var(--ink-2); line-height: 1.35; }
.body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: var(--s3); zoom: var(--artifact-scale); }
/* Components size to their content instead of stretching to the footer. */
.body > :deep(*) { flex: 0 1 auto !important; }
</style>
