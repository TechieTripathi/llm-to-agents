<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { CORE_SLIDES, FRONT_SLIDES, sectionFor } from './data/sections'
import { refNumber, slideSources } from './composables/useRefs'

// Footer: section name, numbered source references for this slide, slide number.
const { $frontmatter, $page } = useSlideContext()
const show = computed(() => $frontmatter.chrome !== false)
const section = computed(() => sectionFor(Number($frontmatter.section)))
const nums = computed(() =>
  slideSources($frontmatter)
    .map(k => refNumber(k))
    .filter((n): n is number => n !== undefined)
    .sort((a, b) => a - b),
)
const no = computed(() => $page.value - FRONT_SLIDES)
const pageLabel = computed(() => (no.value <= CORE_SLIDES ? String(no.value) : `A${no.value - CORE_SLIDES}`))
const dark = computed(() => $frontmatter.layout === 'statement')
</script>

<template>
  <footer v-if="show" class="foot" :class="{ dark }">
    <span class="sec">
      <template v-if="section">{{ section.no }} · {{ section.name }}</template>
      <template v-else-if="no > CORE_SLIDES">Appendix · Sources</template>
    </span>
    <span v-if="nums.length" class="src">Sources {{ nums.map(n => `[${n}]`).join(' ') }} — full list at end</span>
    <span class="no">{{ pageLabel }}</span>
  </footer>
</template>

<style scoped>
.foot {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 24px;
  font: 400 var(--fs-micro)/1.2 var(--font-sans);
  color: var(--ink-3);
  z-index: 10;
}
.sec { flex: 0 0 auto; }
.src { flex: 1 1 auto; text-align: right; }
.no { flex: 0 0 auto; margin-left: auto; font-variant-numeric: tabular-nums; color: var(--ink-2); font-weight: 500; min-width: 2.2em; text-align: right; }
.dark { color: #8a9099; }
.dark .no { color: #c9cdd3; }
</style>
