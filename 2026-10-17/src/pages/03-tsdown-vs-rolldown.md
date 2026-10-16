<div class="kicker">03 · tsdown 建在什麼上面</div>

# 底層都是 Rolldown

<div class="grid grid-cols-3 gap-3 mt-8">

<div v-click="1" class="card col-span-3">
<div class="flex items-baseline gap-4">
<div class="text-2xl font-semibold">Rolldown</div>
<div class="text-base muted">API 和 Rollup 相容 · 功能向 esbuild 看齊</div>
</div>
</div>

<div v-click="2" class="card">
<div class="eyebrow mb-2">應用程式</div>
<div class="text-xl font-semibold flex items-center gap-2"><img src="/vite.svg" alt="Vite" class="h-6" /><span><a href="https://vite.dev" target="_blank" rel="noopener">Vite</a> 8+</span></div>
<div class="text-sm muted mt-2">dev server、HMR、App build</div>
</div>

<div v-click="3" class="card">
<div class="eyebrow mb-2">函式庫</div>
<div class="text-xl font-semibold flex items-center gap-2"><img src="/tsdown.svg" alt="tsdown" class="h-6" /><span>tsdown</span></div>
<div class="text-sm muted mt-2">型別、格式、exports、發布前檢查</div>
</div>

<div v-click="4" class="card">
<div class="eyebrow mb-2">整合</div>
<div class="text-xl font-semibold flex items-center gap-2"><img src="/viteplus.svg" alt="Vite+" class="h-6" /><a href="https://viteplus.dev" target="_blank" rel="noopener">Vite+</a></div>
<div class="text-sm muted mt-2"><span class="font-mono">vp build</span> 用 Vite<br><span class="font-mono">vp pack</span> 用 tsdown</div>
</div>

</div>

<!--
這一頁把這層關係講清楚。

[click] 核心是剛剛說的 Rolldown：API 跟 Rollup 相容、功能向 esbuild 看齊，它只負責打包這件事。

[click] 應用程式這一側是 Vite，從 Vite 8 開始打包就是 Rolldown 在做。

[click] 函式庫這一側是 tsdown。Rolldown 負責打包本身，tsdown 負責打包函式庫的整個使用體驗。

[click] 再來是將兩個都整合在一起的 Vite+，vp build 用 Vite 打包應用程式，vp pack 用 tsdown 打包函式庫。
-->
