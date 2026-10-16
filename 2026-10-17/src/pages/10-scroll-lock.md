---
clicks: 4
---

<div class="kicker normal-case">08 · 對齊原生 dialog 行為</div>

# Scroll Lock 與 Focus Trap

<div class="grid grid-cols-2 gap-3 mt-3">
<div class="card py-2! px-4!"><div class="eyebrow mb-0.5">滾動鎖</div><div class="text-sm muted">原生 dialog 不鎖滾動，背景照樣能捲；VFM 用重寫的 <span class="whitespace-nowrap">scroll-lock</span> 鎖住，Nuxt 環境也安全</div></div>
<div class="card py-2! px-4!"><div class="eyebrow mb-0.5">焦點</div><div class="text-sm muted">原生 dialog 會把焦點關在裡面；VueFinalModal 用 <span class="whitespace-nowrap">focus-trap</span> 做到一樣的事</div></div>
</div>

<div class="mt-3">

<ModalStackDemo :clicks="$clicks" />

</div>

<!--
第四項，滾動鎖跟焦點。

滾動鎖：VFM 從 v0 到 v4 一直用 body-scroll-lock，它已經很久沒維護了而且不支援 TypeScript。所以 v5 重新寫了 scroll-lock：沒有任何依賴，Nuxt 的 server 端也能跑。

焦點：原生 dialog 瀏覽器會自動處理好焦點的問題；VueFinalModal 必須用 focus-trap 自己做。

兩件事單獨看都不難，比較麻煩的是巢狀的 modal。

[click] 開 Modal A，鎖住滾動，焦點進到 Modal A。

[click] 在 Modal A 裡開 Modal B，Modal A 的 trap 暫停，Modal B 接手。滾動鎖只有一把，但記著被鎖了兩次。

[click] 倒過來關。關 Modal B，Modal A 的 trap 恢復，焦點回到開 Modal B 的那顆按鈕。

[click] 關 Modal A，這時候才解開滾動，焦點回到最初那顆按鈕。關一層退一層。
-->
