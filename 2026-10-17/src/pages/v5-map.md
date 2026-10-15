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
v5 改了這八件事，這一頁是下半場的地圖。打包換成 tsdown；核心改建立在 vue-use-template 上；元件行為逐項對照原生 dialog，原生負責邊界，VFM 負責體驗；捲動鎖定換成新寫的 scroll-lock。SSR 這次正式支援：v4 只是裝得進 Nuxt 專案，v5 的 modal 可以在 server 端 render、每個 request 各自隔離，解掉的老問題留到第 10 章講。Nuxt module 併入主套件，不再是另一個套件；API 跟 v4 相容；還有測試：v4 只有 6 個單元測試、沒有 Cypress，v5 有 206 個單元測試加 22 個 Cypress 元件測試。接下來一格一格看。先講打包，但打包之前，先回頭看 VFM 之前換過哪些工具。
-->
