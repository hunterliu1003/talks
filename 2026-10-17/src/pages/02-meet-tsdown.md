<div class="kicker">02 · 第四次換的工具</div>

<div class="flex items-baseline gap-4 mb-2">
<img src="/tsdown.svg" alt="tsdown" class="h-12 self-center" />
<h1 class="mb-0!">認識 tsdown</h1>
</div>

<div class="grid grid-cols-3 gap-5 mt-4 [&_pre]:text-[0.8rem]! [&_pre]:py-2!">

<div>
<div class="eyebrow mb-2">建立新專案</div>

```bash
pnpm create tsdown@latest
```

</div>

<div>
<div class="eyebrow mb-2">裝進既有專案</div>

```bash
pnpm add -D tsdown
```

</div>

<div>
<div class="eyebrow mb-2">一行指令打包</div>

```bash
pnpm tsdown
```

</div>

</div>

<div class="mt-4 text-lg space-y-1.5">
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />極簡設定，開箱即用</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />型別宣告自動產生，依賴自動分析</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />多種格式，一套設定一致輸出</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" /><span>極致效能，底層是 Rust 寫的 <a href="https://rolldown.rs" target="_blank" rel="noopener">Rolldown</a></span></div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />npm、pnpm、Yarn、Bun 都支援</div>
<div v-click class="flex items-center gap-3"><carbon-checkmark-outline class="accent shrink-0" />Node.js 22.18+</div>
</div>

<!--
讓我們先認識 tsdown。

tsdown 是專為函式庫設計的打包工具。

[click] 設定非常簡單，開箱即用。

[click] 自動產生 TS 型別宣告，依賴也自動分析哪些要外部化。

[click] 多種格式一套設定一次輸出。

[click] 極致效能，底層是 Rust 寫的 Rolldown

[click] 支援 npm、pnpm、Yarn、Bun 

[click] Node 要 22.18 以上。
-->
