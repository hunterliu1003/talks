<div class="kicker normal-case">08 · 對齊原生 dialog 行為</div>

# Modal 的生命週期

<div class="card py-2.5! px-4! mt-4 flex items-baseline gap-4"><div class="eyebrow normal-case shrink-0">原生 &lt;dialog&gt;</div><div class="text-base muted"><code>showModal()</code> / <code>close()</code> 是同步的，呼叫完就回來，沒有「轉場完成」這個時間點</div></div>

<div class="w-[33rem] mx-auto mt-4">

<ModalLifecycleFsm :stage="7" />

</div>

<!--
接下來要分享 VueFinalModal 和原生 dialog 的一些差異，
第一個是 Modal 的生命週期，原生 dialog 的部分很簡單，showModal 跟 close 是同步的，呼叫完就回來，如果你要客製化轉場效果就會比較不方便。

我把一個 modal 的一生畫成狀態機。有四個狀態，初始狀態在 closed。

呼叫 open() 之後進到 opening，開始跑進場的過渡動畫。

跑完到 opened，promise 這時候才回傳已開啟。

關閉也一樣，不管是呼叫 close()、按 Esc 或是點擊外部，都會進到 closing，開始跑退場的過渡動畫。

跑完回到 closed，resolve 成 closed。這是走完的一圈。

再來是不會動的情況：在 beforeOpen 或 beforeClose 裡呼叫 stop()，或是已經關著又 close、已經開著又 open，狀態都維持不變，promise 會馬上回傳目前的狀態。

最後是中途反轉的情況：例如開到一半被 Esc 關掉，或關到一半又打開，promise 也都會回傳相對應的狀態不會卡著。
-->

---
clicks: 2
---

<div class="kicker normal-case">08 · 對齊原生 dialog 行為</div>

# 點擊外部關閉與文字選取

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

<SelectDragDemo :stage="$clicks" />

</div>

</div>

<!--
第二個是點擊外部關閉跟文字選取的小細節。原生 dialog 預設點遮罩不會關，要加 closedby="any" 才會關，不過 Safari 還不支援。文字選取的問題是一個 bug，

[click] VueFinalModal 的解法是：記住點擊時在哪裡，只有從遮罩按下、也在遮罩放開，才算外部點擊。

[click] 所以用滑鼠選取文字並到遮罩放開來，並不會誤觸關閉。
-->

---

<div class="kicker normal-case">08 · 對齊原生 dialog 行為</div>

# 巢狀 Modal 遮罩

<div class="grid grid-cols-2 gap-8 mt-6">

<div>
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

<div>
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
第三個是巢狀 Modal 的遮罩，modal 裡再開一個確認視窗很常見。

原生 dialog 每一層都有自己的 backdrop，疊三層就蓋了三層，畫面會越來越暗。

VueFinalModal 預設只顯示最上面那一層的遮罩，亮度一致；想要每層都有，overlayBehavior 設成 persist 就好。
-->
