<script setup lang="ts">
import { computed } from 'vue'

/** Clicks 1-2 walk the setup path through server then browser; clicks 3-4 walk the outside-setup path; click 5 is the verdict. */
const props = defineProps<{ clicks: number }>()

const LANES = [
  { key: 'setup', label: 'setup 內', serverAt: 1, browserAt: 2, packet: 'HTML + modal', serverCaption: '寫進 HTML，帶 z-index', browserCaption: '立刻出現，水合完成就能操作' },
  { key: 'outside', label: 'setup 外', serverAt: 3, browserAt: 4, packet: 'HTML', serverCaption: '分不出 request，跳過', browserCaption: 'mount 後再開，播進場動畫' },
] as const

const at = (n: number) => props.clicks >= n
const verdict = computed(() => props.clicks >= 5)

const frame = 'relative w-[12.5rem] h-[7.6rem] mx-auto rounded-lg border-2 border-[#cfcfca] bg-[#f6f6f3] overflow-hidden'
const modalBox = 'absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[7.2rem] h-[3.9rem] rounded border-[3px] border-[var(--accent)] dark:border-[#3a8a62] bg-[#fbfbfa] flex flex-col items-center justify-center gap-[3px]'
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-[13rem_1fr_6rem_1fr] gap-x-2 items-end mb-2">
      <div></div>
      <div class="font-mono text-xs tracking-wider text-[var(--fg-3)] text-center">server</div>
      <div></div>
      <div class="font-mono text-xs tracking-wider text-[var(--fg-3)] text-center">browser</div>
    </div>

    <div v-for="lane in LANES" :key="lane.key" class="grid grid-cols-[13rem_1fr_6rem_1fr] gap-x-2 items-center mt-4" :data-lane="lane.key">
      <div class="flex flex-col gap-1.5 min-w-0 self-start">
        <span class="tag text-xs! py-px! self-start" :class="lane.key === 'setup' ? '' : 'tag-neutral border-dashed!'">{{ lane.label }}</span>
        <div class="min-w-0 [&_pre]:text-[0.62rem]! [&_pre]:leading-[1.55]! [&_pre]:my-0! [&_.slidev-code]:py-1.5! [&_.slidev-code]:px-2.5!"><slot :name="lane.key + '-code'" /></div>
      </div>

      <!-- server cell -->
      <div>
        <div :class="[frame, 'transition-opacity duration-500', at(lane.serverAt) ? 'opacity-100' : 'opacity-0']" :data-cell="lane.key + '-server'">
          <div class="h-3.5 flex items-center gap-1 px-2 bg-[#f8f8f6] border-b-2 border-[#cfcfca]"><span class="w-1 h-1 rounded-full bg-[#c4c4bf]"></span><span class="w-1 h-1 rounded-full bg-[#c4c4bf]"></span></div>
          <div class="absolute inset-x-0 top-3.5 bottom-0 bg-[#f1f1ee] p-2.5 flex flex-col gap-2"><div class="h-1.5 w-2/3 rounded bg-[#d6d6d1]"></div><div class="h-1.5 w-1/2 rounded bg-[#d6d6d1]"></div><div class="h-1.5 w-3/4 rounded bg-[#d6d6d1]"></div><div class="h-1.5 w-2/5 rounded bg-[#d6d6d1]"></div></div>
          <template v-if="lane.key === 'setup'">
            <div class="absolute inset-x-0 top-3.5 bottom-0 bg-black/40 transition-opacity duration-500" :class="at(lane.serverAt) ? 'opacity-100' : 'opacity-0'"></div>
            <div :class="[modalBox, 'transition-opacity duration-500', at(lane.serverAt) ? 'opacity-100' : 'opacity-0']" data-modal="setup-server"><div class="h-[2px] w-8 bg-[#b0b0ab]"></div><div class="h-[2px] w-6 bg-[#b0b0ab]"></div><div class="mt-0.5 w-4 h-[5px] border-2 border-[#b0b0ab]"></div></div>
          </template>
          <div v-else class="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[7.2rem] h-[3.9rem] rounded border-[3px] border-dashed border-[#b0b0ab] flex items-center justify-center font-mono text-[0.6rem] text-[#8a8a85] transition-opacity duration-300" :class="at(lane.serverAt) ? 'opacity-100' : 'opacity-0'" data-modal="outside-server">ignored</div>
        </div>
        <div class="mt-2 text-base text-center whitespace-nowrap transition-colors duration-300" :class="at(lane.serverAt) ? 'text-[var(--fg-2)]' : 'text-transparent'">{{ lane.serverCaption }}</div>
      </div>

      <!-- the handoff: an HTML packet travels from server to browser -->
      <div class="relative h-8 -mt-7" data-link>
        <div class="absolute left-0 right-[3px] top-1/2 h-[2px] -translate-y-1/2 rounded-full transition-colors duration-500" :class="at(lane.browserAt) ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'"></div>
        <svg class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 transition-colors duration-500" :class="at(lane.browserAt) ? 'text-[var(--accent)]' : 'text-[var(--border-strong)]'" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 1.5 L9.5 6 L4 10.5" /></svg>
        <div class="absolute left-0 bottom-[calc(50%+4px)] rounded px-1.5 py-px font-mono text-[0.55rem] whitespace-nowrap bg-[var(--accent)] text-[#0b1a12] transition-all duration-[1400ms] ease-in-out" :style="{ transform: at(lane.browserAt) ? 'translateX(calc(6rem - 100% - 1rem))' : 'translateX(-0.5rem)', opacity: at(lane.browserAt) ? 1 : 0 }" :data-packet="lane.key">{{ lane.packet }}</div>
      </div>

      <!-- browser cell -->
      <div>
        <div :class="[frame, 'transition-opacity duration-300', at(lane.browserAt) ? 'opacity-100' : 'opacity-0']" :style="{ transitionDelay: at(lane.browserAt) ? '1400ms' : '0ms' }" :data-cell="lane.key + '-browser'">
          <div class="h-3.5 flex items-center gap-1 px-2 bg-[#f8f8f6] border-b-2 border-[#cfcfca]"><span class="w-1 h-1 rounded-full bg-[#c4c4bf]"></span><span class="w-1 h-1 rounded-full bg-[#c4c4bf]"></span></div>
          <div class="absolute inset-x-0 top-3.5 bottom-0 bg-[#f1f1ee] p-2.5 flex flex-col gap-2"><div class="h-1.5 w-2/3 rounded bg-[#d6d6d1]"></div><div class="h-1.5 w-1/2 rounded bg-[#d6d6d1]"></div><div class="h-1.5 w-3/4 rounded bg-[#d6d6d1]"></div><div class="h-1.5 w-2/5 rounded bg-[#d6d6d1]"></div></div>
          <div class="absolute inset-x-0 top-3.5 bottom-0 bg-black/40" :class="[lane.key === 'setup' ? 'transition-none' : 'transition-opacity duration-1000', at(lane.browserAt) ? 'opacity-100' : 'opacity-0']" :style="{ transitionDelay: at(lane.browserAt) && lane.key !== 'setup' ? '2200ms' : '0ms' }"></div>
          <div :class="[modalBox, lane.key === 'setup' ? 'transition-none' : 'transition-all duration-1000 ease-out', at(lane.browserAt) ? 'opacity-100 scale-100' : lane.key === 'setup' ? 'opacity-0' : 'opacity-0 scale-75']" :style="{ transitionDelay: at(lane.browserAt) && lane.key !== 'setup' ? '2200ms' : '0ms' }" :data-modal="lane.key + '-browser'"><div class="h-[2px] w-8 bg-[#b0b0ab]"></div><div class="h-[2px] w-6 bg-[#b0b0ab]"></div><div class="mt-0.5 w-4 h-[5px] border-2 border-[#b0b0ab]"></div></div>
          <div v-if="lane.key === 'setup'" class="absolute right-1.5 top-5 rounded-full px-1.5 py-px font-mono text-[0.55rem] bg-[var(--accent)] text-[#0b1a12] transition-opacity duration-300" :class="at(lane.browserAt) ? 'opacity-100' : 'opacity-0'" :style="{ transitionDelay: at(lane.browserAt) ? '1500ms' : '0ms' }">hydrated</div>
          <div v-else class="absolute right-1.5 top-5 rounded-full px-1.5 py-px font-mono text-[0.55rem] bg-[#6b6b66] text-white transition-opacity duration-300" :class="at(lane.browserAt) ? 'opacity-100' : 'opacity-0'" :style="{ transitionDelay: at(lane.browserAt) ? '2200ms' : '0ms' }">mounted</div>
        </div>
        <div class="mt-2 text-base text-center whitespace-nowrap transition-colors duration-300" :class="at(lane.browserAt) ? 'text-[var(--fg-2)]' : 'text-transparent'" :style="{ transitionDelay: at(lane.browserAt) ? (lane.key === 'setup' ? '1600ms' : '2600ms') : '0ms' }">{{ lane.browserCaption }}</div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 mt-6 text-base muted transition-opacity duration-500" :class="verdict ? 'opacity-100' : 'opacity-0'" data-verdict>兩條路 server 與 browser 的輸出都一致<span class="tag">沒有 hydration mismatch</span>v4 的<span class="tag tag-neutral">server render memory leak</span>也一起解掉</div>
  </div>
</template>
