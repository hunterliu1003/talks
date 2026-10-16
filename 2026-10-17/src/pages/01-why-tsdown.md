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

介紹 tsdown 之前，先講我為什麼會需要它。
-->

---

<div class="kicker">01 · 換了三次打包工具</div>

# Vue Final Modal 的三代打包工具

<div class="grid grid-cols-[0.72fr_1.7fr] gap-8 mt-4 items-start">

<div class="vsteps mt-2">

<div class="vstep is-on">
<div class="vstep-dot"></div>
<div><div class="eyebrow">2020-06 · v0</div><div class="vstep-desc">Vue 2 · <a href="https://cli.vuejs.org" target="_blank" rel="noopener">Vue CLI</a><br>拿 App 工具打包函式庫，只產 UMD</div></div>
</div>

<div class="vstep" :class="$clicks >= 1 ? 'is-on' : ''">
<div class="vstep-dot"></div>
<div><div class="eyebrow">2020-08 → 2021-03 · v0.10 到 v3</div><div class="vstep-desc">Vue 2 與 Vue 3 兩條線 · <a href="https://rollupjs.org" target="_blank" rel="noopener">Rollup</a><br>手接 7 個 plugin，型別手寫 d.ts</div></div>
</div>

<div class="vstep" :class="$clicks >= 2 ? 'is-on' : ''">
<div class="vstep-dot"></div>
<div><div class="eyebrow">2023-02 · v4</div><div class="vstep-desc">Vue 3 · <a href="https://vite.dev/guide/build#library-mode" target="_blank" rel="noopener">Vite library mode</a><br>改寫成 TypeScript，型別自動產生</div></div>
</div>

</div>

<div class="min-w-0 [&_pre]:text-[0.68rem]! [&_pre]:leading-[1.45]!">

````md magic-move {at: 1}
```js
// package.json · Vue CLI
"scripts": {
  "build:lib": "vue-cli-service build --target lib \\
    --name VueFinalModal ./plugin.js --dest lib",
},
"main": "./lib/VueFinalModal.umd.min.js",
"unpkg": "./lib/VueFinalModal.umd.min.js",
```

```js
// rollup.config.js · 46 行
const plugins = [
  NodeResolve(), VuePlugin(), cleanup(), terser(), PostCSS(), commonjs(), sizes(),
  babel({ babelHelpers: 'bundled', extensions: ['.js', '.vue'] }),
]
export default {
  input: 'lib/index.js',
  output: [
    { file: pkg.main, format: 'umd', name: 'VueFinalModal',
      globals: { vue: 'Vue' } },
    { file: pkg.module, format: 'esm' },
  ],
  plugins, external: ['vue'],
}
```

```ts
// vite.config.ts · 56 行
export default defineConfig({
  plugins: [VueMacros({ plugins: { vue: Vue() } }),
    DefineOptions(), dts({ include: 'src' })],
  build: {
    lib: { entry: 'src/index.ts', name, fileName: f => `index.${f}.js` },
    rollupOptions: {
      external: ['vue', '@vueuse/core', 'focus-trap' /* … */],
      output: { globals: { 'vue': 'Vue', '@vueuse/core': 'VueUse' /* … */ } },
    },
  },
})
```
````

</div>

</div>

<!--
先從我自己的經驗講起。Vue Final Modal 六年來換過三次打包工具，左邊是三代工具，右邊是當時的設定檔。

2020 年 6 月的第一版是給 Vue 2 的，從來沒打包過元件庫的我，當時我直接用 Vue CLI 的 library mode，webpack 設定全部交給 CLI。方便是方便，但產出只有 UMD，沒有 ESM。

[click] 同年 8 月換成 Rollup，一路用到 2021 年的 v3。中間 Vue 3 出來，同一套元件要同時維護 Vue 2 跟 Vue 3 兩條線，一個改動要發兩個版本。Rollup 的 plugin 一個一個自己接。那時候專案還是 JavaScript，支援 TS 型別的部分我沒記錯的話，第一版還是 Alex 幫我寫的 d.ts，問題就是 d.ts 常常和實際的 API 不同步。

[click] 2023 年改用 TypeScript 重寫了 v4，打包改用 Vite 的 library mode。搭配 VueMacros、DefineOptions、dts 等等 plugins。我覺得是 VueFinalModal 變得真正好用且穩定的版本。然後 2024 年 1 月發了 v5 的第一個 beta 版本後，就沒有然後了。但是暫停維護的這兩年多，也讓我迎來了 tsdown。
-->
