<script setup lang="ts">
import { computed } from 'vue'

/** Each click calls open() with one component. */
const STEPS = [
  { name: 'VueFinalModal', kind: 'modal', click: 1, order: 0 },
  { name: 'VueFinalDialog', kind: 'dialog', click: 2, order: 0 },
  { name: 'Dialog', kind: 'hoc', click: 3, order: 0 },
  { name: 'NavDrawer', kind: 'hoc', click: 4, order: 0 },
  { name: 'BottomSheet', kind: 'hoc', click: 5, order: 0 },
  { name: 'Spinner', kind: 'hoc', click: 6, order: 0 },
  { name: 'MyModal', kind: 'custom', click: 7, order: 0 },
] as const

type Step = (typeof STEPS)[number]

const BURST_MS = 350

const props = defineProps<{ clicks: number }>()

const pushedSteps = computed(() => STEPS.filter(s => props.clicks >= s.click))
const active = computed(() => STEPS.filter(s => s.click === props.clicks))
const current = computed(() => active.value[0] ?? pushedSteps.value.at(-1))

function pushed(s: Step) {
  return props.clicks >= s.click
}
function delay(s: Step, base: number) {
  return pushed(s) ? `${base + s.order * BURST_MS}ms` : '0ms'
}
function isActive(s: Step) {
  return s.click === props.clicks
}



const line = 'h-[2px] bg-[#b0b0ab]'
const box = 'absolute border-[3px] flex flex-col items-center justify-center gap-[3px] transition-all duration-500'
function boxState(s: Step) {
  return pushed(s) ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
}
</script>

<template>
  <div class="grid grid-cols-[1fr_1.15fr] gap-x-6 items-start w-full">
    <!-- left: one call, pushed down into the container -->
    <div class="flex flex-col gap-1.5 min-w-0">
      <div class="card py-2! px-4! font-mono text-[0.8rem] leading-6 text-[var(--fg-2)]">
        <div class="whitespace-nowrap"><span class="text-[#61afef]">useModal</span>({ component: <span class="font-semibold transition-colors duration-300" :class="clicks > 0 ? 'text-[var(--accent)]' : 'text-[var(--fg-4)]'">{{ current ? current.name : '…' }}</span> }).<span class="text-[#61afef]">open</span>()</div>
        <div class="h-4 text-[0.6rem] leading-4 tracking-wider text-[var(--fg-4)] transition-opacity duration-300" :class="current && (current.kind === 'hoc' || current.kind === 'custom') ? 'opacity-100' : 'opacity-0'">{{ current && current.kind === 'custom' ? '你自己從頭寫的 Modal 元件' : '用 VueFinalModal 包出來的元件' }}</div>
      </div>

      <div class="flex items-center justify-center gap-1.5 -my-1">
        <carbon-arrow-down class="text-lg transition-colors duration-300" :class="clicks > 0 ? 'text-[var(--accent)]' : 'text-[var(--fg-3)]'" />
        <span class="font-mono text-[0.6rem] tracking-wider text-[var(--fg-3)]">push</span>
      </div>

      <div class="card py-2! px-4!">
        <div class="flex items-baseline justify-between mb-1.5"><span class="font-mono text-sm accent">&lt;ModalsContainer /&gt;</span><span class="font-mono text-[0.6rem] tracking-wider text-[var(--fg-3)]">modals: {{ pushedSteps.length }}</span></div>
        <div class="flex flex-col gap-[3px]">
          <div v-for="(s, i) in STEPS" :key="s.name" class="h-6 rounded border px-2.5 font-mono text-xs flex items-center gap-2 transition-all duration-500" :class="[pushed(s) ? 'opacity-100 translate-y-0 border-[var(--border-strong)] text-[var(--fg-2)]' : 'opacity-0 -translate-y-10 border-transparent', isActive(s) ? 'bg-[var(--accent-soft)] text-[var(--fg)]!' : '']" :style="{ transitionDelay: delay(s, 250) }" data-stack>
            <span class="text-[var(--fg-4)]">{{ i + 1 }}</span><span>{{ s.name }}</span><span v-if="s.kind === 'hoc'" class="ml-auto text-[9px] tracking-wider text-[var(--fg-4)]">VueFinalModal</span><span v-else-if="s.kind === 'custom'" class="ml-auto text-[9px] tracking-wider text-[#f472b6]">你自己的</span>
          </div>
        </div>
      </div>
    </div>

    <!-- right: what the user sees -->
    <div class="relative w-full aspect-[4/3] rounded-lg border-2 border-[#cfcfca] bg-[#f6f6f3] overflow-hidden" data-viewport>
      <div class="h-6 flex items-center gap-1.5 px-3 bg-[#f8f8f6] border-b-2 border-[#cfcfca]"><span class="w-2 h-2 rounded-full bg-[#c4c4bf]"></span><span class="w-2 h-2 rounded-full bg-[#c4c4bf]"></span><span class="w-2 h-2 rounded-full bg-[#c4c4bf]"></span></div>
      <div class="absolute inset-x-0 top-6 bottom-0 bg-[#f1f1ee] p-3 grid grid-cols-[1.6fr_1fr] grid-rows-[0.6fr_1.4fr] gap-2.5"><div class="col-span-2 rounded border-2 border-[#c4c4bf]"></div><div class="rounded border-2 border-[#c4c4bf]"></div><div class="rounded border-2 border-[#c4c4bf]"></div></div>

      <!-- 1 · VueFinalModal: overlay + box -->
      <div class="absolute inset-x-0 top-6 bottom-0 bg-black/45 transition-opacity duration-500" :class="pushed(STEPS[0]) ? 'opacity-100' : 'opacity-0'" :style="{ transitionDelay: delay(STEPS[0], 600) }"></div>
      <div :class="[box, boxState(STEPS[0]), 'left-[30%] top-[24%] w-[10rem] h-[5.6rem] gap-[6px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa]']" :style="{ transitionDelay: delay(STEPS[0], 600) }" data-layer="modal"><div :class="[line, 'w-16']"></div><div :class="[line, 'w-16']"></div><div class="mt-1 w-8 h-3 border-2 border-[#b0b0ab]"></div></div>

      <!-- 2 · VueFinalDialog: native dialog on top layer -->
      <div :class="[box, boxState(STEPS[1]), 'left-[40%] top-[32%] w-[10rem] h-[5.6rem] gap-[6px] border-[#6b6b66] bg-white']" :style="{ transitionDelay: delay(STEPS[1], 600) }" data-layer="dialog"><svg class="absolute top-1.5 right-1.5 w-3.5 h-3.5" viewBox="0 0 10 10" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round"><path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" /></svg><div :class="[line, 'w-16']"></div><div :class="[line, 'w-12']"></div><div class="mt-1 w-8 h-3 border-2 border-[#b0b0ab]"></div></div>

      <!-- 3 · HOCs built on VueFinalModal -->
      <div :class="[box, boxState(STEPS[2]), 'left-[50%] top-[40%] w-[10rem] h-[5.6rem] gap-[6px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa]']" :style="{ transitionDelay: delay(STEPS[2], 600) }" data-layer="hoc-dialog"><div :class="[line, 'w-16']"></div><div class="mt-1 flex gap-2"><div class="w-8 h-3 border-2 border-[#b0b0ab]"></div><div class="w-8 h-3 bg-[#3a8a62]"></div></div></div>
      <div class="absolute left-0 top-6 bottom-0 w-[27%] border-r-[3px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa] flex flex-col gap-[10px] p-4 pt-8 transition-transform duration-500" :class="pushed(STEPS[3]) ? 'translate-x-0' : '-translate-x-full'" :style="{ transitionDelay: delay(STEPS[3], 600) }" data-layer="hoc-drawer"><svg class="absolute top-2 right-2 w-5 h-5" viewBox="0 0 12 12" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2.5 H10.5 M1.5 6 H6 M1.5 9.5 H10.5 M10 4.5 L8.5 6 L10 7.5" /></svg><div :class="[line, 'w-16']"></div><div :class="[line, 'w-12']"></div><div :class="[line, 'w-14']"></div><div :class="[line, 'w-10']"></div></div>
      <div class="absolute inset-x-0 bottom-0 h-[30%] rounded-b-[6px] border-t-[3px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa] flex flex-col items-center gap-[8px] pt-3 transition-transform duration-500" :class="pushed(STEPS[4]) ? 'translate-y-0' : 'translate-y-full'" :style="{ transitionDelay: delay(STEPS[4], 600) }" data-layer="hoc-sheet"><div class="w-10 h-[5px] rounded bg-[#c4c4bf]"></div><div :class="[line, 'w-20']"></div></div>
      <div class="absolute right-[6%] top-[18%] w-12 h-12 transition-all duration-500" :class="boxState(STEPS[5])" :style="{ transitionDelay: delay(STEPS[5], 600) }" data-layer="hoc-spinner"><div class="w-full h-full rounded-full border-[6px] border-[#d8d8d4] border-t-[#3a8a62] animate-spin"></div></div>

      <!-- 4 · your own component -->
      <div :class="[box, boxState(STEPS[6]), 'left-[60%] top-[48%] w-[10rem] h-[5.2rem] border-dashed border-[#f472b6] bg-[#fbfbfa]']" :style="{ transitionDelay: delay(STEPS[6], 600) }" data-layer="custom"><span class="font-mono text-xs text-[#f472b6]">MyModal</span></div>
    </div>
  </div>
</template>
