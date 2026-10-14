<script setup lang="ts">
import { computed } from 'vue'

/** Quadrants in talk order: 1 top-right, 2 top-left, 3 bottom-left, 4 bottom-right; `start` is the click that zooms in, `variants` how many clicks it owns. */
const QUADRANTS = [
  { start: 1, variants: 4, pos: 'right-[11.25rem] top-[3.8rem]', zoom: 'translate(-13.5rem, 9rem) scale(1.8)' },
  { start: 5, variants: 3, pos: 'left-[11.25rem] top-[3.8rem]', zoom: 'translate(13.5rem, 9rem) scale(1.8)' },
  { start: 8, variants: 2, pos: 'left-[11.25rem] bottom-[3.8rem]', zoom: 'translate(13.5rem, -9rem) scale(1.8)' },
  { start: 10, variants: 1, pos: 'right-[11.25rem] bottom-[3.8rem]', zoom: 'translate(-13.5rem, -9rem) scale(1.8)' },
]

const props = defineProps<{ clicks: number }>()

const focus = computed(() => QUADRANTS.findIndex(q => props.clicks >= q.start && props.clicks < q.start + q.variants))
const zoomed = computed(() => focus.value >= 0)

function shown(q: number) {
  return props.clicks >= QUADRANTS[q].start
}
/** The variant a quadrant shows: the one being clicked through while in focus, the last one once the talk has moved on, the first before it is reached. */
function variant(q: number) {
  const { start, variants } = QUADRANTS[q]
  if (focus.value === q) return props.clicks - start
  return props.clicks >= start + variants ? variants - 1 : 0
}
/** Each layer enters from where that component comes from on a real page; the window clips the hidden state. */
function layerClass(q: number, i: number, hidden: string) {
  return variant(q) === i ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : `opacity-0 ${hidden}`
}
function centeredLayerClass(q: number, i: number) {
  return variant(q) === i ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
}
function quadrantClass(q: number) {
  if (!shown(q)) return 'opacity-0'
  return zoomed.value && focus.value !== q ? 'opacity-30' : 'opacity-100'
}
const containerStyle = computed(() => zoomed.value ? { transform: QUADRANTS[focus.value].zoom } : {})

const G = 'border-[var(--accent)] dark:border-[#3a8a62]'
/** The window background matches its frame so anti-aliased corners of inner layers never show a light seam. */
const win = 'relative w-[10.5rem] h-[7.4rem] rounded-xl border-[3px] border-[#cfcfca] bg-[#cfcfca] overflow-hidden'
const blank = 'absolute inset-x-0 top-5 bottom-0 bg-[#f1f1ee]'
const grid = 'absolute inset-x-0 top-5 bottom-0 bg-[#f1f1ee] p-2 grid grid-cols-[1.6fr_1fr] grid-rows-[0.55fr_1.5fr_0.75fr] gap-1.5'
const blk = 'rounded-sm border-[3px] border-[#c4c4bf]'
const dim = 'absolute inset-x-0 top-5 bottom-0 bg-black/45'
const layer = 'absolute transition-all duration-500 ease-out'
const center = 'left-1/2 top-[calc(50%+0.625rem)] -translate-x-1/2 -translate-y-1/2'
const line = 'h-[2px] bg-[#b0b0ab]'
const btn = 'w-4 h-[7px] border-2 border-[#b0b0ab]'
const dialog = `${center} w-[6rem] h-[3.7rem] border-[4px] ${G} bg-[#fbfbfa] flex flex-col items-center justify-center gap-[3px]`
</script>

<template>
  <div class="relative mx-auto mt-6 w-[48rem] h-[25rem] transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)]" :style="containerStyle">
    <div class="absolute left-1/2 -translate-x-1/2 top-[3.3rem] bottom-[3.3rem] w-[3px] rounded bg-[var(--fg-4)]"></div>
    <div class="absolute left-1/2 -translate-x-1/2 top-[3.3rem] w-5 h-[3px] rounded bg-[var(--fg-4)]"></div>
    <div class="absolute left-1/2 -translate-x-1/2 bottom-[3.3rem] w-5 h-[3px] rounded bg-[var(--fg-4)]"></div>
    <div class="absolute top-1/2 -translate-y-1/2 left-[9rem] right-[9rem] h-[3px] rounded bg-[var(--fg-4)]"></div>
    <div class="absolute top-1/2 -translate-y-1/2 left-[9rem] w-[3px] h-5 rounded bg-[var(--fg-4)]"></div>
    <div class="absolute top-1/2 -translate-y-1/2 right-[9rem] w-[3px] h-5 rounded bg-[var(--fg-4)]"></div>

    <div class="absolute left-1/2 -translate-x-1/2 top-0 text-center leading-tight whitespace-nowrap"><div class="text-lg font-bold">Non-overlay</div><div class="text-xs muted">（沒有遮罩）</div></div>
    <div class="absolute left-1/2 -translate-x-1/2 bottom-0 text-center leading-tight whitespace-nowrap"><div class="text-lg font-bold">Overlay</div><div class="text-xs muted">（有遮罩）</div></div>
    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-[8.5rem] text-center leading-tight whitespace-nowrap"><div class="text-lg font-bold">Modal</div><div class="text-xs muted">（不能操作背景）</div></div>
    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-[8.5rem] text-center leading-tight whitespace-nowrap"><div class="text-lg font-bold">Nonmodal</div><div class="text-xs muted">（能操作背景）</div></div>

    <!-- 1 · top-right · Nonmodal + Non-overlay -->
    <div class="absolute transition-opacity duration-500" :class="[QUADRANTS[0].pos, quadrantClass(0)]" data-quadrant="1">
      <div :class="win">
        <div class="h-5 flex items-center gap-1.5 px-3 bg-[#f8f8f6] border-b-[3px] border-[#cfcfca]"><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span></div>
        <div :class="grid"><div :class="[blk, 'col-span-2']"></div><div :class="blk"></div><div :class="blk"></div><div :class="blk"></div><div :class="blk"></div></div>
        <div :class="[layer, layerClass(0, 0, '-translate-y-4'), 'top-6 right-1.5 w-[3.8rem] h-[1.5rem] border-[3px] bg-[#fbfbfa] flex items-center gap-1 px-1.5', G]" data-layer="toast"><div class="w-1.5 h-1.5 rounded-full bg-[#3a8a62]"></div><div :class="[line, 'w-6']"></div></div>
        <div :class="[layer, layerClass(0, 1, 'translate-y-4'), 'bottom-1.5 left-[calc(50%-3rem)] w-[6rem] h-[1.4rem] border-[3px] bg-[#fbfbfa] flex items-center justify-between px-1.5', G]" data-layer="snackbar"><div :class="[line, 'w-7']"></div><div class="w-3 h-[5px] border-2 border-[#b0b0ab]"></div></div>
        <div :class="[layer, layerClass(0, 2, 'translate-y-full'), 'bottom-0 inset-x-0 h-[1.8rem] border-t-[3px] bg-[#fbfbfa] flex items-center justify-between px-2', G]" data-layer="cookie"><div class="flex flex-col gap-[3px]"><div :class="[line, 'w-10']"></div><div :class="[line, 'w-7']"></div></div><div class="flex gap-1"><div class="w-3.5 h-[6px] bg-[#3a8a62]"></div><div class="w-3.5 h-[6px] border-2 border-[#b0b0ab]"></div></div></div>
        <div :class="[layer, layerClass(0, 3, 'scale-75 origin-bottom-left'), 'left-[1.9rem] top-[2.55rem] w-[3.4rem] h-[1.25rem] border-[3px] bg-[#fbfbfa] flex items-center px-1.5', G]" data-layer="tooltip"><div :class="[line, 'w-6']"></div><div :class="['absolute -bottom-[6px] left-2 w-2 h-2 rotate-45 border-r-[3px] border-b-[3px] bg-[#fbfbfa]', G]"></div></div>
      </div>
    </div>

    <!-- 2 · top-left · Modal + Non-overlay -->
    <div class="absolute transition-opacity duration-500" :class="[QUADRANTS[1].pos, quadrantClass(1)]" data-quadrant="2">
      <div :class="win">
        <div class="h-5 flex items-center gap-1.5 px-3 bg-[#f8f8f6] border-b-[3px] border-[#cfcfca]"><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span></div>
        <div :class="blank"></div>
        <div :class="[layer, layerClass(1, 0, 'scale-95'), 'inset-x-0 top-5 bottom-0 rounded-b-[9px] border-[3px] bg-[#fbfbfa] flex flex-col items-center justify-center gap-[3px]', G]" data-layer="fullscreen"><svg class="absolute top-1 right-1 w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round"><path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" /></svg><div :class="[line, 'w-10']"></div><div :class="[line, 'w-10']"></div><div :class="[line, 'w-8']"></div><div :class="['mt-1', btn]"></div></div>
        <div :class="[layer, layerClass(1, 1, '-translate-x-full'), 'left-0 top-5 bottom-0 w-[46%] border-r-[3px] bg-[#fbfbfa] flex flex-col gap-[5px] p-2 pt-4', G]" data-layer="drawer"><svg class="absolute top-1 right-1 w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2.5 H10.5 M1.5 6 H6 M1.5 9.5 H10.5 M10 4.5 L8.5 6 L10 7.5" /></svg><div :class="[line, 'w-8']"></div><div :class="[line, 'w-6']"></div><div :class="[line, 'w-7']"></div><div :class="[line, 'w-5']"></div></div>
                <div :class="[layer, layerClass(1, 2, 'translate-y-full'), 'inset-x-0 bottom-0 h-[50%] rounded-b-[9px] border-t-[3px] bg-[#fbfbfa] flex flex-col items-center gap-[4px] pt-1.5', G]" data-layer="sheet"><div class="w-5 h-[3px] rounded bg-[#c4c4bf]"></div><div :class="[line, 'w-10']"></div><div :class="[line, 'w-8']"></div></div>
      </div>
    </div>

    <!-- 3 · bottom-left · Modal + Overlay -->
    <div class="absolute transition-opacity duration-500" :class="[QUADRANTS[2].pos, quadrantClass(2)]" data-quadrant="3">
      <div :class="win">
        <div class="h-5 flex items-center gap-1.5 px-3 bg-[#f8f8f6] border-b-[3px] border-[#cfcfca]"><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span></div>
        <div :class="blank"></div>
        <div :class="dim"></div>
        <div :class="[layer, centeredLayerClass(2, 0), dialog]" data-layer="dialog"><svg class="absolute top-1 right-1 w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="#9a9a95" stroke-width="1.5" stroke-linecap="round"><path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" /></svg><div :class="[line, 'w-10']"></div><div :class="[line, 'w-10']"></div><div :class="[line, 'w-10']"></div><div :class="['mt-1', btn]"></div></div>
        <div :class="[layer, centeredLayerClass(2, 1), center, 'w-7 h-7']" data-layer="spinner"><div class="w-full h-full rounded-full border-[4px] border-[#d8d8d4] border-t-[#3a8a62] animate-spin"></div></div>
                      </div>
    </div>

    <!-- 4 · bottom-right · Nonmodal + Overlay: no real use case, left empty on purpose -->
    <div class="absolute transition-opacity duration-500 w-[10.5rem] h-[7.4rem] flex items-center justify-center" :class="[QUADRANTS[3].pos, quadrantClass(3)]" data-quadrant="4">
      <div class="text-xl text-[var(--fg-3)]" data-layer="empty">（空）</div>
    </div>
  </div>
</template>
