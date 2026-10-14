<div class="kicker">03 · tsdown 與 Rolldown</div>

# 同一個核心，兩種用途

<div class="grid grid-cols-3 gap-3 mt-8">

<div v-click="1" class="card col-span-3">
<div class="flex items-baseline gap-4">
<div class="text-2xl font-semibold">Rolldown</div>
<div class="text-base muted">Rust 寫的打包器 · 相容 Rollup 的 API · 對齊 esbuild 的功能</div>
</div>
</div>

<div v-click="2" class="card">
<div class="eyebrow mb-2">應用程式</div>
<div class="text-xl font-semibold"><a href="https://vite.dev" target="_blank" rel="noopener">Vite</a> 8+</div>
<div class="text-sm muted mt-2">dev server、HMR、App build</div>
</div>

<div v-click="3" class="card card-accent">
<div class="eyebrow mb-2">函式庫</div>
<div class="text-xl font-semibold">tsdown</div>
<div class="text-sm muted mt-2">型別、格式、exports、發布前檢查</div>
</div>

<div v-click="4" class="card border-dashed! opacity-80">
<div class="eyebrow mb-2">未來</div>
<div class="text-xl font-semibold flex items-center gap-2 whitespace-nowrap"><carbon-arrow-right class="accent text-lg" />Vite library mode</div>
<div class="text-sm muted mt-2">以 tsdown 為基礎</div>
</div>

</div>


<!--
大家常把 tsdown 跟 Rolldown 混在一起，我們用一張圖分清楚。

[click] 核心是 Rolldown。它是 Rust 寫的打包器，API 相容 Rollup，功能上對齊 esbuild，是一個通用的打包核心。

[click] 從它長出來的，應用程式這一側是 Vite。從 Vite 8 開始，打包就是由 Rolldown 負責。

[click] 函式庫這一側就是 tsdown。它處理的是函式庫才在意的事：型別宣告、輸出格式、package.json 的 exports，還有發布前的檢查。

[click] 而官方給 tsdown 的定位是，未來 Vite 的 library mode 會以 tsdown 為基礎。所以今天學 tsdown，不是學一個小眾工具，而是在學 Vite 生態未來打包函式庫的方式。
-->

---

<div class="kicker">03 · tsdown 與 Rolldown</div>

# Rolldown 給能力，tsdown 給預設值

<table class="mt-4">
<thead>
<tr><th class="w-[18%]"></th><th>Rolldown 提供</th><th>tsdown 決定</th></tr>
</thead>
<tbody>
<tr v-click><td class="font-semibold">外部化</td><td><code>external</code> 選項</td><td>讀 <code>package.json</code> 的依賴自動填入</td></tr>
<tr v-click><td class="font-semibold">輸出格式</td><td><code>format</code> 選項</td><td>一個 format 一次 build，副檔名依 <code>type</code> 決定</td></tr>
<tr v-click><td class="font-semibold">型別宣告</td><td>plugin 介面</td><td>用 <code>rolldown-plugin-dts</code> 產生 <code>.d.ts</code> / <code>.d.cts</code></td></tr>
<tr v-click><td class="font-semibold">發布前</td><td class="faint">不負責</td><td>開啟後寫回 <code>exports</code>、跑 publint 與 attw</td></tr>
</tbody>
</table>

<div v-click class="mt-6">

> tsdown 負責「<span v-mark.underline.delay400="{ at: 5, color: '#00DC82', seed: 121 }">產出可以發布的產物</span>」，<br>版本號、changelog、`npm publish` 不在它的範圍。

</div>

<!--
再具體一點，兩者的分工可以用一句話講：Rolldown 給能力，tsdown 給預設值。

[click] 外部化：Rolldown 提供 external 這個選項，但要外部化哪些套件，是 tsdown 讀 package.json 的依賴自動幫你填。

[click] 輸出格式：Rolldown 有 format 選項，tsdown 決定的是一個 format 跑一次 build，副檔名依 package.json 的 type 來決定。

[click] 型別宣告：Rolldown 本身不產生型別，它提供的是 plugin 介面，tsdown 用 rolldown-plugin-dts 這個 plugin 產生 d.ts 跟 d.cts。

[click] 發布前：這部分 Rolldown 完全不負責。tsdown 則是在你開啟對應選項之後，幫你把 exports 寫回 package.json，再跑 publint 跟 attw 檢查。

[click] 最後要講清楚它的邊界：tsdown 負責的是產出可以發布的產物。版本號、changelog、npm publish，這些不在它的範圍，還是要交給你的發布流程。
-->
