<script setup lang="ts">
// Slide 1: title. Typography carries the slide; one small, precise diagram shows the course path.
// Each glyph is the previous one plus exactly one new layer, and the model (accent square) never changes.
const STAGES = ['Model', 'Context', 'Tools', 'Agent', 'Workflow'] as const
</script>

<template>
  <div class="title-slide">
    <div class="top">
      <h1 class="t1">From LLMs to AI Agents</h1>
      <p class="t2">Transforming Professional Productivity</p>
      <p class="sub">Understanding the technology, mastering the tools,<br>and engineering reliable AI&#8209;powered workflows</p>
    </div>

    <div class="bottom">
      <ol class="path" aria-label="Course path: model, context, tools, agent, workflow">
        <li v-for="(s, i) in STAGES" :key="s" class="st" :style="{ '--i': i }">
          <svg class="glyph" viewBox="0 0 96 64" width="96" height="64" aria-hidden="true">
            <!-- Workflow: a lane with a check before delivery -->
            <g v-if="i >= 4" class="g-line">
              <rect x="1.5" y="1.5" width="93" height="61" rx="3" />
              <circle cx="87" cy="32" r="5" class="chk" />
              <path d="M84.6 32.2l1.7 1.7 3.1-3.4" class="tick" />
            </g>
            <!-- Agent: a loop around the system -->
            <g v-if="i >= 3" class="g-line">
              <path d="M29 17a17 15 0 0 1 30 0" />
              <path d="M54.6 15.4l4.4 1.8 1.2-4.6" />
            </g>
            <!-- Tools: two connectors out of the context frame -->
            <g v-if="i >= 2" class="g-line">
              <path d="M63 26h10M63 38h10" />
              <circle cx="76" cy="26" r="3" />
              <circle cx="76" cy="38" r="3" />
            </g>
            <!-- Context: the frame of information around the model -->
            <g v-if="i >= 1" class="g-line">
              <rect x="25" y="20" width="38" height="24" rx="2" />
            </g>
            <!-- Model -->
            <rect x="37" y="25" width="14" height="14" rx="1.5" class="core" />
          </svg>
          <span class="lab">{{ s }}</span>
          <svg v-if="i < STAGES.length - 1" class="arr" width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
            <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </li>
      </ol>
      <div class="meta">
        <span>A two-hour workshop for IT and non-IT professionals</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.top { padding-top: 18px; }
.t1 {
  font-size: 62px;
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.03em;
  max-width: none;
  margin: 0;
}
.t2 {
  margin: 10px 0 0;
  font-size: 38px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--ink);
}
.sub {
  margin: 28px 0 0;
  font-size: var(--fs-body);
  line-height: 1.4;
  color: var(--ink-2);
  max-width: none;
}

.bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid var(--rule);
  padding-top: 18px;
}
.path { list-style: none; margin: 0; padding: 0; display: flex; align-items: flex-start; gap: 0; }
.st {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 96px 30px;
  grid-template-rows: 64px auto;
  row-gap: 6px;
  animation: rise 0.5s var(--ease) both;
  animation-delay: calc(0.15s + var(--i) * 0.12s);
}
.st:last-child { grid-template-columns: 96px; }
.glyph { grid-column: 1; grid-row: 1; overflow: visible; }
.arr { grid-column: 2; grid-row: 1; align-self: center; justify-self: center; color: var(--rule-strong); }
.lab { grid-column: 1; grid-row: 2; text-align: center; font-size: var(--fs-label); color: var(--ink-2); }
.st:last-child .lab { color: var(--ink); font-weight: 500; }

.g-line { fill: none; stroke: var(--ink); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.g-line circle { fill: var(--paper); }
.g-line .tick { stroke: var(--ok); stroke-width: 1.6; }
.g-line .chk { stroke: var(--ok); }
.core { fill: var(--accent); }

.meta { font-size: var(--fs-label); color: var(--ink-2); text-align: right; max-width: 22ch; line-height: 1.35; padding-bottom: 26px; }

@keyframes rise {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .st { animation: none; }
}
</style>
