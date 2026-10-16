<div class="kicker">09 · SSR 與 Nuxt</div>

# 一個套件，附 Nuxt module

<div class="card py-4! px-6! mt-4">
<div class="eyebrow mb-2 normal-case">修復潛在的問題</div>
<ul class="compact-list text-lg">
<li>hydration error</li>
<li>memory leak</li>
<li>每個 server 請求各自獨立</li>
</ul>
</div>

<div class="grid grid-cols-[1fr_max-content_1fr] gap-4 items-start mt-8">

<div v-click>
<div class="eyebrow mb-2">v4 · 另一個套件</div>

```ts
// pnpm add @vue-final-modal/nuxt
export default defineNuxtConfig({
  modules: ['@vue-final-modal/nuxt'],
})
```

</div>

<carbon-arrow-right v-click class="text-2xl faint self-center" />

<div v-after>
<div class="eyebrow mb-2">v5 · 隨主套件發布</div>

```ts
export default defineNuxtConfig({
  modules: ['vue-final-modal/nuxt'],
})
```

</div>

</div>

<!--
鎖講完了，最後一章：SSR 與 Nuxt。v5 這次花最多力氣的地方是 SSR，徹底的解決 hydration error, memory leak, 每個 server request 各自獨立等等問題，確保 A 使用者的 modal 絕對不會出現在 B 使用者的頁面上，細節都放在新的文件裡。

[click] v4 的時候，Nuxt module 是另一個獨立的套件 @vue-final-modal/nuxt，要另外安裝。

[click] v5 透過 tsdown 簡易的設定，把 Nuxt module 併回主套件，modules 裡寫 vue-final-modal/nuxt 就好。module 會自動匯入 vue-final-modal exports 出去的東西。
-->

---
clicks: 5
---

<div class="kicker">09 · SSR 與 Nuxt</div>

<div class="mt-6">

<SsrPathsDemo :clicks="$clicks">

<template #setup-code>

```vue
<script setup lang="ts">
const { open } = useModal({
  component: Confirm,
})
open()
</script>
```

</template>

<template #outside-code>

```ts
// 任何元件之外，例如 plugin
const { open } = useModal({
  component: Confirm,
})
open()
```

</template>

</SsrPathsDemo>

</div>

<!--
SSR 是 v5 新增的能力。

[click] 如果在元件的 script setup 內呼叫 useModal open。伺服器渲染時，這個 modal 會直接寫進 HTML。server 上沒有 transition 效果。

[click] 到了瀏覽器，hydration 直接接上 server 寫好的 DOM，modal 維持開啟，第一個畫面就能操作，也不會重播進場動畫，不會閃一下。

[click] 如果是在 script setup 之外呼叫 useModal open ，例如 plugin。server 上可能無法分辨這是哪個請求，所以直接跳過、不寫進 HTML，當成 client-only 的 modal。

[click] 這種情況，一開始就會先看到頁面，再看到 modal 被開啟。

[click] 這兩條路一起算是提供了比舊版更好的使用體驗，Nuxt 專案不用再擔心有 hydration error 和 memory leak 的問題。
-->
