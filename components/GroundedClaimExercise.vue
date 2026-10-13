<script setup lang="ts">
// Slide 57 — audience exercise: an answer written without sources, checked claim by claim
// against the fictional policy (demos/policy-excerpt.md, read verbatim).
// Clicks 1–6 reveal one verdict each; click 7 shows the answer grounded in the policy.
// Clicking a claim reveals it out of order; the right-hand buttons switch the panel.
import { computed, ref, watch } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { CLAIMS, GROUNDED_ANSWER, QUESTION, VERDICT_LABEL } from '../data/s7/grounding'
import { policyClauses, policyMeta } from '../data/s7/raw'

const { step } = useArtifactStep(CLAIMS.length + 1)
const manual = ref(new Set<number>())
const focus = ref<number | null>(null)
const panel = ref<'policy' | 'grounded' | null>(null)
watch(step, () => { manual.value = new Set(); focus.value = null; panel.value = null })

const revealed = (i: number) => i < step.value || manual.value.has(i)
function toggle(i: number) {
  const s = new Set(manual.value)
  if (s.has(i) && i >= step.value) s.delete(i)
  else s.add(i)
  manual.value = s
  focus.value = i
}

// Which claim the policy panel should point at: hovered/clicked, else the latest revealed.
const active = computed<number | null>(() => {
  if (focus.value !== null && revealed(focus.value)) return focus.value
  const last = Math.min(step.value, CLAIMS.length) - 1
  return last >= 0 ? last : null
})
const activeClaim = computed(() => (active.value === null ? null : CLAIMS[active.value]))
const showPanel = computed(() => panel.value ?? (step.value > CLAIMS.length ? 'grounded' : 'policy'))

const tally = computed(() => {
  const t = { supported: 0, contradicted: 0, absent: 0 }
  CLAIMS.forEach((c, i) => { if (revealed(i)) t[c.verdict]++ })
  return t
})
const anyRevealed = computed(() => CLAIMS.some((_, i) => revealed(i)))
const allRevealed = computed(() => CLAIMS.every((_, i) => revealed(i)))
</script>

<template>
  <div class="s7-ground">
    <!-- left: the ungrounded answer as a sign-off sheet -->
    <section class="sheet">
      <p class="q"><span class="who">{{ QUESTION.who }} asks:</span> “{{ QUESTION.text }}”</p>

      <div class="shead">
        <span class="sh-t">Answer written without the policy</span>
        <span v-if="allRevealed" class="ask">Only {{ tally.supported }} of {{ CLAIMS.length }} could be signed off</span>
        <span v-else-if="anyRevealed" class="tally">
          <Status compact state="ok" :label="`${tally.supported}`" />
          <Status compact state="bad" :label="`${tally.contradicted}`" />
          <Status compact state="warn" :label="`${tally.absent}`" />
        </span>
        <span v-else class="ask">Which would you sign off?</span>
      </div>

      <ol class="claims">
        <li
          v-for="(c, i) in CLAIMS" :key="i"
          class="claim" :class="[{ open: revealed(i), act: active === i }, c.verdict]"
          @click.stop="toggle(i)" @mouseenter="focus = i"
        >
          <span class="n">{{ i + 1 }}</span>
          <span class="ct">{{ c.text }}</span>
          <span class="vd">
            <Transition name="s7flip" mode="out-in">
              <span v-if="revealed(i)" key="v" class="vdin" :title="c.finding">
                <Status :state="VERDICT_LABEL[c.verdict].state" :label="VERDICT_LABEL[c.verdict].label" />
                <span v-if="c.clause" class="cl">§{{ c.clause }}</span>
              </span>
              <span v-else key="q" class="pending">Sign off?</span>
            </Transition>
          </span>
        </li>
      </ol>
      <div class="tags"><SimTag kind="fictional" /><SimTag kind="simulated" /></div>
    </section>

    <!-- right: the policy, or the grounded answer -->
    <section class="doc">
      <div class="dtabs" role="group" aria-label="Right panel">
        <button class="btn" :aria-pressed="showPanel === 'policy'" @click.stop="panel = 'policy'">Policy</button>
        <button class="btn" :aria-pressed="showPanel === 'grounded'" @click.stop="panel = 'grounded'">Grounded answer</button>
      </div>

      <Transition name="s7flip" mode="out-in">
        <div v-if="showPanel === 'policy'" key="p" class="paper">
          <div class="ptitle" :title="policyMeta">
            <strong>Travel and Expenses Policy</strong>
            <span class="pmeta">{{ policyMeta.split(' · ')[0] }}, excerpt</span>
          </div>
          <ul class="clauses">
            <li
              v-for="cl in policyClauses" :key="cl.id"
              class="clause" :class="[{ hit: activeClaim?.clause === cl.id }, activeClaim?.clause === cl.id ? activeClaim?.verdict : '']"
            >
              <span class="cid">{{ cl.id }}</span>
              <span class="cbody">
                <span class="ctitle">{{ cl.title }}</span>
                <Transition name="s7grow">
                  <span v-if="activeClaim?.clause === cl.id" class="ctext">{{ cl.text }}</span>
                </Transition>
              </span>
            </li>
            <li v-if="activeClaim && !activeClaim.clause" class="clause none">
              <span class="cid">—</span>
              <span class="cbody"><span class="ctitle">No clause covers this</span><span class="ctext">The excerpt is silent on mileage. Silence is not permission: ask Group Finance.</span></span>
            </li>
          </ul>
          <p v-if="!activeClaim" class="hint">Each verdict lights up the clause it rests on.</p>
        </div>

        <div v-else key="g" class="paper grounded">
          <div class="ptitle"><strong>Same question, policy attached</strong></div>
          <ul class="gans">
            <li v-for="(g, i) in GROUNDED_ANSWER" :key="i" :class="{ gap: g.gap }">
              <Status v-if="g.gap" compact state="warn" />
              <span>{{ g.text }}<span v-if="g.cite" class="gcite">§{{ g.cite }}</span></span>
            </li>
          </ul>
        </div>
      </Transition>
    </section>
  </div>
</template>

<style scoped>
.s7-ground { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1fr 296px; grid-template-rows: minmax(0, 1fr); gap: 22px; }

.sheet { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.q { margin: 0; padding: 7px 12px; background: var(--stage); border-radius: var(--radius); font-size: var(--fs-label); line-height: 1.35; color: var(--ink); }
.who { color: var(--ink-2); }

.shead { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; border-bottom: 1.5px solid var(--ink); padding-bottom: 4px; }
.sh-t { font-size: var(--fs-label); font-weight: 600; }
.ask { font-size: var(--fs-label); color: var(--accent); font-weight: 600; }
.tally { display: inline-flex; gap: 12px; }

.claims { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.claim {
  display: grid; grid-template-columns: 22px 1fr 184px; gap: 10px; align-items: center;
  margin: 0; padding: 5px 6px 5px 4px; min-height: 44px;
  border-bottom: 1px solid var(--rule);
  font-size: var(--fs-label); line-height: 1.3;
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}
.claim.act { background: var(--surface); }
.n { font-weight: 600; color: var(--ink-3); font-variant-numeric: tabular-nums; text-align: right; }
.claim.open .n { color: var(--ink); }
.ct { color: var(--ink); }
.claim.open.contradicted .ct { text-decoration: line-through; text-decoration-color: var(--bad); text-decoration-thickness: 1.5px; color: var(--ink-2); }
.vd { min-width: 0; }
.vdin { display: flex; align-items: center; gap: 8px; }
.cl { color: var(--accent); font-weight: 500; white-space: nowrap; }
.pending { display: inline-block; color: var(--ink-3); border: 1px dashed var(--rule-strong); border-radius: 999px; padding: 3px 12px; }

.doc { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.dtabs { display: flex; }
.dtabs .btn { flex: 1; border-radius: 0; padding: 7px 8px; }
.dtabs .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
.dtabs .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-left: -1px; }

.paper { flex: 1 1 auto; min-height: 0; position: relative; background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 8px 14px; overflow: hidden; display: flex; flex-direction: column; gap: 6px; }
.ptitle { display: flex; flex-direction: column; font-size: var(--fs-label); line-height: 1.3; border-bottom: 1px solid var(--rule); padding-bottom: 6px; }
.pmeta { color: var(--ink-2); }
.hint { margin: auto 0 0; font-size: var(--fs-label); color: var(--ink-3); }
.tags { margin-top: auto; display: flex; gap: 10px; }

.clauses { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2px 6px; }
.clause.hit, .clause.none { grid-column: 1 / -1; }
.clause { display: grid; grid-template-columns: 28px 1fr; gap: 4px; margin: 0; padding: 3px 6px; font-size: var(--fs-label); line-height: 1.3; border-left: 3px solid transparent; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.cid { color: var(--ink-3); font-variant-numeric: tabular-nums; }
.cbody { display: flex; flex-direction: column; }
.ctitle { color: var(--ink-2); }
.ctext { color: var(--ink); margin-top: 2px; }
.clause.hit .ctitle { color: var(--ink); font-weight: 600; }
.clause.hit.supported { border-color: var(--ok); background: var(--ok-tint); }
.clause.hit.contradicted { border-color: var(--bad); background: var(--bad-tint); }
.clause.none { border: 1px dashed var(--warn); border-left-width: 3px; background: var(--warn-tint); margin-top: 4px; }

.gans { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
.gans li { display: flex; gap: 8px; align-items: baseline; margin: 0; padding: 0; font-size: var(--fs-label); line-height: 1.28; }
.gans li.gap { background: var(--warn-tint); padding: 4px 6px; border-radius: var(--radius-sm); }
.gcite { color: var(--accent); font-weight: 500; margin-left: 6px; white-space: nowrap; }

.s7flip-enter-active, .s7flip-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.s7flip-enter-from { opacity: 0; transform: translateY(4px); }
.s7flip-leave-to { opacity: 0; }
.s7grow-enter-active { transition: opacity var(--dur) var(--ease); }
.s7grow-enter-from { opacity: 0; }
</style>
