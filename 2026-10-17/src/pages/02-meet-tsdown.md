<div class="kicker">02 · 認識 tsdown</div>

# 專為現代函式庫而生

<div class="eyebrow mt-1">The Elegant Library Bundler</div>

<div class="grid grid-cols-[auto_1fr] gap-14 mt-6 items-center">

<div class="flex flex-col items-center gap-4">
  <img src="/tsdown.svg" alt="tsdown" class="w-52" />
</div>

<div>

<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-settings-adjust class="accent shrink-0" />極簡設定，開箱即用</div>
<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-document class="accent shrink-0" />型別宣告自動產生，依賴自動分析</div>
<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-cube class="accent shrink-0" />多種格式，一套設定一致輸出</div>
<div v-click class="flex items-center gap-4 mb-4 text-2xl"><carbon-hourglass class="accent shrink-0" /><span>底層是 Rust 寫的 <a href="https://rolldown.rs" target="_blank" rel="noopener">Rolldown</a></span></div>

</div>

</div>

<!--
tsdown 就是衝著這四件事來的。它把自己定位成專為函式庫設計的打包器，標語是 The Elegant Library Bundler。標語歸標語，我拿 VFM 的四個痛點去對它。

[click] 設定繁瑣：預設值照函式庫的需求調好，VFM 主套件那組設定從 v4 的 56 行變成 9 行。

[click] 型別宣告：dist 自己多出 index.d.ts 跟 index.d.cts，連 .vue 檔的型別都有，我只寫了一行；依賴也是它讀 package.json 自己判斷哪些要外部化。

[click] 多格式：ESM 跟 CJS 一份設定一次 build。

[click] 效能：底層是 Rust 寫的 Rolldown。VFM 太小感受不深，它跟 Rolldown 的關係等一下分清楚。
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

<div v-click class="mt-4 text-xl muted">還有很多值得大家去挖掘，今天先挑我核心的幾個和我有用到的講。</div>

<!--
它具體能做什麼？六張卡，我照 VFM 用到的講。

[click] Node.js 跟 CommonJS。VFM 的 dist 有 index.cjs，給還沒轉 ESM 的專案用；Nuxt module 那組 build 的 platform 是 node。

[click] Vue 元件。VFM 整個套件都是 SFC，這張卡是我最需要的：SFC 編成 JS，型別一起出來。

[click] 型別宣告。打包成一份 d.ts，不用另外跑 vue-tsc；v4 的 build 要跑兩次，v5 一次。

[click] 壓縮。VFM 只有給 CDN 的 UMD 開 minify，因為 CDN 的使用者沒有自己的 build step；ESM 跟 CJS 不壓。

[click] 打包。給瀏覽器用的打成一包；也有 bundleless 模式，一個檔案對一個檔案，VFM 用不到。

[click] plugin。Rolldown 的全部能用，Rollup 的大多數能用，unplugin 也能用。VFM 只掛了一個 unplugin-vue。

[click] 還有很多值得大家去挖掘，今天先挑我核心的幾個和我有用到的講。
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
```

</div>

</div>

<div class="mt-8 text-xl space-y-3">
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />npm、pnpm、Yarn、Bun 都支援</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />Node.js 22.18+</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" /><span>設定檔可有可無，CLI 旗標會蓋過它：<span class="font-mono">--format</span>、<span class="font-mono">--watch</span>、<span class="font-mono">--no-dts</span></span></div>
</div>

<!--
怎麼開始？我重啟 v5 的第一天就是這三行：新專案一行指令建範本，既有專案裝成 devDependency，打包一行。

[click] npm、pnpm、Yarn、Bun 都能裝。

[click] Node 要 22.18 以上。

[click] 設定檔不是必要的選擇，CLI 就提供很多旗標能夠使用，例如臨時不要型別就加 --no-dts。
-->
