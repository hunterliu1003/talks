<div class="kicker">02 · 認識 tsdown</div>

# 專為現代函式庫而生

<div class="eyebrow mt-1">The Elegant Library Bundler</div>

<div class="grid grid-cols-[auto_1fr] gap-14 mt-6 items-center">

<div class="flex flex-col items-center gap-4">
  <img src="/tsdown.svg" alt="tsdown" class="w-52" />
  <div class="font-mono text-xl font-semibold">tsdown</div>
</div>

<div>

<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-settings-adjust class="accent shrink-0" />極簡設定，開箱即用</div>
<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-document class="accent shrink-0" />型別宣告自動產生，依賴自動分析</div>
<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-cube class="accent shrink-0" />多種格式，一套設定一致輸出</div>
<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-hourglass class="accent shrink-0" /><span>Rust 驅動，底層是 <a href="https://rolldown.rs" target="_blank" rel="noopener">Rolldown</a></span></div>
<div v-click class="flex items-center gap-4 text-2xl"><carbon-inspection class="accent shrink-0" /><span>連發布前的 <span class="font-mono">exports</span>、publint、attw 都管</span></div>

</div>

</div>

<!--
tsdown 的定位很明確：專為現代函式庫而生，它的標語是 The Elegant Library Bundler。剛才的四個痛點，它一個一個回應。

[click] 設定繁瑣，它用極簡設定回應：預設值是照函式庫的需求調好的，大部分專案連設定檔都不用寫。

[click] TS 型別宣告複雜，它自動產生 d.ts；依賴也自動分析，哪些要打進去、哪些留給使用者自己裝，不用你手動列。

[click] 多格式易出錯，它一套設定就一致輸出 ESM 跟 CJS，不用抽共用設定。

[click] 效能，它的底層是 Rust 寫的 Rolldown。等一下會把它跟 Rolldown 的關係分清楚。

[click] 第五點，也是今天的主線：它連發布前的事都管。package.json 的 exports 它幫你寫，publint 跟 attw 它幫你跑。等一下就跟著這條線，從設定檔一路走到 npm publish。
-->

---

<div class="kicker">02 · 認識 tsdown</div>

# 它能做什麼

<div class="grid grid-cols-3 gap-4 mt-4">

<div v-click class="card flex flex-col items-center text-center py-4!">
  <carbon-terminal class="text-3xl accent" />
  <div class="text-lg font-semibold mt-2">Node.js / CommonJS</div>
  <div class="font-mono text-sm muted mt-1">require('fs')</div>
</div>

<div v-click class="card flex flex-col items-center text-center py-4!">
  <carbon-logo-vue class="text-3xl accent" />
  <div class="text-lg font-semibold mt-2">Vue 元件</div>
  <div class="font-mono text-sm muted mt-1">App.vue</div>
</div>

<div v-click class="card flex flex-col items-center text-center py-4!">
  <carbon-types class="text-3xl accent" />
  <div class="text-lg font-semibold mt-2">型別宣告</div>
  <div class="font-mono text-sm muted mt-1">index.d.ts</div>
</div>

<div v-click class="card flex flex-col items-center text-center py-4!">
  <carbon-shrink-screen class="text-3xl accent" />
  <div class="text-lg font-semibold mt-2">壓縮</div>
  <div class="font-mono text-sm muted mt-1">minify · tree shaking</div>
</div>

<div v-click class="card flex flex-col items-center text-center py-4!">
  <carbon-cube class="text-3xl accent" />
  <div class="text-lg font-semibold mt-2">打包</div>
  <div class="font-mono text-sm muted mt-1">bundle · bundleless</div>
</div>

<div v-click class="card card-accent flex flex-col items-center text-center py-4!">
  <carbon-plug class="text-3xl accent" />
  <div class="text-lg font-semibold mt-2">Plugin</div>
  <div class="font-mono text-sm muted mt-1">Rolldown · Rollup · unplugin</div>
</div>

</div>

<div v-click class="mt-4 text-xl muted">還有更多：JSON、WASM、source map、watch…，今天只挑核心的講</div>

<!--
那 tsdown 具體能做什麼？

[click] Node.js 跟 CommonJS 它都處理：程式碼裡的 require 它看得懂，也能直接輸出 CJS 格式給還沒轉 ESM 的使用者。

[click] Vue 元件。Node 跟瀏覽器都不認識 .vue 檔，tsdown 可以把 SFC 編譯成 JS，型別宣告也一起產出。等一下 VFM 就是這個情境。

[click] 型別宣告。它會把 TypeScript 的型別打包成一份 d.ts，方便發布，也不用再跑 tsc。

[click] 壓縮。minify 跟 tree shaking 都內建，要給瀏覽器用、在意體積的函式庫特別需要。

[click] 打包。給瀏覽器用的當然要打成一包；給 Node 用的，有些人覺得不需要打包，所以也有 bundleless 模式，一個檔案對一個檔案。

[click] 最重要的是 plugin。Rolldown 的 plugin 全部能用，Rollup 的大多數能用，unplugin 當然也能用，所以原本的生態幾乎都能沿用。

[click] 還有更多功能，今天不一一展開，等一下只挑核心的講。
-->

---

<div class="kicker">02 · 認識 tsdown</div>

# 快速上手

<div class="grid grid-cols-3 gap-5 mt-6">

<div>
<div class="eyebrow mb-3">建立新專案</div>

```bash
pnpm create tsdown@latest
```

</div>

<div>
<div class="eyebrow mb-3">裝進既有專案</div>

```bash
pnpm add -D tsdown
```

</div>

<div>
<div class="eyebrow mb-3">一行指令打包</div>

```bash
pnpm tsdown
# → dist/index.mjs
```

</div>

</div>

<div class="mt-8 text-xl space-y-3">
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />npm、pnpm、Yarn、Bun 都支援</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />Node.js 22.18、24.11 或 26 以上，奇數版不支援</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" /><span>沒有設定檔也能跑；有的話，CLI 旗標蓋過去，例如 <span class="font-mono">tsdown --no-dts</span></span></div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" /><span>常用旗標都有：<span class="font-mono">--format</span>、<span class="font-mono">--watch</span>、<span class="font-mono">--minify</span></span></div>
</div>

<!--
上手非常簡單。新專案一行指令建立範本，既有專案直接裝成 devDependency，打包也只要一行，就會在 dist 底下得到 index.mjs。這個 .mjs 的副檔名先記著，等一下會回來講。

[click] npm、pnpm、Yarn、Bun 都支援。

[click] Node.js 要 22.18、24.11 或 26 以上，奇數版不支援。Deno 跟 Bun 的執行環境還是實驗性的。

[click] 沒有設定檔也能跑。有設定檔的話，CLI 旗標會蓋過設定檔，例如設定檔開了 dts，臨時想跳過就加 --no-dts。我實測過，產物裡就只剩 index.mjs。

[click] 常用的旗標都有：format、watch、minify。預設值已經調好了，大部分需求不用再加。
-->
