---
clicks: 12
---

<div class="kicker normal-case">08 · 原生 dialog 行為比較</div>

# 開跟關的每一條路，都有結果

<div class="card py-2.5! px-4! mt-4 flex items-baseline gap-4"><div class="eyebrow normal-case shrink-0">原生 &lt;dialog&gt;</div><div class="text-base muted"><code>showModal()</code> / <code>close()</code> 是同步的，呼叫完就回來，沒有「轉場完成」這個時間點</div></div>

<div class="w-[33rem] mx-auto mt-4">

<ModalLifecycleFsm :stage="$clicks" />

</div>

<!--
接下來看行為層，VueFinalModal 元件本身的細節，每一項都先看原生 dialog 怎麼做，再看 VFM 怎麼做：開跟關的 promise、選取文字、多層遮罩、捲動鎖跟焦點。第一項，開跟關。原生 dialog 的 showModal 跟 close 是同步的，呼叫完就回來，沒有「轉場完成」這個時間點，想等 modal 真的開好再做事，只能自己聽 transitionend。

[click] VFM 把一個 modal 的一生畫成狀態機。四個狀態：closed、opening、opened、closing，就是 useModal 回傳的 status。實線框是停得住的狀態，虛線框是轉場中。一開始在 closed。

[click] 要開的第一關是 beforeOpen，裡面呼叫 stop() 就留在 closed，open() 直接 resolve「被擋下」。

[click] 關著的時候又呼叫 close()，狀態不動，馬上 resolve「已經關著」。

[click] 這次真的開：呼叫 open()，beforeOpen 沒擋，

[click] 進到 opening，進場轉場開始跑，open() 的 promise 在等。

[click] 轉場跑完到 opened，promise 這時候才 resolve 成 opened。所以 await open() 回來的時候，modal 一定已經開好了。

[click] 開著的時候一樣：beforeClose 呼叫 stop() 就留在 opened，close() resolve「被擋下」。

[click] 已經開著又呼叫 open()，馬上 resolve「已經開著」；還在開的話就跟著同一趟，開完一起拿到 opened。

[click] 要關：呼叫 close()、按 Esc 或點擊外部，beforeClose 沒擋，

[click] 進到 closing，退場轉場跑，close() 的 promise 在等。

[click] 跑完回到 closed，resolve 成 closed。這是走完的一圈。

[click] 最後是沒走完的路。開到一半被 Esc 關掉，或關到一半又打開，就直接反轉方向，原本在等的 promise resolve「被切換」，不會被晾著。例外只有一個：開到一半呼叫 useModal 的 close()，它不反轉，等開完再關，兩個 promise 都拿到正常結果。元件被銷毀也一樣，不管停在哪裡都直接回到 closed，不跑轉場，在等的 promise resolve「被銷毀」。所以每一條路都有結果，promise 不會卡在 pending。VueFinalDialog 也是同一套規則。
-->

---
clicks: 3
---

<div class="kicker normal-case">08 · 原生 dialog 行為比較</div>

# 選取文字時，不要把 modal 關掉

<div class="grid grid-cols-[1fr_1.15fr] gap-8 mt-6 items-center">

<div class="flex flex-col gap-4">

<div class="card py-3!"><div class="eyebrow normal-case mb-1">原生 &lt;dialog&gt;</div><div class="text-base muted">預設點遮罩不會關；<code>closedby="any"</code> 才會，判定交給瀏覽器，Safari 未支援</div></div>

<div v-click="1">

```ts
function onMousedown(e: MouseEvent) {
  lastMousedownEl = e.target
}

function onMouseupRoot() {
  if (lastMousedownEl !== vfmRootEl.value) return
  // 從遮罩上按下、也在遮罩上放開，才算點外面
}
```

</div>

</div>

<div v-click="1">

<SelectDragDemo :stage="Math.max($clicks - 1, 0)" />

</div>

</div>


<!--
第二項很小，但每個人都遇過：在 modal 裡選取文字。先看原生：原生 dialog 預設點遮罩不會關；要關得加 closedby="any"，判定交給瀏覽器，而且前面說過，Safari 還不支援。我實測過，瀏覽器的判定會看按下跟放開是不是在同一個地方，選取文字不會誤關。

[click] VFM 要自己判定「點外面」：記住 mousedown 發生在哪裡，只有從遮罩上按下、也在遮罩上放開，才算點外面。右邊用一個 VFM 的 modal 實際走一次。

[click] 看實際情境：你在 modal 裡面想選取一段文字，滑鼠在內容上按下去，拖著拖著，

[click] 一不小心拖到遮罩上才放開。很多 modal 只看 click 事件，會把這個當成「點外面」，直接關掉，你剛打的東西就不見了；VFM 這裡不會關。
-->

---

<div class="kicker normal-case">08 · 原生 dialog 行為比較</div>

# 疊三層 modal，畫面不該越來越暗

<div class="grid grid-cols-2 gap-8 mt-6">

<div v-click>
<div class="eyebrow normal-case mb-3">原生：每個 dialog 各自一個 ::backdrop</div>
<div class="relative h-56 rounded-xl overflow-hidden border border-[var(--border)]">
<div class="absolute inset-0 bg-[#ece9e1]"></div>
<div class="absolute left-5 top-5 w-28 h-2 rounded bg-black/25"></div>
<div class="absolute left-5 top-10 w-52 h-2 rounded bg-black/15"></div>
<div class="absolute left-5 top-15 w-44 h-2 rounded bg-black/15"></div>
<div class="absolute left-5 bottom-8 w-56 h-2 rounded bg-black/15"></div>
<div class="absolute left-5 bottom-4 w-36 h-2 rounded bg-black/15"></div>
<div class="absolute inset-0 bg-black/40"></div>
<div class="absolute left-8 top-8 w-40 h-24 rounded-lg bg-white border-black/20 border shadow-md"></div>
<div class="absolute inset-0 bg-black/40"></div>
<div class="absolute left-16 top-14 w-40 h-24 rounded-lg bg-white border-black/20 border shadow-md"></div>
<div class="absolute inset-0 bg-black/40"></div>
<div class="absolute left-24 top-20 w-40 h-24 rounded-lg bg-white border-[#00DC82] border-2 shadow-md"></div>
</div>
</div>

<div v-click>
<div class="eyebrow normal-case mb-3">VFM：<code>overlayBehavior: 'auto'</code></div>
<div class="relative h-56 rounded-xl overflow-hidden border border-[var(--border)]">
<div class="absolute inset-0 bg-[#ece9e1]"></div>
<div class="absolute left-5 top-5 w-28 h-2 rounded bg-black/25"></div>
<div class="absolute left-5 top-10 w-52 h-2 rounded bg-black/15"></div>
<div class="absolute left-5 top-15 w-44 h-2 rounded bg-black/15"></div>
<div class="absolute left-5 bottom-8 w-56 h-2 rounded bg-black/15"></div>
<div class="absolute left-5 bottom-4 w-36 h-2 rounded bg-black/15"></div>
<div class="absolute left-8 top-8 w-40 h-24 rounded-lg bg-white border-black/20 border shadow-md"></div>
<div class="absolute left-16 top-14 w-40 h-24 rounded-lg bg-white border-black/20 border shadow-md"></div>
<div class="absolute inset-0 bg-black/40"></div>
<div class="absolute left-24 top-20 w-40 h-24 rounded-lg bg-white border-[#00DC82] border-2 shadow-md"></div>
</div>
</div>

</div>

<div v-after class="text-sm faint mt-5">示意圖；<code>overlayBehavior: 'persist'</code> 則保留每一層的遮罩</div>

<!--
第三項是多層 modal。實際專案裡，modal 裡再開一個確認視窗很常見。

[click] 原生 dialog 每一層都有自己的 backdrop，疊三層之後，最底下的畫面就被蓋了三層，越來越暗。

[click] VFM 預設的 overlayBehavior 是 auto：疊了幾層都只顯示最上面那一層的遮罩，畫面的亮度維持一致。如果你就是想要每層都有遮罩，設成 persist 就好。第四項，捲動鎖跟焦點。
-->
