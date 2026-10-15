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

<div v-click="4" class="card">
<div class="eyebrow mb-2">整合</div>
<div class="text-xl font-semibold"><a href="https://viteplus.dev" target="_blank" rel="noopener">Vite+</a></div>
<div class="text-sm muted mt-2"><span class="font-mono">vp build</span> 用 Vite，<span class="font-mono">vp pack</span> 用 tsdown</div>
</div>

</div>


<!--
tsdown 跟 Rolldown 的關係，我一開始也搞不清楚，翻了原始碼才分清楚，用一張圖講。

[click] 核心是 Rolldown。Rust 寫的打包器，API 相容 Rollup，功能對齊 esbuild，它只管打包本身。

[click] 從它長出來的，應用程式這一側是 Vite。Vite 8 開始，打包就是 Rolldown 在做。

[click] 函式庫這一側是 tsdown。它管的是函式庫才會碰到的事：型別宣告、輸出格式、package.json 的 exports，還有發布前的檢查。

[click] 再上去是 Vite+。VoidZero 把兩條路裝進同一個 vp 指令：vp build 用 Vite 打應用程式，vp pack 用 tsdown 打函式庫。如果大家用 vp pack 打過函式庫，底層就是 tsdown。所以今天學的不是一個小眾工具，是 Vite 生態打包函式庫的方式。
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
再具體一點，兩邊的分工一句話：Rolldown 給能力，tsdown 給預設值。這五列對應的就是等一下的六步。

[click] 外部化。Rolldown 有 external 選項，但要外部化哪些套件，是 tsdown 讀 package.json 的依賴幫你填，VFM 的設定一個字都沒寫。

[click] 輸出格式。Rolldown 有 format，tsdown 決定一個 format 跑一次 build，副檔名照 package.json 的 type 決定。

[click] 型別宣告。Rolldown 本身不產型別，只提供 plugin 介面；tsdown 用 rolldown-plugin-dts 產 d.ts 跟 d.cts。

[click] 發布前。Rolldown 完全不管。tsdown 在你開了選項之後，把 exports 寫回 package.json，再跑 publint 跟 attw。

[click] 最後是邊界：tsdown 負責的是產出可以發布的東西。版本號、changelog、npm publish 本身，不在它的範圍，還是你自己的流程。接下來就跟著 VFM 走六步。
-->
