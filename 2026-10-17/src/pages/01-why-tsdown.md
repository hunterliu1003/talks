---
class: section-slide
---

<div class="chapter">Part 1</div>

# tsdown

<div class="desc">先看打包函式庫的痛點，再跟著一個套件從設定檔走到 npm publish。</div>

<div class="chapter-ghost">1</div>

<!--
今天分成兩段。前半段講 tsdown：先看打包函式庫有哪些痛點，認識 tsdown 怎麼回應，再跟著一個套件從設定檔一路走到 npm publish。後半段用 Vue Final Modal v5 當實戰案例。

開始之前，想簡單調查一下現場有沒有用過 tsdown 的人？有沒有用過 Vue Final Modal 的人？
-->

---

<div class="kicker">01 · 為什麼又一個打包工具</div>

# 打包函式庫的工具，已經不少了

<div v-click="1" class="flex flex-wrap gap-4 mt-12">
  <span class="tag tag-neutral text-xl! px-5! py-2!">Rollup</span>
  <span class="tag tag-neutral text-xl! px-5! py-2!">esbuild</span>
  <span class="tag tag-neutral text-xl! px-5! py-2!">tsup</span>
  <span class="tag tag-neutral text-xl! px-5! py-2!">unbuild</span>
  <span class="tag tag-neutral text-xl! px-5! py-2!">Rslib</span>
</div>

<div v-click="2" class="mt-16 text-4xl font-semibold tracking-tight">那為什麼還要 <span class="text-gradient">tsdown</span>？</div>

<!--
先問一個問題。打包函式庫這件事，工具早就不缺了。

[click] Rollup 是老牌，我自己的套件從 2020 年一路用到 v4，Vite 的 library mode 底層也是它；esbuild 是 Go 寫的，主打快；tsup 是包著 esbuild 的函式庫打包器；unbuild 是 UnJS 的，Rslib 是 Rspack 家的。後面這幾個我自己沒在套件上用過，用過的是 Vue CLI 時代的 webpack、Rollup，還有 Vite。你現在手上的專案，八成就是其中一個。

[click] 那為什麼還要再做一個 tsdown？要回答這個問題，得先看這些工具沒解決的痛點。
-->

---

<div class="kicker">01 · 為什麼又一個打包工具</div>

# 打包函式庫的四個痛點

<div class="grid grid-cols-2 gap-4 mt-8">

<div v-click class="card py-6! px-7! flex items-start gap-5">
  <carbon-settings-adjust class="text-3xl accent shrink-0 mt-1" />
  <div>
    <div class="text-xl font-semibold mb-1">設定繁瑣</div>
    <div class="text-base muted">Rollup 要湊一堆 plugin，Vite 也要自己疊</div>
  </div>
</div>

<div v-click class="card py-6! px-7! flex items-start gap-5">
  <carbon-document class="text-3xl accent shrink-0 mt-1" />
  <div>
    <div class="text-xl font-semibold mb-1">TS 型別宣告複雜</div>
    <div class="text-base muted">tsc 一次只吐一份，多格式要自己寫腳本</div>
  </div>
</div>

<div v-click class="card py-6! px-7! flex items-start gap-5">
  <carbon-cube class="text-3xl accent shrink-0 mt-1" />
  <div>
    <div class="text-xl font-semibold mb-1">多格式易出錯</div>
    <div class="text-base muted">ESM、CJS、UMD 各寫一段，改了會漏</div>
  </div>
</div>

<div v-click class="card py-6! px-7! flex items-start gap-5">
  <carbon-hourglass class="text-3xl accent shrink-0 mt-1" />
  <div>
    <div class="text-xl font-semibold mb-1">效能瓶頸</div>
    <div class="text-base muted">JavaScript 寫的打包器，大專案一跑就慢</div>
  </div>
</div>

</div>

<!--
這四個痛點，做過函式庫的人應該都遇過。

[click] 第一，設定繁瑣。Rollup 是以 plugin 為核心，一個完整的打包流程要湊好幾個 plugin：解析模組、編譯 SFC、PostCSS、commonjs、壓縮，plugin 之間還可能打架。換成 Vite 的 library mode 也一樣，build.lib、external、globals 全部自己寫，型別還要再疊一個 plugin。這兩份設定我在 Vue Final Modal 上都親手堆過，後半段會攤開來看。

[click] 第二，型別宣告複雜。tsc 只是逐檔把 TS 轉成 JS 和 d.ts，一次只吐一份。你要同時出 ESM 跟 CJS，就得自己寫腳本產兩份型別，Vue Final Modal 最初的版本甚至不支援 TS。這時候就不得不提到 Alex，我們這屆 VConf 的總召，也是我 TypeScript 的 mentor，告訴我 TS 有多好，也才有了 VFM v4。

[click] 第三，多格式容易出錯。要同時輸出 ESM、CJS、UMD，Rollup 不是 output 寫好幾段，就是抽一層共用設定，改一個地方很容易漏掉另一個。VFM v3 的 Rollup 設定就是 UMD 跟 ESM 各寫一段。

[click] 第四，效能。webpack 跟 Rollup 都是 JavaScript 寫的，專案一大就慢，天生比不過 Go 或 Rust 寫的工具。tsdown 就是為了這四件事而生的，下一頁看它怎麼回應。
-->
