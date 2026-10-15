<script setup lang="ts">
import { computed } from 'vue'

type Kind = 'page' | 'nonmodal' | 'modal'

interface Leaf {
  kind: Kind
  label: string
}

interface Question {
  short: string
  criteria: string[]
  /** the answer that leaves the tree on this row; the other answer goes on to the next question */
  exitOn: 'Yes' | 'No'
  exit: Leaf
}

const props = defineProps<{
  /** The slide's `$clicks`: 0 = title only, 1 to 7 = one question each. */
  clicks?: number
}>()

const questions: Question[] = [
  {
    short: '需要打斷使用者嗎？',
    criteria: ['需要抓住使用者的注意力', '使用者只從少數幾個選項中挑一個', '要提供額外內容，又不能離開主頁面', '繼續之前，要先收集少量資訊', '內容緊急'],
    exitOn: 'No',
    exit: { kind: 'page', label: 'Page' },
  },
  {
    short: '會被分享、會長大？',
    criteria: ['使用者想把內容加入書籤或分享', '使用者離開流程後，可能再回來', '有複雜的操作互相影響', '未來會擴充其他操作、任務或內容'],
    exitOn: 'Yes',
    exit: { kind: 'page', label: 'Page' },
  },
  {
    short: '內容多到要捲動？',
    criteria: ['畫面中會塞入大量元素', '內容高度超過裝置高度', '內容需要捲動', '有兩個以上的操作要使用者完成', '要使用者完成一項以上的任務'],
    exitOn: 'Yes',
    exit: { kind: 'page', label: 'Page' },
  },
  {
    short: '短暫、單一、用完就回主頁？',
    criteria: ['使用者常在功能之間來回切換', '使用者與功能的互動很單一', '內容是暫時的', '之後注意力要回到主頁面', '內容簡短', '有其他充分的理由'],
    exitOn: 'No',
    exit: { kind: 'page', label: 'Page' },
  },
  {
    short: '非擋住流程不可？',
    criteria: ['使用者需要「立刻」注意到', '轉移注意力，任務反而更容易完成', '這個任務是接下來流程的必要條件', '先完成它，能明顯省下後面的操作', '任務有明確步驟，有起點也有終點'],
    exitOn: 'No',
    exit: { kind: 'nonmodal', label: 'Nonmodal' },
  },
  {
    short: '只是告知結果？',
    criteria: ['成功訊息：「已儲存」', '按鈕直接變成「已儲存」'],
    exitOn: 'Yes',
    exit: { kind: 'nonmodal', label: 'Toast' },
  },
  {
    short: '要收集資訊或確認操作？',
    criteria: ['收集使用者資訊', '確認使用者的操作', '嚴重或不可逆的操作', '填寫表單或做決定', '防止嚴重錯誤的警告'],
    exitOn: 'Yes',
    exit: { kind: 'modal', label: 'Dialog' },
  },
]

const lastLeaf: Leaf = { kind: 'modal', label: 'Bottom Sheet · Nav Drawer' }

const icons: Record<Kind, string> = {
  page: 'i-carbon-document',
  nonmodal: 'i-carbon-notification',
  modal: 'i-carbon-popup',
}

const step = computed(() => Math.min(Math.max(props.clicks ?? 0, 0), questions.length))
const current = computed(() => questions[step.value - 1])

const flip = (answer: 'Yes' | 'No') => (answer === 'Yes' ? 'No' : 'Yes')

function rowState(i: number) {
  const n = i + 1
  return {
    'is-on': step.value >= n,
    'is-active': step.value === n,
    'is-past': step.value > n,
  }
}
</script>

<template>
  <div class="mdt" :class="{ 'is-intro': step === 0 }">
    <div class="kicker absolute! left-0 top-0 m-0!">UX · 決策樹 · 選對類型</div>

    <div class="mdt-title">
      用決策樹<span class="text-gradient">選對</span> Modal 的類型
    </div>
    <div class="mdt-subtitle muted">
      七個問題，每個出口都是最適合那個情境的元件
    </div>

    <div class="mdt-tree">
      <div v-for="(q, i) in questions" :key="i" class="mdt-row" :class="rowState(i)">
        <div class="mdt-badge">Q{{ i + 1 }}</div>
        <div class="mdt-pill">{{ q.short }}</div>
        <div class="mdt-exit">
          <span class="mdt-answer">{{ q.exitOn }}</span>
          <span class="mdt-line" />
        </div>
        <div class="mdt-leaf" :class="`kind-${q.exit.kind}`">
          <span :class="icons[q.exit.kind]" />
          <span>{{ q.exit.label }}</span>
        </div>
        <div class="mdt-spine" :class="{ 'is-drawn': i < questions.length - 1 ? step > i + 1 : step > i }">
          <span class="mdt-answer">{{ flip(q.exitOn) }}</span>
        </div>
      </div>

      <div class="mdt-row mdt-row-last" :class="rowState(questions.length - 1)">
        <div class="mdt-leaf" :class="`kind-${lastLeaf.kind}`">
          <span :class="icons[lastLeaf.kind]" />
          <span>{{ lastLeaf.label }}</span>
        </div>
      </div>
    </div>

    <div class="mdt-panel card">
      <div v-if="current" :key="step" class="mdt-panel-body">
        <div class="eyebrow">Q{{ step }} · 任一成立就是 Yes</div>
        <div class="text-lg font-semibold mt-1 mb-3 leading-snug">{{ current.short }}</div>
        <ul class="mdt-criteria">
          <li v-for="(c, j) in current.criteria" :key="c" :style="{ '--d': `${120 + j * 70}ms` }">{{ c }}</li>
        </ul>
        <div class="mdt-verdict" :style="{ '--d': `${200 + current.criteria.length * 70}ms` }">
          <span class="mdt-verdict-pair">
            <span class="font-mono">{{ current.exitOn }}</span>
            <span class="faint">→</span>
            <span :class="current.exit.kind === 'modal' ? 'accent' : 'text-[var(--fg)]'">{{ current.exit.label }}</span>
          </span>
          <span v-if="step === questions.length" class="mdt-verdict-pair">
            <span class="font-mono">No</span>
            <span class="faint">→</span>
            <span class="accent">{{ lastLeaf.label }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mdt {
  --row-h: 36px;
  --gap: 14px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  height: 472px;
}

.mdt-title {
  position: absolute;
  left: 0;
  top: 22px;
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.15;
  color: var(--fg);
  white-space: nowrap;
  transform-origin: left top;
  transition: left 0.7s var(--ease), top 0.7s var(--ease), transform 0.7s var(--ease);
}

.is-intro .mdt-title {
  left: 50%;
  top: 40%;
  transform: translate(-87.5%, -87.5%) scale(1.75);
}

.mdt-subtitle {
  position: absolute;
  left: 0;
  right: 0;
  top: 56%;
  text-align: center;
  font-size: 1.25rem;
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.is-intro .mdt-subtitle {
  opacity: 1;
  transform: none;
  transition-delay: 0.35s;
}

.mdt-tree {
  position: absolute;
  left: 0;
  top: 80px;
  width: 570px;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

.mdt-row {
  position: relative;
  height: var(--row-h);
  display: flex;
  align-items: center;
}

.mdt-badge,
.mdt-pill {
  opacity: 0;
  filter: blur(4px);
  transform: translateY(-6px);
  transition: opacity 0.35s ease, filter 0.35s ease, transform 0.45s var(--ease), border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
}

.is-on .mdt-badge,
.is-on .mdt-pill {
  opacity: 1;
  filter: none;
  transform: none;
  transition-delay: 0.18s;
}

.mdt-badge {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--fg-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
}

.mdt-pill {
  margin-left: 10px;
  width: 262px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--fg-2);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

.is-active .mdt-badge {
  color: var(--bg);
  background: var(--accent);
  border-color: var(--accent);
}

.is-active .mdt-pill {
  color: var(--fg);
  border-color: var(--accent-border);
  background: linear-gradient(90deg, var(--accent-soft), transparent 80%), var(--bg-elevated);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.is-past .mdt-pill,
.is-past .mdt-badge {
  opacity: 0.45;
  transition-delay: 0s;
}

.mdt-exit {
  position: relative;
  width: 64px;
  height: 100%;
  flex-shrink: 0;
}

.mdt-line {
  position: absolute;
  left: 4px;
  right: 6px;
  top: 50%;
  height: 1.5px;
  background: var(--fg-4);
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.mdt-line::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -3.5px;
  border-left: 7px solid var(--fg-4);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.is-on .mdt-line {
  transform: scaleX(1);
  transition-delay: 0.42s;
}

.mdt-answer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--fg-4);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.mdt-exit .mdt-answer {
  position: absolute;
  left: 0;
  right: 0;
  top: 1px;
  text-align: center;
}

.is-on .mdt-exit .mdt-answer {
  opacity: 1;
  transition-delay: 0.5s;
}

.mdt-leaf {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid var(--border-strong);
  color: var(--fg-2);
  background: var(--bg-elevated);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.is-on .mdt-leaf {
  opacity: 1;
  transform: none;
  transition-delay: 0.62s;
}

.mdt-leaf.kind-nonmodal {
  border-style: dashed;
}

.mdt-leaf.kind-modal {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-soft);
}

.mdt-spine {
  position: absolute;
  left: 14.25px;
  top: calc(50% + 15px);
  width: 1.5px;
  height: calc(var(--gap) + 3px);
  background: var(--fg-4);
  transform-origin: top center;
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.mdt-spine.is-drawn {
  transform: scaleY(1);
}

.mdt-spine .mdt-answer {
  position: absolute;
  left: 6px;
  top: 1px;
  line-height: 1;
}

.mdt-spine.is-drawn .mdt-answer {
  opacity: 1;
  transition-delay: 0.15s;
}

.mdt-row:nth-last-child(2) .mdt-spine {
  height: calc(var(--gap) + 10px);
}

.mdt-row-last {
  height: 30px;
  margin-top: 6px;
}

.mdt-row-last .mdt-leaf {
  margin-left: 0;
}

.mdt-panel {
  position: absolute;
  left: 530px;
  right: 0;
  top: 80px;
  min-height: 300px;
  padding: 1.1rem 1.2rem;
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 0.4s ease, transform 0.5s var(--ease);
}

.mdt:not(.is-intro) .mdt-panel {
  opacity: 1;
  transform: none;
  transition-delay: 0.3s;
}

.mdt-criteria {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.mdt-panel-body {
  animation: mdt-rise 0.35s var(--ease) both;
}

.mdt-criteria li {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--fg-2);
  animation: mdt-rise 0.4s var(--ease) both;
  animation-delay: var(--d);
}

.mdt-verdict {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
  font-size: 0.85rem;
  color: var(--fg-3);
  animation: mdt-rise 0.4s var(--ease) both;
  animation-delay: var(--d);
}

.mdt-verdict-pair {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

@keyframes mdt-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
