<script setup lang="ts">
import SourceTreeNode from './SourceTreeNode.vue'

export interface TreeNode {
  path: string
  name: string
  label?: string
  children?: TreeNode[]
}

export type State = 'on' | 'calls' | 'ancestor' | 'off'

defineProps<{
  node: TreeNode
  states: Record<string, State>
}>()

const rowClass: Record<State, string> = {
  on: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  calls: 'text-[var(--fg)]',
  ancestor: 'text-[var(--fg-2)]',
  off: 'text-[var(--fg-4)]',
}

const labelClass: Record<State, string> = {
  on: 'text-[var(--fg-2)]',
  calls: 'text-[var(--fg-3)]',
  ancestor: 'text-[var(--fg-4)]',
  off: 'text-[var(--fg-4)] opacity-70',
}

const badgeClass: Record<State, string> = {
  on: 'opacity-100',
  calls: 'opacity-100',
  ancestor: 'opacity-60',
  off: 'opacity-45',
}
</script>

<template>
  <div>
    <div
      class="flex items-center gap-1.5 h-[0.95rem] px-1 rounded-sm transition-colors duration-300"
      :class="rowClass[states[node.path]]"
    >
      <svg v-if="node.children" class="w-3 h-3 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span v-else class="w-3 shrink-0 font-mono text-[0.5rem] font-bold leading-none text-[var(--ts-badge)]" :class="badgeClass[states[node.path]]">TS</span>
      <span class="text-[0.72rem] whitespace-nowrap" :class="node.children ? 'font-sans font-medium' : 'font-mono'">{{ node.name }}</span>
      <span v-if="node.label" class="font-sans text-[0.66rem] whitespace-nowrap" :class="labelClass[states[node.path]]">{{ node.label }}</span>
    </div>
    <div v-if="node.children" class="ml-[0.7rem] pl-[0.45rem] border-l border-[var(--border)]">
      <SourceTreeNode v-for="c in node.children" :key="c.path" :node="c" :states="states" />
    </div>
  </div>
</template>
