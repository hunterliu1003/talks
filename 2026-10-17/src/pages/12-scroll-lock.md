---
clicks: 6
---

<div class="kicker normal-case">11 · 原生 dialog 行為比較</div>

# 捲動鎖與焦點

<div class="grid grid-cols-2 gap-3 mt-3">
<div class="card py-2! px-4!"><div class="eyebrow mb-0.5">捲動鎖</div><div class="text-sm muted">原生 dialog 不鎖捲動，背景照樣能捲；VFM 用重寫的 <span class="whitespace-nowrap">scroll-lock</span> 鎖住，Nuxt 環境也安全</div></div>
<div class="card py-2! px-4!"><div class="eyebrow mb-0.5">焦點</div><div class="text-sm muted">原生 dialog 會把焦點關在裡面；VueFinalModal 用 <span class="whitespace-nowrap">focus-trap</span> 做到一樣的事</div></div>
</div>

<div class="mt-3">

<ModalStackDemo :clicks="$clicks" />

</div>

<!--
第四項，也是行為層的最後一項：捲動鎖跟焦點。第一，捲動鎖。VFM 從 v0 到 v4 本質上一直用 body-scroll-lock，先是依賴、後來複製進 repo 改成 TypeScript；body-scroll-lock 2020 年 9 月之後就沒有穩定版，repo 2023 年之後沒再動，每週卻還有 190 萬次下載，這些數字是我 10 月 10 號查的。所以 v5 換成自己寫的 scroll-lock：沒有任何依賴，在 Nuxt 的 server 端也能安全執行，而且 modal 所在的捲動容器也一起鎖，不只鎖 body。第二，焦點。原生 dialog 用 showModal 開啟的時候，瀏覽器會把焦點關在 dialog 裡、Tab 繞不出去；VueFinalModal 不是原生元素，這件事用 focus-trap 自己做。

兩件事單獨看都不難，難的是 modal 疊著開的時候，表單裡再開確認框。畫面是一個可以捲動的頁面，焦點在「開啟 A」這顆按鈕上。右邊兩個數字要盯著：body 被鎖了幾次，還有 focus trap 的堆疊。

[click] 按下去，modal A 開了。scroll-lock 把 body 鎖住，計數 1，背後的頁面捲不動了。同時 A 的 focus trap 啟動，焦點被送進 A 的內容區，Tab 繞不出去。

[click] 在 A 裡面開 B。body 再鎖一次，計數 2。focus-trap 的 trap stack 把 A 的 trap 暫停，B 的 trap 變成 active，焦點進到 B 的內容區。

[click] 再開 C，計數 3，A 跟 B 都暫停，焦點在 C 的內容區，只有 C 在管焦點。三層都在，捲動鎖只有一把，但記著被鎖了三次。

[click] 現在倒過來關。C 關閉：它只釋放自己那一次，計數回到 2，背後還是鎖著的，B 不會突然能捲。C 的 trap 從堆疊拿掉，B 的 trap 恢復，而且焦點回到剛剛按下去開 C 的那顆按鈕，這是 returnFocusOnDeactivate 做的事，回到 trap 啟動前焦點所在的元素。這些數字跟順序都在 Chrome 裡用 Cypress 實測過。

[click] B 關閉，計數 1，A 的 trap 恢復，焦點回到 A 裡「開啟 B」的那顆按鈕。鍵盤使用者從頭到尾都知道自己在哪裡。

[click] A 關閉，計數歸零，這時候 scroll-lock 才還原 body 的樣式，捲軸回來；焦點回到頁面上最初那顆「開啟 A」。兩個堆疊各自記帳：捲動鎖是 reference counting，每個 modal 只釋放自己拿的那幾把；焦點是 trap stack，關一層退一層。鎖跟焦點講完，行為層收個尾，最後一章：SSR 與 Nuxt。
-->
