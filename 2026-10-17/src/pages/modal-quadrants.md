---
clicks: 11
---

<div class="kicker transition-opacity duration-500" :class="$clicks >= 1 && $clicks <= 10 ? 'opacity-0' : ''">UX · 象限 · Modal 廣義的分類</div>

<ModalQuadrants :clicks="$clicks" />

<div class="absolute right-[3.4rem] bottom-[2.1rem] text-xs text-[var(--fg-3)] transition-opacity duration-500" :class="$clicks >= 1 && $clicks <= 10 ? 'opacity-0' : ''">改繪自 <a href="https://www.nngroup.com/articles/popups/" target="_blank" rel="noopener" class="no-underline border-none! text-[var(--fg-3)]">NN/g · The Anatomy of Popups</a><span class="mx-1.5">·</span><span class="font-mono tracking-wide">nngroup.com</span></div>

<!--
進入 VFM 之前，先把 Modal 定義清楚。什麼是 Modal？定義只有一條：它出現的時候，使用者不能操作背景。這張象限圖改繪自 NN/g 的 The Anatomy of Popups，用兩條軸把所有彈出元件分類。橫軸就是這個定義：背景不能操作的是 Modal，還能操作的是 Nonmodal。縱軸看有沒有遮罩，VFM 裡叫 overlay，NN/g 原圖叫 Lightbox。兩條軸切出四個象限，照數學的習慣從右上角開始，逆時針走一圈。

[click] 第一象限，右上：Nonmodal，而且沒有遮罩，使用者可以完全不理它。最常見的是 Toast，角落冒出來一下就走。

[click] Snackbar，底部一條，帶一個動作按鈕，Material 的標準件。

[click] Cookie 通知，貼在底部整寬，NN/g 建議的就是這種不擋人的版本。

[click] Tooltip 跟 popover，貼著元素出現，看完就走。

[click] 第二象限，左上：符合 Modal 的定義，背景不能操作，但沒有遮罩，因為元件自己就把畫面蓋滿了。Fullscreen Modal 是最直接的例子。

[click] Nav Drawer，從側邊滑出來的導覽選單，右上角那個 toggle 就是收合它的地方。

[click] Bottom Sheet，從底部推上來的半頁。

[click] 第三象限，左下：有遮罩、背景不能操作，是最典型的 Modal，也就是 Dialog、確認框。等一下 VFM 講的大部分都是這一格。

[click] Spinner，整頁等待的時候把背景鎖住。

[click] 第四象限，右下：有遮罩卻還能操作背景。照定義它是 Nonmodal，NN/g 也只說 lightbox 多半是 modal、但不一定；我 2021 年的分類表直接把這格打了叉，因為實務上很少見。

[click] 四格一起看：左邊兩格是 Modal，右邊兩格是 Nonmodal，上下只差有沒有遮罩。分類定好了，接著用一棵決策樹，決定什麼情境該用哪一種。
-->
