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
講到這裡，v5 的東西都看完了，剩下一件事：把它發出去。(pause) 就是現在。切到 npmjs.com，按下 Approve。(pause) 一兩分鐘後 registry 更新，pnpm add vue-final-modal@5 裝到的就是正式版。如果你是 v4 的使用者，接下來講怎麼升級。
-->

---

<div class="kicker">結語</div>

# 從 v4 遷移

<div class="mt-10 flex flex-col items-center gap-2 font-mono">
<AudienceLink href="https://v5.vue-final-modal.org/get-started/guide/migration-guide" class="no-underline border-none! flex items-center gap-2 text-xl text-[var(--fg)] opacity-85 hover:opacity-100"><carbon-book class="opacity-60" />Migration Guide</AudienceLink>
<span class="flex items-center gap-2 text-lg text-[var(--fg-3)]"><span class="vfm-logo"></span>v5.vue-final-modal.org</span>
</div>

<div v-click="1" class="mt-8 max-w-3xl mx-auto">

<div class="card py-5! px-6! font-mono text-xl">
<div class="flex items-center gap-3"><span class="accent">❯</span><span>claude</span></div>
<div v-click="2" class="mt-4 text-[var(--fg)]"><span class="faint mr-2">&gt;</span>幫我把 vue-final-modal 升級到 v5</div>
<div v-click="2" class="mt-4 muted flex items-center gap-3"><span class="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>正在讀 vue-final-modal.org 的遷移指南……</div>
</div>

</div>

<!--
如何遷移到新版？

其實核心的 API，例如：useModal、VueFinalModal 元件本身基本上全部向下相容。細節的部分可以參考 v5 新的遷移文件

另一個更符合現在 AI 時代的做法是：

[click] 打開終端機，叫 Claude Code 或 Codex 出來，

[click] 跟它說：幫我把 vue-final-modal 升級到 v5。
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
