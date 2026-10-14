---
layout: center
class: text-center
---

# v5 改了什麼

<div class="grid grid-cols-4 gap-3 mt-8">

<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><img src="/tsdown.svg" alt="tsdown" class="h-[3.6rem] w-[3.6rem] scale-150 translate-x-[4px] translate-y-[8px]" /><div class="text-sm whitespace-nowrap">打包換成 tsdown</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><carbon-code class="text-5xl text-[#f472b6]" /><div class="text-sm whitespace-nowrap">核心：vue-use-template</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><ph-app-window class="text-5xl text-[#facc15]" /><div class="text-sm whitespace-nowrap">行為對齊原生 dialog</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><carbon-locked class="text-5xl text-[#c084fc]" /><div class="text-sm whitespace-nowrap">新的 scroll-lock</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><ph-cloud-check class="text-5xl text-[#2dd4bf]" /><div class="text-sm whitespace-nowrap">正式支援 SSR</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><img src="/nuxt-icon.svg" alt="Nuxt" class="h-[3.6rem] w-[3.6rem] scale-105" /><div class="text-sm whitespace-nowrap">Nuxt module 併入主套件</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><ph-handshake class="text-5xl text-[#a3e635]" /><div class="text-sm whitespace-nowrap">API 向下相容</div></div>
<div class="card py-5! px-3! flex flex-col items-center gap-3 text-center"><carbon-task-complete class="text-5xl text-[#38bdf8]" /><div class="text-sm whitespace-nowrap">更多 e2e 測試</div></div>

</div>

<!--
v5 改了這八件事，這一頁是下半場的地圖。打包換成 tsdown；核心改建立在 vue-use-template 上；元件行為逐項對照原生 dialog，原生負責邊界，VFM 負責體驗；捲動鎖定換成新寫的 scroll-lock。SSR 這次正式支援：v4 只是裝得進 Nuxt 專案，v5 的 modal 可以在 server 端 render、每個 request 各自隔離，解掉的老問題留到第 12 章講。Nuxt module 併入主套件，不再是另一個套件；API 跟 v4 相容；還有測試：v4 只有 6 個單元測試、沒有 Cypress，v5 有 206 個單元測試加 22 個 Cypress 元件測試。接下來一格一格看。先講打包，但打包之前，先回頭看 VFM 之前換過哪些工具。
-->


---

<div class="kicker">06 · 演進史</div>

# 三代打包工具，三份設定檔

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

<div v-click="3" class="mt-4">

> 設定越堆越多，打包工具本身變成<span v-mark.underline.delay400="{ at: 3, color: '#00DC82', seed: 114 }">技術債</span>。

</div>

<!--
後半段先用一頁把 v5 之前的 VFM 走一遍：左邊是三代打包工具，右邊是當時的設定檔。2020 年 6 月的 v0 給 Vue 2，直接拿 Vue CLI 的 target lib 來 build。函式庫的 build 就是一行旗標，webpack 的設定全部藏在 CLI 裡面，產出只有 UMD，main 跟 unpkg 都指向同一個 min.js，沒有 ESM、沒有型別，外部化也管不到。

[click] 同年 8 月的 v0.10 換成 Rollup，一路用到 2021 年 3 月的 v3，中間 Vue 3 出來，v1 給 Vue 3、v2 給 Vue 2，同一套元件分兩條線維護，常常同一天要發兩個版號。設定 46 行，plugin 一個一個接：解析模組、編譯 SFC、清理、壓縮、PostCSS、commonjs、Babel，UMD 跟 ESM 各寫一段，external 自己列。專案還是 JavaScript，型別宣告是我手寫的 d.ts，實作一改，型別就要記得跟著改。

[click] 2023 年的 v4 改寫成 TypeScript，打包換成 Vite 的 library mode，56 行。plugin 變少了，但疊了三層：VueMacros 包著 Vue、DefineOptions、還有產生型別的 vite-plugin-dts；build.lib 要自己寫，external 跟 globals 手寫維護。型別終於自動產生了，代價是 build 指令要另外跑一次 vue-tsc。這是一次不相容的重寫，遷移指南第一句就說請把 4.x 當成另一個函式庫。2024 年 1 月發了 v5 的 beta，然後專案停了快兩年。

[click] 回頭看，每換一次打包工具，設定就重新堆一次：plugin 清單、型別怎麼產、CSS 怎麼出、哪些依賴外部化。設定越堆越多，打包工具本身就變成了技術債。這個月重新啟動的 v5，要做的第一件事就是把這筆債還掉：換成 tsdown。
-->
