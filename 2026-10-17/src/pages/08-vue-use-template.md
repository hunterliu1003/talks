<div class="kicker normal-case">08 · vue-use-template</div>

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
const lang = ref('en')

const { open } = useModal({
  component: ModalConfirm,
  attrs: computed(() => ({ title: t(lang.value) })),
})

lang.value = 'zh-TW'
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

<div class="overflow-hidden transition-all duration-500" :class="$clicks >= 7 ? 'max-h-32 mt-1.5 opacity-100' : 'max-h-0 mt-0 opacity-0'"><div class="card py-1! px-4!"><div class="eyebrow mb-0.5 normal-case">ModalConfirm.vue</div><div class="font-mono text-[0.68rem] leading-[1.5] text-[var(--fg-2)] whitespace-nowrap">defineProps&lt;{ title: string, count?: number }&gt;()<br>defineEmits&lt;{ confirm: [value: number], cancel: [] }&gt;()<br>&lt;slot /&gt; &lt;slot name="footer" /&gt;</div></div></div>

</div>

<div class="card py-2.5! px-4!">
<div class="eyebrow mb-2">改資料，畫面跟著變</div>
<div class="flex flex-col gap-[2px] text-sm">
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 0 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : 'text-[var(--fg-3)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">v4</span>patchOptions，手動同步一次</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 1 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 1 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">getter</span>函式裡讀 ref，改 ref 就同步</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 2 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 2 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">ref</span>整包是 ref，改 .value</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 3 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 3 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">computed</span>算出來的也行，例如 i18n</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 4 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 4 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">reactive</span>直接改屬性</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 5 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 5 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">props</span>props、emits 同一套，plain object 也行</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 6 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : $clicks > 6 ? 'text-[var(--fg-3)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">slots</span>巢狀 template 的 props 一樣會動</div>
<div class="flex items-center gap-2 rounded px-2 py-[2px] transition-colors duration-300" :class="$clicks === 7 ? 'bg-[var(--accent-soft)] text-[var(--fg)]' : 'text-[var(--fg-4)]'"><span class="font-mono text-xs w-16 shrink-0 text-[var(--fg-4)]">型別</span>全從 component 推出來，錯的當場紅</div>
</div>
</div>

</div>

<!--
打包講完，接下來回到 VFM 5 本身。useModal 跟 ModalsContainer，底下都是 vue-use-template：useModal 包的是 useTemplate，ModalsContainer 包的是 TemplateProvider。VFM 自己不再管「怎麼把一個元件動態渲染出來」，這件事整個交給 vut。vut 是我以 VFM 的核心概念從頭重寫的獨立函式庫，不是把程式碼複製出來，零 runtime 依賴。

那它最重要的改變是什麼？是把 v4 的 patchOptions 換掉。v4 開著的 modal 要改資料，你得拿著 useModal 回傳的物件呼叫 patchOptions，手動同步一次，寫起來跟 Vue 其他地方的響應式完全不一樣。

[click] v5 直接用 Vue 的響應式。第一種：attrs 給一個 getter，裡面讀 ref，改 title.value 畫面就跟著變，不用再呼叫任何東西。patchOptions 在 v5 整個拿掉，遷移指南裡就是這段。

[click] 第二種：整包 attrs 本身就是一個 ref，改 attrs.value.title。

[click] 第三種：computed。標題是算出來的，例如跟著語言切換的 i18n，lang 一變，title 就跟著重算。

[click] 第四種：reactive，直接改屬性，最接近平常寫 Vue 的手感。再加上 plain object，一共五種寫法，vut 渲染的時候統一用 toValue 解開。

[click] 而且不只 attrs：props 跟 emits 也是同一套規則，props 給 reactive、emits 給 computed 都可以，三個欄位你想怎麼混就怎麼混。

[click] 連 slots 也是：slot 裡放的巢狀 template，用 defineTemplate 包起來，它的 props 一樣可以給 getter，hint 一變，slot 內容就跟著變。你平常怎麼寫 Vue，這裡就怎麼寫。

[click] 寫法自由了，型別沒有跟著變鬆。所有型別都從 component 那一行推出來，vut 靠 vue-component-type-helpers 把元件的 props、emits、slots 讀出來：title 給數字，編輯器當場就紅；emits 只收 on 開頭的 listener，onConfirm 的 value 型別來自元件的 emit 宣告，不用自己標；slots 只能是元件宣告過的名字，header 沒宣告就紅。不管你用 getter、ref、computed 還是 reactive 包，檢查的都是解開之後的那個物件；巢狀 template 要用 defineTemplate 包一層才有檢查，這是 TypeScript 對巢狀 callback 推導的限制。這些規則全部寫成型別測試放在 repo 裡。型別講完，接下來用一段動畫看動態渲染的機制實際上怎麼運作。
-->
