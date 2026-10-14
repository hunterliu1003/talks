---
class: section-slide
---

<div class="chapter">Part 1</div>

# tsdown

<div class="desc">先認識它，再打開原始碼看它替你做了什麼。</div>

<div class="chapter-ghost">1</div>

<!--
今天分成兩段。前半段講 tsdown：先認識它是什麼、能做什麼，再看它跟 Rolldown 的差別，最後打開原始碼，看它到底替我們做了哪些事。後半段用 Vue Final Modal v5 當實戰案例。
-->

---

<div class="kicker">02 · 認識 tsdown</div>

# 優雅的函式庫打包工具

<div class="eyebrow mt-1">The Elegant Library Bundler</div>

<div class="grid grid-cols-[auto_1fr] gap-14 mt-8 items-center">

<div class="flex flex-col items-center gap-4">
  <img src="/tsdown.svg" alt="tsdown" class="w-56" />
  <div class="font-mono text-xl font-semibold">tsdown</div>
</div>

<div>

<div v-click class="flex items-center gap-4 mb-5 text-2xl"><carbon-layers class="accent shrink-0" />建立在 <a href="https://rolldown.rs" target="_blank" rel="noopener">Rolldown</a> 之上，Rust 寫的打包器</div>
<div v-click class="flex items-center gap-4 mb-5 text-2xl"><carbon-settings class="accent shrink-0" />專為函式庫最佳化，預設值開箱即用</div>
<div v-click class="flex items-center gap-4 mb-5 text-2xl"><carbon-checkmark-filled class="accent shrink-0" />Rolldown 的官方專案</div>
<div v-click class="flex items-center gap-4 mb-5 text-2xl"><carbon-rocket class="accent shrink-0" />定位為 <a href="https://github.com/vitejs/rolldown-vite" target="_blank" rel="noopener">Rolldown Vite</a> library mode 的基礎</div>
<div v-click class="text-lg faint mt-8">靈感來自 Rollup、esbuild、tsup 與 unbuild</div>

</div>

</div>

<!--
tsdown 怎麼介紹自己？它的官方標語是 The Elegant Library Bundler，優雅的函式庫打包工具。

[click] 首先，它建立在 Rolldown 之上。Rolldown 是用 Rust 寫的打包器，這也是它快的原因。

[click] 第二，它是專門為函式庫最佳化的，大部分的設定都有合理的預設值，開箱就能用。

[click] 第三，它不是社群的第三方工具，而是 Rolldown 的官方專案。

[click] 第四，官方的定位是，它將會成為 Rolldown Vite 的 library mode 的基礎。注意這是未來式，現在還不是。

[click] 最後，tsdown 也大方地寫出它的靈感來源：Rollup 的 plugin 系統、esbuild 的速度、tsup 的開發體驗，還有 unbuild 的 hooks。
-->

---

<div class="kicker">02 · 認識 tsdown</div>

# 函式庫需要的，都內建了

<div v-click class="grid grid-cols-4 gap-3 mt-6">

<div class="card">
<carbon-code class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">TS / JS</div>
<div class="text-sm muted">現代語法直接打包</div>
</div>

<div class="card">
<carbon-document class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">型別宣告</div>
<div class="text-sm muted">自動產生 <code>.d.ts</code></div>
</div>

<div class="card">
<carbon-cube class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">多種格式</div>
<div class="text-sm muted">esm、cjs、iife、umd</div>
</div>

<div class="card">
<carbon-folder class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">資產</div>
<div class="text-sm muted"><code>.json</code>、<code>.wasm</code></div>
</div>

</div>

<div v-click class="grid grid-cols-4 gap-3 mt-3">

<div class="card">
<carbon-tree-view class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">Tree shaking</div>
<div class="text-sm muted">只留用得到的程式碼</div>
</div>

<div class="card">
<carbon-flash class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">Minify</div>
<div class="text-sm muted">需要時一個選項開啟</div>
</div>

<div class="card">
<carbon-debug class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">Source map</div>
<div class="text-sm muted">除錯對得回原始碼</div>
</div>

<div class="card card-accent">
<carbon-plug class="text-2xl accent" />
<div class="eyebrow mt-3 mb-1">Plugin 生態</div>
<div class="text-sm muted">Rolldown 全部，Rollup 大多數</div>
</div>

</div>

<!--
那 tsdown 能做什麼？

[click] 打包函式庫的基本功它都內建：TypeScript 跟 JavaScript 直接打包、自動產生型別宣告、一次輸出 esm、cjs、iife、umd 多種格式，還能處理 json、wasm 這類資產。

[click] 產物的最佳化也內建：tree shaking、minify、source map。另外它支援所有 Rolldown 的 plugin，也相容大多數的 Rollup plugin，所以原本的生態幾乎都能沿用。等一下 VFM 的例子就會看到，Vue SFC 的編譯就是靠 unplugin-vue 這個 plugin。
-->

---

<div class="kicker">02 · 認識 tsdown</div>

# 三步上手

<div class="grid grid-cols-[1fr_1.25fr] gap-x-6 gap-y-4 mt-4 items-start">

<div v-click="1">
<div class="eyebrow mb-3">01 · 安裝</div>

```bash
pnpm create tsdown@latest
# 或在既有專案
pnpm add -D tsdown
```

</div>

<div v-click="2">
<div class="eyebrow mb-3">02 · 設定</div>

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
})
```

</div>

<div v-click="3" class="col-span-2">
<div class="eyebrow mb-3">03 · 打包</div>

```bash
pnpm tsdown
# → dist/index.mjs
```

</div>

</div>


<!--
上手只要三步。

[click] 第一步安裝：新專案可以用 create tsdown 建立範本，既有專案就直接把 tsdown 裝成 devDependency。

[click] 第二步設定：最小的設定只要告訴它入口在哪裡，一個 entry 就好。

[click] 第三步打包：執行 tsdown，就會在 dist 底下得到 index.mjs。三步，沒有設定檔也能跑。
-->
