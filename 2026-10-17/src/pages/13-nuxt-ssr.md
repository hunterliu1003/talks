<div class="kicker">12 · SSR 與 Nuxt</div>

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
鎖講完了，最後一章：SSR 與 Nuxt。vut 這次花最多力氣的地方是 SSR：每一次 server render 各自隔離，A 使用者的 modal 絕對不會出現在 B 使用者的頁面上，連 polyfill 了 window 的伺服器環境都有 markServer 可以手動標記。這些細節在文件裡，這裡先講 Nuxt。

[click] v4 的時候，Nuxt module 是另一個獨立的套件 @vue-final-modal/nuxt，要另外安裝。

[click] v5 把它併回主套件，modules 裡寫 vue-final-modal/nuxt 就好。為什麼要併？那個獨立套件的最後一版 1.0.3 停在 2023 年 12 月，主套件後來的版本它都沒跟上；併回來之後兩邊永遠是同一個版本。這就是 tsdown 設定的第三組 build 產出來的東西，套件的 exports 裡 ./nuxt 指向 dist/nuxt/module.mjs，等一下會看它怎麼打包。module 會自動匯入 useModal、useVfm、defineModal、defineTemplate 這些 composables，還有 VueFinalModal 跟 ModalsContainer 兩個元件，不用再 import；style.css 也由它自動加進去。如果跟別的 module 撞名，可以把 autoImports 關掉。裝好之後，modal 在 SSR 下怎麼開，下一頁用動畫看兩條路。
-->

---
clicks: 5
---

<div class="kicker">12 · SSR 與 Nuxt</div>

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

[click] 第一條：在元件的 script setup 內呼叫 open，或是設定 defaultModelValue 為 true。伺服器渲染時，這個 modal 直接寫進 HTML，而且帶著正確的 z-index，這就是前面說 zIndexFn 用 computed 的原因。補充一個細節：在 server 上沒有 transition，open 會立刻 resolve 成 opened，所以 HTML 寫出來的時候 modal 已經是開的。

[click] 到了瀏覽器，hydration 直接接上 server 寫好的 DOM，modal 維持開啟，第一個畫面就立刻可以操作，不用等 client 重新 render；而且不重播進場動畫，使用者第一眼看到的就是開好的 modal，不會閃一下。

[click] 第二條：open 不是在 script setup 內呼叫。程式碼和第一條一模一樣，差別只在它寫在任何元件之外，例如 plugin。一定會碰到的情境是閒置逾時警告：計時器跟著整個 app，到期時沒有任何元件正在 setup，而「再 1 分鐘就登出，要延長嗎」又需要使用者當場決定，只能在這裡開 modal。server 上它可能在任何時間點被觸發，前面 SSR 隔離那頁講過，伺服器分不出這是哪個 request，所以直接跳過、不寫進 HTML，useTemplate 回傳的 ignored 會是 true，等於把它當成 client-only 的 modal，dev 模式會印警告提醒你。Nuxt 的 plugin 跟路由 middleware 都跑在 render 之前，那時候還沒有這次 request 的 SSR context，所以都是同一條路，這些都在 Nuxt 專案裡實測過。

[click] 重點是它會自動退回 client 端：瀏覽器接手、元件 mount 之後再把 modal 開起來，這時候就是一般的 client 端開啟，進場動畫照播，只是少了首屏就開著的好處。

[click] 兩條路 server 跟瀏覽器的輸出都一致：第一條兩邊都有 modal，第二條兩邊都沒有、client 再補開，所以都不會 hydration mismatch。這也順便解掉 v4 的另一個老問題：v4 只是裝得進 Nuxt 專案，modal 的狀態掛在跨 request 的單例上，server render 會 memory leak；v5 每個 request 各自隔離，這個問題一起消失。
-->
