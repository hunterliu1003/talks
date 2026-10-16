---
clicks: 3
---

<div class="flex items-center gap-3 mb-5">
<img src="/vue-final-modal.svg" alt="Vue Final Modal" class="h-7" />
<span class="muted text-base italic">The most powerful modal library for Vue</span>
</div>

# Vue Final Modal 是什麼

<div v-click="1" class="grid grid-cols-3 gap-4 mt-4">

<div class="card py-3!">
<div class="eyebrow mb-2">上 npm 至今</div>
<div class="stat-num">6 <span class="stat-unit">年</span></div>
<div class="stat-src">2020-06 起 · Vue 2 → 3 · JS → TS</div>
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

<div class="grid grid-cols-[1fr_1.5fr] gap-4 mt-4 items-stretch">

<div v-click="2" class="card py-3!">
<div class="eyebrow mb-2">核心概念</div>
<div class="text-lg font-medium leading-snug">盡量不帶預設的 CSS 樣式</div>
<div class="text-sm muted mt-2">切版的彈性留給前端工程師</div>
</div>

<div v-click="3" class="card card-accent py-3!">
<div class="eyebrow mb-2">背後做掉的事</div>
<div class="flex flex-wrap gap-2">
<span class="tag">點擊外部關閉</span>
<span class="tag">Esc 關閉</span>
<span class="tag">無障礙與易用性</span>
<span class="tag">鎖住頁面捲動</span>
<span class="tag">巢狀 z-index 自動計算</span>
<span class="tag">開關過渡動畫</span>
<span class="tag tag-neutral">等等</span>
</div>
</div>

</div>

<!--
正式開始之前簡單調查一下有多少人用過 VFM? 有用過 useModal 的可以繼續舉著。好的謝謝，請放下。

先給沒聽過和沒用過的人一個簡單的介紹：
Vue Final Modal 就是一個 Vue 的元件，最初的版本參考了：vue-js-modal, Vuetify, Element UI, BootstrapVue 等等 Modal 元件，吸收了各個元件庫的優點。

[click] 距離 VFM 第一個版本已經歷經了六年，中間不斷的改進。上個月下載 28.6 萬次；GitHub 一千顆星。

[click] 核心概念是盡可能避免預設的 CSS 樣式，將切版彈性留給前端工程師。

[click] 為了提升開發體驗，VFM 提供的功能包含：
點擊外部關閉、按 Esc 關閉、網站易用性、Scroll Lock、巢狀 Modal 的 z-index 計算、開關 Modal 的過渡動畫等等。

但是 VFM 提供這麼多功能，應該怎麼正確用呢？接下來兩頁簡報，我會先用四個象限替 Modal 進行簡單的分類，再用一個決策樹協助我們做決定。
-->
