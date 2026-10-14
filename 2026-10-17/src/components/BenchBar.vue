<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  value: number
  max: number
  unit?: string
  secondary?: string
  highlight?: boolean
}>()

const width = computed(() => `${(props.value / props.max) * 100}%`)
</script>

<template>
  <div class="flex items-center gap-4 rounded-md px-3 py-1" :class="highlight && 'bg-[var(--accent-soft)]'">
    <div class="w-60 shrink-0 flex items-baseline gap-2 whitespace-nowrap">
      <span class="text-base">{{ name }}</span>
      <span v-if="secondary" class="text-xs faint">{{ secondary }}</span>
    </div>
    <div class="flex flex-1 items-center gap-3">
      <div
        class="h-2.5 rounded transition-all duration-500"
        :class="highlight ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'"
        :style="{ width }"
      />
      <span class="font-mono text-base whitespace-nowrap">{{ value }}{{ unit }}</span>
    </div>
  </div>
</template>
