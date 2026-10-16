<div class="kicker">09 · SSR 與 Nuxt</div>

# 一個套件，附 Nuxt module

<div class="grid grid-cols-[1fr_max-content_1fr] gap-4 items-start mt-12">

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
SSR 是 v5 新增的能力，底層來自 vue-use-template。open 在哪裡呼叫，會走兩條不同的路。左邊是 server，右邊是瀏覽器。

[click] 第一條：在元件的 script setup 內呼叫 open，或是 defaultModelValue 設 true。伺服器渲染時，這個 modal 直接寫進 HTML，帶著正確的 z-index。server 上沒有 transition，open 會立刻 resolve 成 opened。

[click] 到了瀏覽器，hydration 直接接上 server 寫好的 DOM，modal 維持開啟，第一個畫面就能操作，也不重播進場動畫，不會閃一下。

[click] 第二條：open 寫在任何元件之外，例如 plugin。典型的情境是閒置逾時警告，計時器跟著整個 app 跑，到期時沒有任何元件在 setup，只能在這裡開 modal。server 上分不出這是哪個 request，所以直接跳過、不寫進 HTML，當成 client-only 的 modal，dev 模式會印警告提醒你。

[click] 它會自動退回 client 端：瀏覽器接手、元件 mount 之後再把 modal 開起來，進場動畫照播，只是少了首屏就開著的好處。

[click] 兩條路 server 跟瀏覽器的輸出都一致，所以不會 hydration mismatch。這也順便解掉 v4 的老問題：v4 的 modal 狀態掛在跨 request 的單例上，server render 會 memory leak；v5 每個 request 各自隔離。
-->
