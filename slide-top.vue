<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { JOURNEY, sectionFor } from './data/sections'

// Journey strip: shows where the current section sits on Model → Context → Tools → Agent → Workflow.
const { $frontmatter } = useSlideContext()
const show = computed(() => $frontmatter.chrome !== false && $frontmatter.section)
const section = computed(() => sectionFor(Number($frontmatter.section)))
const stage = computed(() => $frontmatter.stage ?? section.value?.stage ?? null)
const dark = computed(() => $frontmatter.layout === 'statement' || $frontmatter.layout === 'cover')
</script>

<template>
  <nav v-if="show" class="journey" :class="{ dark }" aria-label="Learning journey">
    <template v-for="(s, i) in JOURNEY" :key="s">
      <span class="step" :class="{ on: stage === s, past: stage && JOURNEY.indexOf(stage) > i }">{{ s }}</span>
      <svg v-if="i < JOURNEY.length - 1" class="arrow" width="14" height="8" viewBox="0 0 14 8" aria-hidden="true">
        <path d="M0 4h12M9 1l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.2" />
      </svg>
    </template>
  </nav>
</template>

<style scoped>
.journey {
  position: absolute;
  top: 16px;
  right: var(--gutter);
  display: flex;
  align-items: center;
  gap: 6px;
  font: 500 var(--fs-micro)/1 var(--font-sans);
  color: var(--ink-3);
  z-index: 10;
}
.step { padding: 4px 7px; border-radius: var(--radius-sm); }
.step.past { color: var(--ink-2); }
.step.on { color: #fff; background: var(--accent); }
.arrow { color: var(--rule-strong); }
.dark { color: #8a9099; }
.dark .arrow { color: #4a4f57; }
</style>
