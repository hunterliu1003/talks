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

[click] Rollup 是老牌，esbuild 快，tsup 包了 esbuild 讓它好用，unbuild 是 UnJS 的，Rslib 是 Rspack 家的。你現在手上的專案，八成就是其中一個。

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
    <div class="text-base muted">Rollup 要湊一堆 plugin，esbuild 不夠全面</div>
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
    <div class="text-base muted">ESM、CJS、IIFE 各一套設定，改了會漏</div>
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

[click] 第一，設定繁瑣。Rollup 是以 plugin 為核心，一個完整的打包流程要湊好幾個 plugin，plugin 之間還可能打架。esbuild 跟 tsup 簡單，但功能不夠全面，plugin 生態也比不上 Rollup。

[click] 第二，型別宣告複雜。tsc 只是逐檔把 TS 轉成 JS 和 d.ts，一次只吐一份。你要同時出 ESM 跟 CJS，就得自己寫腳本產兩份型別，Vue Final Modal 最初的版本甚至不支援 TS。這時候就不得不提到 Alex，我們這屆 VConf 的總召，也是我 TypeScript 的 mentor，告訴我 TS 有多好，也才有了 VFM v4。

[click] 第三，多格式容易出錯。用 esbuild 或 Rollup 要同時輸出 ESM、CJS、IIFE、UMD，不是寫好幾套設定，就是抽一層共用設定，改一個地方很容易漏掉另一個。

[click] 第四，效能。Rollup 是 JavaScript 寫的，大專案一跑就慢，天生比不過 Go 或 Rust 寫的工具。tsdown 就是為了這四件事而生的，下一頁看它怎麼回應。
-->
