<div class="kicker">07 · 改用 tsdown 打包</div>

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
v5 的 tsdown 設定整份 58 行，是三組 build，左下角的 dist 會跟著亮出每一組產出的檔案。第一組是主套件的 ESM 跟 CJS，攤平只有 9 行：macros 的 plugin 不需要了，Vue 3.3 之後 defineOptions 是原生的；external 整段刪掉，tsdown 讀 package.json 自己決定；build.lib 消失，因為預設就是為函式庫設計的，entry 一行、format 一行，副檔名跟路徑它自己決定。型別一行：dts 設定 vue 為 true，tsdown 改用 vue-tsc 處理 .vue 檔的型別，產出 index.d.ts 給 ESM、index.d.cts 給 CJS。

[click] CSS 零行。設定檔裡一行都沒寫，只要專案裝了 @tsdown/css，tsdown 偵測到就自動載入它處理 SFC 的 style，就是第 4 章看過的那個 plugin 順序，產出 dist/style.css，package.json 的 exports 自動多一條 ./style.css。使用者的用法跟 v4 一樣要自己 import，用 Nuxt module 的話會自動加進去。

[click] 第二組是 UMD，只給 CDN 用。deps.alwaysBundle 把 vue-use-template 跟 scroll-lock 打包進去，因為這兩個套件沒有提供會定義全域變數的瀏覽器版本，CDN 使用者沒辦法自己用 script 標籤載入。minify 設成 true，因為 CDN 使用者沒有自己的 build step，下載到什麼就跑什麼；ESM 跟 CJS 不壓，交給使用者的打包工具。outputOptions 是 UMD 的全域名稱跟 globals 對應表。誰會拿到它？只有 CDN：package.json 的 unpkg 跟 jsdelivr 欄位指向它，exports 跟 main 都不指向它，用 npm 安裝的人完全碰不到這個檔案。

[click] 第三組是 Nuxt module，三個入口：module 本身、跑在瀏覽器的 runtime plugin、跑在伺服器的 server plugin，輸出路徑直接寫在 key 裡，產到 dist/nuxt 底下。platform 是 node，因為 module 是在 Nuxt 的 build 階段跑的。deps.neverBundle 把 @nuxt、nuxt 跟 # 開頭的 import 都外部化，這些由 Nuxt 提供；最特別的是 vue-final-modal 自己也要外部化，runtime plugin 必須 import 套件本身而不是原始碼，這樣 app 跟 plugin 拿到的才是同一個 vfm 實例，否則兩邊各拿一份，狀態就對不起來。最後 clean 設成 false，因為這組跟第一組都寫進同一個 dist，清空的工作交給 build script 在最前面做一次。三組 build 加上 CSS，就是左下角這一整個 dist。
-->

---

<div class="kicker">07 · 改用 tsdown 打包</div>

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
