/**
 * AI R&D Center Webサイト 共通スクリプト
 * 全ページ共通のナビゲーション開閉、スクロール進捗バー、
 * ニュースティッカーの複製、タブ切り替え、アコーディオン開閉を扱う。
 * localStorage / sessionStorage は使用しない。
 */
(function () {
  "use strict";

  /**
   * ナビゲーションのハンバーガーメニュー開閉を初期化する関数．
   * 引数: なし．
   * 戻り値: なし．
   */
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /**
   * スクロール量に応じてページ上部の進捗バーの幅を更新する関数．
   * 引数: なし．
   * 戻り値: なし．
   */
  function initScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    function update() {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var ratio = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = ratio + "%";
    }
    document.addEventListener("scroll", update, { passive: true });
    update();
  }

  /**
   * ニュースティッカーの中身を複製し，シームレスなループ表示にする関数．
   * 引数: なし．
   * 戻り値: なし．
   */
  function initNewsTicker() {
    var track = document.querySelector(".news-ticker-track");
    if (!track) return;
    var originalHTML = track.innerHTML;
    track.innerHTML = originalHTML + originalHTML;
  }

  /**
   * data-tabs属性を持つタブUIを初期化する関数．
   * 引数: なし．
   * 戻り値: なし．
   */
  function initTabs() {
    var groups = document.querySelectorAll("[data-tabs]");
    groups.forEach(function (group) {
      var buttons = group.querySelectorAll(".tab-btn");
      var panels = group.querySelectorAll(".tab-panel");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var target = btn.getAttribute("data-tab-target");
          buttons.forEach(function (b) {
            b.setAttribute("aria-selected", b === btn ? "true" : "false");
          });
          panels.forEach(function (panel) {
            panel.classList.toggle("is-active", panel.id === target);
          });
        });
      });
    });
  }

  /**
   * アコーディオン形式の開閉UIを初期化する関数．
   * 引数: なし．
   * 戻り値: なし．
   */
  function initAccordions() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panelId = trigger.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);
        if (!panel) return;
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
        panel.classList.toggle("is-open", !isOpen);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initScrollProgress();
    initNewsTicker();
    initTabs();
    initAccordions();
  });
})();
