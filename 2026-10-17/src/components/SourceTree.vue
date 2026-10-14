<script setup lang="ts">
import { computed } from 'vue'
import SourceTreeNode from './SourceTreeNode.vue'
import type { State, TreeNode } from './SourceTreeNode.vue'

type Scene = 'overview' | 'format' | 'css' | 'pkg' | 'exports' | 'unbundle' | 'workspace' | 'watch'

const props = defineProps<{
  /** Which walkthrough page this tree sits on; the click table for it lives in `scenes` below. */
  scene?: Scene
  /** The slide's `$clicks`; steps past the table's end keep its last entry. */
  clicks?: number
  /** Manual override when no scene fits: paths lit as "reading". */
  highlight?: string[]
}>()

/** Only the files this chapter walks through, in VS Code order (folders first, then alphabetical); labels are each file's job. */
const tree: TreeNode[] = [
  {
    path: 'src',
    name: 'src',
    children: [
      {
        path: 'src/config',
        name: 'config',
        label: '讀設定、補預設值',
        children: [
          { path: 'src/config/file.ts', name: 'file.ts', label: '找設定檔' },
          { path: 'src/config/index.ts', name: 'index.ts', label: 'resolveConfig 在這' },
          { path: 'src/config/options.ts', name: 'options.ts', label: '預設值、展開 format' },
          { path: 'src/config/workspace.ts', name: 'workspace.ts', label: '每個 package 一次' },
        ],
      },
      {
        path: 'src/features',
        name: 'features',
        label: '一個功能一支檔案',
        children: [
          {
            path: 'src/features/pkg',
            name: 'pkg',
            label: '發布前',
            children: [
              { path: 'src/features/pkg/exports.ts', name: 'exports.ts', label: '寫 package.json' },
              { path: 'src/features/pkg/index.ts', name: 'index.ts', label: '等 format 到齊' },
              { path: 'src/features/pkg/publint.ts', name: 'publint.ts', label: '與 attw 檢查 tarball' },
            ],
          },
          { path: 'src/features/deps.ts', name: 'deps.ts', label: '依賴 external' },
          { path: 'src/features/output.ts', name: 'output.ts', label: '副檔名' },
          { path: 'src/features/rolldown.ts', name: 'rolldown.ts', label: '組選項與 plugin' },
          { path: 'src/features/watch.ts', name: 'watch.ts', label: '監看哪些檔' },
        ],
      },
      { path: 'src/build.ts', name: 'build.ts', label: '一次 build 的流程' },
      { path: 'src/cli.ts', name: 'cli.ts', label: '解析參數' },
      { path: 'src/run.ts', name: 'run.ts', label: 'bin 入口' },
    ],
  },
]

interface Step {
  /** the file whose code is on screen at this click */
  on: string[]
  /** files those highlighted lines call into (verified against tsdown v0.22.5 imports) */
  calls?: string[]
}

/**
 * One row per `$clicks` value, index 0 = before the first click.
 * A file is "on" from the moment its code block is on screen (undimmed), not only once a line is highlighted.
 */
const scenes: Record<Scene, Step[]> = {
  overview: [
    { on: [] },
    { on: ['src/run.ts', 'src/cli.ts', 'src/build.ts'] },
    { on: ['src/config/index.ts', 'src/config/file.ts', 'src/config/workspace.ts', 'src/config/options.ts'] },
    { on: ['src/features/rolldown.ts', 'src/features/deps.ts', 'src/features/output.ts'] },
    { on: ['src/features/pkg/index.ts', 'src/features/pkg/exports.ts', 'src/features/pkg/publint.ts'] },
  ],
  format: [
    { on: ['src/config/options.ts', 'src/build.ts'] },
    { on: ['src/config/options.ts'] },
    { on: ['src/config/options.ts'] },
    { on: ['src/build.ts'] },
  ],
  css: [
    { on: ['src/features/rolldown.ts'] },
    { on: ['src/features/rolldown.ts'], calls: ['src/features/deps.ts'] },
    { on: ['src/features/rolldown.ts'] },
    { on: ['src/features/rolldown.ts'] },
  ],
  pkg: [
    { on: ['src/features/pkg/index.ts'] },
    { on: ['src/features/pkg/index.ts'] },
    { on: ['src/features/pkg/index.ts'], calls: ['src/features/pkg/exports.ts'] },
    { on: ['src/features/pkg/index.ts'], calls: ['src/features/pkg/publint.ts'] },
  ],
  exports: [
    { on: ['src/features/pkg/exports.ts'] },
  ],
  unbundle: [{ on: ['src/features/rolldown.ts'] }],
  workspace: [{ on: ['src/config/workspace.ts'] }],
  watch: [
    { on: ['src/features/watch.ts', 'src/build.ts'] },
    { on: ['src/features/watch.ts'] },
    { on: ['src/build.ts'] },
  ],
}

const step = computed<Step>(() => {
  if (props.scene) {
    const steps = scenes[props.scene]
    return steps[Math.min(props.clicks ?? 0, steps.length - 1)]
  }
  return { on: props.highlight ?? [] }
})

const showLegend = computed(() => props.scene !== undefined && scenes[props.scene].some(s => s.calls?.length))

function flatten(nodes: TreeNode[], out: TreeNode[] = []): TreeNode[] {
  for (const n of nodes) {
    out.push(n)
    if (n.children) flatten(n.children, out)
  }
  return out
}

const states = computed<Record<string, State>>(() => {
  const on = step.value.on
  const calls = step.value.calls ?? []
  const lit = [...on, ...calls]
  const out: Record<string, State> = {}
  for (const n of flatten(tree)) {
    if (on.includes(n.path)) out[n.path] = 'on'
    else if (calls.includes(n.path)) out[n.path] = 'calls'
    else if (n.children && lit.some(p => p.startsWith(`${n.path}/`))) out[n.path] = 'ancestor'
    else out[n.path] = 'off'
  }
  return out
})
</script>

<template>
  <div class="card py-2.5! px-3! min-w-0 [--ts-badge:#5ba3d6]">
    <SourceTreeNode v-for="n in tree" :key="n.path" :node="n" :states="states" />
    <div v-if="showLegend" class="flex gap-4 mt-1.5 px-1 font-sans text-[0.62rem] text-[var(--fg-3)]">
      <span><span class="inline-block w-2 h-2 rounded-sm bg-[var(--accent)] mr-1 align-middle"></span>正在讀的檔案</span>
      <span><span class="inline-block w-2 h-2 rounded-sm bg-[var(--fg)] mr-1 align-middle"></span>這幾行呼叫的檔案</span>
    </div>
  </div>
</template>
