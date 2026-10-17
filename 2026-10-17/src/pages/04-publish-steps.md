<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="1" /></div>

<div class="grid grid-cols-[1.7fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.62rem]! [&_pre]:leading-[1.35]!">

<div class="flex items-center gap-2 mb-3 text-base whitespace-nowrap">
<span class="font-mono">format: ['esm', 'cjs']</span>
<carbon-arrow-right class="faint" />
<span class="tag">index.js</span><span class="tag">index.cjs</span><span class="tag tag-neutral">+ .d.ts</span>
</div>

<div>

```ts
// src/config/options.ts
async function resolveUserConfig(config) {
  const formats = resolveComma(toArray(format, 'esm'))
  return formats.map((fmt, idx) => ({
    ...config,
    format: normalizeFormat(fmt),
  }))
}
```

</div>

<div class="mt-2">

```ts
// src/build.ts
async function buildWithConfigs(configs) {
  const bundles = await Promise.all(
    configs.map(o => buildSingle(o, clean, done)),
  )
}
```

</div>


</div>

<SourceTree scene="format" :clicks="$clicks" />

</div>

<!--
接下來從設定檔到 npm publish 發生什麼事情，我簡單分成了六個步驟。搭配簡化過後的原始碼，一起看看 tsdown 替我們做掉了什麼。
第一步是格式的部分。設定檔只寫了一行 format，產物是四個檔：index.js、index.cjs，加上各自的型別。

左邊 options.ts 的 resolveUserConfig 把 format 轉成陣列，對每一個 format 各產生一份獨立的設定，所以 tsdown 裡其實是兩次獨立的 build。下面 build.ts 的 buildWithConfigs 把展開後的每一份設定丟給 buildSingle，用 Promise.all 平行跑。buildSingle 就是一次完整的 build：組好 Rolldown 的設定和 plugin，叫 Rolldown 打包，產物寫進 dist 資料夾。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="2" /></div>

<div class="grid grid-cols-[1.7fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.66rem]! [&_pre]:leading-[1.45]!">

<div class="flex items-center gap-2 mb-2 text-sm whitespace-nowrap">
<span class="muted">三個訊號有一個就自動產</span>
<span class="tag">types</span><span class="tag">exports.types</span><span class="tag">declaration</span>
</div>

```ts
// src/config/options.ts
async function resolveUserConfig(config) {
  if (dts == null) {
    if (pkg?.types || pkg?.typings || hasExportsTypes(pkg?.exports)) {
      dts = true
    } else if (tsconfig) {
      const { config } = readTsconfig(tsconfig)
      dts = !!config.compilerOptions?.declaration
    }
  }
}
```

<div v-click class="card card-accent py-2! mt-2">
<div class="flex items-center gap-3 mb-1"><carbon-logo-vue class="text-xl accent" /><div class="eyebrow normal-case">Vue 元件庫多一行</div></div>
<div class="text-sm muted leading-relaxed"><span class="font-mono">dts: { vue: true }</span>，型別交給 vue-tsc，SFC 的 props 才推得出來；ESM 配 <span class="font-mono">.d.ts</span>、CJS 配 <span class="font-mono">.d.cts</span></div>
</div>

</div>

<SourceTree scene="dts" :clicks="$clicks" />

</div>

<!--
第二步是型別的部分。
tsdown 主要會根據三個訊號來判斷是否要自動產出型別。
原始碼一樣在 resolveUserConfig：設定裡沒寫 dts，就看 package.json 有沒有 types，或 exports 裡有沒有 types 條件，有就開。

都沒有，再看 tsconfig 的 declaration。這些本來就是 TypeScript 專案會設的東西，不用再寫一次。

[click] 補充一下 Vue 元件庫要多一行設定，dts 的 vue 設成 true。因為 tsc 看不懂 .vue 檔，開了之後才會改走 vue-tsc 去處理 SFC 的型別。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="3" /></div>

<div class="grid grid-cols-[1.7fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.66rem]! [&_pre]:leading-[1.45]!">

<div class="mb-2 text-sm space-y-1.5">
<div class="muted">VFM 的依賴</div>
<div class="flex flex-wrap gap-2"><span class="tag tag-neutral">vue</span><span class="tag tag-neutral">@vueuse/core</span><span class="tag tag-neutral">focus-trap</span><span class="tag tag-neutral">vue-use-template</span><span class="tag tag-neutral">scroll-lock</span></div>
<div class="flex items-center gap-2"><carbon-arrow-right class="faint" /><span class="muted">不打包進 dist，留成 import</span></div>
</div>

```ts
// src/features/deps.ts
async function externalStrategy(id, importer) {
  if (deps.includes(id) || deps.some(dep => id.startsWith(`${dep}/`)))
    return true // dependencies、peerDependencies
  if (importer && RE_DTS.test(importer) && !id.startsWith('@types/')) {
    const typesName = getTypesPackageName(id)
    if (typesName && deps.includes(typesName)) return true
  } // d.ts 裡 import 的套件，有對應的 @types 也外部化
}
```


</div>

<SourceTree scene="deps" :clicks="$clicks" />

</div>

<!--
第三步，依賴。打包的時候，原本要手動設定外部化的地方，tsdown 都幫我們做好了，
這個部分是為了確保我們不會將不該打包的依賴包進最終的資料夾裡。拿 VFM 舉例：vue、@vueuse/core、focus-trap 是 peerDependencies，vue-use-template 跟 scroll-lock 是 dependencies。設定檔不用寫 external 就能自動將這些依賴外部化，tsdown 是怎麼做到的？

我們可以看到 deps.ts 中的 externalStrategy 這個函式，會拿每一個 import 去對應 package.json：在 dependencies 或 peerDependencies 裡的就自動外部化。

型別檔也是一樣：d.ts 裡 import 的套件照同一套規則外部化，不會把別人的型別不小心打包進來。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="4" /></div>

<div class="grid grid-cols-[1.7fr_1fr] gap-6 items-start">

<div class="min-w-0 [&_pre]:text-[0.7rem]!">

<div class="card py-3! mb-3">
<div class="flex items-center gap-3 mb-1"><carbon-paint-brush class="text-xl accent" /><div class="eyebrow normal-case">Vue 一個 plugin，CSS 一行都不用寫</div></div>
<div class="text-sm muted leading-relaxed">SFC 交給 <span class="font-mono">unplugin-vue/rolldown</span>；偵測到 <span class="font-mono">@tsdown/css</span> 就掛上，SFC 的 style 抽成 <span class="font-mono">style.css</span></div>
</div>

```ts
// src/features/rolldown.ts
async function resolveInputOptions(config) {
  plugins.push(DepsPlugin(config, bundle)) // external
  if (dts) plugins.push(dtsPlugin(options)) // 型別
  if (hasCss) plugins.push(...cssPlugins.pre) // @tsdown/css
  plugins.push(ReportPlugin(config))
  plugins.push(userPlugins) // 你的 unplugin-vue
  plugins.push(...cssPostPlugins) // 收 CSS，排最後
}
```

</div>

<SourceTree scene="css" :clicks="$clicks" />

</div>

<!--
第四步，CSS 跟 Vue。

Vue 元件庫只需要 unplugin-vue/rolldown 一個 plugin

CSS 的部分，tsdown 則是會自動判斷你是否已經裝了 @tsdown/css

SFC 的 style 會抽成 dist/style.css。

這些設定都寫在 rolldown.ts 的 resolveInputOptions 中，plugin 的順序是固定的：先加上處理依賴的 DepsPlugin，再加上產生型別的 dts，然後是 @tsdown/css 的前置 plugin，這些都是內建的。

內建的加完之後，才掛我們自己的 plugins，unplugin-vue 的部分就在這邊。

最後 cssPostPlugins 被擺在 vue plugin 之後的原因是因為要確保 Vue 的 scoped CSS 先轉換完成。
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
第五步，exports。這一步我自己最有感。以前 package.json 的 main、module、types、exports 這幾個欄位都要自己手寫，很容易寫錯或是有遺漏的部分。現在 tsdown 會自動去更新 package.json 真的非常方便。

[click] 你如果多加一個入口 foo.ts，package.json 不用動，exports 會由 tsdown 自動設定完成。

[click] 再設定 devExports: true 的話，開發的時候 exports 會指向 src 資料夾，monorepo 裡其他套件要用它不用先打包；要發布的時候 tsdown 再換回 dist 的路徑。所以 package.json 變成 build 的產物，我們只要顧好 tsdown 的設定檔，就會自動產出 exports 的部分。
-->

---

<div class="kicker normal-case">04 · 從設定檔到 npm publish 發生什麼事</div>

<div class="-mt-1 mb-5"><PublishSteps :current="6" /></div>

<div class="grid grid-cols-2 gap-5 items-stretch mt-2">

<div class="card py-5! px-6!">
<div class="text-2xl font-semibold mb-1">publint</div>
<div class="muted text-sm mb-4"><a href="https://publint.dev" target="_blank" rel="noopener">publint.dev</a></div>
<div class="text-lg leading-relaxed">檢查 <span class="font-mono">main</span>、<span class="font-mono">types</span>、<span class="font-mono">exports</span> 指到的檔案在不在，格式有沒有擺錯</div>
</div>

<div class="card py-5! px-6!">
<div class="text-2xl font-semibold mb-1">attw</div>
<div class="muted text-sm mb-4"><a href="https://arethetypeswrong.github.io" target="_blank" rel="noopener">Are the types wrong?</a></div>
<div class="text-lg leading-relaxed">假裝成四種不同設定的使用者專案來找型別，抓裝了才會炸的錯</div>
</div>

</div>

<!--
第六步是 tsdown 在函式庫發布之前會替我們做的檢查。tsdown 整合了兩個工具，分別是 publint 和 attw。在我認真研究 tsdown 之前我根本沒聽過這兩個工具。那這兩個工具做了什麼檢查呢？

publint 檢查的是 package.json：main、types、exports 這些欄位寫的路徑是否正確，檔案是不是真的在那裡，還有其他 package.json 的欄位檢查。

attw 是 Are the types wrong 的縮寫，它模擬了四種不同設定的使用者專案來 import 你的函式庫，看型別找不找得到，抓的是使用者裝了才會發現的錯誤。

而這兩個工具都只要簡單的一行設定即可，tsdown 會幫我們自動的執行。
-->
