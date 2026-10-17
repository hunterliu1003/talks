---
clicks: 7
class: py-10!
---

<ModalDecisionTree :clicks="$clicks" />

<div class="absolute right-[3.4rem] bottom-[2.1rem] text-xs text-[var(--fg-3)]">改自 Ryan Neufeld <a href="https://uxplanet.org/modal-vs-page-a-decision-making-framework-34453e911129" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-3)]">Modal vs Page</a> · UX Planet 2020</div>

<!--
這個決策樹會和大家一步步走過七個問題，並選出最適合該情境的解決方案。

[click] 第一題，需要打斷使用者嗎？不需要的話，做成頁面。

[click] 第二題，會被分享、會長大嗎？會的話，它值得一個自己的網址，做成頁面。

[click] 第三題，內容多到要捲動嗎？是的話，做成頁面。

[click] 第四題，短暫、單一、用完就回主頁？不是的話，還是頁面。到這裡四個出口都是 Page，也就是說大多數的情況下，我們其實不一定需要 Modal。

[click] 第五題才進到 Modal：非擋住流程不可嗎？不需要擋住的話就是 Nonmodal，例如 Cookie 通知、Tooltip、Popover 這些元件。

[click] 第六題，如果只是單純告知結果可以用 Toast。

[click] 最後一題，要收集資訊或確認操作嗎？要的話用 Dialog；不用的話用 Bottom Sheet 或 Nav Drawer。

七個問題走完一輪，大家可以發現真正需要 Modal 的情況其實不多，但真正需要的時候，這個決策樹可以協助我們做判斷。

更認識 Modal 所代表的概念之後，接下來回到新版的 VFM 5 將帶來哪些新的改動。
-->
