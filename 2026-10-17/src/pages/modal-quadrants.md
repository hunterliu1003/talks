---
clicks: 11
---

<div class="kicker transition-opacity duration-500" :class="$clicks >= 1 && $clicks <= 10 ? 'opacity-0' : ''">UX · 象限 · Modal 廣義的分類</div>

<ModalQuadrants :clicks="$clicks" />

<div class="absolute right-[3.4rem] bottom-[2.1rem] text-xs text-[var(--fg-3)] transition-opacity duration-500" :class="$clicks >= 1 && $clicks <= 10 ? 'opacity-0' : ''">改繪自 <a href="https://www.nngroup.com/articles/popups/" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-3)]">NN/g · The Anatomy of Popups</a><span class="mx-1.5">·</span><span class="font-mono tracking-wide">nngroup.com</span></div>

<!--
這張象限圖的橫軸左邊是 Modal 右邊是 Nonmodal，Modal 的背景不能操作，Nonmodal 可以。縱軸是看有沒有遮罩，下方是有遮罩，上方是沒有遮罩。

[click] 第一象限，背景能操作而且沒有遮罩，使用者通常可以忽略它。最常見的是 Toast 元件

[click] Snackbar

[click] Cookie 通知

[click] Tooltip 跟 Popover，廣義上也屬於這個區域。

[click] 再來是第二象限，背景不能操作也沒有遮罩。滿版的 Fullscreen Modal 是最直觀的例子。

[click] Nav Drawer，從側邊滑出來的導覽選單。

[click] 從底部推上來的 Bottom Sheet。

[click] 再來是第三象限，最典型的就是 Dialog 和 [click] Spinner

[click] 第四象限，留個空因為實務上很少見到有遮罩但背景卻可以操作的情況。

[click] 對 Modal 有了基本的分類之後，我們就可以基於這個分類方法，來搭配下一張的決策樹一起看。
-->
