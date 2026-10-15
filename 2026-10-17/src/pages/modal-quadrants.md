---
clicks: 11
---

<div class="kicker transition-opacity duration-500" :class="$clicks >= 1 && $clicks <= 10 ? 'opacity-0' : ''">UX · 象限 · Modal 廣義的分類</div>

<ModalQuadrants :clicks="$clicks" />

<div class="absolute right-[3.4rem] bottom-[2.1rem] text-xs text-[var(--fg-3)] transition-opacity duration-500" :class="$clicks >= 1 && $clicks <= 10 ? 'opacity-0' : ''">改繪自 <a href="https://www.nngroup.com/articles/popups/" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-3)]">NN/g · The Anatomy of Popups</a><span class="mx-1.5">·</span><span class="font-mono tracking-wide">nngroup.com</span></div>

<!--
剛剛說 VFM 管的那一串行為，收斂起來就是 Modal 的定義，只有一條：它出現的時候，使用者不能操作背景。這張圖改繪自 NN/g 的 The Anatomy of Popups，用兩條軸把所有彈出元件分類。
橫軸是看背景能不能操作，縱軸是看有沒有遮罩，兩條軸切出四個象限。

[click] 第一象限，背景能操作而且沒有遮罩，使用者通常可以忽略它。最常見的是 Toast

[click] Snackbar

[click] Cookie 通知

[click] Tooltip 跟 popover，廣義上也屬於這個區域。

[click] 再來是第二象限，背景不能操作也沒有遮罩。滿版的 Fullscreen Modal 是最直觀的例子。

[click] Nav Drawer，從側邊滑出來的導覽選單。

[click] 從底部推上來的 Bottom Sheet。

[click] 再來是第三象限，最典型的就是 Dialog 和 [click] Spinner

[click] 第四象限，留個空因為實務上很少見。

[click] 對 Modal 有了基本的分類之後，我們就可以基於這個分類方法，來搭配下一張的決策樹一起看。
-->
