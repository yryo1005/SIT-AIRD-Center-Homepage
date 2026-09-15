/**
 * AI R&D Center Webサイト 共通スクリプト
 * 全ページ共通のナビゲーション開閉、スクロール進捗バー、
 * タブ切り替え、アコーディオン開閉、ArtisCMS3のiframeシェルへの
 * 高さ通知処理に加えて、ニュース（src/data/news/以下の個別JSON）と
 * 学会行脚マップ（src/assets/images/conference-map/以下の画像）の
 * 描画・ポップアップ表示・画像カルーセルを扱う。
 * localStorage / sessionStorage は使用しない。
 */
import { PREFECTURES } from "../data/prefectures.js";
import { FACILITY_ROOMS } from "../data/facility-rooms.js";

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
 * ハッシュ付きの本番URLへ解決するための一覧．ニュースJSON内のimages[].srcや，
 * 学会行脚マップの画像フォルダは"news/xxx.jpg"のようにsrc/assets/images/からの
 * 相対パスで参照するため，文字列参照だけではVite/Rollupが画像をビルド成果物へ
 * 含めてくれない（HTML内のimg src="/src/..."と異なり，JS/JSON上の文字列は
 * 静的なアセット参照として解析されないため）。この問題を避けるため，
 * import.meta.globで画像を静的にインポートしておき，パスから実際のURLを引く。
 */
const imageAssets = import.meta.glob("../assets/images/**/*", {
  eager: true,
  import: "default",
});

/**
 * "news/xxx.jpg"等，src/assets/images/以下の相対パスを，実際に読み込み可能な
 * 画像URLへ変換する関数．"http"で始まる場合は外部URLとしてそのまま返す
 * （非技術者が外部画像URLを直接貼り付けた場合の後方互換のため）．
 * 引数:
 *   imagePath (string | null | undefined): 画像の相対パス．
 * 戻り値:
 *   string | null: 解決済みの画像URL．該当画像が見つからない場合はnull．
 */
function resolveImagePath(imagePath) {
  if (!imagePath) return null;
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  const key = `../assets/images/${imagePath.replace(/^\/+/, "")}`;
  return imageAssets[key] ?? null;
}

/**
 * HTML特殊文字をエスケープする関数．JSON等から読み込んだ文字列は
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
      const imageUrl = firstImage ? resolveImagePath(firstImage.src) : null;
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
      if (!item) return;
      const images = (item.images ?? [])
        .map((image) => ({ url: resolveImagePath(image.src), alt: image.alt }))
        .filter((image) => Boolean(image.url));
      const metaParts = [];
      if (item.eventDate) metaParts.push(`開催日：${item.eventDate}`);
      if (item.participants) metaParts.push(`参加人数：${item.participants}名`);
      openMediaModal({
        eyebrow: formatNewsDateLabel(item.date),
        title: item.title,
        meta: metaParts.join("／"),
        bodyLines: (item.body ?? "").split("\n"),
        referenceLines: item.references,
        images,
      });
    });
  });
}

/**
 * 複数枚の候補画像を横スライドで切り替える「ミニカルーセル」のHTML断片を作る関数．
 * ニュース写真帯・施設ページの各部屋写真など，サイト内で自動的に画像が
 * 切り替わる箇所すべてで共通して使う型。画像が1枚しかない場合は
 * 左右ボタンを表示しない（ただし同じ構造のHTMLを返すため，呼び出し側の
 * 処理を画像枚数で分岐させる必要はない）。
 * 引数:
 *   images (Array<{url: string, alt: string}>): 表示する画像の一覧。
 * 戻り値:
 *   string: `.mini-carousel`要素のHTML文字列。
 */
function buildMiniCarouselHtml(images) {
  const track = images
    .map((image) => `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt || "")}" referrerpolicy="no-referrer">`)
    .join("");
  const buttons = images.length > 1
    ? `
      <button type="button" class="mini-carousel-btn mini-carousel-prev" aria-label="前の画像">‹</button>
      <button type="button" class="mini-carousel-btn mini-carousel-next" aria-label="次の画像">›</button>
    `
    : "";
  return `
    <div class="mini-carousel" role="button" tabindex="0" aria-label="タップすると全ての写真を一覧表示します">
      <div class="mini-carousel-track">${track}</div>
      ${buttons}
    </div>
  `;
}

/**
 * `buildMiniCarouselHtml()`で生成したミニカルーセル1つに，動作を仕込む関数．
 * - 左右ボタンでの手動切り替え
 * - ハードカットではなく，横方向へのスムーズなスライド（CSS transitionによる
 *   transform変化。実体は常にtrack内の全画像を並べておき，表示位置を
 *   ずらしているだけなので，画像の差し替え（src変更）は発生しない）
 * - 画像が2枚以上ある場合の一定時間おきの自動切り替え（prefers-reduced-motion
 *   が有効な場合は自動切り替えしない。手動でのボタン操作は常に可能）
 * - カルーセル本体（ボタン以外の部分）をクリック／タップすると，
 *   全画像の一覧をポップアップ（モーダル）で表示する
 * 引数:
 *   carouselEl (HTMLElement): `.mini-carousel`要素。
 *   options (object):
 *     intervalMs (number): 自動切り替えの間隔（ミリ秒）。
 *     onOpen (function(number): void): カルーセル本体クリック時に，
 *       現在表示中の画像インデックスを引数として呼ばれるコールバック。
 * 戻り値: なし．
 */
function wireMiniCarousel(carouselEl, { intervalMs = 4000, onOpen } = {}) {
  const track = carouselEl.querySelector(".mini-carousel-track");
  const prevBtn = carouselEl.querySelector(".mini-carousel-prev");
  const nextBtn = carouselEl.querySelector(".mini-carousel-next");
  const count = track.children.length;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;

  /**
   * 指定したインデックスの画像へスライド移動する関数（内部use）。
   * 引数: i (number): 移動先のインデックス（範囲外はループする）。
   * 戻り値: なし。
   */
  function setIndex(i) {
    index = ((i % count) + count) % count;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function startTimer() {
    if (count <= 1 || prefersReducedMotion) return;
    timer = setInterval(() => setIndex(index + 1), intervalMs);
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    startTimer();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      setIndex(index - 1);
      resetTimer();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      setIndex(index + 1);
      resetTimer();
    });
  }

  if (onOpen) {
    carouselEl.addEventListener("click", () => onOpen(index));
    carouselEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(index);
      }
    });
  }

  startTimer();
}

/**
 * ニュースのうち画像を持つ記事を，横方向に自動スクロールする
 * 写真帯（.news-photo-slider-track[data-source="news-json"]）へ描画する関数．
 * 該当要素がないページでは何もしない．画像を持つ記事が無い場合も何もしない．
 * 1件のニュースに複数の画像がある場合は，同じ枠内で一定時間おきに画像を
 * 切り替えて，全ての写真が見られるようにする。
 * 引数: なし．
 * 戻り値: なし．
 */
function renderNewsPhotoSlider() {
  const track = document.querySelector('.news-photo-slider-track[data-source="news-json"]');
  if (!track) return;

  const withImages = sortNewsByDateDesc(newsData)
    .map((item) => ({
      ...item,
      resolvedImages: (item.images ?? [])
        .map((image) => ({ url: resolveImagePath(image.src), alt: image.alt || item.title }))
        .filter((image) => Boolean(image.url)),
    }))
    .filter((item) => item.resolvedImages.length > 0);
  if (withImages.length === 0) {
    const wrapper = track.closest(".news-photo-slider");
    if (wrapper) wrapper.hidden = true;
    return;
  }

  track.innerHTML = withImages
    .map(
      (item) => `
        <figure>
          ${buildMiniCarouselHtml(item.resolvedImages)}
          <figcaption>${escapeHtml(formatNewsDateLabel(item.date))} ${escapeHtml(item.title)}</figcaption>
        </figure>
      `
    )
    .join("");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    track.innerHTML += track.innerHTML;
  }
  // 複製後のtrack全体から<figure>を取得し，オリジナル・複製の両方に
  // ミニカルーセルの動作を仕込む（複製分もユーザーの目に触れるため）。
  track.querySelectorAll("figure").forEach((figure, index) => {
    const item = withImages[index % withImages.length];
    const carousel = figure.querySelector(".mini-carousel");
    wireMiniCarousel(carousel, {
      intervalMs: 4000 + (index % withImages.length) * 350,
      onOpen: (startIndex) => {
        openMediaModal({
          eyebrow: formatNewsDateLabel(item.date),
          title: item.title,
          bodyLines: [],
          images: item.resolvedImages,
          startIndex,
        });
      },
    });
  });
}

/**
 * 学会行脚マップの背景に薄く敷く，日本列島のおおまかな模式的シルエット。
 * 正確な海岸線ではなく，北海道・本州＋四国＋九州・沖縄という3つの
 * ゆるやかな塊として，マーカーの位置関係が地図らしく見えるようにするための
 * 装飾目的の図形である。
 */
const JP_MAP_BACKGROUND = `
  <g class="jp-map-bg" aria-hidden="true">
    <ellipse cx="345" cy="100" rx="55" ry="38" />
    <path d="M 300,170
             C 330,165 355,175 372,195
             C 385,215 380,235 368,250
             C 378,265 385,282 375,298
             C 365,312 345,318 328,308
             C 300,300 305,280 292,275
             C 270,270 260,255 258,238
             C 255,215 270,195 285,182
             C 290,175 295,172 300,170 Z" />
    <path d="M 95,300
             C 130,290 165,300 195,315
             C 220,318 245,312 260,325
             C 250,340 225,345 205,335
             C 185,345 160,340 145,350
             C 120,360 95,345 90,325
             C 88,315 90,305 95,300 Z" />
    <ellipse cx="108" cy="470" rx="26" ry="18" />
    <line x1="60" y1="430" x2="200" y2="430" stroke-dasharray="4 4" class="jp-map-divider" />
    <text x="60" y="448" class="jp-map-inset-label">沖縄県（別枠表示）</text>
  </g>
`;

/**
 * "../assets/images/<prefix>/<key>/<file>"という構成のフォルダから，
 * キー（都道府県キーや部屋キー等）ごとに画像URLの一覧を集計する関数．
 * ファイル名の並び順（import.meta.globの結果はパス文字列順）で返るため，
 * "YYYY-MM-連番"のような命名規則にしておくと時系列順になる。
 * 学会行脚マップ・施設ページの部屋写真など，「フォルダに画像を追加するだけで
 * 反映される」仕組みを共有する箇所すべてから使う。
 * 引数:
 *   prefix (string): "conference-map"や"facility"等，assets/images直下のフォルダ名。
 * 戻り値:
 *   Object<string, string[]>: キーごとの画像URL配列。
 */
function groupImagesByFolder(prefix) {
  const grouped = {};
  const pattern = new RegExp(`\\.\\./assets/images/${prefix}/([^/]+)/`);
  Object.keys(imageAssets)
    .sort()
    .forEach((path) => {
      const match = path.match(pattern);
      if (!match) return;
      const key = match[1];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(imageAssets[path]);
    });
  return grouped;
}

/**
 * 学会行脚マップ（.jp-map[data-source="conference-map"]）を描画する関数．
 * src/data/prefectures.jsの47都道府県それぞれに，
 * src/assets/images/conference-map/<都道府県キー>/ 以下の画像を対応付け，
 * クリックするとその都道府県の写真をポップアップ表示するマーカーをSVGへ配置する。
 * 該当要素がないページでは何もしない。
 * 引数: なし．
 * 戻り値: なし．
 */
function renderConferenceMap() {
  const svg = document.querySelector('.jp-map[data-source="conference-map"]');
  if (!svg) return;

  const imagesByPrefecture = groupImagesByFolder("conference-map");

  const markers = PREFECTURES.map((pref) => {
    const images = imagesByPrefecture[pref.key] ?? [];
    const hasImages = images.length > 0;
    return `
      <g class="jp-map-marker${hasImages ? " has-photos" : ""}" data-pref-key="${escapeHtml(pref.key)}" tabindex="0" role="button" aria-label="${escapeHtml(pref.name)}${hasImages ? `（写真${images.length}枚）` : "（写真未登録）"}">
        <circle class="jp-map-marker-hit" cx="${pref.x}" cy="${pref.y}" r="12"></circle>
        <circle cx="${pref.x}" cy="${pref.y}" r="7"></circle>
        <title>${escapeHtml(pref.name)}</title>
      </g>
    `;
  }).join("");

  svg.innerHTML = JP_MAP_BACKGROUND + markers;

  svg.querySelectorAll(".jp-map-marker").forEach((marker) => {
    const key = marker.getAttribute("data-pref-key");
    const pref = PREFECTURES.find((p) => p.key === key);
    const openHandler = () => {
      const images = (imagesByPrefecture[key] ?? []).map((url) => ({ url, alt: `${pref.name}の写真` }));
      openMediaModal({
        eyebrow: "Conference Map",
        title: `${pref.name}`,
        bodyLines: images.length > 0
          ? []
          : ["この都道府県の写真はまだ登録されていません．", `src/assets/images/conference-map/${key}/ に画像ファイルを追加すると，ここに表示されます．`],
        images,
      });
    };
    marker.addEventListener("click", openHandler);
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openHandler();
      }
    });
  });
}

/**
 * 施設ページの各部屋を縦に並べて描画する関数（.facility-room-list[data-source="facility-rooms"]）．
 * src/data/facility-rooms.jsで定義した部屋ごとに，
 * src/assets/images/facility/<部屋キー>/ 以下の画像を対応付ける。
 * 学会行脚マップと同様，フォルダに画像を追加するだけで反映される仕組みとし，
 * 1つの部屋に複数枚の写真がある場合は一定時間おきに自動で切り替える。
 * 該当要素がないページでは何もしない。
 * 引数: なし．
 * 戻り値: なし．
 */
function renderFacilityRooms() {
  const list = document.querySelector('.facility-room-list[data-source="facility-rooms"]');
  if (!list) return;

  const imagesByRoom = groupImagesByFolder("facility");

  list.innerHTML = FACILITY_ROOMS.map((room) => {
    const images = (imagesByRoom[room.key] ?? []).map((url) => ({ url, alt: `${room.name}の様子` }));
    const photo = images.length > 0
      ? `<div class="card-img facility-room-photo" data-room-key="${escapeHtml(room.key)}">${buildMiniCarouselHtml(images)}</div>`
      : `<div class="card-img facility-room-photo-empty" aria-hidden="true">写真準備中</div>`;
    return `
      <div class="info-card facility-room-card">
        ${photo}
        <div class="card-body">
          <p class="card-tag">${escapeHtml(room.caption)}</p>
          <h3>${escapeHtml(room.name)}</h3>
          <p>${escapeHtml(room.description)}</p>
        </div>
      </div>
    `;
  }).join("");

  list.querySelectorAll(".facility-room-photo[data-room-key]").forEach((wrapper) => {
    const key = wrapper.getAttribute("data-room-key");
    const room = FACILITY_ROOMS.find((r) => r.key === key);
    const images = (imagesByRoom[key] ?? []).map((url) => ({ url, alt: `${room.name}の様子` }));
    const carousel = wrapper.querySelector(".mini-carousel");
    wireMiniCarousel(carousel, {
      intervalMs: 5000,
      onOpen: (startIndex) => {
        openMediaModal({
          eyebrow: room.caption,
          title: room.name,
          bodyLines: [],
          images,
          startIndex,
        });
      },
    });
  });
}

/** モーダル内の画像カルーセルの現在の表示位置を保持する状態。 */
const mediaModalState = {
  images: [],
  currentIndex: 0,
};

/**
 * 汎用ポップアップ（モーダル）のDOMを1つだけ生成し，documentに追加する関数．
 * ニュース詳細・学会行脚マップの都道府県写真の両方で共有して使う。
 * 2回目以降の呼び出しでは既存の要素を返す。
 * 引数: なし．
 * 戻り値:
 *   HTMLElement: モーダルのオーバーレイ要素。
 */
function ensureMediaModal() {
  let overlay = document.querySelector(".media-modal-overlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.className = "media-modal-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="media-modal" role="dialog" aria-modal="true" aria-labelledby="media-modal-title">
      <button type="button" class="media-modal-close" aria-label="閉じる">×</button>
      <div class="media-modal-carousel" hidden>
        <div class="media-modal-carousel-viewport">
          <div class="media-modal-carousel-track"></div>
        </div>
        <button type="button" class="media-modal-carousel-btn media-modal-carousel-prev" aria-label="前の画像">‹</button>
        <button type="button" class="media-modal-carousel-btn media-modal-carousel-next" aria-label="次の画像">›</button>
        <p class="media-modal-carousel-count"></p>
      </div>
      <div class="media-modal-body">
        <p class="media-modal-eyebrow"></p>
        <h2 id="media-modal-title" class="media-modal-title"></h2>
        <p class="media-modal-meta"></p>
        <div class="media-modal-text"></div>
        <ol class="media-modal-references"></ol>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector(".media-modal-close").addEventListener("click", closeMediaModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMediaModal();
  });
  overlay.querySelector(".media-modal-carousel-prev").addEventListener("click", () => stepMediaModalCarousel(-1));
  overlay.querySelector(".media-modal-carousel-next").addEventListener("click", () => stepMediaModalCarousel(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) closeMediaModal();
    if (!overlay.hidden && event.key === "ArrowLeft") stepMediaModalCarousel(-1);
    if (!overlay.hidden && event.key === "ArrowRight") stepMediaModalCarousel(1);
  });

  return overlay;
}

/**
 * モーダル内の画像カルーセルを，指定した相対量だけ進める（または戻す）関数．
 * 画像が1枚以下の場合は何もしない。track内の全画像はすでにDOM上に
 * 並んでいるため，画像の差し替えは発生せず，CSS transitionによって
 * 表示位置がスムーズに横移動する。
 * 引数:
 *   delta (number): 進める枚数（-1で前へ，+1で次へ）。
 * 戻り値: なし．
 */
function stepMediaModalCarousel(delta) {
  if (mediaModalState.images.length <= 1) return;
  const count = mediaModalState.images.length;
  mediaModalState.currentIndex = (mediaModalState.currentIndex + delta + count) % count;
  renderMediaModalCarouselFrame();
}

/**
 * モーダル内の画像カルーセルの現在の表示位置（カウンタ表示）を更新する関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function renderMediaModalCarouselFrame() {
  const overlay = ensureMediaModal();
  const track = overlay.querySelector(".media-modal-carousel-track");
  const count = overlay.querySelector(".media-modal-carousel-count");
  track.style.transform = `translateX(-${mediaModalState.currentIndex * 100}%)`;
  count.textContent = mediaModalState.images.length > 1
    ? `${mediaModalState.currentIndex + 1} / ${mediaModalState.images.length}`
    : "";
}

/**
 * ポップアップ（モーダル）を，指定した内容で開く関数．
 * ニュース詳細（日付・タイトル・本文・画像）と，学会行脚マップの
 * 都道府県別写真（都道府県名・案内文・画像）の両方から共通して呼び出される。
 * 引数:
 *   options (object):
 *     eyebrow (string): タイトル上に小さく表示するラベル（日付やカテゴリ名）。
 *     title (string): 見出し。
 *     meta (string | undefined): 開催日・参加人数等，タイトル直下に1行で表示する補足情報。
 *     bodyLines (Array<string>): 本文の各行（空行は無視される）。
 *     referenceLines (Array<string> | undefined): 文献情報。1件ずつ番号付きリストで表示する。
 *     images (Array<{url: string, alt: string}>): 表示する画像一覧。
 *     startIndex (number | undefined): 最初に表示する画像のインデックス
 *       （ミニカルーセルをタップして開いた場合，タップ時点で表示していた
 *       画像から一覧を開始するために使う）。省略時は0。
 * 戻り値: なし．
 */
function openMediaModal({ eyebrow, title, meta, bodyLines, referenceLines, images, startIndex }) {
  const overlay = ensureMediaModal();

  overlay.querySelector(".media-modal-eyebrow").textContent = eyebrow ?? "";
  overlay.querySelector(".media-modal-title").textContent = title ?? "";

  const metaEl = overlay.querySelector(".media-modal-meta");
  metaEl.textContent = meta ?? "";
  metaEl.hidden = !meta;

  const bodyParagraphs = (bodyLines ?? [])
    .filter((line) => (line ?? "").trim().length > 0)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  overlay.querySelector(".media-modal-text").innerHTML = bodyParagraphs;

  const referencesEl = overlay.querySelector(".media-modal-references");
  const references = (referenceLines ?? []).filter((line) => (line ?? "").trim().length > 0);
  if (references.length > 0) {
    referencesEl.innerHTML = references.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
    referencesEl.hidden = false;
  } else {
    referencesEl.innerHTML = "";
    referencesEl.hidden = true;
  }

  const resolvedImages = (images ?? []).filter((image) => Boolean(image.url));

  const carousel = overlay.querySelector(".media-modal-carousel");
  const track = overlay.querySelector(".media-modal-carousel-track");
  const prevBtn = overlay.querySelector(".media-modal-carousel-prev");
  const nextBtn = overlay.querySelector(".media-modal-carousel-next");
  if (resolvedImages.length > 0) {
    mediaModalState.images = resolvedImages;
    mediaModalState.currentIndex = Math.min(Math.max(startIndex ?? 0, 0), resolvedImages.length - 1);
    track.innerHTML = resolvedImages
      .map((image) => `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt || "")}" referrerpolicy="no-referrer">`)
      .join("");
    carousel.hidden = false;
    const multiple = resolvedImages.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
    renderMediaModalCarouselFrame();
  } else {
    mediaModalState.images = [];
    track.innerHTML = "";
    carousel.hidden = true;
  }

  overlay.hidden = false;
  document.body.classList.add("media-modal-open");
  overlay.querySelector(".media-modal-close").focus();
}

/**
 * ポップアップ（モーダル）を閉じる関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function closeMediaModal() {
  const overlay = document.querySelector(".media-modal-overlay");
  if (!overlay) return;
  overlay.hidden = true;
  document.body.classList.remove("media-modal-open");
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
  renderConferenceMap();
  renderFacilityRooms();
  initTabs();
  initAccordions();
  initIframeHeightReporter();
});
