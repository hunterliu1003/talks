<div class="kicker">06 · 打包換成 tsdown</div>

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

<!--
先從打包開始。不過在看 v5 的設定檔之前，先回頭看一下 VFM 之前換過哪些打包工具。

2020 年 6 月的第一版是給 Vue 2 的，從來沒打包過元件庫的我，當時我直接用 Vue CLI 的 library mode，webpack 設定全部交給 CLI。方便是方便，但產出只有 UMD，沒有 ESM。

[click] 同年 8 月換成 Rollup，一路用到 2021 年的 v3。中間 Vue 3 出來，同一套元件要同時維護 Vue 2 跟 Vue 3 兩條線，一個改動要發兩個版本。Rollup 的 plugin 一個一個自己接。那時候專案還是 JavaScript，支援 TS 型別的部分我沒記錯的話，第一版還是 Alex 幫我寫的 d.ts，問題就是 d.ts 常常和實際的 API 不同步。

[click] 2023 年改用 TypeScript 重寫了 v4，打包改用 Vite 的 library mode。搭配 VueMacros、DefineOptions、dts 等等 plugins。我覺得是 VueFinalModal 變得真正好用且穩定的版本。然後 2024 年 1 月發了 v5 的第一個 beta 版本後，就沒有然後了。但是暫停維護的這兩年多，也讓我迎來了 tsdown，接下來看看它怎麼優雅的解決 v5 打包的問題！
-->

---

<div class="kicker">06 · 打包換成 tsdown</div>

# v5 的 tsdown 設定

<div class="grid grid-cols-[0.8fr_1.7fr] gap-8 mt-4 items-start">

<div>

<div class="card py-4! px-5! mt-1">
<div class="eyebrow normal-case mb-2">dist/</div>
<div class="font-mono text-lg leading-9">
<div class="transition-colors duration-300" :class="$clicks === 0 ? 'accent' : 'faint'">index.js<span class="ml-3 opacity-70">ESM</span></div>
<div class="transition-colors duration-300" :class="$clicks === 0 ? 'accent' : 'faint'">index.cjs<span class="ml-3 opacity-70">CJS</span></div>
<div class="transition-colors duration-300" :class="$clicks === 0 ? 'accent' : 'faint'">index.d.ts<span class="ml-3 opacity-70">ESM 型別</span></div>
<div class="transition-colors duration-300" :class="$clicks === 0 ? 'accent' : 'faint'">index.d.cts<span class="ml-3 opacity-70">CJS 型別</span></div>
<div class="transition-colors duration-300" :class="$clicks === 1 ? 'accent' : 'faint'">style.css<span class="ml-3 opacity-70">@tsdown/css</span></div>
<div class="transition-colors duration-300" :class="$clicks === 2 ? 'accent' : 'faint'">index.umd.js<span class="ml-3 opacity-70">CDN</span></div>
<div class="transition-colors duration-300" :class="$clicks === 3 ? 'accent' : 'faint'">nuxt/<span class="ml-3 opacity-70">Nuxt module</span></div>
</div>
</div>


</div>

<div class="min-w-0 [&_pre]:text-[0.68rem]! [&_pre]:leading-[1.45]!">

````md magic-move {at: 1}
```ts
// tsdown.config.ts
export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  format: ['esm', 'cjs'],
  plugins: [Vue()],
  dts: { vue: true },
})
```

```jsonc
// package.json · pnpm add -D @tsdown/css，設定檔一行不用改
"devDependencies": {
  "@tsdown/css": "^0.22.5"
},
// build 完 tsdown 自動補的
"exports": {
  "./style.css": "./dist/style.css"
}
```

```ts
// tsdown.config.ts
{
  ...library(),
  format: ['umd'],
  deps: { alwaysBundle: ['vue-use-template', '@hunterliu/scroll-lock'] },
  minify: true,
  outputOptions: {
    name: 'VueFinalModal',
    globals: { 'vue': 'Vue', '@vueuse/core': 'VueUse' /* … */ },
  },
}
```

```ts
// tsdown.config.ts
{
  entry: {
    'nuxt/module': './src/nuxt/module.ts',
    'nuxt/runtime/plugin': './src/nuxt/runtime/plugin.ts',
    'nuxt/runtime/server': './src/nuxt/runtime/server.ts',
  },
  platform: 'node',
  format: ['esm'],
  deps: { neverBundle: [/^@nuxt\//, /^nuxt(\/|$)/, /^#/, 'vue-final-modal'] },
  dts: true,
  clean: false,
}
```
````

</div>

</div>

<!--
這是 v5 的 tsdown 設定檔，整份 58 行，分成三組 build，左下角的 dist 會跟著亮出每一組產出的檔案。先看第一組，主套件的 ESM 跟 CJS，只有 9 行。跟 v4 的 Vite 設定比，少掉的東西比留下的多：VueMacros 不用了，因為 Vue 3.3 之後 defineOptions 是原生的；external 整段刪掉，tsdown 會讀 package.json 自己判斷；build.lib 也不用寫，因為它本來就是為函式庫設計的，entry 一行、format 一行就好。型別只要一行，dts 的 vue 設成 true，.vue 檔的型別它會用 vue-tsc 處理，產出 index.d.ts 給 ESM、index.d.cts 給 CJS。

[click] CSS 的部分，設定檔裡一行都沒寫。只要專案裝了 @tsdown/css，tsdown 偵測到就會自動掛上，把 SFC 的 style 抽成 dist/style.css。使用者的用法跟 v4 一樣要自己 import style.css，用 Nuxt module 的話會自動幫你加進去。

[click] 第二組是 UMD，只給 CDN 用。這裡用 deps.alwaysBundle 把 vue-use-template 跟 scroll-lock 一起打包進去，因為這兩個套件沒有瀏覽器可以直接用 script 標籤載入的版本。minify 開著，因為 CDN 的使用者沒有自己的 build step，下載到什麼就跑什麼；ESM 跟 CJS 就不壓，交給使用者自己的打包工具。這個檔案只有 package.json 的 unpkg 跟 jsdelivr 欄位指向它，用 npm 安裝的人完全碰不到。

[click] 第三組是 Nuxt module，三個入口：module 本身、跑在瀏覽器的 runtime plugin、跑在伺服器的 server plugin，一起產到 dist/nuxt 底下。platform 設成 node，因為 module 是在 Nuxt build 的時候跑的。deps.neverBundle 把 @nuxt、nuxt 跟 # 開頭的 import 都外部化，這些由 Nuxt 提供；比較特別的是 vue-final-modal 自己也要外部化，因為 runtime plugin 必須 import 套件本身，app 跟 plugin 拿到的才會是同一個 vfm 實例，不然狀態會對不起來。最後 clean 設成 false，因為這組跟第一組都寫進同一個 dist，清空的事交給 build script 在最前面做一次就好。三組 build 加上 CSS，就是左下角這一整個 dist。
-->

---

<div class="kicker">06 · 打包換成 tsdown</div>

# 一個 monorepo，一次 build

<div class="grid grid-cols-[1fr_1.15fr] gap-6 mt-4 items-start [&_pre]:text-[0.8rem]! [&_pre]:leading-[1.5]!">

<div class="min-w-0">
<div class="eyebrow mb-2 normal-case">根目錄的 tsdown.config.ts</div>

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  workspace: 'packages/*',
})
```

<div class="font-mono text-sm leading-7 text-[var(--fg-2)] mt-3 pl-1">
<div><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />packages/</div>
<div class="pl-5"><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />scroll-lock/ <span class="muted">tsdown.config.ts</span></div>
<div class="pl-5"><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />vue-use-template/ <span class="muted">tsdown.config.ts</span></div>
<div class="pl-5"><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />vue-final-modal/ <span class="muted">tsdown.config.ts</span></div>
</div>
</div>

<div class="flex flex-col gap-4">

<div v-click="1" class="card">
<div class="eyebrow mb-2 normal-case">workspace 做的事</div>
<div class="text-base leading-relaxed">掃 <span class="font-mono">packages/*</span>，每個套件用自己的設定、各自 build，平行跑</div>
<div class="text-sm muted mt-1">scroll-lock 幾行就夠，VFM 三組 build，根目錄不用知道</div>
</div>

<div v-click="2" class="card">
<div class="eyebrow mb-2">平行沒有順序，所以分兩次</div>
<div class="font-mono text-xs leading-relaxed text-[var(--fg-2)] whitespace-nowrap">tsdown -F vue-use-template -F @hunterliu/scroll-lock<br>tsdown -F vue-final-modal</div>
<div class="text-sm muted mt-1">UMD 要把另外兩包的 dist 打進去，它們得先好</div>
</div>

</div>

</div>

<!--
v5 不只 VFM 用 tsdown，拆出來的 vue-use-template 跟 scroll-lock 也是，三個套件住在同一個 monorepo。根目錄的 tsdown.config.ts 只有一行：workspace 指到 packages 底下所有東西，就是第 4 章原始碼講的那個功能。

[click] 它做的事：掃 packages 底下每個套件，讀各自的 tsdown.config.ts，各自 build，而且平行跑。每個套件照自己的需求寫設定，scroll-lock 幾行就夠，VFM 是三組 build，根目錄完全不用知道這些差異。

[click] 一個實際踩到的點：平行跑沒有先後順序，而 VFM 給 CDN 的 UMD 要把 vue-use-template 跟 scroll-lock 的 dist 打進去，所以它們得先 build 好。做法是用 -F 過濾，分兩次跑：先 build 那兩個，再 build VFM。打包講完了，接下來回到 VFM v5 本身，看它拆成哪兩層。
-->
