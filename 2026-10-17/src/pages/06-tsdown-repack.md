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
  clean: false,
}
```
````

</div>

</div>

<!--
前面看過三份舊設定檔，這是第四份：v5 的 tsdown 設定檔，分成三組 build，左邊的 dist 會跟著亮出每一組產出的檔案。第一組是主套件的 ESM 跟 CJS。跟 v4 的 Vite 設定比，少掉的東西比留下的多：VueMacros 不用了，external 整段刪掉，build.lib 也不用寫，entry 一行、format 一行就好。型別只要 dts 的 vue 設成 true。

[click] CSS 的部分一行都沒寫，裝了 @tsdown/css 它就會把 SFC 的 style 抽成 dist/style.css，用法跟 v4 一樣要自己 import。

[click] 第二組是 UMD，只給 CDN 用。用 deps.alwaysBundle 把 vue-use-template 跟 scroll-lock 一起打包進去，因為這兩個套件沒有能直接用 script 標籤載入的版本。minify 開著，因為 CDN 的使用者沒有自己的 build step。

[click] 第三組是 Nuxt module，三個入口一起產到 dist/nuxt 底下。@nuxt 和 nuxt 開頭的 import 都外部化，由 Nuxt 提供；vue-final-modal 自己也要外部化，因為 runtime plugin 要 import 套件本身，app 跟 plugin 拿到的才是同一個 vfm。clean 設成 false，因為這組跟第一組寫進同一個 dist。
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
<div class="text-sm muted mt-1">UMD 要把另外兩包的 dist 打包進去，它們得先好</div>
</div>

</div>

</div>

<!--
v5 不只 VFM 用 tsdown，拆出來的 vue-use-template 跟 scroll-lock 也是，三個套件放在同一個 monorepo。根目錄的 tsdown.config.ts 只有一行，workspace 指到 packages 底下。

[click] 它會掃 packages 底下每個套件，讀各自的 tsdown.config.ts，各自 build，而且是平行跑的。每個套件照自己的需求寫設定就好。

[click] 這邊有一個我實際踩到的點：平行跑就沒有先後順序，但 VFM 給 CDN 的 UMD 要把 vue-use-template 跟 scroll-lock 的 dist 打包進去，所以它們兩個要先 build 好。解法是用 -F 過濾，分兩次跑：先 build 那兩個，再 build VFM。
-->
