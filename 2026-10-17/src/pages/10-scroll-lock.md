---
clicks: 6
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
第四項，滾動鎖跟焦點。滾動鎖：VFM 從 v0 到 v4 一直用 body-scroll-lock，它 2020 年 9 月之後沒有穩定版，repo 2023 年之後沒再動，每週卻還有 190 萬次下載，這是我 10 月 10 號查的。所以 v5 換成自己寫的 scroll-lock：沒有依賴，Nuxt 的 server 端也能跑，而且 modal 所在的捲動容器也一起鎖。焦點：原生 dialog 用 showModal 開，瀏覽器會把焦點關在裡面；VueFinalModal 不是原生元素，用 focus-trap 自己做。

兩件事單獨看都不難，難的是 modal 疊著開。盯著兩個地方：右上角 scroll lock 的計數，還有右邊 focus trap 的堆疊。

[click] 開 modal A。body 鎖住，計數 1；A 的 focus trap 啟動，焦點進到 A，Tab 繞不出去。

[click] 在 A 裡開 B。計數 2；A 的 trap 暫停，B 的 trap 接手，焦點進到 B。

[click] 再開 C，計數 3，A 跟 B 都暫停，只有 C 在管焦點。滾動鎖只有一把，但記著被鎖了三次。

[click] 倒過來關。C 關閉只釋放自己那一次，計數回到 2，B 不會突然能捲；B 的 trap 恢復，焦點回到剛剛開 C 的那顆按鈕。這些順序都在 Chrome 裡用 Cypress 實測過。

[click] B 關閉，計數 1，焦點回到 A 裡開 B 的那顆按鈕。鍵盤使用者從頭到尾都知道自己在哪。

[click] A 關閉，計數歸零，這時候才還原 body，捲軸回來，焦點回到最初那顆按鈕。滾動鎖是 reference counting，焦點是 trap stack，關一層退一層。
-->
