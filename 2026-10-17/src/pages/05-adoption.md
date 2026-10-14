<div class="kicker">05 · 現況與證據</div>

# 現在有多少人在用

<div v-click="1" class="grid grid-cols-3 gap-4 mt-4">

<div class="card py-3!">
<div class="eyebrow mb-2">npm 月下載</div>
<div class="stat-num">2,014 <span class="stat-unit">萬</span></div>
<div class="stat-src">2026-09-13 到 10-12 · api.npmjs.org</div>
</div>

<div class="card py-3!">
<div class="eyebrow mb-2">GitHub stars</div>
<div class="stat-num">4,300</div>
<div class="stat-src">rolldown/tsdown · 2026-10-15</div>
</div>

<div class="card card-accent py-3!">
<div class="eyebrow mb-2">十五個月的成長</div>
<div class="stat-num">82<span class="stat-unit">×</span></div>
<div class="stat-src">月下載 24.5 萬 → 2,014 萬</div>
</div>

</div>

<div v-click="2" class="mt-4 flex flex-col gap-1">
<div class="eyebrow mb-1">npm 月下載，單位：萬</div>
<BenchBar name="2025-07 · VueConf CN" secondary="sxzz 第一場" :value="24.5" :max="2014" />
<BenchBar name="2025-10 · ViteConf" secondary="sxzz 第二場" :value="87.3" :max="2014" />
<BenchBar name="2026-10 · 今天" :value="2014" :max="2014" highlight />
</div>

<div v-click="3" class="mt-4 flex flex-wrap items-center gap-2 text-lg">
<span class="muted">背後是整個 Vite 生態：</span>
<span class="tag">Vite 8 內建 Rolldown · 2026-03</span>
<span class="tag">Vite+ 的 vp pack 以 tsdown 為核心</span>
</div>

<!--
六步走完，看一下現在有多少人在用它。

[click] 三個數字都是這兩天查的。npm 每個月的下載量 2,014 萬次；GitHub 4,300 顆星；跟 sxzz 第一次講 tsdown 的時候比，十五個月成長了 82 倍。

[click] 把他兩場演講的數字放在一起看：去年 7 月 VueConf 是 24.5 萬，10 月 ViteConf 是 87.3 萬，今天是 2,014 萬。這條線不是慢慢長，是直接換了一個數量級。

[click] 原因是它背後是整個 Vite 生態。Vite 8 今年 3 月正式內建 Rolldown，Vite+ 的 vp pack 又直接以 tsdown 為核心。所以後半段的實戰，不是在賭一個小眾工具。接下來看 Vue Final Modal v5 怎麼用它。
-->
