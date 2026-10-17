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
這頁要來分享 VFM 的 tsdown 設定。
左邊的 dist 是實際打包後的結果，右邊搭配是 tsdown 的 config。
entry 只有一個 index.ts 因為要支援 SSR, platform 設定成 neutral, format 要輸出成 esm 和 cjs, 也因為要打包的是 Vue 元件，所以加上了 Vue plugin 以及型別的設定。

[click] CSS 的部分就非常簡單，只需要安裝 @tsdown/css 後，CSS 就會被打包放進 style.css 中。

[click] 第二組是 UMD，只給 CDN 用。用 deps.alwaysBundle 把 vue-use-template 跟 scroll-lock 一起打包進去。

[click] 第三組是 Nuxt module，三個入口一起產到 dist/nuxt 底下。@nuxt 和 nuxt 開頭的 import 都外部化，由 Nuxt 提供；vue-final-modal 自己也要外部化，因為 runtime plugin 要 import 套件本身，app 跟 plugin 拿到的才是同一個 vfm。clean 設成 false，是因為要避免打包的時候不會把其他設定的產出到 dist 資料夾的檔案刪掉。
-->

---

<div class="kicker">06 · 打包換成 tsdown</div>

# 一個 monorepo，一次 build

<div class="grid grid-cols-[1fr_1.1fr] gap-8 mt-6 items-start [&_pre]:text-[0.85rem]! [&_pre]:leading-[1.6]!">

<div class="min-w-0">
<div class="eyebrow mb-2 normal-case">根目錄的 tsdown.config.ts</div>

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  workspace: 'packages/*',
})
```

</div>

<div class="font-mono text-base leading-8 text-[var(--fg-2)] mt-7 pl-1 whitespace-nowrap">
<div><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />packages/</div>
<div class="pl-5"><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />scroll-lock/ <span class="muted">tsdown.config.ts</span></div>
<div class="pl-5"><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />vue-use-template/ <span class="muted">tsdown.config.ts</span></div>
<div class="pl-5"><carbon-folder class="inline-block align-[-3px] mr-1.5 text-[var(--fg-3)]" />vue-final-modal/ <span class="muted">tsdown.config.ts</span></div>
</div>

</div>

<!--
VFM 本身是一個 monorepo，獨立拆出來了 vue-use-template 和 scroll-lock。根目錄的 tsdown.config.ts 只要加上一行 workspace 並且指定在 packages 資料夾底下。

它會掃 packages 底下每個套件，讀各自的 tsdown.config.ts，各自 build，而且是平行跑的。每個套件照自己的需求寫設定就好。
-->
