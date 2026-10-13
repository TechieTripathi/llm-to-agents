<script setup lang="ts">
// Slide 54 — "What studies found": measured results differ by task type and setting.
// Figures checked against the primary sources on 2026-10-13 (see data/refs/s6.ts and the notes).
const ROWS: { task: string, n: string, result: string, state: 'ok' | 'warn' | 'neutral', label: string, k: string[] }[] = [
  { task: 'Customer support', n: '5,172 agents', result: '+15% issues resolved per hour', state: 'ok', label: 'Gain', k: ['brynjolfsson2025genai'] },
  { task: 'Writing tasks', n: '453 people', result: '40% less time, 18% better quality', state: 'ok', label: 'Gain', k: ['noy2023science'] },
  { task: 'Consulting', n: '758 people', result: 'Better inside AI’s abilities; 19% less often correct outside', state: 'warn', label: 'Mixed', k: ['dellacqua2026jagged'] },
  { task: 'Coding', n: 'several studies', result: 'From 55.8% faster to 19% slower', state: 'warn', label: 'Mixed', k: ['peng2023copilot', 'becker2025metr'] },
  { task: 'Whole jobs, Denmark', n: '11 occupations', result: 'About 3% of hours saved (self-reported)', state: 'neutral', label: 'Small', k: ['humlum2025denmark'] },
]
</script>

<template>
  <section class="ev">
    <header class="eh">What studies measured</header>
    <ul class="rows">
      <li v-for="r in ROWS" :key="r.task">
        <span class="top">
          <strong>{{ r.task }}</strong><Cite :k="r.k" /><span class="who">· {{ r.n }}</span>
          <Status :state="r.state" :label="r.label" compact class="st" />
        </span>
        <span class="res">{{ r.result }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.ev { display: flex; flex-direction: column; gap: 2px; min-height: 0; padding: 0 0 0 18px; border-left: 1.5px solid var(--rule); }
.eh { font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink); }
.rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.rows li { line-height: 1.25; margin: 0; padding: 4px 0; border-bottom: 1px solid var(--rule); display: flex; flex-direction: column; gap: 0; }
.rows li:last-child { border-bottom: 0; }
.top { display: flex; align-items: center; gap: 2px; font-size: 15px; line-height: 1.25; white-space: nowrap; }
.st { margin-left: auto; font-size: 14px; }
.who { font-size: 14px; color: var(--ink-2); margin-left: 4px; white-space: nowrap; }
.res { font-size: 15px; line-height: 1.25; color: var(--ink); }
</style>
