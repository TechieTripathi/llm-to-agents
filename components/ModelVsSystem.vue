<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { MODEL_CAPS, STEP_NOTES, SYSTEM_CAPS } from '../data/s1/modelSystem'
import type { Capability } from '../data/s1/modelSystem'

// Slide 4: separates what the model does from what the product or system around it provides.
// Step 0: model capabilities. Step 1: the system layer appears. Step 2: a tool call round trip.
// Any capability can be selected to see where it lives, with an example and its source.
const { step } = useArtifactStep(2)
const picked = ref<Capability | null>(null)
watch(step, () => { picked.value = null })

const showSys = computed(() => step.value >= 1)
const showCall = computed(() => step.value >= 2)
const pick = (c: Capability) => { picked.value = picked.value?.id === c.id ? null : c }
const isHot = (id: string) => picked.value?.id === id || (showCall.value && !picked.value && (id === 'propose' || id === 'run'))
const whereLabel = { model: 'The model', system: 'The system', both: 'Model and system' }
</script>

<template>
  <div class="mvs">
    <div class="diagram">
      <section class="sys" :class="{ on: showSys }">
        <header class="sys-h">
          <span class="lay-name">Product or system</span>
          <span class="lay-sub">the software around the model</span>
        </header>

        <div class="chips" :class="{ on: showSys }">
          <button
            v-for="c in SYSTEM_CAPS" :key="c.id" class="chip"
            :class="{ hot: isHot(c.id), sel: picked?.id === c.id }"
            :tabindex="showSys ? 0 : -1"
            @click.stop="pick(c)"
          >{{ c.label }}</button>
        </div>

        <div class="flow" :class="{ on: showSys }">
          <span class="f-in">
            <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="M6 1v17M2 14l4 4 4-4" /></svg>
            adds text to the context
          </span>
          <span class="f-call" :class="{ on: showCall }">
            <span class="req">
              <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="M6 19V2M2 6l4-4 4 4" /></svg>
              tool request
            </span>
            <span class="res">
              <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="M6 1v17M2 14l4 4 4-4" /></svg>
              result
            </span>
          </span>
        </div>

        <section class="ctx">
          <header class="ctx-h">
            <span class="lay-name">Context window</span>
            <span class="lay-sub">all the model sees in one request</span>
          </header>
          <section class="model">
            <header class="model-h">Model</header>
            <ul class="caps">
              <li v-for="c in MODEL_CAPS" :key="c.id">
                <button class="cap" :class="{ hot: isHot(c.id), sel: picked?.id === c.id }" @click.stop="pick(c)">
                  <svg class="mk" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <rect x="0.75" y="0.75" width="10.5" height="10.5" rx="1.5" class="mk-o" />
                    <rect x="0.75" y="0.75" :width="c.where === 'both' ? 5.25 : 10.5" height="10.5" rx="1.5" class="mk-f" />
                  </svg>
                  {{ c.label }}
                </button>
              </li>
            </ul>
          </section>
        </section>
      </section>
    </div>

    <aside class="detail">
      <Transition name="swap" mode="out-in">
        <div v-if="picked" :key="picked.id" class="d">
          <span class="where" :class="picked.where">{{ whereLabel[picked.where] }}</span>
          <h3 class="d-t">{{ picked.label }}</h3>
          <p class="d-what">{{ picked.what }}<Cite :k="picked.refs" /></p>
          <p class="d-ex"><span class="ex-k">At Kestrel Freight</span>{{ picked.example }}</p>
        </div>
        <div v-else-if="showCall" key="call" class="d">
          <span class="where both">Model and system</span>
          <h3 class="d-t">{{ STEP_NOTES[2].title }}</h3>
          <div class="xchg">
            <span class="x-k">Model</span><code class="x-v req">search_files("risk log")</code>
            <span class="x-k">System</span><code class="x-v">runs it → 14 risks, 3 new</code>
          </div>
          <p class="d-what">{{ STEP_NOTES[2].body }}</p>
          <SimTag kind="simulated" class="tag" />
        </div>
        <div v-else :key="'s' + step" class="d">
          <span class="where" :class="step === 0 ? 'model' : 'system'">{{ step === 0 ? 'The model' : 'The system' }}</span>
          <h3 class="d-t">{{ STEP_NOTES[step].title }}</h3>
          <p class="d-what">{{ STEP_NOTES[step].body }}</p>
          <p class="hint">Select any item to see where it lives.</p>
        </div>
      </Transition>
      <div class="legend">
        <span><svg class="mk" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="0.75" y="0.75" width="10.5" height="10.5" rx="1.5" class="mk-o" /><rect x="0.75" y="0.75" width="10.5" height="10.5" rx="1.5" class="mk-f" /></svg>in the model</span>
        <span><svg class="mk" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="0.75" y="0.75" width="10.5" height="10.5" rx="1.5" class="mk-o" /><rect x="0.75" y="0.75" width="5.25" height="10.5" rx="1.5" class="mk-f" /></svg>model sets the limit, system fills it</span>
        <SimTag kind="fictional" />
      </div>
    </aside>
  </div>
</template>

<style scoped>
.mvs { display: grid; grid-template-columns: 1.62fr 1fr; gap: 22px; flex: 1 1 auto; min-height: 0; align-items: start; }
.diagram { min-width: 0; display: flex; }

.lay-name { font-size: var(--fs-label); font-weight: 600; color: var(--ink); }
.lay-sub { font-size: 14px; color: var(--ink-3); margin-left: 8px; }

/* System layer */
.sys {
  flex: 1;
  display: flex; flex-direction: column;
  border: 1.5px dashed var(--rule-strong);
  border-radius: var(--radius);
  padding: 6px 10px 10px;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
.sys.on { border-style: solid; border-color: var(--ink); background: var(--stage); }
.sys-h { opacity: 0.55; transition: opacity var(--dur) var(--ease); }
.sys.on .sys-h { opacity: 1; }

.chips { display: flex; flex-wrap: nowrap; gap: 5px; margin-top: 6px; opacity: 0; transform: translateY(4px); transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.chips.on { opacity: 1; transform: none; }
.chip {
  font: 500 var(--fs-label)/1 var(--font-sans);
  padding: 6px 8px;
  white-space: nowrap;
  border: 1.5px solid var(--ink);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.chip.hot { background: var(--ink); color: var(--paper); }
.chip:focus-visible, .cap:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.flow {
  display: flex; justify-content: space-between; align-items: center;
  height: 28px; margin: 1px 4px;
  font-size: 15px; color: var(--ink-2);
  opacity: 0; transition: opacity var(--dur) var(--ease);
}
.flow.on { opacity: 1; }
.flow svg { fill: none; stroke: currentColor; stroke-width: 1.5; flex: 0 0 auto; }
.f-in { display: inline-flex; align-items: center; gap: 6px; }
.f-call { display: inline-flex; gap: 14px; margin-right: 96px; opacity: 0; transition: opacity var(--dur) var(--ease); }
.f-call.on { opacity: 1; }
.req, .res { display: inline-flex; align-items: center; gap: 5px; }
.req { color: var(--accent); }
.res { color: var(--ink); }

/* Context layer */
.ctx {
  flex: 1;
  display: flex; flex-direction: column;
  border: 1.5px solid var(--ink-3);
  border-radius: var(--radius);
  background: var(--paper);
  padding: 6px 10px 10px;
}
.ctx-h { margin-bottom: 6px; }

/* Model core */
.model {
  flex: 1;
  border: 2px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--surface);
  padding: 5px 8px 6px;
}
.model-h { font-size: var(--fs-label); font-weight: 600; color: var(--accent); margin-bottom: 2px; }
.caps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1px; }
.caps li { margin: 0; padding: 0; }
.cap {
  width: 100%;
  display: flex; align-items: center; gap: 10px;
  font: 400 17px/1.2 var(--font-sans);
  text-align: left;
  color: var(--ink);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  padding: 4px 6px;
  cursor: pointer;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.cap:hover { background: var(--accent-tint); }
.cap.hot { background: var(--accent); color: #fff; }
.mk { flex: 0 0 auto; }
.mk-o { fill: none; stroke: var(--accent); stroke-width: 1.5; }
.mk-f { fill: var(--accent); }
.cap.hot .mk-o { stroke: #fff; }
.cap.hot .mk-f { fill: #fff; }

/* Detail panel */
.detail { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.d { display: flex; flex-direction: column; gap: 9px; border-top: 1.5px solid var(--ink); padding-top: 10px; }
.where {
  align-self: flex-start;
  font: 600 var(--fs-label)/1 var(--font-sans);
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--ink);
}
.where.model { background: var(--accent); border-color: var(--accent); color: #fff; }
.where.system { background: var(--ink); color: var(--paper); }
.where.both { border-color: var(--accent); color: var(--accent); background: var(--accent-tint); }
.d-t { font-size: 21px; line-height: 1.2; margin: 0; }
.xchg { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; align-items: baseline; }
.x-k { font-size: var(--fs-label); color: var(--ink-2); }
.x-v { font-size: 15px; justify-self: start; }
.x-v.req { color: var(--accent); background: var(--accent-tint); }
.tag { align-self: flex-start; }
.d-what { font-size: 15px; line-height: 1.36; margin: 0; color: var(--ink); }
.d-ex { font-size: var(--fs-label); line-height: 1.4; margin: 0; color: var(--ink-2); }
.ex-k { display: block; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
.hint { font-size: var(--fs-label); color: var(--ink-3); margin: 0; }
.legend { margin-top: auto; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; font-size: 14px; color: var(--ink-2); }
.legend > span { display: inline-flex; align-items: center; gap: 8px; }

.swap-enter-active, .swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.swap-enter-from { opacity: 0; transform: translateY(4px); }
.swap-leave-to { opacity: 0; }
</style>
