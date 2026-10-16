---
clicks: 7
---

<div class="kicker normal-case">07 · vue-use-template</div>

# 動態渲染 Modal 元件的機制如何運作

<div class="mt-3">

<UseModalFlow :clicks="$clicks" />

</div>

<!--
接下來用一段動畫看 useModal 和 ModalsContainer 實際怎麼運作。

useModal 給一個 component，呼叫 open。ModalsContainer 放在 App.vue，每 open 一次就 push 一筆進去，由它渲染。右邊是使用者看到的畫面。

[click] 先開 VueFinalModal，畫面出現一個有遮罩的 modal。

[click] 再來是新增的 VueFinalDialog 元件，底層是原生的 dialog。如果原生行為夠用就選它。

[click] 實務上通常不會直接開 VueFinalModal，而是包成自己的元件像是 Dialog，

[click] 以及側邊的 Nav Drawer，
[click] 還有 Bottom Sheet，
[click] 還有 Spinner。

[click] 最後是你自己寫的 Modal 元件，useModal 也接得上，open() 一樣等得到結果。
-->
