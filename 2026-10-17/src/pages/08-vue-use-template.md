<div class="kicker normal-case">07 · vue-use-template</div>

# VFM 的動態渲染層

<div class="grid grid-cols-2 gap-4 mt-2 font-mono text-sm">
<div class="card py-2! px-4! flex items-center justify-between"><span class="accent">useModal()</span><span class="font-sans text-xs text-[var(--fg-4)]">底層是</span><span>useTemplate()</span></div>
<div class="card py-2! px-4! flex items-center justify-between"><span class="accent">&lt;ModalsContainer /&gt;</span><span class="font-sans text-xs text-[var(--fg-4)]">底層是</span><span>&lt;TemplateProvider /&gt;</span></div>
</div>

<div class="grid grid-cols-[1.15fr_1fr] gap-5 mt-3 items-start">

<div class="min-w-0 [&_pre]:text-[0.8rem]!">

````md magic-move
```ts
// v4
const modal = useModal({
  component: ModalConfirm,
  attrs: { title: 'Hello World!' },
})

modal.patchOptions({
  attrs: { title: 'Hello Vue!' },
})
```
```ts
// v5 · getter
const title = ref('Hello World!')

const { open } = useModal({
  component: ModalConfirm,
  attrs: () => ({ title: title.value }),
})

title.value = 'Hello Vue!'
```
```ts
// v5 · ref
const attrs = ref({ title: 'Hello World!' })

const { open } = useModal({
  component: ModalConfirm,
  attrs,
})

attrs.value.title = 'Hello Vue!'
```
```ts
// v5 · computed
const { t } = useI18n()

const { open } = useModal({
  component: ModalConfirm,
  attrs: computed(() => ({ title: t('hello') })),
})
```
```ts
// v5 · reactive
const attrs = reactive({ title: 'Hello World!' })

const { open } = useModal({
  component: ModalConfirm,
  attrs,
})

attrs.title = 'Hello Vue!'
```
```ts
// v5 · props、emits 同一套
const { open, close } = useModal({
  component: ModalConfirm,
  props: reactive({ title: 'Hello World!' }),
  emits: computed(() => ({
    onConfirm: () => close(),
  })),
})
```
```ts
// v5 · slots 裡的巢狀 template 也一樣
const { open } = useModal({
  component: ModalConfirm,
  attrs: () => ({ title: title.value }),
  slots: {
    default: defineTemplate({
      component: Hint,
      props: () => ({ text: hint.value }),
    }),
  },
})
```
```ts
// v5 · 型別跟著 component 走
const { open, close } = useModal({
  component: ModalConfirm,
  attrs: () => ({ title: 1 }), // 紅：要 string
  emits: {
    onConfirm: value => close(), // value 是 number
  },
  slots: { header: Hint }, // 紅：沒有 header slot
})
```
````

<div class="overflow-hidden transition-all duration-500" :class="$clicks >= 7 ? 'max-h-32 mt-1.5 opacity-100' : 'max-h-0 mt-0 opacity-0'"><div class="card py-1! px-4!"><div class="eyebrow mb-0.5 normal-case">ModalConfirm.vue</div><div class="font-mono text-[0.68rem] leading-[1.5] text-[var(--fg-2)] whitespace-nowrap">defineProps&lt;{ title: string, count?: number }&gt;()<br>defineEmits&lt;{ confirm: [value: number], cancel: [] }&gt;()<br>defineSlots&lt;{ default(): any, footer(): any }&gt;()</div></div></div>

</div>

<div class="card py-2.5! px-4!">
<div class="eyebrow mb-2">改資料，畫面跟著變</div>
<div class="flex flex-col gap-[2px] text-sm">
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 0 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : 'text-[var(--fg-3)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">v4</span>patchOptions，手動同步一次</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 1 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 1 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">getter</span></div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 2 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 2 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">ref</span></div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 3 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 3 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">computed</span></div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 4 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 4 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">reactive</span></div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 5 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 5 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-24 shrink-0 text-[var(--fg-4)]">props, emits</span></div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 6 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 6 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">slots</span><span class="font-mono">defineTemplate</span></div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 7 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">型別</span><span class="font-mono">vue-component-type-helpers</span></div>
</div>
</div>

</div>

<!--
打包講完，接下來回到 VFM 5 本身。VFM 自己不再管「怎麼把一個元件動態渲染出來」，這件事整個交給 vue-use-template。它是我以 VFM 的核心概念從頭重寫的函式庫，useModal 底層是用 useTemplate， ModalsContainer 底層是用 TemplateProvider。

舊版開著的 Modal 要改資料，你得拿 patchOptions，手動同步一次，寫起來跟 Vue 3 響應的方式完全不一樣。

[click] v5 善用了 Vue 的響應式。不管你是要用 getter
[click] ref
[click] computed
[click] 或是 reactive 都可以

[click] 而且不只 attrs：props, emits 也是同樣支援這寫法。

[click] 再來 slots 也是：slot 裡放的巢狀 template，slot 可以用 defineTemplate 包起來，提供較好的型別檢查。

[click] 寫法自由了，型別沒有跟著變鬆。型別檢查主要是靠 vue-component-type-helpers 把元件的 props、events、slots 讀取出來：title 是必填的字串，你給數字，TS型別檢查都會報錯；同理 events 和 slots 也是，巢狀 template 要用 defineTemplate 包一層才有檢查，這是 TypeScript 對巢狀 callback 推導的限制，目前還沒有更好的解決辦法。型別講完，接下來用一段動畫看動態渲染的機制實際上怎麼運作。
-->
