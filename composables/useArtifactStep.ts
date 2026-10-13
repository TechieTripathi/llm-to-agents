import { computed, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

/**
 * Step state for an artifact that can be driven by BOTH the presenter's clicker
 * (Slidev clicks, so PDF export captures every state) and on-screen buttons.
 *
 * - Declare `clicks: <max>` in the slide frontmatter so the clicker advances it.
 * - Buttons call `go()/next()/prev()/reset()`; a click change clears the manual override.
 * - `offset` lets a slide spend some clicks on v-click reveals before the artifact starts.
 */
export function useArtifactStep(max: number, opts: { offset?: number, initial?: number } = {}) {
  const { $clicks } = useSlideContext()
  const offset = opts.offset ?? 0
  const manual = ref<number | null>(null)

  watch($clicks, () => { manual.value = null })

  const fromClicks = computed(() => Math.min(max, Math.max(opts.initial ?? 0, ($clicks.value ?? 0) - offset)))
  const step = computed(() => manual.value ?? fromClicks.value)

  const go = (n: number) => { manual.value = Math.min(max, Math.max(0, n)) }
  const next = () => go(step.value + 1)
  const prev = () => go(step.value - 1)
  const reset = () => go(opts.initial ?? 0)

  return { step, max, go, next, prev, reset }
}
