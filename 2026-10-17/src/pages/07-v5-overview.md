---
clicks: 4
---

<div class="kicker">08 · v5 概覽</div>

# 動態渲染 Modal 元件的機制如何運作

<div class="mt-3">

<UseModalFlow :clicks="$clicks" />

</div>

<!--
用一段動畫看 modal 是怎麼被打開的。左邊是你寫的程式：useModal 給一個 component，回傳 open；右邊是 App.vue 放一次的 ModalsContainer，所有用 useModal 開的 modal 實際上都渲染在它裡面。useModal 負責控制元件開關的生命週期，底下由 vue-use-template 做動態渲染。

[click] component 先給 VueFinalModal，呼叫 open，ModalsContainer 的清單就多一筆，畫面上出現一個有遮罩的 modal。這是 v4 就有的用法，樣式全部自己決定。

[click] 把 component 換成 VueFinalDialog，再 open 一次，一樣多一筆，畫面上多的是一個原生的 dialog。這是 v5 新增的選項，原生 dialog 的行為夠用的時候就可以選它。

[click] 不過平常不會直接開 VueFinalModal，而是拿它包成自己專案的元件：確認用的 Dialog、側邊的 Nav Drawer、手機上的 Bottom Sheet、整頁等待的 Spinner，也就是前面象限裡的那些東西。它們底層都還是 VueFinalModal，所以一樣走 useModal，一口氣開四個，容器裡就疊了四層。

[click] 最後一種是你自己從頭寫的 Modal 元件。只要符合同一套約定，也就是 v-model 加上開關的事件，useModal 一樣接得上，open() 一樣等得到結果。所以不管是哪一種 modal，程式碼只有 component 那一行不一樣。動態渲染這一層講完，接下來看 VueFinalDialog 跟 VueFinalModal 哪裡一樣、哪裡不一樣。
-->
