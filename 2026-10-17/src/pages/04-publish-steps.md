<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="1" /></div>

<div class="grid grid-cols-[1.35fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.7rem]!">

<div class="flex items-center gap-2 mb-3 text-base whitespace-nowrap">
<span class="font-mono">format: ['esm', 'cjs']</span>
<carbon-arrow-right class="faint" />
<span class="tag">index.js</span><span class="tag">index.cjs</span><span class="tag tag-neutral">+ .d.ts</span>
</div>

<div v-show="$clicks < 2">

```ts {all|2-3}
// src/config/options.ts
const formats = resolveComma(toArray(format, 'esm'))
return formats.map((fmt, idx) => ({
  ...config,
  format: normalizeFormat(fmt),
}))
```

</div>

<div v-show="$clicks >= 2">

```ts {all|2-4}
// src/build.ts
const bundles = await Promise.all(
  configs.map(o => buildSingle(o, clean, done)),
) // clean 只跑一次
```

</div>

<div v-click="3" class="text-sm muted mt-2 leading-relaxed">副檔名也是它決定：<span class="font-mono">platform</span> 是 node 一律 <span class="font-mono">.mjs</span> / <span class="font-mono">.cjs</span>；VFM 是 neutral 加 <span class="font-mono">"type": "module"</span>，所以是 <span class="font-mono">.js</span> / <span class="font-mono">.cjs</span></div>

</div>

<SourceTree scene="format" :clicks="$clicks" />

</div>

<!--
接下來跟著 VFM 走六步，從設定檔到 npm publish。每一步先看它替你做了什麼，再看原始碼，右邊會點亮正在讀的檔案。第一步，格式。寫一次 format，產物兩份。VFM 只寫了一行 format，產物是四個檔：index.js、index.cjs，加上各自的型別。

[click] options.ts 把 format 轉成陣列，對每一個 format 各產生一份獨立的設定。平常說的 dual format，在 tsdown 裡是兩次獨立的 build。

[click] 展開後的設定在 build.ts 用 Promise.all 平行跑，clean 只做一次。VFM 三組設定展開就是四次 build 平行跑。

[click] 快速上手那頁的 index.mjs，副檔名也是這裡決定的。platform 預設 node，一律用 .mjs 跟 .cjs；VFM 是給瀏覽器用的，platform 設成 neutral，再看 package.json 有 type module，所以 ESM 是 .js、CJS 是 .cjs。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="2" /></div>

<div class="grid grid-cols-[1.35fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.66rem]! [&_pre]:leading-[1.45]!">

<div class="flex items-center gap-2 mb-2 text-sm whitespace-nowrap">
<span class="muted">三個訊號有一個就自動產</span>
<span class="tag">types</span><span class="tag">exports.types</span><span class="tag">declaration</span>
</div>

```ts {all|3-4|5-7}
// src/config/options.ts · 設定裡沒寫 dts 的時候
if (dts == null) {
  if (pkg?.types || pkg?.typings || hasExportsTypes(pkg?.exports)) {
    dts = true
  } else if (tsconfig) {
    const { config } = readTsconfig(tsconfig)
    dts = !!config.compilerOptions?.declaration
  }
}
```

<div v-click="3" class="card card-accent py-2! mt-2">
<div class="flex items-center gap-3 mb-1"><carbon-logo-vue class="text-xl accent" /><div class="eyebrow normal-case">Vue 元件庫多一行</div></div>
<div class="text-sm muted leading-relaxed"><span class="font-mono">dts: { vue: true }</span>，型別交給 vue-tsc，SFC 的 props 才推得出來；ESM 配 <span class="font-mono">.d.ts</span>、CJS 配 <span class="font-mono">.d.cts</span></div>
</div>

</div>

<SourceTree scene="dts" :clicks="$clicks" />

</div>

<!--
第二步，型別。要不要產型別，它看你的 package.json。VFM 的設定裡沒寫要產型別，dist 裡卻有 index.d.ts 跟 index.d.cts，因為 tsdown 讀 package.json 替你決定。

[click] 原始碼就這幾行：設定裡沒寫 dts，先看 package.json 有沒有 types，或 exports 裡有沒有 types 條件，有就開。

[click] 都沒有，再讀 tsconfig 的 declaration。你本來就會替 TypeScript 專案設這些，不用再講一次。

[click] Vue 元件庫要多一行：dts 的 vue 設成 true。因為預設的 tsc 跟 Oxc 都看不懂 .vue 檔，開了 vue 才會接上 Vue 的語言支援，等於 vue-tsc 那一套，SFC 的 props 跟 emits 才推得出來。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="3" /></div>

<div class="grid grid-cols-[1.35fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.66rem]! [&_pre]:leading-[1.45]!">

<div class="flex items-center gap-2 mb-2 text-sm whitespace-nowrap">
<span class="muted">VFM 的依賴</span>
<span class="tag tag-neutral">vue</span><span class="tag tag-neutral">focus-trap</span><span class="tag tag-neutral">vue-use-template</span>
<carbon-arrow-right class="faint" />
<span class="muted">只剩 import</span>
</div>

```ts {all|2-3|5-8}
// src/features/deps.ts · 這個 import 要不要外部化
if (deps.includes(id) || deps.some(dep => id.startsWith(`${dep}/`)))
  return true // dependencies、peerDependencies，連子路徑都算
if (importer && RE_DTS.test(importer) && !id.startsWith('@types/')) {
  const typesName = getTypesPackageName(id)
  if (typesName && deps.includes(typesName)) return true
} // d.ts 裡 import 的套件，有對應的 @types 也外部化
```

<div v-click="3" class="card card-accent py-2! mt-2">
<div class="flex items-center gap-3 mb-1"><carbon-package class="text-xl accent" /><div class="eyebrow">VFM 的 UMD 是例外</div></div>
<div class="text-sm muted leading-relaxed"><span class="font-mono">deps.alwaysBundle</span> 把 vue-use-template 與 scroll-lock 打進 UMD，CDN 使用者沒有 build step；有開 <span class="font-mono">exports</span> 的套件，打進去的套件與版本會寫進 <span class="font-mono">inlinedDependencies</span></div>
</div>

</div>

<SourceTree scene="deps" :clicks="$clicks" />

</div>

<!--
第三步，依賴。依賴自動外部化，打進去的會寫給你看。VFM 的 package.json 裡，vue、focus-trap、@vueuse/core 是 peerDependencies，vue-use-template 跟 scroll-lock 是 dependencies。設定檔一個字都沒提它們，產物裡卻全部變成 import。這是 sxzz 去年講過的自動外部化，今天看它怎麼判斷。

[click] deps.ts 拿每一個 import 去對 package.json：在 dependencies 或 peerDependencies 裡的就外部化，連 vue/server-renderer 這種子路徑都算。

[click] 他沒講的是這段：型別宣告也懂 @types。d.ts 裡 import 的套件，只要對應的 @types 在你的依賴裡，一樣外部化。

[click] VFM 有一個例外：UMD。CDN 的使用者沒有 build step，所以用 alwaysBundle 把 vue-use-template 跟 scroll-lock 打進去。反過來，node_modules 的東西意外被打進去，它會在 build 時列出來提醒你。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="4" /></div>

<div class="grid grid-cols-[1.35fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.7rem]!">

<div class="card py-3! mb-3">
<div class="flex items-center gap-3 mb-1"><carbon-paint-brush class="text-xl accent" /><div class="eyebrow normal-case">Vue 一個 plugin，CSS 一行都不用寫</div></div>
<div class="text-sm muted leading-relaxed">SFC 交給 <span class="font-mono">unplugin-vue/rolldown</span>；偵測到 <span class="font-mono">@tsdown/css</span> 就掛上，SFC 的 style 抽成 <span class="font-mono">style.css</span>，有開 <span class="font-mono">exports</span> 還會補一條 <span class="font-mono">./style.css</span></div>
</div>

```ts {all|2-4|6|7}
// src/features/rolldown.ts · plugin 順序
plugins.push(DepsPlugin(config, bundle)) // external
if (dts) plugins.push(dtsPlugin(options)) // 型別
if (hasCss) plugins.push(...cssPlugins.pre) // @tsdown/css
plugins.push(ReportPlugin(config))
plugins.push(userPlugins) // 你的 unplugin-vue
plugins.push(...cssPostPlugins) // 收 CSS，排最後
```

</div>

<SourceTree scene="css" :clicks="$clicks" />

</div>

<!--
第四步，CSS 跟 Vue。CSS 零設定，而且排在你的 plugin 之後。Vue 元件庫只要一個 plugin：unplugin-vue。CSS 一行都不用寫，裝了 @tsdown/css 它就自動掛上，SFC 的 style 抽成 dist/style.css。問題是 scoped style 要先經過 Vue plugin 轉換，它怎麼知道要等？

[click] 答案在 rolldown.ts 組 plugin 的順序，而且是固定的：先掛處理依賴的 DepsPlugin，再掛產型別的 dts，然後是 @tsdown/css 的前置 plugin，這些都是內建的。

[click] 內建的掛完，才掛你自己的 plugins，unplugin-vue 排在這裡。

[click] 最後是 CSS 的後處理，特地放在使用者 plugin 之後，因為要等 Vue 的 scoped CSS 轉換完才能收集。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="5" /></div>

<div class="grid grid-cols-[0.85fr_1.5fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.7rem]!">

````md magic-move {at: 1}
```ts
// tsdown.config.ts
export default defineConfig({
  exports: true,
  format: ['cjs', 'esm'],
})
```

```ts
// tsdown.config.ts · 多一個入口
export default defineConfig({
  exports: true,
  format: ['cjs', 'esm'],
  entry: ['src/index.ts',
    'src/foo.ts'],
})
```

```ts
// tsdown.config.ts · 開發時指向原始碼
export default defineConfig({
  exports: { devExports: true },
  format: ['cjs', 'esm'],
  entry: ['src/index.ts',
    'src/foo.ts'],
})
```
````

<div v-click="3" class="card card-accent mt-3 py-3!">
<div class="eyebrow mb-1">一個坑</div>
<div class="text-sm muted">純 ESM 時 <span class="font-mono">main</span>、<span class="font-mono">module</span> 會拿掉，舊的 <span class="font-mono">types</span> 卻留著指向不存在的 <span class="font-mono">.d.cts</span>；開 <span class="font-mono">legacy: true</span> 或自己刪</div>
</div>

</div>

<div class="min-w-0 [&_pre]:text-[0.6rem]! [&_pre]:leading-[1.35]!">

````md magic-move {at: 1}
```jsonc
// package.json · 這些欄位由 tsdown 寫回
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
    "./package.json": "./package.json"
  }
}
```

```jsonc
// package.json · 自動多一個子路徑
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
    "./foo": { "import": "./dist/foo.mjs", "require": "./dist/foo.cjs" },
    "./package.json": "./package.json"
  }
}
```

```jsonc
// package.json · 開發指 src，發布時由 publishConfig 換回 dist
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    ".": "./src/index.ts",
    "./foo": "./src/foo.ts",
    "./package.json": "./package.json"
  },
  "publishConfig": {
    "exports": {
      ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
      "./foo": { "import": "./dist/foo.mjs", "require": "./dist/foo.cjs" },
      "./package.json": "./package.json"
    }
  }
}
```
````

</div>

</div>

<!--
第五步，exports。一行 exports，package.json 它來寫。這一步我自己最有感：scroll-lock 的設定檔只有兩行，exports 設成 true，格式 CJS 跟 ESM。右邊 package.json 的 main、module、types、exports，全部是 tsdown 每次 build 寫回去的，這是我 10 月 11 號用 v0.22.5 實際跑出來的。

[click] 多加一個入口 foo，什麼都不用改，exports 自動多一個 ./foo。

[click] 再開 devExports：開發時 exports 直接指向 src，monorepo 裡其他套件 import 你不用先 build；dist 的版本搬到 publishConfig，publish 時自動換回去。設定檔是唯一的真相，package.json 變成產物。

[click] 一個坑：改成純 ESM 時 main 跟 module 會被拿掉，但舊的 types 會留著，指到已經不存在的 .d.cts。它替你寫，你還是要看一眼。這個坑下一步的檢查會抓到。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="6" /></div>

<div class="grid grid-cols-[1fr_1.1fr] gap-5 items-start">

<div class="min-w-0 [&_pre]:text-[0.72rem]! [&_pre]:leading-[1.5]!">

<div v-click="1" class="card py-3! mb-3">
<div class="eyebrow normal-case mb-1">publint <span class="muted tracking-normal">· publint.dev</span></div>
<div class="text-sm muted leading-relaxed">對 <span class="font-mono">npm pack</span> 出來的那一包檢查 package.json：<span class="font-mono">main</span>、<span class="font-mono">types</span>、<span class="font-mono">exports</span> 指到的檔案在不在、格式有沒有擺錯</div>
</div>

<div v-click="2" class="card py-3! mb-3">
<div class="eyebrow normal-case mb-1">attw <span class="muted tracking-normal">· Are the types wrong?</span></div>
<div class="text-sm muted leading-relaxed">模擬 node10、node16 的 import 與 require、bundler 四種解析去找型別，抓使用者裝了才會炸的錯</div>
</div>

<div v-click="5" class="text-sm muted leading-relaxed"><span class="accent font-semibold">什麼時候跑：</span>所有 format 到齊 → 寫 <span class="font-mono">exports</span> → <span class="font-mono">npm pack</span> → 兩個檢查平行跑同一包；檢查的是真正會上傳的內容，不是 dist</div>

</div>

<div v-click="3" class="min-w-0 [&_pre]:text-[0.72rem]! [&_pre]:leading-[1.45]!">

<div class="eyebrow normal-case mb-2">scroll-lock 實跑：純 ESM，舊的 types 沒刪</div>

````md magic-move {at: 4}
```text
$ publint
Errors:
1. pkg.types is ./dist/index.d.cts
   but the file does not exist.

$ attw --pack
⚠️ A require call resolved to
   an ESM JavaScript file
node16 (from CJS)  ⚠️ ESM (dynamic import only)
```

```text
$ publint
Linting...（沒有 Errors）

$ attw --pack
No problems found 🌟
node16 (from CJS)  🟢 (CJS)
```
````

<div class="text-sm muted mt-3">設 <span class="font-mono">publint: 'ci-only'</span>、<span class="font-mono">attw: 'ci-only'</span>，只在 <span class="font-mono">CI=true</span> 時跑，本機 build 不會被拖慢</div>

</div>

</div>

<!--
第六步，發布前檢查。兩個檢查，對著真正的 tarball 跑。這兩個工具是什麼，我做 v5 之前根本不知道，我猜大部分的人也沒聽過。兩個都是獨立的套件，設定裡開起來，tsdown 會在對的時間點替你跑。

[click] publint 是 Vite 團隊的 bluwy 寫的。它拿 npm pack 出來的那一包去對 package.json：main、types、exports 指到的檔案在不在、格式有沒有擺錯。

[click] attw 是 Are the types wrong 的縮寫，TypeScript 團隊的 Andrew Branch 做的。它模擬四種模組解析模式去找你的型別，抓的是只有使用者裝了才會炸的錯。

[click] 實際的例子就是上一步那個坑。scroll-lock 改成純 ESM，舊的 types 還指著 .d.cts。publint 一行就抓到：types 指到的檔案不存在；attw 則說 require 會解析到 ESM 檔。

[click] 改回 CJS 加 ESM 之後，publint 沒有錯誤，attw 四種模式全綠。設成 ci-only 的話只在 CI 跑，本機 build 不會被拖慢。

[click] 它在哪個時間點跑？所有 format 都 build 完，先寫 exports 回 package.json，再把套件 pack 成 tarball，publint 跟 attw 檢查同一包。檢查的是 npm publish 真正會上傳的內容，不是 dist 資料夾。
-->
