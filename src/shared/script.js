/**
 * AI R&D Center Webサイト 共通スクリプト
 * 全ページ共通のナビゲーション開閉、スクロール進捗バー、
 * タブ切り替え、アコーディオン開閉、ArtisCMS3のiframeシェルへの
 * 高さ通知処理に加えて、ニュース（src/data/news/以下の個別JSON）の
 * 描画・ポップアップ表示・画像カルーセルを扱う。
 * localStorage / sessionStorage は使用しない。
 */

/**
 * src/data/news/以下の個別ニュースJSONファイルを，ビルド時に静的インポートする。
 * 1ファイル＝1ニュースで，{ date, title, body, images } の4項目を持つ。
 * import.meta.globのeager指定により，各モジュールのdefaultエクスポート
 * （JSONの中身そのもの）がすぐ参照できる。
 */
const newsModules = import.meta.glob("../data/news/*.json", { eager: true });
const newsData = Object.values(newsModules).map((mod) => mod.default ?? mod);

/**
 * src/assets/images/以下の全画像ファイルを，ビルド時にVite側で
 * ハッシュ付きの本番URLへ解決するための一覧．ニュースJSON内のimages[].srcは
 * "news/xxx.jpg"のようにsrc/assets/images/からの相対パスで指定するため，
 * JSON内の文字列参照だけではVite/Rollupが画像をビルド成果物へ含めてくれない
 * （HTML内のimg src="/src/..."と異なり，JSON値は静的なアセット参照として
 * 解析されないため）。この問題を避けるため，import.meta.globで
 * 画像を静的にインポートしておき，ファイル名から実際のURLを引けるようにする．
 */
const newsImageAssets = import.meta.glob("../assets/images/**/*", {
  eager: true,
  import: "default",
});

/**
 * ニュースJSONのimages[].src（"news/xxx.jpg"等，src/assets/images/以下の
 * 相対パス）を，実際に読み込み可能な画像URLへ変換する関数．
 * "http"で始まる場合は外部URLとしてそのまま返す（非技術者が外部画像URLを
 * 直接貼り付けた場合の後方互換のため）．
 * 引数:
 *   imagePath (string | null | undefined): images[].srcの値．
 * 戻り値:
 *   string | null: 解決済みの画像URL．該当画像が見つからない場合はnull．
 */
function resolveNewsImage(imagePath) {
  if (!imagePath) return null;
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  const key = `../assets/images/${imagePath.replace(/^\/+/, "")}`;
  return newsImageAssets[key] ?? null;
}

/**
 * HTML特殊文字をエスケープする関数．ニュースJSON内のtitle/bodyは
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
 * ニュース配列を，dateフィールド（YYYY-MM-DD）が新しい順に並べ替える関数．
 * ファイル名の並び順に関わらず，常に日付降順で表示するために使う．
 * 引数:
 *   items (Array<object>): newsDataの要素配列．
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
 * ニュース本文（body）の先頭行を，一覧表示用に短く切り詰める関数．
 * bodyは複数の発表を"\n"区切りで持つ場合があるため，1行目のみを使う。
 * 引数:
 *   body (string): ニュースJSONのbodyフィールド．
 *   maxLength (number): 切り詰める最大文字数（デフォルト70）．
 * 戻り値:
 *   string: 一覧表示用の短い本文．
 */
function buildNewsExcerpt(body, maxLength = 70) {
  const firstLine = (body ?? "").split("\n")[0].trim();
  if (firstLine.length <= maxLength) return firstLine;
  return `${firstLine.slice(0, maxLength)}…`;
}

/**
 * ニュースの日付順ソート済み配列に，元のnewsDataの中での通し番号（id）を
 * 付与する関数．一覧描画時にdata-news-id属性へ埋め込み，
 * クリック時にどのニュースのモーダルを開くかを特定するために使う。
 * 引数: なし．
 * 戻り値:
 *   Array<object>: 各要素に`id`（数値）を追加したソート済み配列．
 */
function getSortedNewsWithIds() {
  return sortNewsByDateDesc(newsData).map((item, index) => ({ ...item, id: index }));
}

/**
 * ニュースページの一覧（.news-list[data-source="news-json"]）へ，
 * ニュース全件を日付が新しい順に描画する関数．該当要素がないページでは何もしない．
 * 件数表示用の要素（#news-count）があれば，件数もあわせて反映する．
 * 各行はクリックするとポップアップ（モーダル）で全文・画像を表示する。
 * 引数: なし．
 * 戻り値: なし．
 */
function renderNewsList() {
  const list = document.querySelector('.news-list[data-source="news-json"]');
  if (!list) return;
  const sorted = getSortedNewsWithIds();

  list.innerHTML = sorted
    .map((item) => {
      const firstImage = (item.images ?? [])[0];
      const imageUrl = firstImage ? resolveNewsImage(firstImage.src) : null;
      const hasImage = Boolean(imageUrl);
      const thumb = hasImage
        ? `<img class="news-thumb" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(firstImage.alt || "")}" referrerpolicy="no-referrer">`
        : "";
      return `
        <button type="button" class="news-row${hasImage ? " has-thumb" : ""}" data-news-id="${item.id}">
          <time datetime="${escapeHtml(item.date)}">${escapeHtml(formatNewsDateLabel(item.date))}</time>
          ${thumb}
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(buildNewsExcerpt(item.body))}</p>
          </div>
        </button>
      `;
    })
    .join("");

  const countEl = document.getElementById("news-count");
  if (countEl) {
    countEl.textContent = String(sorted.length);
  }

  list.querySelectorAll(".news-row").forEach((row) => {
    row.addEventListener("click", () => {
      const id = Number(row.getAttribute("data-news-id"));
      const item = sorted.find((n) => n.id === id);
      if (item) openNewsModal(item);
    });
  });
}

/**
 * ニュースのうち画像を持つ記事の先頭画像を，横方向に自動スクロールする
 * 写真帯（.news-photo-slider-track[data-source="news-json"]）へ描画する関数．
 * 該当要素がないページでは何もしない．画像を持つ記事が無い場合も何もしない．
 * 引数: なし．
 * 戻り値: なし．
 */
function renderNewsPhotoSlider() {
  const track = document.querySelector('.news-photo-slider-track[data-source="news-json"]');
  if (!track) return;

  const withImages = sortNewsByDateDesc(newsData)
    .map((item) => {
      const firstImage = (item.images ?? [])[0];
      return { ...item, resolvedImage: firstImage ? resolveNewsImage(firstImage.src) : null, imageAlt: firstImage?.alt };
    })
    .filter((item) => Boolean(item.resolvedImage));
  if (withImages.length === 0) {
    const wrapper = track.closest(".news-photo-slider");
    if (wrapper) wrapper.hidden = true;
    return;
  }

  track.innerHTML = withImages
    .map(
      (item) => `
        <figure>
          <img src="${escapeHtml(item.resolvedImage)}" alt="${escapeHtml(item.imageAlt || item.title)}" referrerpolicy="no-referrer">
          <figcaption>${escapeHtml(formatNewsDateLabel(item.date))} ${escapeHtml(item.title)}</figcaption>
        </figure>
      `
    )
    .join("");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    track.innerHTML += track.innerHTML;
  }
}

/** モーダル内の画像カルーセルの現在の表示位置を保持する状態。 */
const newsModalState = {
  images: [],
  currentIndex: 0,
};

/**
 * ニュース詳細のポップアップ（モーダル）のDOMを1つだけ生成し，
 * documentに追加する関数．2回目以降の呼び出しでは既存の要素を返す。
 * 引数: なし．
 * 戻り値:
 *   HTMLElement: モーダルのオーバーレイ要素。
 */
function ensureNewsModal() {
  let overlay = document.querySelector(".news-modal-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.className = "news-modal-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="news-modal" role="dialog" aria-modal="true" aria-labelledby="news-modal-title">
      <button type="button" class="news-modal-close" aria-label="閉じる">×</button>
      <div class="news-modal-carousel" hidden>
        <button type="button" class="news-modal-carousel-btn news-modal-carousel-prev" aria-label="前の画像">‹</button>
        <img class="news-modal-carousel-img" src="" alt="">
        <button type="button" class="news-modal-carousel-btn news-modal-carousel-next" aria-label="次の画像">›</button>
        <p class="news-modal-carousel-count"></p>
      </div>
      <div class="news-modal-body">
        <time class="news-modal-date"></time>
        <h2 id="news-modal-title" class="news-modal-title"></h2>
        <div class="news-modal-text"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector(".news-modal-close").addEventListener("click", closeNewsModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeNewsModal();
  });
  overlay.querySelector(".news-modal-carousel-prev").addEventListener("click", () => stepNewsModalCarousel(-1));
  overlay.querySelector(".news-modal-carousel-next").addEventListener("click", () => stepNewsModalCarousel(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeNewsModal();
    if (!overlay.hidden && event.key === "ArrowLeft") stepNewsModalCarousel(-1);
    if (!overlay.hidden && event.key === "ArrowRight") stepNewsModalCarousel(1);
  });

  return overlay;
}

/**
 * モーダル内の画像カルーセルを，指定した相対量だけ進める（または戻す）関数．
 * 画像が1枚以下の場合は何もしない。
 * 引数:
 *   delta (number): 進める枚数（-1で前へ，+1で次へ）。
 * 戻り値: なし．
 */
function stepNewsModalCarousel(delta) {
  if (newsModalState.images.length <= 1) return;
  const count = newsModalState.images.length;
  newsModalState.currentIndex = (newsModalState.currentIndex + delta + count) % count;
  renderNewsModalCarouselFrame();
}

/**
 * モーダル内の画像カルーセルの現在フレーム（画像・カウンタ表示）を更新する関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function renderNewsModalCarouselFrame() {
  const overlay = ensureNewsModal();
  const img = overlay.querySelector(".news-modal-carousel-img");
  const count = overlay.querySelector(".news-modal-carousel-count");
  const current = newsModalState.images[newsModalState.currentIndex];
  if (!current) return;
  img.src = current.url;
  img.alt = current.alt || "";
  count.textContent = newsModalState.images.length > 1
    ? `${newsModalState.currentIndex + 1} / ${newsModalState.images.length}`
    : "";
}

/**
 * 指定したニュース1件の詳細をポップアップ（モーダル）で開く関数．
 * bodyは"\n"区切りで複数の段落として表示し，imagesが複数ある場合は
 * 矢印ボタンで送れる画像カルーセルを表示する。
 * 引数:
 *   item (object): { date, title, body, images } を持つニュース1件。
 * 戻り値: なし．
 */
function openNewsModal(item) {
  const overlay = ensureNewsModal();

  overlay.querySelector(".news-modal-date").textContent = formatNewsDateLabel(item.date);
  overlay.querySelector(".news-modal-title").textContent = item.title;

  const bodyParagraphs = (item.body ?? "")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  overlay.querySelector(".news-modal-text").innerHTML = bodyParagraphs;

  const resolvedImages = (item.images ?? [])
    .map((image) => ({ url: resolveNewsImage(image.src), alt: image.alt }))
    .filter((image) => Boolean(image.url));

  const carousel = overlay.querySelector(".news-modal-carousel");
  const prevBtn = overlay.querySelector(".news-modal-carousel-prev");
  const nextBtn = overlay.querySelector(".news-modal-carousel-next");
  if (resolvedImages.length > 0) {
    newsModalState.images = resolvedImages;
    newsModalState.currentIndex = 0;
    carousel.hidden = false;
    const multiple = resolvedImages.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
    renderNewsModalCarouselFrame();
  } else {
    newsModalState.images = [];
    carousel.hidden = true;
  }

  overlay.hidden = false;
  document.body.classList.add("news-modal-open");
  overlay.querySelector(".news-modal-close").focus();
}

/**
 * ニュース詳細のポップアップ（モーダル）を閉じる関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function closeNewsModal() {
  const overlay = document.querySelector(".news-modal-overlay");
  if (!overlay) return;
  overlay.hidden = true;
  document.body.classList.remove("news-modal-open");
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
 * HTML側でaria-expanded="true"・class="is-open"が初期設定されている
 * パネルは，開いた状態のままクリックで開閉できるようにする。
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
  renderNewsList();
  renderNewsPhotoSlider();
  initTabs();
  initAccordions();
  initIframeHeightReporter();
});
