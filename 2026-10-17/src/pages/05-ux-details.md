<div class="kicker">05 · 使用者體驗的細節</div>

# 一行設定，package.json 它來寫

<div class="grid grid-cols-[0.85fr_1.5fr] gap-6 mt-3 items-start">

<div class="min-w-0 [&_pre]:text-[0.74rem]!">

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

<div v-click="3" class="card card-accent mt-4 py-3!">
<div class="eyebrow mb-1">一個坑</div>
<div class="text-sm muted">純 ESM 時 <code>main</code>、<code>module</code> 會拿掉，舊的 <code>types</code> 卻留著指向不存在的 <code>.d.cts</code>；開 <code>legacy: true</code> 或自己刪</div>
</div>

</div>

<div class="min-w-0 [&_pre]:text-[0.68rem]! [&_pre]:leading-[1.45]!">

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
原始碼走完，看它在使用者這一端的貼心。我自己最有感的是這個：scroll-lock 的設定檔只有兩行，exports 設成 true，格式 CJS 跟 ESM。右邊 package.json 的 main、module、types、exports 四個欄位，全部是 tsdown 每次 build 寫回去的：main 指 CJS、module 指 ESM、exports 的點拆成 import 跟 require，還順手補一條 package.json 的子路徑。這是我 10 月 11 號用 v0.22.5 實際跑出來的結果，不是文件上的示意。

[click] 多加一個入口 foo，什麼都不用改，exports 自動多一個 ./foo 子路徑，import 跟 require 兩個條件都有。

[click] 再開 devExports：開發的時候 exports 直接指向 src 底下的原始碼，monorepo 裡其他套件 import 你，不用先 build；dist 的版本搬到 publishConfig，pnpm 跟 yarn 在 publish 的時候自動換回去。設定檔是唯一的真相，package.json 變成產物。

[click] 一個要先講的坑：純 ESM 的時候 main 跟 module 會被拿掉，但舊的 types 會留著，指到一個已經不存在的 .d.cts。要嘛開 legacy，要嘛自己把舊欄位刪掉。它替你寫，你還是要看一眼。那這幾個欄位是怎麼算出來的？下一頁回到原始碼看一眼。
-->

---

<div class="kicker">05 · 使用者體驗的細節</div>

# exports.ts：package.json 由它寫

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.74rem]!">

```ts {all|2-7|9-11|12|13}
// src/features/pkg/exports.ts · generateExports
for (const chunk of entryChunks) {
  if (isIndex && format === 'cjs')
    isDts ? (cjsTypes = file) : (main = file)
  if (isIndex && format === 'es')
    isDts ? (esmTypes = file) : (module = file)
  subExport[format] = file // 其他入口變 "./<name>"
}
exports['.'] = dualFormat
  ? { import: es, require: cjs }
  : es ?? cjs // 單一格式直接給路徑
exports['./package.json'] = './package.json'
pkg.publishConfig.exports = publishExports // devExports
```

<div v-click="4" class="text-base mt-3 whitespace-nowrap">開發時 <code>exports</code> 指向 <code>src/</code>，<code>npm publish</code> 時才換成 <code>dist/</code></div>

</div>

<SourceTree scene="exports" :clicks="$clicks" />

</div>

<!--
剛才那四個欄位是怎麼算出來的？回到原始碼看一眼，在 exports.ts 的 generateExports。

[click] 先掃每一個入口的產物：是 index 的話，CJS 的檔案填進 main、ESM 的填進 module，對應的 d.ts 跟 d.cts 填進 types；不是 index 的入口就變成 ./name 這種子路徑，剛才的 ./foo 就是這樣來的。

[click] 接著組 exports 欄位。同時有 ESM 跟 CJS 的時候，"." 會拆成 import 跟 require 兩個條件；只有一種格式就直接給路徑，不會多包一層。

[click] 它還會順手補一條 ./package.json 的 export，讓工具可以讀你的 package.json。

[click] 最後是 devExports：開發時 exports 指向 src，publishConfig 裡放的才是 dist 的版本，publish 時自動換上去。你改的只有設定檔，package.json 這幾個欄位都是它維護的。除了 exports，它還讀你的 package.json 替你做幾個決定。
-->

---

<div class="kicker">05 · 使用者體驗的細節</div>

# 它替你決定，也會提醒你

<div class="eyebrow mt-4 mb-3 normal-case">讀 package.json 與 tsconfig，替你決定</div>

<div class="grid grid-cols-3 gap-4">

<div class="card py-3!">
<div class="flex items-center gap-2 mb-2"><carbon-settings class="text-xl accent" /><div class="font-semibold">要不要產型別</div></div>
<div class="text-sm muted leading-relaxed">package.json 有 types、exports 有 types 條件，或 tsconfig 開了 declaration，就自動產</div>
</div>

<div class="card py-3!">
<div class="flex items-center gap-2 mb-2"><carbon-document class="text-xl accent" /><div class="font-semibold">型別也懂 @types/*</div></div>
<div class="text-sm muted leading-relaxed">d.ts 裡 import 的套件，對應的 @types 在依賴裡就自動外部化</div>
</div>

<div class="card py-3!">
<div class="flex items-center gap-2 mb-2"><carbon-task-complete class="text-xl accent" /><div class="font-semibold">打包了誰，寫給你看</div></div>
<div class="text-sm muted leading-relaxed">被打包進產物的套件與精確版本，寫進 package.json 的 inlinedDependencies</div>
</div>

</div>

<div v-click>

<div class="eyebrow mt-5 mb-3">build 的時候主動提醒</div>

<div class="grid grid-cols-3 gap-4">

<div class="card py-3!">
<div class="flex items-center gap-2 mb-2"><carbon-arrow-up class="text-xl accent" /><div class="font-semibold">該改 ESM 了</div></div>
<div class="text-sm muted leading-relaxed">engines.node 已經能 require ESM，你卻還輸出 CJS，它建議改用 ESM</div>
</div>

<div class="card py-3!">
<div class="flex items-center gap-2 mb-2"><carbon-warning-alt class="text-xl accent" /><div class="font-semibold">誰被打包進去了</div></div>
<div class="text-sm muted leading-relaxed">node_modules 的東西進了產物，列出套件名，建議加 deps.onlyBundle 白名單</div>
</div>

<div class="card py-3!">
<div class="flex items-center gap-2 mb-2"><carbon-renew class="text-xl accent" /><div class="font-semibold">舊選項改名了</div></div>
<div class="text-sm muted leading-relaxed">bundle、injectStyle、publicDir、outExtension 改名後仍照舊值套用，只印一行警告</div>
</div>

</div>

</div>

<!--
exports 之外，它還讀你的 package.json 跟 tsconfig，替你做三個決定。第一，要不要產型別宣告：package.json 有寫 types、exports 裡有 types 條件，或是 tsconfig 開了 declaration，它就自動開 dts，都沒有就不產。第二，外部化不只看 JavaScript：d.ts 裡 import 的套件，只要對應的 @types 在你的依賴裡，也自動外部化，型別宣告不會把別人的型別整包抄進來。第三，誠實：真的有東西從 node_modules 被打包進去，它把套件名跟精確版本寫進 inlinedDependencies，使用者看 package.json 就知道你的套件裡藏了誰。

[click] 另外三件是 build 的時候主動提醒你，都是它實際會印的訊息。engines.node 已經是 20.19 或 22.12 以上，require 可以直接載 ESM 了，你卻還在輸出 CommonJS，它會建議改用 ESM，不想看可以用 checks.legacyCjs 關掉。有 node_modules 裡的東西被打包進產物，它列出是哪些套件，建議你加 deps.onlyBundle 白名單，白名單開了之後名單外的會直接報錯，還告訴你是誰 import 的。最後是改名：bundle 改成 unbundle、injectStyle 改成 css.inject、publicDir 改成 copy、outExtension 改成 outExtensions，舊名字還是照套，只印一行警告叫你換，升版不會把你的設定弄壞。這就是前半段的 tsdown：設定幾行，後面的事它替你做，做了什麼它會告訴你。接下來進入後半段，看 VFM v5 本身。
-->
