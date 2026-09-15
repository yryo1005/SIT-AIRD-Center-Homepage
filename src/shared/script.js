/**
 * AI R&D Center Webサイト 共通スクリプト
 * 全ページ共通のナビゲーション開閉、スクロール進捗バー、
 * ニュースティッカーの複製、タブ切り替え、アコーディオン開閉、
 * ArtisCMS3のiframeシェルへ高さを通知する処理を扱う。
 * ニュース一覧・ティッカーは src/data/news.json を読み込んで描画する。
 * localStorage / sessionStorage は使用しない。
 */
import newsData from "../data/news.json";

/**
 * HTML特殊文字をエスケープする関数．news.json内のtitle/summaryは
 * innerHTMLで挿入するため，&/</>等が含まれていても壊れないようにする．
 * 引数:
 *   value (string): エスケープ対象の文字列．
 * 戻り値:
 *   string: エスケープ後の文字列．
 */
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

/**
 * news.jsonの配列を，dateフィールド（YYYY-MM-DD）が新しい順に並べ替える関数．
 * 配列内での記載順に関わらず，常に日付降順で表示するために使う．
 * 引数:
 *   items (Array<object>): news.jsonの要素配列．
 * 戻り値:
 *   Array<object>: 日付が新しい順に並べ替えた新しい配列．
 */
function sortNewsByDateDesc(items) {
  return [...items].sort((a, b) => {
    if (a.date === b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });
}

/**
 * "YYYY-MM-DD"形式の日付文字列を，このサイトの表示形式"YYYY.MM.DD"に変換する関数．
 * 引数:
 *   isoDate (string): "YYYY-MM-DD"形式の日付文字列．
 * 戻り値:
 *   string: "YYYY.MM.DD"形式の日付文字列．
 */
function formatNewsDateLabel(isoDate) {
  return isoDate.split("-").join(".");
}

/**
 * トップページのニューストリッカー（.news-ticker-track[data-source="news-json"]）へ，
 * news.jsonのうち日付が新しい上位5件を描画する関数．該当要素がないページでは何もしない．
 * 引数: なし．
 * 戻り値: なし．
 */
function renderNewsTicker() {
  const track = document.querySelector('.news-ticker-track[data-source="news-json"]');
  if (!track) return;
  const latest = sortNewsByDateDesc(newsData).slice(0, 5);
  track.innerHTML = latest
    .map(
      (item) => `
        <span class="news-ticker-item"><time datetime="${escapeHtml(item.date)}">${escapeHtml(formatNewsDateLabel(item.date))}</time>${escapeHtml(item.title)}</span>
      `
    )
    .join("");
}

/**
 * ニュースページの一覧（.news-list[data-source="news-json"]）へ，
 * news.jsonの全件を日付が新しい順に描画する関数．該当要素がないページでは何もしない．
 * 件数表示用の要素（#news-count）があれば，件数もあわせて反映する．
 * 引数: なし．
 * 戻り値: なし．
 */
function renderNewsList() {
  const list = document.querySelector('.news-list[data-source="news-json"]');
  if (!list) return;
  const sorted = sortNewsByDateDesc(newsData);

  list.innerHTML = sorted
    .map((item) => {
      const hasImage = Boolean(item.image);
      const thumb = hasImage
        ? `<img class="news-thumb" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || "")}" referrerpolicy="no-referrer">`
        : "";
      return `
        <div class="news-row${hasImage ? " has-thumb" : ""}">
          <time datetime="${escapeHtml(item.date)}">${escapeHtml(formatNewsDateLabel(item.date))}</time>
          ${thumb}
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const countEl = document.getElementById("news-count");
  if (countEl) {
    countEl.textContent = String(sorted.length);
  }
}

/**
 * ナビゲーションのハンバーガーメニュー開閉を初期化する関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/**
 * スクロール量に応じてページ上部の進捗バーの幅を更新する関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${ratio}%`;
  }
  document.addEventListener("scroll", update, { passive: true });
  update();
}

/**
 * ニュースティッカーの中身を複製し，シームレスなループ表示にする関数．
 * prefers-reduced-motionが有効な場合は複製を行わない．
 * 引数: なし．
 * 戻り値: なし．
 */
function initNewsTicker() {
  const track = document.querySelector(".news-ticker-track");
  if (!track) return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;
  const originalHTML = track.innerHTML;
  track.innerHTML = originalHTML + originalHTML;
}

/**
 * data-tabs属性を持つタブUIを初期化する関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function initTabs() {
  const groups = document.querySelectorAll("[data-tabs]");
  groups.forEach((group) => {
    const buttons = group.querySelectorAll(".tab-btn");
    const panels = group.querySelectorAll(".tab-panel");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab-target");
        buttons.forEach((b) => {
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        panels.forEach((panel) => {
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
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panelId = trigger.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      if (!panel) return;
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      panel.classList.toggle("is-open", !isOpen);
    });
  });
}

/**
 * このページがArtisCMS3側のiframeシェルに埋め込まれている場合に，
 * ResizeObserverで本文の高さを検知し，window.parent.postMessageで
 * 親ウィンドウ（cms-shells/側のスクリプト）へ高さを通知する関数．
 * 単独でGitHub Pagesを直接表示している場合（iframeでない場合）は何もしない．
 * 引数: なし．
 * 戻り値: なし．
 */
function initIframeHeightReporter() {
  const isEmbedded = window.self !== window.top;
  if (!isEmbedded) return;

  const target = document.body;

  /**
   * 現在の本文の高さを親ウィンドウへpostMessageで送信する関数．
   * 引数: なし．
   * 戻り値: なし．
   */
  function postHeight() {
    const height = target.scrollHeight;
    window.parent.postMessage({ type: "ai-rd-center:height", height }, "*");
  }

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => postHeight());
    observer.observe(target);
  } else {
    window.addEventListener("resize", postHeight);
  }

  window.addEventListener("load", postHeight);
  postHeight();
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initScrollProgress();
  renderNewsTicker();
  renderNewsList();
  initNewsTicker();
  initTabs();
  initAccordions();
  initIframeHeightReporter();
});
