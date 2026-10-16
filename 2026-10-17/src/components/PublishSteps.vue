<script setup lang="ts">
defineProps<{ current: number }>()

const STEPS = ['格式', '型別', '依賴', 'CSS 與 Vue', 'exports', '發布前檢查']
</script>

<template>
  <div class="flex items-center gap-2.5 my-0 shrink-0 font-mono text-sm" data-publish-steps>
    <template v-for="(step, i) in STEPS" :key="step">
      <span
        class="tag whitespace-nowrap px-3! py-1! transition-opacity duration-300"
        :class="i + 1 === current ? '' : 'tag-neutral opacity-60'"
        :data-current="i + 1 === current ? '' : undefined"
      >{{ i + 1 }} {{ step }}</span>
      <carbon-arrow-right v-if="i < STEPS.length - 1" class="text-sm faint shrink-0" />
    </template>
  </div>
</template>
