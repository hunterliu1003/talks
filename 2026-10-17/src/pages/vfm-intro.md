---
clicks: 4
---

<div class="kicker">VFM · 先認識它</div>

# Vue Final Modal 是什麼

<div class="flex items-center gap-3 -mt-2">
<img src="/vue-final-modal.svg" alt="Vue Final Modal" class="h-7" />
<span class="muted text-base italic">The most powerful modal library for Vue</span>
</div>

<div v-click="1" class="grid grid-cols-3 gap-4 mt-3">

<div class="card py-3!">
<div class="eyebrow mb-2">上 npm 至今</div>
<div class="stat-num">6 <span class="stat-unit">年</span></div>
<div class="stat-src">2020-06 起 · v1 到 v5 五個大版本</div>
</div>

<div class="card py-3!">
<div class="eyebrow mb-2">npm 月下載</div>
<div class="stat-num">28.6 <span class="stat-unit">萬</span></div>
<div class="stat-src">09-13 到 10-12 · api.npmjs.org</div>
</div>

<div class="card py-3!">
<div class="eyebrow mb-2">GitHub stars</div>
<div class="stat-num">1,010</div>
<div class="stat-src">GitHub · 2026-10-15</div>
</div>

</div>

<div class="grid grid-cols-[1fr_1.5fr] gap-4 mt-3 items-stretch">

<div v-click="2" class="card py-3!">
<div class="eyebrow mb-2">你寫的</div>
<div class="flex flex-wrap gap-2">
<span class="tag tag-neutral">內容</span>
<span class="tag tag-neutral">樣式 · CSS 或 Tailwind</span>
<span class="tag tag-neutral">什麼時候開 · v-model 或 useModal()</span>
</div>
<div class="text-sm muted mt-3">styleless：版面就是一個 <span class="font-mono">slot</span></div>
</div>

<div v-click="3" class="card card-accent py-3!">
<div class="eyebrow mb-2">它管的</div>
<div class="flex flex-wrap gap-2">
<span class="tag">遮罩</span>
<span class="tag">點背景或 Esc 關閉</span>
<span class="tag">focus trap</span>
<span class="tag">鎖捲動</span>
<span class="tag">疊層 z-index</span>
<span class="tag">過場</span>
<span class="tag">Teleport</span>
<span class="tag">SSR</span>
</div>
</div>

</div>

<div v-click="4" class="mt-3 flex flex-wrap items-center gap-2 text-lg">
<span class="muted">文件 Concepts 頁，功能清單的下一節就叫</span>
<a href="https://vue-final-modal.org/get-started/guide/concepts#you-might-not-need-vuefinalmodal" target="_blank" rel="noopener">You Might Not Need VueFinalModal</a>
</div>

<!--
後半段的主角是 Vue Final Modal，先用一頁說它是什麼。它是給 Vue 的 modal 函式庫，我給它的定位是：最強大的 modal library。強大在哪裡，等一下看它管什麼、不管什麼就知道。

[click] 先看規模。2020 年 6 月第一版上 npm，到今天六年，v1 到 v5 走過五個大版本；上個月下載 28.6 萬次；GitHub 一千多顆星。不是大專案，但在 Vue 的 modal 這個小題目上活得夠久。

[click] 它的核心設計是 styleless。VueFinalModal 這個元件不畫任何外觀，版面就是一個 slot，長相你自己寫，純 CSS 或 Tailwind 都行；什麼時候開也是你決定，用 v-model，或是用 useModal 從任何地方開。它沒有一套樣式要你覆寫，所以套進任何設計系統都不會打架。

[click] 它管的是行為：遮罩、點背景或按 Esc 關閉、焦點困在 modal 裡、關掉之後焦點回到原位、鎖住頁面捲動、多層疊起來的 z-index、開關的過場、Teleport 到 body、SSR。「最強大」指的就是這一串。加起來其實只有一件事：modal 開著的時候，使用者碰不到背景。

[click] 所以文件的 Concepts 頁，介紹完功能的下一節就叫 You Might Not Need VueFinalModal，底下列了五篇 NN/g 的文章。我自己寫的套件，我也盡量不用它，因為先搞清楚什麼是 Modal、什麼情境該用哪一種，比會用套件重要。接下來兩頁就做這件事：先用象限定義 Modal，再用決策樹選類型。
-->
