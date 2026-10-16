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

首先 v5 最重要的改動之一就是 tsdown 重新打包

第二個是，核心改用 vue-use-template 稍後會介紹

再來是將 Modal 的行為對齊原生的 dialog

開發了新的 scroll-lock 機制

正式支援 SSR 並且提供 Nuxt module

幾乎所有 API 向下相容

還補上了更多的 e2e 測試

接下來，我會一個一個進行分享
-->
