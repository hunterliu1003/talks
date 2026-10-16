<script setup lang="ts">
import { computed } from 'vue'

/** Clicks 1..N open the modals in order; clicks N+1..2N close them in reverse. */
const props = defineProps<{ clicks: number }>()

const MODALS = [
  { name: 'A', button: '開啟 Modal B', pos: 'left-[26%] top-[22%]' },
  { name: 'B', button: '關閉', pos: 'left-[50%] top-[42%]' },
]
const N = MODALS.length

const open = computed(() => (props.clicks <= N ? props.clicks : 2 * N - props.clicks))
const closing = computed(() => props.clicks > N)
const locked = computed(() => open.value > 0)

function isOpen(i: number) {
  return i < open.value
}
function isTop(i: number) {
  return i === open.value - 1
}
function trapState(i: number) {
  if (!isOpen(i)) return 'closed'
  return isTop(i) ? 'active' : 'paused'
}


/** Opening focuses the level's content container; closing returns focus to the button that opened the closed level. */
function focusOnBox(i: number) {
  return isTop(i) && !closing.value
}
function focusOnButton(i: number) {
  return isTop(i) && closing.value
}

const ring = 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[#fbfbfa]'
</script>

<template>
  <div class="w-full">
    <!-- the page -->
    <div class="relative h-[15.5rem] max-w-[44rem] mx-auto rounded-lg border-2 border-[#cfcfca] bg-[#f6f6f3] overflow-hidden" data-viewport>
      <div class="h-5 flex items-center gap-1 px-2 bg-[#f8f8f6] border-b-2 border-[#cfcfca]"><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span><span class="w-1.5 h-1.5 rounded-full bg-[#c4c4bf]"></span></div>

      <!-- page content with its scrollbar -->
      <div class="absolute inset-x-0 top-5 bottom-0 bg-[#f1f1ee] p-3 pr-6 flex flex-col gap-2">
        <div class="h-2 w-2/3 rounded bg-[#d6d6d1]"></div>
        <div class="h-2 w-1/2 rounded bg-[#d6d6d1]"></div>
        <button type="button" class="self-start mt-1 rounded border-2 px-2 py-0.5 text-[0.65rem] font-medium text-[#3a3a36] border-[#b0b0ab] bg-white transition-all duration-300" :class="open === 0 ? ring : ''" data-focus="page">開啟 Modal A</button>
        <div class="h-2 w-5/6 rounded bg-[#d6d6d1] mt-1"></div>
        <div class="h-2 w-3/5 rounded bg-[#d6d6d1]"></div>
        <div class="h-2 w-4/5 rounded bg-[#d6d6d1]"></div>
        <div class="h-2 w-1/2 rounded bg-[#d6d6d1]"></div>
      </div>
      <div class="absolute right-1 top-6 bottom-1 w-1.5 rounded bg-[#e2e2de]"><div class="w-full h-1/3 rounded transition-colors duration-500" :class="locked ? 'bg-[#c9c9c4]' : 'bg-[#9a9a95]'"></div></div>
      <div class="absolute right-3 top-7 z-50 flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-mono transition-all duration-500" :class="locked ? 'opacity-100 bg-[var(--accent)] text-[#0b1a12]' : 'opacity-0'" data-lock-badge><carbon-locked class="text-[0.65rem]" />scroll lock ×{{ open }}</div>

      <!-- overlay -->
      <div class="absolute inset-x-0 top-5 bottom-0 bg-black/40 transition-opacity duration-500" :class="locked ? 'opacity-100' : 'opacity-0'"></div>

      <!-- the modals -->
      <div v-for="(m, i) in MODALS" :key="m.name" class="absolute w-[9.5rem] h-[5.6rem] rounded border-[3px] bg-[#fbfbfa] p-2 flex flex-col gap-1.5 transition-all duration-500" :class="[m.pos, isOpen(i) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none', isTop(i) ? 'border-[var(--accent)] dark:border-[#3a8a62]' : 'border-[#c4c4bf]', focusOnBox(i) ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-black/40' : '']" :data-modal="m.name" :data-state="trapState(i)" :data-focus="focusOnBox(i) ? m.name + '-content' : undefined">
        <div class="flex items-center justify-between">
          <span class="font-mono text-[0.65rem] text-[#3a3a36]">Modal {{ m.name }}</span>
          <span class="font-mono text-[0.55rem] tracking-wider transition-colors duration-300" :class="isTop(i) ? 'text-[#3a8a62]' : 'text-[#9a9a95]'">{{ isTop(i) ? 'trap active' : 'trap paused' }}</span>
        </div>
        <div class="h-[2px] w-16 bg-[#d6d6d1]"></div>
        <div class="h-[2px] w-12 bg-[#d6d6d1]"></div>
        <button type="button" class="self-start mt-auto rounded border-2 px-2 py-0.5 text-[0.65rem] font-medium text-[#3a3a36] border-[#b0b0ab] bg-white transition-all duration-300" :class="focusOnButton(i) ? ring : ''" :data-focus="m.name">{{ m.button }}</button>
      </div>
    </div>

  </div>
</template>
