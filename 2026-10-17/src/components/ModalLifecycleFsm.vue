<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ stage: number }>()

const STEP = {
  states: 1,
  openStopped: 2,
  alreadyClosed: 3,
  openCalled: 4,
  opening: 5,
  opened: 6,
  closeStopped: 7,
  alreadyOpen: 8,
  closeCalled: 9,
  closing: 10,
  closed: 11,
  reversed: 12,
} as const

const NODE_W = 104
const NODE_H = 36
const NODES = [
  { name: 'closed', x: 95, y: 135, settled: true },
  { name: 'opening', x: 290, y: 40, settled: false },
  { name: 'opened', x: 485, y: 135, settled: true },
  { name: 'closing', x: 290, y: 230, settled: false },
]

/** The state the walk-through stands on; none once it moves past the normal cycle. */
const CURRENT: [number, string][] = [
  [STEP.reversed, ''],
  [STEP.closed, 'closed'],
  [STEP.closing, 'closing'],
  [STEP.opened, 'opened'],
  [STEP.opening, 'opening'],
  [STEP.states, 'closed'],
]
const current = computed(() => CURRENT.find(([at]) => props.stage >= at)?.[1] ?? '')

const EDGES = [
  { at: STEP.openCalled, d: 'M 125 117 Q 150 40 236 40' },
  { at: STEP.opened, d: 'M 344 40 Q 450 40 475 115' },
  { at: STEP.closeCalled, d: 'M 475 155 Q 450 230 346 230' },
  { at: STEP.closed, d: 'M 236 230 Q 130 230 107 155' },
]

function shown(at: number) {
  return props.stage >= at
}
function fade(at: number, delay = 0) {
  return { opacity: shown(at) ? 1 : 0, transitionDelay: shown(at) ? `${delay}ms` : '0ms' }
}
</script>

<template>
  <div class="w-full [--fsm-alt:#b45309] dark:[--fsm-alt:#fbbf24]">
    <svg viewBox="0 0 580 272" class="w-full overflow-visible" data-fsm>
      <defs>
        <marker id="fsm-arrow-main" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 1 1 L 9 5 L 1 9 z" style="fill: var(--accent)" />
        </marker>
        <marker id="fsm-arrow-alt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 1 1 L 9 5 L 1 9 z" style="fill: var(--fsm-alt)" />
        </marker>
      </defs>

      <!-- the normal cycle: each edge draws itself, its arrowhead lands once the line is done -->
      <g v-for="e in EDGES" :key="e.at" :data-edge="e.at">
        <path :d="e.d" fill="none" stroke-width="2" pathLength="1" stroke-dasharray="1" class="transition-[stroke-dashoffset] duration-700 ease-out" :style="{ stroke: 'var(--accent)', strokeDashoffset: shown(e.at) ? 0 : 1 }" />
        <path :d="e.d" fill="none" stroke-width="2" marker-end="url(#fsm-arrow-main)" class="transition-opacity duration-200" :style="{ stroke: 'transparent', ...fade(e.at, 650) }" />
      </g>

      <g class="transition-opacity duration-500" :style="fade(STEP.openCalled, 300)">
        <text x="160" y="50" text-anchor="end" class="font-mono" style="font-size: 14px; fill: var(--fg)">open()</text>
      </g>
      <g class="transition-opacity duration-500" :style="fade(STEP.opened, 300)">
        <text x="452" y="60" style="font-size: 13px; fill: var(--fg-2)">轉場結束 <tspan class="font-mono" style="fill: var(--accent)">resolve 'opened'</tspan></text>
      </g>
      <g class="transition-opacity duration-500" :style="fade(STEP.closeCalled, 300)">
        <text x="456" y="224" class="font-mono" style="font-size: 13px; fill: var(--fg)">close() · Esc · 點外面</text>
      </g>
      <g class="transition-opacity duration-500" :style="fade(STEP.closed, 300)">
        <text x="136" y="219" text-anchor="end" style="font-size: 13px; fill: var(--fg-2)">轉場結束 <tspan class="font-mono" style="fill: var(--accent)">resolve 'closed'</tspan></text>
      </g>

      <!-- stopped by beforeOpen / beforeClose: stays where it is -->
      <g class="transition-opacity duration-500" :style="fade(STEP.openStopped)" data-fsm-stop="open">
        <path d="M 125 117 C 132 90, 92 84, 96 116" fill="none" stroke-width="1.6" stroke-dasharray="5 4" style="stroke: var(--fsm-alt)" marker-end="url(#fsm-arrow-alt)" />
        <text x="86" y="105" text-anchor="end" class="font-mono" style="font-size: 13px; fill: var(--fg)">beforeOpen stop()</text>
      </g>
      <g class="transition-opacity duration-500" :style="fade(STEP.closeStopped)" data-fsm-stop="close">
        <path d="M 475 155 C 468 182, 508 188, 504 154" fill="none" stroke-width="1.6" stroke-dasharray="5 4" style="stroke: var(--fsm-alt)" marker-end="url(#fsm-arrow-alt)" />
        <text x="514" y="176" class="font-mono" style="font-size: 13px; fill: var(--fg)">beforeClose stop()</text>
      </g>

      <!-- already there: nothing moves -->
      <g class="transition-opacity duration-500" :style="fade(STEP.alreadyClosed)" data-fsm-already="closed">
        <path d="M 43 143 C 6 160, 6 110, 43 127" fill="none" stroke-width="1.6" stroke-dasharray="5 4" style="stroke: var(--fsm-alt)" marker-end="url(#fsm-arrow-alt)" />
        <text x="4" y="139.5" text-anchor="end" class="font-mono" style="font-size: 13px; fill: var(--fg)">再 close()</text>
      </g>
      <g class="transition-opacity duration-500" :style="fade(STEP.alreadyOpen)" data-fsm-already="open">
        <path d="M 537 127 C 574 110, 574 160, 537 143" fill="none" stroke-width="1.6" stroke-dasharray="5 4" style="stroke: var(--fsm-alt)" marker-end="url(#fsm-arrow-alt)" />
        <text x="576" y="139.5" class="font-mono" style="font-size: 13px; fill: var(--fg)">再 open()</text>
      </g>

      <!-- reversed midway: the waiting promise resolves with a reason -->
      <g class="transition-opacity duration-500" :style="fade(STEP.reversed)" data-fsm-reverse>
        <path d="M 278 60 L 278 208" fill="none" stroke-width="1.6" stroke-dasharray="5 4" style="stroke: var(--fsm-alt)" marker-end="url(#fsm-arrow-alt)" />
        <path d="M 302 210 L 302 62" fill="none" stroke-width="1.6" stroke-dasharray="5 4" style="stroke: var(--fsm-alt)" marker-end="url(#fsm-arrow-alt)" />
        <text x="314" y="139.5" style="font-size: 13px; fill: var(--fg)">中途反轉</text>
      </g>

      <g class="transition-opacity duration-500" :style="fade(STEP.states)">
        <g v-for="n in NODES" :key="n.name" :data-state="n.name" :data-current="current === n.name ? '' : undefined">
          <rect
            :x="n.x - NODE_W / 2" :y="n.y - NODE_H / 2" :width="NODE_W" :height="NODE_H" rx="10"
            :stroke-dasharray="n.settled ? undefined : '5 4'"
            class="transition-all duration-500"
            :style="{ fill: current === n.name ? 'var(--accent-soft)' : 'var(--bg-elevated)', stroke: 'var(--accent)', strokeWidth: current === n.name ? 3.5 : 2 }"
          />
          <text :x="n.x" :y="n.y + 5" text-anchor="middle" class="font-mono" style="font-size: 15px; font-weight: 600; fill: var(--fg)">{{ n.name }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>
