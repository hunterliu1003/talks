---
clicks: 4
---

<div class="kicker">09 · v5 概覽</div>

# 一個入口，兩種 modal

<div class="mt-3">

<UseModalFlow :clicks="$clicks" />

</div>

<!--
打包講完，回到架構，用一段動畫看 v5 的 modal 怎麼開。左邊是你寫的程式：useModal 給一個 component，回傳 open；右邊是 App.vue 放一次的 ModalsContainer，所有用 useModal 開的 modal 實際上都渲染在它裡面。useModal 負責控制元件開關的生命週期，底下由 vue-use-template 做動態渲染。

[click] component 先給 VueFinalModal，呼叫 open：ModalsContainer 的清單被 push 一筆，畫面就渲染出一個有遮罩的 modal。這是 v4 就有的用法，headless，什麼都能客製。

[click] 換成 VueFinalDialog，再 open 一次：一樣 push 一筆，畫面上多一個原生 dialog。這是 v5 新增的選項，原生行為夠用的時候選它。

[click] 平常你不會直接開 VueFinalModal，而是拿它包成自己專案的 Higher Order Component：確認用的 Dialog、側邊的 Nav Drawer、手機上的 Bottom Sheet、整頁等待的 Spinner，就是前面象限裡那些東西。每一個都還是 VueFinalModal，所以一樣走 useModal，一口氣 push 四筆，容器裡就疊了四層。

[click] 最後一種：你自己從頭寫的 Modal 元件。只要遵守同一套契約，v-model 加上開關的事件，useModal 一樣能接，open() 一樣等得到結果，第 11 章會看到這套契約長什麼樣。七筆都在同一個容器裡，疊在同一個畫面上，你的程式碼只換 component 那一行。兩種 modal 都接進了同一個入口，下一頁看它們哪裡一樣、哪裡不一樣。
-->
