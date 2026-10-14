<script setup lang="ts">
import { computed } from 'vue'

interface Contributor {
  login: string
  contributions: number
}

const props = withDefaults(defineProps<{
  contributors: Contributor[]
  /** radius of the largest circle in px */
  maxRadius?: number
  /** radius of the smallest circle in px */
  minRadius?: number
  gap?: number
}>(), { maxRadius: 80, minRadius: 28, gap: 3 })

interface Placed extends Contributor { x: number; y: number; r: number }

/** Biggest first at the origin, then each next circle takes the closest spot on an outward spiral that does not overlap. */
const placed = computed<Placed[]>(() => {
  const sorted = [...props.contributors].sort((a, b) => b.contributions - a.contributions)
  const max = Math.sqrt(sorted[0]?.contributions ?? 1)
  const min = Math.sqrt(sorted[sorted.length - 1]?.contributions ?? 1)
  const scale = (c: number) => {
    const t = max === min ? 1 : (Math.sqrt(c) - min) / (max - min)
    return props.minRadius + t * (props.maxRadius - props.minRadius)
  }
  const out: Placed[] = []
  for (const c of sorted) {
    const r = scale(c.contributions)
    if (out.length === 0) {
      out.push({ ...c, x: 0, y: 0, r })
      continue
    }
    let best: { x: number; y: number } | undefined
    for (let dist = 0; dist < 2000 && !best; dist += 2) {
      const steps = Math.max(12, Math.floor(dist / 3))
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2 + dist * 0.05
        const x = Math.cos(a) * dist
        const y = Math.sin(a) * dist * 0.68
        if (out.every(p => Math.hypot(p.x - x, p.y - y) >= p.r + r + props.gap)) {
          best = { x, y }
          break
        }
      }
    }
    out.push({ ...c, x: best!.x, y: best!.y, r })
  }
  return out
})

const bounds = computed(() => {
  const xs = placed.value.flatMap(p => [p.x - p.r, p.x + p.r])
  const ys = placed.value.flatMap(p => [p.y - p.r, p.y + p.r])
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
})

const base = import.meta.env.BASE_URL
</script>

<template>
  <div
    class="relative mx-auto"
    :style="{ width: `${bounds.maxX - bounds.minX}px`, height: `${bounds.maxY - bounds.minY}px` }"
  >
    <a
      v-for="p in placed"
      :key="p.login"
      :href="`https://github.com/${p.login}`"
      target="_blank"
      rel="noopener"
      class="absolute z-0 hover:z-10 no-underline border-none! rounded-full overflow-hidden border-2 border-[var(--border)] transition-transform duration-300 hover:scale-110"
      :style="{ left: `${p.x - p.r - bounds.minX}px`, top: `${p.y - p.r - bounds.minY}px`, width: `${p.r * 2}px`, height: `${p.r * 2}px` }"
      :title="`${p.login} · ${p.contributions} commits`"
    >
      <img :src="`${base}contributors/${p.login}.png`" :alt="p.login" class="w-full h-full object-cover" />
    </a>
  </div>
</template>
