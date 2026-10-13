<script setup lang="ts">
// Slide 56 — Prompt laboratory (spec Artifact D). Same task and source, three prompt variants.
// Clicks: 0 vague → 1 structured → 2 context-rich → 3 compare all. Buttons jump directly.
import { computed } from 'vue'
import { useArtifactStep } from '../composables/useArtifactStep'
import { LAB_TASK, MUST_COVER, VARIANTS } from '../data/s7/promptlab'
import { statusSection } from '../data/s7/raw'

const { step, go } = useArtifactStep(3)
const v = computed(() => VARIANTS[Math.min(step.value, 2)])
const comparing = computed(() => step.value === 3)
const excerpt = statusSection(5)
const circled = ['①', '②', '③', '④', '⑤', '⑥']
const coverCount = (i: number) => VARIANTS[i].cover.filter(c => c.state === 'ok').length
const goodFor = ['Brainstorming, tone and first structure', 'When you will fill in the facts yourself', 'When the facts live in documents']
</script>

<template>
  <Stage :task="`Task: ${LAB_TASK}`" :tag="false">
    <template #controls>
      <div class="seg" role="group" aria-label="Prompt variant">
        <button v-for="(x, i) in VARIANTS" :key="x.id" class="btn" :aria-pressed="step === i" @click.stop="go(i)">{{ x.name }}</button>
        <button class="btn" :aria-pressed="comparing" @click.stop="go(3)">Compare all</button>
      </div>
    </template>

    <Transition name="s7swap" mode="out-in">
      <div v-if="!comparing" :key="v.id" class="lab">
        <!-- prompt -->
        <section class="col prompt">
          <h4 class="ph4">Prompt <span class="srcflag" :class="{ on: v.withExcerpt }">{{ v.withExcerpt ? '+ source attached' : 'no source attached' }}</span></h4>
          <div class="ptext">
            <p v-for="(l, i) in v.prompt" :key="i">{{ l }}</p>
          </div>
          <div v-if="v.withExcerpt" class="excerpt" :title="excerpt.join('\n')">
            <span class="ex-k">+ pasted below the prompt</span>
            <span class="ex-n"><span class="ex-f">status report §5</span>, {{ excerpt.length }} lines</span>
          </div>
        </section>

        <!-- output -->
        <section class="col output">
          <h4 class="outh">Output <SimTag kind="simulated" /></h4>
          <article class="mail">
            <p v-for="(para, pi) in v.output" :key="pi" :class="{ subj: pi === 0, note: para[0]?.note }">
              <template v-for="(sg, si) in para" :key="si">
                <span v-if="sg.ph" class="ph">{{ sg.t }}</span>
                <span v-else-if="sg.mark" class="assume">{{ sg.t }}<sup>{{ circled[sg.mark - 1] }}</sup></span>
                <template v-else>{{ sg.t }}</template>
              </template>
            </p>
          </article>
        </section>

        <!-- evaluation -->
        <section class="col evalc">
          <h4>Against the report</h4>
          <ul class="cover">
            <li v-for="(item, i) in MUST_COVER" :key="item" :title="v.cover[i].why">
              <Status compact :state="v.cover[i].state" />
              <span>{{ item }}</span>
            </li>
          </ul>
          <div class="metric">
            <span class="big" :class="v.assumptions.length ? 'warn' : 'ok'">{{ v.assumptions.length }}</span>
            <span class="mlab">unsupported<br>assumptions</span>
          </div>
          <div class="metric effort">
            <span class="bars" :aria-label="`Editing effort ${v.effort.label}`"><i v-for="n in 3" :key="n" :class="{ on: n <= v.effort.level }" /></span>
            <span class="mlab"><strong>{{ v.effort.label }}</strong> edit<br><span class="muted">{{ v.effort.why }}</span></span>
          </div>
        </section>
      </div>

      <!-- compare all -->
      <div v-else key="compare" class="compare">
        <div class="crow chead">
          <span>Prompt</span><span>Covers the 5 facts</span><span>Unsupported<br>assumptions</span><span>Editing</span><span>Good enough when…</span>
        </div>
        <div v-for="(x, i) in VARIANTS" :key="x.id" class="crow">
          <span class="cname">{{ x.name }}</span>
          <span class="icons">
            <Status v-for="(c, ci) in x.cover" :key="ci" compact :state="c.state" />
            <span class="cnt">{{ coverCount(i) }}/5</span>
          </span>
          <span class="big" :class="x.assumptions.length ? 'warn' : 'ok'">{{ x.assumptions.length }}</span>
          <span class="edit"><span class="bars"><i v-for="n in 3" :key="n" :class="{ on: n <= x.effort.level }" /></span>{{ x.effort.label }}</span>
          <span class="good">{{ goodFor[i] }}</span>
        </div>
        <div class="cfoot">
          <p class="caveat">
            Context-rich did best here because the facts sat in a document. That is not a law: format changes alone can swing results, and what works differs between models<Cite k="sclar2024formatting" />.
          </p>
          <SimTag kind="simulated" />
        </div>
      </div>
    </Transition>
  </Stage>
</template>

<style scoped>
.seg { display: inline-flex; }
.seg .btn { border-radius: 0; margin-left: -1px; padding: 6px 11px; }
.seg .btn:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); margin-left: 0; }
.seg .btn:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-left: 10px; }

.lab { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 262px 1fr 180px; grid-template-rows: minmax(0, 1fr); gap: 14px; }
.col { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
h4 { margin: 0; font: 600 var(--fs-label)/1.2 var(--font-sans); color: var(--ink-2); }
.outh { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

.ptext { background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 7px 10px; font: 400 15px/1.3 var(--font-mono); color: var(--ink); }
.ptext p { margin: 0 0 4px; }
.ptext p:last-child { margin: 0; }
.excerpt { display: flex; flex-direction: column; gap: 1px; border: 1px dashed var(--accent); background: var(--accent-tint); border-radius: var(--radius-sm); padding: 6px 10px; font-size: var(--fs-label); line-height: 1.25; }
.ex-k { color: var(--accent); font-weight: 600; }
.ex-f { font: 400 15px/1.3 var(--font-mono); color: var(--ink); }
.ex-n { color: var(--ink-2); }
.ph4 { display: flex; justify-content: space-between; align-items: baseline; }
.srcflag { font-weight: 400; color: var(--ink-3); }
.srcflag.on { color: var(--accent); font-weight: 500; }

.mail { flex: 1 1 auto; background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius-sm); padding: 8px 12px; font-size: var(--fs-label); line-height: 1.34; overflow: hidden; }
.mail p { margin: 0 0 6px; }
.mail .subj { font-weight: 600; padding-bottom: 5px; border-bottom: 1px solid var(--rule); }
.mail .note { border-left: 3px solid var(--accent); background: var(--accent-tint); padding: 4px 8px; color: var(--ink); margin-top: 4px; }
.assume { text-decoration: underline wavy var(--warn); text-decoration-thickness: 1.5px; text-underline-offset: 3px; background: var(--warn-tint); }
.assume sup { color: var(--warn); font-weight: 600; margin-left: 1px; font-size: 14px; }
.ph { font: 500 15px/1 var(--font-mono); color: var(--accent); border: 1px dashed var(--accent); border-radius: var(--radius-sm); padding: 1px 4px; }

.evalc { gap: 8px; }
.cover { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
.cover li { display: flex; align-items: center; gap: 8px; margin: 0; padding: 0; font-size: var(--fs-label); }
.metric { display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--rule); padding-top: 8px; }
.big { font: 600 32px/1 var(--font-sans); font-variant-numeric: tabular-nums; min-width: 26px; }
.big.warn { color: var(--warn); }
.big.ok { color: var(--ok); }
.mlab { font-size: var(--fs-label); line-height: 1.25; color: var(--ink); }
.bars { display: inline-flex; gap: 3px; align-items: flex-end; }
.bars i { width: 7px; border-radius: 1px; background: var(--rule); display: inline-block; }
.bars i:nth-child(1) { height: 12px; } .bars i:nth-child(2) { height: 20px; } .bars i:nth-child(3) { height: 28px; }
.bars i.on { background: var(--ink); }

.compare { flex: 1 1 auto; display: flex; flex-direction: column; gap: 0; }
.crow { display: grid; grid-template-columns: 130px 210px 120px 130px 1fr; align-items: center; gap: 12px; padding: 10px 4px; border-bottom: 1px solid var(--rule); font-size: var(--fs-label); }
.chead { color: var(--ink-2); padding-top: 0; border-bottom: 1.5px solid var(--ink); line-height: 1.2; }
.cname { font-weight: 600; font-size: var(--fs-small); }
.icons { display: inline-flex; gap: 6px; align-items: center; }
.cnt { margin-left: 6px; color: var(--ink-2); font-variant-numeric: tabular-nums; }
.edit { display: inline-flex; align-items: flex-end; gap: 10px; }
.good { color: var(--ink); }
.cfoot { display: flex; align-items: flex-start; gap: 24px; justify-content: space-between; margin-top: 12px; }
.caveat { margin: 0; font-size: var(--fs-label); color: var(--ink-2); line-height: 1.4; max-width: 70ch; }

.s7swap-enter-active, .s7swap-leave-active { transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
.s7swap-enter-from { opacity: 0; transform: translateY(6px); }
.s7swap-leave-to { opacity: 0; }
</style>
