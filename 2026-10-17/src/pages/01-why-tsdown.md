---
class: section-slide
---

<div class="chapter">Part 1</div>

# tsdown

<div class="chapter-ghost">1</div>

<!--
今天的分享主要分成兩段：

1. 前半段介紹 tsdown
2. 後半段用 Vue Final Modal 當實戰案例
-->

---

<div class="kicker">01 · 為什麼又一個打包工具</div>

# 打包函式庫的工具，已經不少了

<div v-click="1" class="flex flex-wrap items-center gap-4 mt-10">
  <span class="eyebrow w-28 shrink-0">VFM 用過的</span>
  <span class="tag text-xl! px-5! py-2!">webpack</span>
  <span class="tag text-xl! px-5! py-2!">Rollup</span>
  <span class="tag text-xl! px-5! py-2!">Vite</span>
</div>

<div v-click="2" class="flex flex-wrap items-center gap-4 mt-5">
  <span class="eyebrow w-28 shrink-0">沒用過的</span>
  <span class="tag tag-neutral text-xl! px-5! py-2! opacity-70">esbuild</span>
  <span class="tag tag-neutral text-xl! px-5! py-2! opacity-70">tsup</span>
  <span class="tag tag-neutral text-xl! px-5! py-2! opacity-70">unbuild</span>
</div>

<div v-click="3" class="mt-12 text-4xl font-semibold tracking-tight">那為什麼還要 <span class="text-gradient">tsdown</span>？</div>

<!--
打包函式庫的工具其實已經不少了。

[click] 這三個是我在 Vue Final Modal 上真的用過的：最早是 Vue CLI，底下是 webpack；後來換 Rollup；v4 換成 Vite 的 library mode，底層其實還是 Rollup。

[click] 這三個我自己沒用過，只在別人的專案裡看過，所以好不好用我不評論。大家手上的專案，八成就是這六個裡的其中一個。

[click] 那為什麼還要再來一個 tsdown？以我自己的經驗，同一個套件換了三次工具，每一次都在重堆設定。
-->

---

<div class="kicker">01 · 為什麼又一個打包工具</div>

# 打包函式庫的四個痛點

<div class="grid grid-cols-2 gap-4 mt-8">

<div v-click class="card py-6! px-7! flex items-start gap-5">
  <carbon-settings-adjust class="text-3xl accent shrink-0 mt-1" />
  <div>
    <div class="text-xl font-semibold mb-1">設定繁瑣</div>
    <div class="text-base muted">Rollup、esbuild 設定複雜</div>
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
剛剛說的重堆設定，拆開來是四個痛點，做過函式庫的人應該都遇過。

[click] 第一，設定繁瑣。Rollup 以 plugin 為核心，一個完整的流程要湊好幾個 plugin：解析模組、編譯 SFC、PostCSS、commonjs、壓縮，plugin 之間還可能打架。esbuild 雖然快，但型別、多格式這些函式庫要的東西都得自己補。這些設定我在 VFM 上親手堆過，後半段會攤開來看。

[click] 第二，型別宣告複雜。tsc 只是逐檔把 TS 轉成 JS 和 d.ts，一次只吐一份。你要同時出 ESM 跟 CJS，就得自己寫腳本產兩份型別，Vue Final Modal 最初的版本甚至不支援 TS。這時候就不得不提到 Alex，我們這屆 VConf 的總召，也是我 TypeScript 的 mentor，告訴我 TS 有多好，也才有了 VFM v4。

[click] 第三，多格式容易出錯。要同時輸出 ESM、CJS、UMD，Rollup 不是 output 寫好幾段，就是抽一層共用設定，改一個地方很容易漏掉另一個。VFM v3 的 Rollup 設定就是 UMD 跟 ESM 各寫一段。

[click] 第四，效能。這點先說清楚：VFM 很小，build 慢不是我遇過的痛。但 webpack 跟 Rollup 都是 JavaScript 寫的，專案一大就慢，這是社群的共識，也是 esbuild 和後來一堆 Rust 打包器出現的原因。
-->
