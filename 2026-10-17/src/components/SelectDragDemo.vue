<script setup lang="ts">
import { computed } from 'vue'

/** 0 idle · 1 mousedown on the text and drag across it · 2 mouseup on the overlay */
const props = defineProps<{ stage: number }>()

const PRESS = { x: 46, y: 38 }
const RELEASE = { x: 84, y: 76 }

const cursor = computed(() => {
  if (props.stage >= 2) return RELEASE
  if (props.stage >= 1) return PRESS
  return { x: 24, y: 38 }
})
</script>

<template>
  <div>
  <div class="relative h-[17rem] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] select-none">
    <div class="absolute inset-x-6 top-10 flex flex-col gap-2.5 opacity-40">
      <div class="h-2.5 w-1/3 rounded bg-[var(--fg-4)]"></div>
      <div class="h-2 w-5/6 rounded bg-[var(--border-strong)]"></div>
      <div class="h-2 w-2/3 rounded bg-[var(--border-strong)]"></div>
      <div class="h-2 w-3/4 rounded bg-[var(--border-strong)]"></div>
      <div class="h-2 w-1/2 rounded bg-[var(--border-strong)]"></div>
    </div>

    <div class="absolute inset-0 bg-black/60">
      <div class="absolute left-3 top-2 font-mono text-[0.6rem] tracking-wider text-[var(--fg-3)]">overlay · vfmRootEl</div>
    </div>

    <div
      class="absolute left-[14%] top-[20%] w-[56%] rounded-lg bg-[var(--bg-elevated)] px-3 py-2.5 border transition-all duration-500"
      :class="stage >= 2 ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]' : 'border-[var(--border-strong)]'"
    >
      <div class="text-xs font-semibold mb-1.5">確認訂單</div>
      <div class="text-sm leading-relaxed text-[var(--fg-2)] whitespace-nowrap">請確認<span class="relative"><span class="absolute inset-y-0 left-0 bg-[rgba(0,220,130,0.35)] transition-all duration-700 ease-out" :style="{ width: stage >= 1 ? '100%' : '0%' }"></span><span class="relative">訂單內容與收件地址</span></span>無誤</div>
      <div class="mt-2.5 flex gap-2">
        <div class="h-5 w-12 rounded bg-[var(--accent)] opacity-70"></div>
        <div class="h-5 w-12 rounded border border-[var(--border-strong)]"></div>
      </div>
    </div>

    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line
        :x1="PRESS.x" :y1="PRESS.y" :x2="RELEASE.x" :y2="RELEASE.y"
        stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"
        class="transition-opacity duration-500" :style="{ opacity: stage >= 2 ? 0.8 : 0 }"
      />
    </svg>

    <div
      class="absolute w-0 h-0"
      :style="{ left: `${cursor.x}%`, top: `${cursor.y}%`, transition: 'left 900ms ease-in-out, top 900ms ease-in-out' }"
    >
      <div
        class="absolute -left-3 -top-3 w-6 h-6 rounded-full border-2 border-[var(--accent)] transition-all duration-300"
        :class="stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
      ></div>
      <svg class="absolute -left-[2px] -top-[2px] w-4 h-4 drop-shadow" viewBox="0 0 16 16">
        <path d="M2 1.5 L2 12 L5 9.2 L7 13.5 L9 12.6 L7 8.4 L11 8.4 Z" fill="#fff" stroke="#000" stroke-width="0.8" stroke-linejoin="round" />
      </svg>
    </div>

    <div
      class="absolute left-[14%] top-[63%] font-mono text-[0.7rem] px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] whitespace-nowrap transition-all duration-500"
      :class="stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'"
    >mousedown · 在內容上</div>

    <div
      class="absolute right-3 bottom-3 font-mono text-[0.7rem] px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] whitespace-nowrap transition-all duration-500 delay-700"
      :class="stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'"
    >mouseup · 在遮罩上</div>

  </div>

  <div
    class="mt-4 flex items-center justify-center gap-2 text-base font-semibold text-[var(--accent)] transition-all duration-500 delay-1000"
    :class="stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'"
  >
    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="var(--accent)" /><path d="M6 10.5 L8.8 13.2 L14 7.6" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
    不算點外面，modal 留著
  </div>
  </div>
</template>
