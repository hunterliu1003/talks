<div class="kicker">04 · 原始碼導讀</div>

# tsdown 的 `src/` 長這樣

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-4 items-start">

<div class="flex flex-col gap-4 mt-1">

<div v-click class="grid grid-cols-[2rem_1fr] gap-3 items-start">
<carbon-terminal class="text-2xl accent mt-1" />
<div><div class="font-semibold text-lg">入口</div><div class="text-base muted"><code>run.ts</code> 是 bin，<code>cli.ts</code> 解析參數，交給 <code>build.ts</code></div></div>
</div>

<div v-click class="grid grid-cols-[2rem_1fr] gap-3 items-start">
<carbon-settings class="text-2xl accent mt-1" />
<div><div class="font-semibold text-lg"><code>config/</code></div><div class="text-base muted">找設定檔、每個 package 各載一次、補預設值、依 format 展開</div></div>
</div>

<div v-click class="grid grid-cols-[2rem_1fr] gap-3 items-start">
<carbon-cube class="text-2xl accent mt-1" />
<div><div class="font-semibold text-lg"><code>features/</code></div><div class="text-base muted">一個功能一支檔案：組 Rolldown 選項與 plugin、依賴外部化、副檔名</div></div>
</div>

<div v-click class="grid grid-cols-[2rem_1fr] gap-3 items-start">
<carbon-package class="text-2xl accent mt-1" />
<div><div class="font-semibold text-lg"><code>features/pkg/</code></div><div class="text-base muted">發布前：等所有 format 到齊，寫 exports、pack tarball 跑 publint 與 attw</div></div>
</div>

</div>

<SourceTree scene="overview" :clicks="$clicks" />

</div>

<!--
接下來打開 tsdown 的原始碼。先不看程式碼，先看目錄：右邊是 src 資料夾，排法跟你在 VS Code 看到的一樣，我只留這章會碰到的檔案，每個檔案旁邊一句它的工作。整個資料夾分成四塊。

[click] 第一塊是入口：run.ts 是 bin，你在終端機打 tsdown 跑的就是它；它交給 cli.ts 解析參數，再交給 build.ts，build 做的第一件事是呼叫 config 的 resolveConfig，把 CLI 的 flags、設定檔、workspace 合併成一個設定陣列。

[click] 第二塊 config，負責把你寫的設定變成可以 build 的設定：file.ts 找設定檔，workspace.ts 替 monorepo 的每個 package 各載一次，options.ts 補預設值、依 format 展開，index.ts 的 resolveConfig 把這三個串起來。

[click] 第三塊 features，一個功能一支檔案：rolldown.ts 組 Rolldown 的選項跟 plugin，deps.ts 決定依賴要不要外部化，output.ts 決定副檔名。

[click] 最後是 features 底下的 pkg，發布前的事：等所有 format 都 build 完，寫 exports 回 package.json，再 pack 出 tarball 跑 publint 跟 attw。接下來不照目錄走，改用幾個你會遇到的情境，每個情境先看它替你做了什麼，再看原始碼怎麼做到的。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 寫一次 `format`，產物兩份，副作用一次

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.74rem]!">

<div class="flex items-center gap-2 mb-3 text-base whitespace-nowrap">
<code>format: ['esm', 'cjs']</code>
<carbon-arrow-right class="faint" />
<span class="tag">index.js</span><span class="tag">index.cjs</span><span class="tag tag-neutral">+ .d.ts</span>
</div>

<div class="transition-opacity duration-300" :class="$clicks >= 3 ? 'opacity-40' : ''">

```ts {all|2-3|5-6}
// src/config/options.ts
const formats = resolveComma(toArray(format, 'esm'))
return formats.map((fmt, idx) => ({
  ...config,
  copy: idx === 0 ? config.copy : undefined,
  onSuccess: idx === 0 ? config.onSuccess : undefined,
  format: normalizeFormat(fmt),
}))
```

</div>

<div class="transition-opacity duration-300" :class="$clicks >= 1 && $clicks < 3 ? 'opacity-40' : ''">

```ts {all|2-4}
// src/build.ts
const bundles = await Promise.all(
  configs.map(o => buildSingle(o, clean, done)),
) // clean 只跑一次
```

</div>

</div>

<SourceTree scene="format" :clicks="$clicks" />

</div>

<!--
第一個情境：你想同時出 ESM 跟 CJS。設定只有一行 format，產物是四個檔：index.js、index.cjs，加上各自的型別。你可能沒注意的是：onSuccess、copy 這類副作用只跑一次，dist 也只清一次，不會第二份設定把第一份的產物刪掉。這是怎麼做到的？

[click] options.ts 把你寫的 format 轉成陣列，沒寫就預設 esm，然後對每一個 format 各產生一份獨立的設定。所以我們平常說的 dual format，在 tsdown 裡其實是兩次獨立的 build。

[click] 細節在這裡：copy 跟 onSuccess 只交給第一份，否則你的 onSuccess 會因為 ESM 跟 CJS 各跑一次。

[click] 展開後的這幾份設定，在 build.ts 用 Promise.all 平行跑，clean 用一個共用的 promise 包起來，所以 dist 只清一次。VFM 的設定檔寫了三組，第一組同時要 ESM 跟 CJS，展開之後就是四次 build 平行跑。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# CSS 零設定，而且排在你的 plugin 之後

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.74rem]!">

<div class="card py-3! mb-3">
<div class="flex items-center gap-3 mb-1"><carbon-paint-brush class="text-xl accent" /><div class="eyebrow">設定一行都不用寫</div></div>
<div class="text-sm muted">偵測到 <code>@tsdown/css</code> 就掛上；SFC 的 style 抽成 <code>style.css</code>，<code>exports</code> 自動多一條 <code>./style.css</code>，VFM 的 CSS 就是這樣對外的</div>
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
第二個情境：Vue 元件庫的 CSS。VFM 的設定檔裡 CSS 一行都沒寫。專案裝了 @tsdown/css，tsdown 偵測到就自動掛上，SFC 的 style 抽成 dist/style.css，exports 也自動多一條 ./style.css。問題是：SFC 的 scoped style 要先經過 Vue plugin 轉換，它怎麼知道要等？

[click] 答案在 rolldown.ts 組 plugin 的順序，而且順序是固定的：先掛處理依賴的 DepsPlugin，再掛 rolldown-plugin-dts 產型別，然後是 @tsdown/css 的前置 plugin，這些都是內建的。

[click] 內建的掛完，才掛你自己的 plugins，VFM 的 unplugin-vue 就排在這裡。

[click] 最後是 CSS 的後處理，特地放在使用者 plugin 之後，因為要等 Vue 的 scoped CSS 轉換完才能收集。你只做了「裝一個套件」，順序的事它替你排好了。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 發布前的兩個檢查：publint 與 attw

<div class="grid grid-cols-2 gap-5 mt-4">

<div v-click="1" class="card py-4!">
<div class="eyebrow mb-2">publint <span class="muted normal-case tracking-normal">· publint.dev</span></div>
<div class="text-base muted leading-relaxed">拿 <code>npm pack</code> 出來的那一包對 package.json：<code>main</code>、<code>types</code>、<code>exports</code> 指到的檔案在不在、ESM 與 CJS 有沒有擺錯格式</div>
</div>

<div v-click="2" class="card py-4!">
<div class="eyebrow mb-2">attw <span class="muted normal-case tracking-normal">· Are the types wrong?</span></div>
<div class="text-base muted leading-relaxed">模擬四種解析模式（node10、node16 的 import 與 require、bundler）去找你的型別，抓只有使用者裝了才會炸的錯</div>
</div>

</div>

<div v-click="3" class="grid grid-cols-[1fr_1.1fr] gap-5 mt-5 items-center [&_pre]:text-[0.74rem]! [&_pre]:leading-[1.5]!">
<div class="text-base muted leading-relaxed">tarball 就是 <code>npm pack</code> 產出的 .tgz，也就是 <code>npm publish</code> 會上傳的那一包；進包的檔案由 <code>files</code> 決定，<code>dist/</code> 裡有不代表使用者拿得到，所以兩個工具都對著這一包檢查</div>

```text
$ npm pack --dry-run
📦 @hunterliu/scroll-lock@0.0.9
1.1kB LICENSE          8.5kB README.md
9.5kB dist/index.cjs   2.0kB dist/index.d.cts
2.0kB dist/index.d.mts 9.2kB dist/index.mjs
1.8kB package.json     · total files: 7
```

</div>

<!--
發布前的檢查要先說兩個工具是什麼，大部分人沒聽過很正常，我也是做 v5 才認真用。兩個都是獨立的套件，tsdown 把它們接進來，套件要自己裝。

[click] publint 是 Vite 團隊的 bluwy 寫的。它拿 npm pack 出來的那一包去對 package.json：main、types、exports 指到的檔案在不在、ESM 跟 CJS 有沒有擺錯格式、副檔名對不對。

[click] attw 是 Are the types wrong 的縮寫，TypeScript 團隊的 Andrew Branch 做的。它模擬四種模組解析模式去找你的型別：舊的 node10、node16 分別從 import 跟 require 進來、還有 bundler，抓的是只有使用者裝了才會炸的錯。

[click] 兩個工具都對著 tarball 檢查，不是對 dist。tarball 就是 npm pack 出來的那個 .tgz，npm publish 上傳的就是它。右邊是 scroll-lock 跑 npm pack --dry-run 的清單，七個檔，哪些進包由 package.json 的 files 決定，dist 裡有不代表使用者拿得到。那它們實際抓得到什麼？下一頁。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 它們實際抓到什麼

<div class="grid grid-cols-2 gap-5 mt-4 [&_pre]:text-[0.8rem]! [&_pre]:leading-[1.5]!">

<div v-click="1" class="min-w-0">
<div class="eyebrow normal-case mb-2">純 ESM，舊的 <code>types</code> 沒刪</div>

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

</div>

<div v-click="2" class="min-w-0">
<div class="eyebrow normal-case mb-2">改回 <code>format: ["cjs", "esm"]</code></div>

```text
$ publint
Linting...（沒有 Errors）

$ attw --pack
No problems found 🌟
node16 (from CJS)  🟢 (CJS)
```

</div>

</div>

<!--
看實際的例子，就是等一下第 5 章會講到的坑。

[click] scroll-lock 改成純 ESM，舊的 types 還指著 .d.cts。publint 一行就抓到：types 指到的檔案不存在。attw 則說 require 會解析到 ESM 檔，CommonJS 的使用者只能用 dynamic import。這兩段都是我實際跑出來的。

[click] 改回 CJS 加 ESM 之後，publint 沒有錯誤，attw 四種模式全綠。裝好套件、設定裡開 publint 跟 attw，tsdown 就會在對的時間點替你跑，下一頁看它在哪個時間點。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 檢查的是真正的 tarball

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.74rem]!">

```ts {all|2-3|5|6-10}
// src/features/pkg/index.ts · 等所有 format 到齊
ctx.bundles.push(bundle)
if (ctx.bundles.length < ctx.count) return ctx.promise

await writeExports(exportsConfigs[0], chunks, inlinedDeps)
const tarball = await packTarball(pkg.packageJsonPath)
await Promise.all([
  ...publintConfigs.map(c => publint(c, tarball)),
  ...attwConfigs.map(c => attw(c, tarball)),
])
```

<div v-click="4" class="card py-3! mt-3">
<div class="text-base"><code>publint: 'ci-only'</code>、<code>attw: 'ci-only'</code></div>
<div class="text-sm muted mt-1">只看 <code>CI</code> 這個環境變數，不認平台：GitHub Actions 與 GitLab CI 都預設給 <code>CI=true</code>；本機想試就 <code>CI=true pnpm build</code></div>
</div>

</div>

<SourceTree scene="pkg" :clicks="$clicks" />

</div>

<!--
工具認識了，回到 tsdown，看它在哪個時間點跑。這段在 pkg 的 index.ts，重點是它要等所有 format 都 build 完。

[click] 每個 format build 完，會把結果放進同一個 package 的清單；如果還有 format 沒完成，就回傳一個 promise 等著。ESM 先完成的話，它會停在這裡等 CJS。

[click] 全部到齊才寫 exports 回 package.json，因為要看得到所有格式的產物，才知道 import 跟 require 各自指到哪個檔案。這就是下一章會看到的 exports。

[click] 接著把套件實際 pack 成 tarball，publint 跟 attw 平行檢查同一包。三個設計：exports 只寫一次、檢查的是真正會發布的內容、兩個檢查共用一包。

[click] 那怎麼開？裝了 publint 跟 @arethetypeswrong/core 之後，設定裡 publint 跟 attw 給 true 就會跑；給 ci-only，本機 build 就不會被拖慢。它怎麼知道你在 CI？它不認平台，不看 GitHub 還是 GitLab，只看 CI 這個環境變數有沒有被設成 true。這是業界慣例，GitHub Actions、GitLab CI、Vercel、Netlify 都會預設幫你設好；本機想試就在指令前面加 CI=true。會合講完。接下來三個你會用到的小功能，一樣先看功能，再看原始碼。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 一個選項，產物從一包變成一棵樹

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.78rem]!">

<div class="grid grid-cols-2 gap-3 mb-3">
<div class="card py-3!"><div class="eyebrow normal-case mb-1">預設：bundle</div><div class="font-mono text-sm">dist/index.js <span class="faint">7.54 kB</span></div></div>
<div class="card card-accent py-3!"><div class="eyebrow normal-case mb-1"><code>unbundle: true</code></div><div class="font-mono text-xs leading-snug break-all">dist/index.js<br>dist/createInstanceResolver.js<br>dist/createTemplateProvider.js<br>dist/utils.js <span class="faint">共 8.53 kB</span></div></div>
</div>

```ts {all|2-3}
// src/features/rolldown.ts · outputOptions
preserveModules: unbundle,
preserveModulesRoot: unbundle ? config.root : undefined,
```

<div v-click="1" class="text-sm muted mt-3">Node 函式庫、想讓使用者的 bundler 自己 tree-shake 時用；給瀏覽器的 UMD 還是一包</div>

</div>

<SourceTree scene="unbundle" :clicks="$clicks" />

</div>

<!--
第一個小功能：unbundle。預設 tsdown 把整個函式庫打成一個檔。這是 vue-use-template 的例子：bundle 是一個 index.js，7.5 KB；設定加一行 unbundle 設成 true，產物就變成跟 src 一比一的四個檔案。什麼時候要這樣？Node 的函式庫，或是你想讓使用者的 bundler 自己決定要 tree-shake 哪些檔案的時候；給瀏覽器用的 UMD 當然還是打成一包。

[click] 原始碼只有兩行：unbundle 其實就是 Rolldown 的 preserveModules，再把 preserveModulesRoot 指到專案根目錄，所以 dist 底下的結構才會跟 src 一樣。這是我在 vue-use-template 的副本實際跑出來的。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 每個 package 自己 build

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.74rem]!">

<div class="card py-3! mb-3">
<div class="font-mono text-base mb-1">workspace: true</div>
<div class="text-sm muted">每一個 package.json 就是一個 build 單位：各自讀自己的 tsdown.config、各自展開 format，一起平行跑</div>
</div>

```ts {all|2-5|6}
// src/config/workspace.ts · resolveWorkspace
packages = (await glob('**/package.json', {
  ignore: exclude, // node_modules、dist 這些
  cwd: rootCwd,
}))
  .filter(file => file !== 'package.json') // 根目錄自己不算
```

</div>

<SourceTree scene="workspace" :clicks="$clicks" />

</div>

<!--
第二個：monorepo。workspace 設成 true，tsdown 把每一個 package.json 當成一個 build 單位：各自讀自己的 tsdown.config，各自展開 format，最後跟前面一樣用 Promise.all 平行跑。VFM v5 的 repo 就是靠這個選項一次 build，第 7 章會看到實際的設定。

[click] 它怎麼找？resolveWorkspace 用 glob 找 **/package.json，ignore 掉 node_modules、dist 這些目錄。

[click] 然後把根目錄自己的 package.json 濾掉，剩下的每一個就是一個 package。找完之後每個 package 走的路，跟單一套件一模一樣。
-->

---

<div class="kicker">04 · 原始碼導讀</div>

# 改到設定檔，整個重來

<div class="grid grid-cols-[1.35fr_1fr] gap-6 mt-2 items-start">

<div class="min-w-0 [&_pre]:text-[0.68rem]!">

<div class="card py-3! mb-3">
<div class="text-sm muted"><code>--watch</code> 時，改到 <code>tsdown.config.*</code>、<code>package.json</code>、<code>tsconfig.json</code> 不是重 build，是整個 process 重啟；<code>watch: [extra/]</code> 可以再加要監看的路徑</div>
</div>

<div class="transition-opacity duration-300" :class="$clicks >= 2 ? 'opacity-40' : ''">

```ts {all|2-3}
// src/features/watch.ts
export const endsWithConfig =
  /[\\/](?:tsdown\.config.*|package\.json|tsconfig\.json)$/
```

</div>

<div class="transition-opacity duration-300" :class="$clicks === 1 ? 'opacity-40' : ''">

```ts {all|2-4}
// src/build.ts · restart
async function restart() {
  await Promise.all(disposeCbs.map(cb => cb()))
  clearRequireCache()
  _restart()
}
```

</div>

</div>

<SourceTree scene="watch" :clicks="$clicks" />

</div>

<!--
最後一個：watch。開 watch 之後，改原始碼是重 build，但改到設定檔、package.json 或 tsconfig，它做的不是重 build，是整個 process 重啟，因為這三種檔案會改變設定本身，舊的設定已經不能信了。想多監看別的路徑，watch 可以給陣列。

[click] 怎麼認出設定檔？watch.ts 裡一個正規表達式：路徑結尾是 tsdown.config 開頭、package.json 或 tsconfig.json。

[click] 重啟的流程在 build.ts：先把所有 dispose 回呼跑完，清掉 require 的快取，再呼叫上層的 restart 從頭來一次。原始碼走完了，下一章看它在使用者這一端替你多想了哪些細節。
-->
