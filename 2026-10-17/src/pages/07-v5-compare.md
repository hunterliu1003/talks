<div class="kicker">08 · v5 概覽</div>

# 兩種 modal，一套契約

<div class="mt-2 text-lg text-[var(--fg-3)]"><span class="font-mono text-[var(--fg-2)]">VueFinalDialog</span> 包的是原生 <span class="font-mono text-[var(--fg-2)]">&lt;dialog&gt;</span>，<span class="font-mono text-[var(--fg-2)]">VueFinalModal</span> 是 VFM 自己實作的 modal</div>

<div class="grid grid-cols-2 gap-6 mt-8 w-full">

<div class="card">
<div class="eyebrow mb-3 normal-case">原生 dialog 與 VueFinalModal 一樣的</div>
<div class="flex flex-wrap gap-2 [&>.tag]:text-base [&>.tag]:px-3 [&>.tag]:py-1.5"><span class="tag">Esc 關閉</span><span class="tag">點外面關閉</span><span class="tag">role · focus</span><span class="tag">before 事件可擋</span><span class="tag">open() 一定有結果</span></div>
</div>

<div v-click="1" class="card">
<div class="eyebrow mb-3 normal-case">原生 dialog 做不到，只有 VueFinalModal 做得到</div>
<div class="flex flex-wrap gap-2 [&>.tag]:text-base [&>.tag]:px-3 [&>.tag]:py-1.5"><span class="tag tag-neutral">背景可互動</span><span class="tag tag-neutral">關在容器裡</span><span class="tag tag-neutral">SSR 首屏就開著</span><span class="tag tag-neutral">只留一層遮罩</span><span class="tag tag-neutral">手勢關閉</span></div>
</div>

</div>

<div v-click="2" class="mt-10 text-2xl text-[var(--fg-2)]">兩邊都接 useModal，<span v-mark.underline="2">只換 component 那一行</span>。</div>

<!--
兩個主角先定義清楚：VueFinalDialog 包的是瀏覽器原生的 dialog 元素，VueFinalModal 是 VFM 自己實作的 modal。一樣的部分：Esc 關閉、點外面關閉、role 跟焦點管理、beforeOpen 跟 beforeClose 可以擋下、還有 open() 跟 close() 回傳的 promise 一定等得到結果，不會懸在那裡，連 dialog 上的 CSS 動畫都會等跑完。這不是兩邊各寫一份：promise 契約在 v5 裡只有一份實作，兩個元件都是建在同一個 lifecycle 核心上的呈現層，同一套契約測試跑在兩個元件上。

[click] 不一樣的部分，都是原生 dialog 把背景整個鎖住之後就做不到的事：背景可以互動、modal 可以關在某個容器裡、SSR 的第一個畫面就是開著的、疊三層只留一層遮罩、手勢關閉。原生行為夠用就選 VueFinalDialog，碰到這五件事就回來用 VueFinalModal。

[click] 所以選哪一個不用一開始就決定：兩邊都接 useModal，你的程式碼只換 component 那一行。接下來看 VueFinalModal 元件本身的細節，每一項都先看原生 dialog 怎麼做，再看 VFM 怎麼做。
-->
