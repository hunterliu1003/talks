<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/** Each click calls open() with a component; the HOC click pushes four in a burst. */
const STEPS = [
  { name: 'VueFinalModal', kind: 'modal', click: 1, order: 0 },
  { name: 'VueFinalDialog', kind: 'dialog', click: 2, order: 0 },
  { name: 'Dialog', kind: 'hoc', click: 3, order: 0 },
  { name: 'NavDrawer', kind: 'hoc', click: 3, order: 1 },
  { name: 'BottomSheet', kind: 'hoc', click: 3, order: 2 },
  { name: 'Spinner', kind: 'hoc', click: 3, order: 3 },
  { name: 'MyModal', kind: 'custom', click: 4, order: 0 },
] as const

type Step = (typeof STEPS)[number]

const BURST_MS = 350

const props = defineProps<{ clicks: number }>()

const hocs = STEPS.filter(s => s.kind === 'hoc')
const pushedSteps = computed(() => STEPS.filter(s => props.clicks >= s.click))
const active = computed(() => STEPS.filter(s => s.click === props.clicks))

function pushed(s: Step) {
  return props.clicks >= s.click
}
function delay(s: Step, base: number) {
  return pushed(s) ? `${base + s.order * BURST_MS}ms` : '0ms'
}
function isActive(s: Step) {
  return s.click === props.clicks
}

/** The code card shows the component being opened; during the burst it walks through the HOC names. */
const shownName = ref('…')
let timers: ReturnType<typeof setTimeout>[] = []
watch(() => props.clicks, (clicks, prev) => {
  timers.forEach(clearTimeout)
  timers = []
  const steps = active.value
  if (steps.length === 0) {
    shownName.value = pushedSteps.value.at(-1)?.name ?? '…'
    return
  }
  if (prev !== undefined && clicks < prev) {
    shownName.value = steps[steps.length - 1].name
    return
  }
  shownName.value = steps[0].name
  steps.slice(1).forEach((s) => {
    timers.push(setTimeout(() => { shownName.value = s.name }, s.order * BURST_MS))
  })
}, { immediate: true })

function chipClass(s: Step) {
  if (isActive(s)) return 'border-[var(--accent)] text-[var(--fg)] bg-[var(--accent-soft)]'
  return pushed(s) ? 'border-[var(--border)] text-[var(--fg-3)]' : 'border-[var(--border)] text-[var(--fg-2)]'
}
const hocBoxClass = computed(() => props.clicks === 3 ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]')
function miniChipClass(s: Step) {
  return pushed(s) ? 'border-[var(--accent)] text-[var(--fg)]' : 'border-[var(--border)] text-[var(--fg-3)]'
}

const line = 'h-[2px] bg-[#b0b0ab]'
const box = 'absolute border-[3px] flex flex-col items-center justify-center gap-[3px] transition-all duration-500'
function boxState(s: Step) {
  return pushed(s) ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
}
</script>

<template>
  <div class="grid grid-cols-[1.05fr_auto_1fr] gap-x-4 items-start w-full">
    <!-- the call site -->
    <div class="flex flex-col gap-2.5 min-w-0">
      <div class="card py-2.5! px-4! font-mono text-sm leading-6 text-[var(--fg-2)]">
        <div><span class="text-[#c678dd]">const</span> { open } = <span class="text-[#61afef]">useModal</span>({</div>
        <div class="pl-4">component: <span class="transition-colors duration-300" :class="clicks > 0 ? 'text-[var(--accent)] font-semibold' : 'text-[var(--fg-4)]'">{{ shownName }}</span>,</div>
        <div>})</div>
        <div class="transition-opacity duration-300" :class="clicks > 0 ? 'opacity-100' : 'opacity-30'"><span class="text-[#61afef]">open</span>()</div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="eyebrow normal-case">component 可以是</div>
        <template v-for="s in STEPS" :key="s.name">
          <div v-if="s.kind !== 'hoc'" class="rounded-md border px-3 py-[3px] text-sm transition-all duration-300 flex items-center justify-between" :class="[chipClass(s), s.kind === 'custom' ? 'border-dashed' : '']">
            <span>{{ s.kind === 'custom' ? '你自己的 Modal 元件' : s.name }}</span>
            <span class="font-mono text-[0.6rem] tracking-wider transition-opacity duration-300" :class="pushed(s) ? 'opacity-100 text-[var(--accent)]' : 'opacity-0'">opened</span>
          </div>
          <div v-else-if="s.order === 0" class="rounded-md border px-3 py-1.5 transition-all duration-300" :class="hocBoxClass">
            <div class="flex items-center justify-between text-sm" :class="clicks >= 3 ? 'text-[var(--fg)]' : 'text-[var(--fg-2)]'">
              <span>用 VueFinalModal 做的 HOC</span>
              <span class="font-mono text-[0.6rem] tracking-wider transition-opacity duration-300" :class="clicks >= 3 ? 'opacity-100 text-[var(--accent)]' : 'opacity-0'">opened ×4</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="h in hocs" :key="h.name" class="rounded border px-1.5 py-px font-mono text-[0.65rem] transition-colors duration-300" :class="miniChipClass(h)" :style="{ transitionDelay: delay(h, 0) }">{{ h.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- push -->
    <div class="flex flex-col items-center gap-0.5 self-center pt-2">
      <span class="font-mono text-[0.6rem] tracking-wider text-[var(--fg-3)] whitespace-nowrap">push</span>
      <carbon-arrow-right class="text-2xl transition-colors duration-300" :class="clicks > 0 ? 'text-[var(--accent)]' : 'text-[var(--fg-3)]'" />
    </div>

    <!-- the container -->
    <div class="flex flex-col gap-3 min-w-0">
      <div class="card py-2.5! px-4!">
        <div class="flex items-baseline justify-between mb-1.5"><span class="font-mono text-sm accent">&lt;ModalsContainer /&gt;</span><span class="font-mono text-[0.6rem] tracking-wider text-[var(--fg-3)]">modals: {{ pushedSteps.length }}</span></div>
        <div class="flex flex-col gap-[2px]">
          <div v-for="(s, i) in STEPS" :key="s.name" class="h-5 rounded border px-2 font-mono text-[11px] flex items-center gap-2 transition-all duration-500" :class="pushed(s) ? 'opacity-100 translate-x-0 border-[var(--border-strong)] text-[var(--fg-2)]' : 'opacity-0 -translate-x-6 border-transparent'" :style="{ transitionDelay: delay(s, 250) }" data-stack>
            <span class="text-[var(--fg-4)]">{{ i + 1 }}</span><span>{{ s.name }}</span><span v-if="s.kind === 'hoc'" class="ml-auto text-[9px] tracking-wider text-[var(--fg-4)]">VueFinalModal</span>
          </div>
        </div>
      </div>

      <div class="relative h-[7.8rem] rounded-lg border-2 border-[#cfcfca] bg-[#f6f6f3] overflow-hidden" data-viewport>
        <div class="h-4 flex items-center gap-1 px-2 bg-[#f8f8f6] border-b-2 border-[#cfcfca]"><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span></div>
        <div class="absolute inset-x-0 top-4 bottom-0 bg-[#f1f1ee] p-2 grid grid-cols-[1.6fr_1fr] grid-rows-[0.6fr_1.4fr] gap-1.5"><div class="col-span-2 rounded-sm border-2 border-[#c4c4bf]"></div><div class="rounded-sm border-2 border-[#c4c4bf]"></div><div class="rounded-sm border-2 border-[#c4c4bf]"></div></div>

        <!-- 1 · VueFinalModal: overlay + box -->
        <div class="absolute inset-x-0 top-4 bottom-0 bg-black/45 transition-opacity duration-500" :class="pushed(STEPS[0]) ? 'opacity-100' : 'opacity-0'" :style="{ transitionDelay: delay(STEPS[0], 600) }"></div>
        <div :class="[box, boxState(STEPS[0]), 'left-[32%] top-[26%] w-[5.2rem] h-[2.8rem] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa]']" :style="{ transitionDelay: delay(STEPS[0], 600) }" data-layer="modal"><div :class="[line, 'w-8']"></div><div :class="[line, 'w-8']"></div><div class="mt-0.5 w-4 h-[6px] border-2 border-[#b0b0ab]"></div></div>

        <!-- 2 · VueFinalDialog: native dialog on top layer -->
        <div :class="[box, boxState(STEPS[1]), 'left-[42%] top-[34%] w-[5.2rem] h-[2.8rem] border-[#6b6b66] bg-white']" :style="{ transitionDelay: delay(STEPS[1], 600) }" data-layer="dialog"><svg class="absolute top-0.5 right-0.5 w-2 h-2" viewBox="0 0 10 10" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round"><path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" /></svg><div :class="[line, 'w-8']"></div><div :class="[line, 'w-6']"></div><div class="mt-0.5 w-4 h-[6px] border-2 border-[#b0b0ab]"></div></div>

        <!-- 3 · HOCs built on VueFinalModal -->
        <div :class="[box, boxState(STEPS[2]), 'left-[52%] top-[42%] w-[5.2rem] h-[2.8rem] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa]']" :style="{ transitionDelay: delay(STEPS[2], 600) }" data-layer="hoc-dialog"><div :class="[line, 'w-8']"></div><div class="mt-0.5 flex gap-1"><div class="w-4 h-[6px] border-2 border-[#b0b0ab]"></div><div class="w-4 h-[6px] bg-[#3a8a62]"></div></div></div>
        <div class="absolute left-0 top-4 bottom-0 w-[27%] border-r-[3px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa] flex flex-col gap-[5px] p-2 pt-4 transition-transform duration-500" :class="pushed(STEPS[3]) ? 'translate-x-0' : '-translate-x-full'" :style="{ transitionDelay: delay(STEPS[3], 600) }" data-layer="hoc-drawer"><svg class="absolute top-1 right-1 w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2.5 H10.5 M1.5 6 H6 M1.5 9.5 H10.5 M10 4.5 L8.5 6 L10 7.5" /></svg><div :class="[line, 'w-8']"></div><div :class="[line, 'w-6']"></div><div :class="[line, 'w-7']"></div><div :class="[line, 'w-5']"></div></div>
        <div class="absolute inset-x-0 bottom-0 h-[34%] rounded-b-[6px] border-t-[3px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa] flex flex-col items-center gap-[4px] pt-1.5 transition-transform duration-500" :class="pushed(STEPS[4]) ? 'translate-y-0' : 'translate-y-full'" :style="{ transitionDelay: delay(STEPS[4], 600) }" data-layer="hoc-sheet"><div class="w-5 h-[3px] rounded bg-[#c4c4bf]"></div><div :class="[line, 'w-10']"></div></div>
        <div class="absolute right-[7%] top-[22%] w-7 h-7 transition-all duration-500" :class="boxState(STEPS[5])" :style="{ transitionDelay: delay(STEPS[5], 600) }" data-layer="hoc-spinner"><div class="w-full h-full rounded-full border-[4px] border-[#d8d8d4] border-t-[#3a8a62] animate-spin"></div></div>

        <!-- 4 · your own component -->
        <div :class="[box, boxState(STEPS[6]), 'left-[62%] top-[50%] w-[5.2rem] h-[2.6rem] border-dashed border-[#f472b6] bg-[#fbfbfa]']" :style="{ transitionDelay: delay(STEPS[6], 600) }" data-layer="custom"><span class="font-mono text-[0.6rem] text-[#f472b6]">MyModal</span></div>
      </div>
    </div>
  </div>
</template>
