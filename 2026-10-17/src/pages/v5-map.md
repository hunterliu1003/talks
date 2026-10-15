---
layout: center
class: text-center
---

# v5 改了什麼

<div class="grid grid-cols-4 gap-3 mt-8">

<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><img src="/tsdown.svg" alt="tsdown" class="h-[3.6rem] w-[3.6rem] scale-150 translate-x-[4px] translate-y-[8px]" /><div class="text-sm whitespace-nowrap">打包換成 tsdown</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><carbon-code class="text-5xl text-[#f472b6]" /><div class="text-sm whitespace-nowrap">核心：vue-use-template</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><ph-app-window class="text-5xl text-[#facc15]" /><div class="text-sm whitespace-nowrap">行為對齊原生 dialog</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><carbon-locked class="text-5xl text-[#c084fc]" /><div class="text-sm whitespace-nowrap">新的 scroll-lock</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><ph-cloud-check class="text-5xl text-[#2dd4bf]" /><div class="text-sm whitespace-nowrap">正式支援 SSR</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><img src="/nuxt-icon.svg" alt="Nuxt" class="h-[3.6rem] w-[3.6rem] scale-105" /><div class="text-sm whitespace-nowrap">Nuxt module 併入主套件</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><ph-handshake class="text-5xl text-[#a3e635]" /><div class="text-sm whitespace-nowrap">API 向下相容</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><carbon-task-complete class="text-5xl text-[#38bdf8]" /><div class="text-sm whitespace-nowrap">更多 e2e 測試</div></div>

</div>

<!--
VFM 5 改進了非常多東西，算是累積了三年左右迎來的一次報復性改動
因為過去三年，小弟我主要專注在照顧女兒上，也感謝 VFM 使用者多多包涵，還有老婆的寬容。

打包換成 tsdown。

核心換成 vue-use-template，這是我從 VFM 拆出來用於動態渲染元件的部分。

將元件行為對齊原生 dialog，還新增了一個 VueFinalDialog 的元件，提供給想直接使用原生 dialog 的使用者。

然後因為原本用的函式庫 body-scroll-lock 的作者沒有再維護了，因此我用 Typescript 重新寫了 scroll-lock。

Nuxt 這次是正式且完整的支援，細節留到後面講。

API 幾乎全部相容，大部分專案只需要進行微調。

最後則是補上比 v4 更多的單元測試、e2e 測試。
-->
