---
class: cover
title: Vue Final Modal v5 發布
---

<div class="flex flex-col items-center justify-center text-center gap-5">

<span class="vfm-logo text-7xl opacity-90"></span>

<div class="font-mono text-7xl font-bold tracking-tight accent leading-none mt-2 drop-shadow-[0_0_28px_rgba(52,211,153,0.35)]">v5.0.0</div>

<div class="text-2xl text-[var(--fg-2)] mt-2">現在發布</div>

</div>

<!--
講到這裡，v5 的東西都看完了，剩下一件事：把它發出去。(pause) 就是現在。切到 npmjs.com，按下 Approve。(pause) 一兩分鐘後 registry 更新，pnpm add vue-final-modal@5 裝到的就是正式版。我先講遷移，謝幕前再回來刷新給大家看。如果你是 v4 的使用者，接下來講怎麼升級。
-->

---

<div class="kicker">結語</div>

# 從 v4 遷移

<div v-click="1" class="mt-12 max-w-3xl mx-auto">

<div class="card py-5! px-6! font-mono text-xl">
<div class="flex items-center gap-3"><span class="accent">❯</span><span>claude</span></div>
<div v-click="2" class="mt-4 text-[var(--fg)]"><span class="faint mr-2">&gt;</span>幫我把 vue-final-modal 升級到 v5</div>
<div v-click="3" class="mt-4 muted flex items-center gap-3"><span class="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>正在讀 vue-final-modal.org 的遷移指南……</div>
</div>

</div>

<!--
遷移怎麼做？2026 年了，先講最省力的做法。

[click] 打開終端機，叫 Claude Code 或 Codex 出來，

[click] 跟它說：幫我把 vue-final-modal 升級到 v5。

[click] 它會去讀遷移指南，然後把該改的改一改。(pause) 這不是玩笑，我自己測過，大多數專案真的這樣就過了。不過它讀的那份指南，重點就四個，你自己花一分鐘看完，才知道它改得對不對。
-->

---
class: cover
title: 從 v4 遷移
---

<div class="flex flex-col items-center justify-center gap-6 scale-150 origin-center">

<AudienceLink href="https://v5.vue-final-modal.org/get-started/guide/migration-guide" class="no-underline border-none! flex items-center gap-2 font-mono text-2xl text-[var(--fg)] opacity-85 hover:opacity-100 transition-opacity">
<carbon-book class="opacity-60" />
Migration Guide
</AudienceLink>

<div class="flex items-center gap-2 font-mono text-sm text-[var(--fg-3)]">
<span class="vfm-logo"></span>
v5.vue-final-modal.org
</div>

</div>

<!--
遷移的細節直接看文件。點進去 v5 文件站的遷移指南，照著頁面講四件事：

核心 API 向下相容：createVfm、ModalsContainer、useModal、useVfm 全部照舊，大多數專案不用改程式碼，清掉的只有幾個原本就該算私有的東西。

要留意：Vue 要 3.3 以上；@vueuse、focus-trap 跟新的 vue-use-template 變成 peer dependencies，Yarn 要自己裝；Nuxt module 併進主套件，modules 裡改成 vue-final-modal/nuxt。

patchOptions 退場：它會存在是因為以前的使用體驗不好，attrs 傳進 useModal 之後就定住了，想動態改 prop、attr 或事件只能靠 patchOptions 去補。v5 的 attrs 可以直接傳 ref 或 getter，modal 會跟著更新，patchOptions 就沒有存在的意義了。

剛才 Claude 讀的也是這一頁。講完回到投影片收尾。
-->

---

<div class="text-center">

# Contributors

<div class="mt-6"></div>

<ContributorCircles :contributors="[
  { login: 'Mini-ghost', contributions: 54 },
  { login: 'fatihsolhan', contributions: 10 },
  { login: 'mesqueeb', contributions: 7 },
  { login: 'danielroe', contributions: 2 },
  { login: 'FlorianWerndl', contributions: 2 },
  { login: 'negezor', contributions: 2 },
  { login: 'AdamMerrifield', contributions: 1 },
  { login: 'benrolfe', contributions: 1 },
  { login: 'Offlein', contributions: 1 },
  { login: 'guillaumebriday', contributions: 1 },
  { login: 'Roxas92', contributions: 1 },
  { login: 'Dschungelabenteuer', contributions: 1 },
  { login: 'netolicak', contributions: 1 },
  { login: 'ul8', contributions: 1 },
]" />

<div class="flex items-center justify-center gap-2 text-lg text-[var(--fg-2)] mt-6">💖<a href="https://github.com/vue-final/vue-final-modal/graphs/contributors" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-2)]">github.com/vue-final/vue-final-modal</a></div>

</div>

<!--
v5 不是我一個人做的。這 14 位是六年來在 vue-final-modal 留下 commit 的人，圓越大 commit 越多：Mini-ghost 54 個最多，fatihsolhan、mesqueeb 接著，Nuxt 核心的 danielroe 也在裡面。謝謝你們。
-->

---
class: cover
---

<div class="flex flex-col items-center text-center">

<h1 class="hero mb-4!">感謝</h1>

<div class="divider-accent mx-auto"></div>

<div class="text-2xl text-[var(--fg-2)] flex items-center gap-2">投影片稍後將在 <carbon-link class="text-xl" /><a href="https://talks.hunterliu.tw" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg)] font-medium">talks.hunterliu.tw</a> 開放</div>

<div class="text-base text-[var(--fg-3)] mt-8">💖 感謝 <a href="https://github.com/antfu" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-2)]">Anthony Fu</a>，投影片由 <img src="/slidev.svg" alt="Slidev" class="inline-block h-4 align-[-3px] mx-1" /><a href="https://sli.dev" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-2)]">Slidev</a> 強力驅動！</div>

<div class="text-base text-[var(--fg-3)] mt-2">💖 感謝 <a href="https://github.com/sxzz" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-2)]">sxzz</a>，tsdown 的介紹參考自 <carbon-logo-github class="inline-block align-[-2px] mx-1" /><a href="https://github.com/sxzz/talks" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-2)]">github.com/sxzz/talks</a></div>

</div>

<div class="absolute right-20 bottom-16 flex flex-col items-center gap-2">
  <div class="w-16 h-16 rounded-full grid place-items-center bg-[var(--bg-elevated)] border border-[var(--border)] shadow-lg">
    <img src="/vconf-favicon.png" alt="v-conf Taiwan" class="h-10 translate-y-[2px]" />
  </div>
  <div class="font-mono text-base font-semibold tracking-wider text-[var(--fg-2)]">2026-10-17</div>
</div>

<!--
以上就是我今天的分享，感謝大家。投影片稍後會放在 talks.hunterliu.tw。這份投影片是用 Anthony Fu 的 Slidev 做的，前半段 tsdown 的介紹順序參考 sxzz 在深圳 VueConf 的演講和簡報，也謝謝他們。接下來的時間開放提問。
-->
