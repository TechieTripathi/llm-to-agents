<script setup lang="ts">
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { EVOLUTION_LABELS, OPEN_QUESTIONS } from '../data/s3/evolution'

// Slide 17 companion to the magic-move prompt: the guesses a reader would have to make,
// resolved one by one as the request turns into a specification.
const { step } = useArtifactStep(3)
const open = computed(() => OPEN_QUESTIONS.filter(q => q.answeredAt > step.value).length)
</script>

<template>
  <div class="evo">
    <div class="head">
      <span class="h">Guesses a new colleague would have to make</span>
    </div>
    <ul class="qs">
      <li v-for="q in OPEN_QUESTIONS" :key="q.q" :class="{ done: q.answeredAt <= step }">
        <span class="q">{{ q.q }}</span>
        <Transition name="swap" mode="out-in">
          <Status v-if="q.answeredAt <= step" key="ok" state="ok" :label="q.by" />
          <Status v-else key="guess" state="warn" label="Guess" />
        </Transition>
      </li>
    </ul>
    <div class="tally">
      <span class="num">{{ open }}</span>
      <span class="lab">{{ open === 1 ? 'guess' : 'guesses' }} left · <em>{{ EVOLUTION_LABELS[step] }}</em></span>
    </div>
  </div>
</template>

<style scoped>
.evo { display: flex; flex-direction: column; gap: 10px; height: 100%; }
.h { font-size: var(--fs-label); color: var(--ink-2); font-weight: 500; }
.qs { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
.qs li {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 8px 0; margin: 0;
  border-bottom: 1px solid var(--rule);
  font-size: var(--fs-small);
  transition: color var(--dur) var(--ease);
}
.qs li:first-child { border-top: 1px solid var(--rule); }
.q { color: var(--ink); }
.done .q { color: var(--ink-3); }
.tally { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; }
.num { font-size: 44px; font-weight: 600; line-height: 1; color: var(--accent); font-variant-numeric: tabular-nums; min-width: 0.7em; }
.lab { font-size: var(--fs-label); color: var(--ink-2); }
.lab em { font-style: normal; color: var(--ink); }
.swap-enter-active, .swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateX(6px); }
.swap-leave-to { opacity: 0; }
</style>
