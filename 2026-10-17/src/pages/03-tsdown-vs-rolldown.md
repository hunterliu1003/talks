<div class="kicker">03 · tsdown 與 Rolldown</div>

# Rolldown 打包，tsdown 管函式庫

<div class="grid grid-cols-3 gap-3 mt-8">

<div v-click="1" class="card col-span-3">
<div class="flex items-baseline gap-4">
<div class="text-2xl font-semibold">Rolldown</div>
<div class="text-base muted">API 和 Rollup 相容 · 功能向 esbuild 看齊</div>
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
tsdown 跟 Rolldown 的關係，我一開始也搞不清楚，翻了原始碼才分清楚。

[click] 核心是剛剛說的 Rolldown：API 跟 Rollup 相容、功能向 esbuild 看齊，它只負責打包這件事。

[click] 應用程式這一側是 Vite，Vite 8 開始打包就是 Rolldown 在做。

[click] 函式庫這一側是 tsdown，管的是函式庫才會碰到的事：型別宣告、輸出格式、package.json 的 exports，還有發布前的檢查。

[click] 再上去是 Vite+，vp build 用 Vite 打應用程式，vp pack 用 tsdown 打函式庫。如果大家用 vp pack 打過函式庫，底層就是 tsdown。我換之前也查過，npm 一個月兩千萬次下載，Vite 8 跟 Vite+ 都建在它上面，所以不是在賭一個小眾工具。
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

<!--
再具體一點，兩邊的分工一句話：Rolldown 給能力，tsdown 給預設值。這五列對應的就是等一下的六步。

[click] 外部化。打包的時候，像 vue 這種套件不能被打進你的 dist，要留成 import 讓使用者的專案自己提供，這就叫外部化。Rolldown 只給你一個 external 選項，要列哪些套件得自己寫；tsdown 直接讀 package.json 的 dependencies 跟 peerDependencies 幫你列好，所以 VFM 的設定裡一個 external 都沒寫。

[click] 輸出格式。重點在副檔名：ESM 跟 CJS 該用 .js、.mjs 還是 .cjs，取決於你的 package.json 有沒有 type: module，這件事 tsdown 讀 package.json 替你決定，不用自己想。Rolldown 的 format 只負責產出那一種格式。

[click] 型別宣告。Rolldown 本身不產型別，只提供 plugin 介面；tsdown 用 rolldown-plugin-dts 產 d.ts 跟 d.cts。

[click] 發布前。Rolldown 完全不管；tsdown 在你開了選項之後，把 exports 寫回 package.json，再跑 publint 跟 attw。
-->
