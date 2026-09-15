/**
 * サイト全体で共有する設定の単一情報源（Single Source of Truth）．
 *
 * GitHub PagesのベースURL（リポジトリ名を含むパス）は，
 *   - vite.config.js の build.base
 *   - cms-shells/*.html 内のiframe src
 *   - README.md に記載する公開URLの例
 * の3箇所で一致していなければならない．この3箇所がそれぞれ個別に
 * ハードコードされていると，どれか1つだけ更新して食い違う事故が起きる．
 * そのため，ベースURLとページ一覧をこのファイルにのみ定義し，
 * vite.config.js と scripts/generate-cms-shells.js の両方がここから読み込む．
 */

/** リポジトリ名（GitHub Pagesのプロジェクトサイトとして公開されるパスの一部になる） */
export const REPO_NAME = "SIT-AIRD-Center-Homepage";

/** GitHub Pagesのオリジン（ユーザー名.github.io） */
export const GITHUB_PAGES_ORIGIN = "https://yryo1005.github.io";

/** Viteのbase設定・GitHub Pages URLの両方で使うベースパス（先頭と末尾に "/" を含む） */
export const BASE_PATH = `/${REPO_NAME}/`;

/** GitHub Pages上の公開ベースURL（例: https://yryo1005.github.io/SIT-AIRD-Center-Homepage/） */
export const SITE_BASE_URL = `${GITHUB_PAGES_ORIGIN}${BASE_PATH}`;

/**
 * 各ページの定義．
 *   key       : vite.config.jsのrollupOptions.inputのキー，およびcms-shells/のファイル名に使う識別子
 *   srcPath   : プロジェクトルートからの相対パス（このパスがそのままdist/以下の出力パスにもなる）
 *   cmsPath   : ArtisCMS3側でこのページを公開する想定のURLパス
 *   title     : iframeのtitle属性・生成コメントに使う日本語名
 */
export const PAGES = [
  {
    key: "top",
    srcPath: "src/pages/top/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/",
    title: "AI R&D Center トップページ",
  },
  {
    key: "news",
    srcPath: "src/pages/news/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/news/",
    title: "AI R&D Center ニュース",
  },
  {
    key: "facility",
    srcPath: "src/pages/facility/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/facility/",
    title: "AI R&D Center 施設",
  },
  {
    key: "basic-research",
    srcPath: "src/pages/basic-research/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/basick_reserch/",
    title: "AI R&D Center 研究内容",
  },
  {
    key: "conference-map",
    srcPath: "src/pages/conference-map/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/conference-map/",
    title: "AI R&D Center 学会行脚マップ",
  },
  {
    key: "join",
    srcPath: "src/pages/join/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/join/",
    title: "AI R&D Center 在学生の方へ",
  },
  {
    key: "for-highschool",
    srcPath: "src/pages/for-highschool/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/for-highschool/",
    title: "AI R&D Center 高校生の方へ",
  },
];

/**
 * ページ定義から，GitHub Pages上の公開URL（フルURL）を算出する関数．
 * Viteはエントリの出力パスとしてプロジェクトルートからの相対パスをそのまま使うため，
 * "SITE_BASE_URL + srcPath" が実際の公開URLと一致する（vite.config.jsのbaseと連動）．
 * 引数:
 *   page (object): PAGES配列の要素（srcPathを持つオブジェクト）．
 * 戻り値:
 *   string: GitHub Pages上のフルURL．
 */
export function pageUrl(page) {
  return `${SITE_BASE_URL}${page.srcPath}`;
}

/**
 * ページ間の内部リンク（ヘッダー・フッターのナビゲーション等）をどちらの前提で
 * 生成するかを切り替えるためのモード定義．
 *
 *   "github-pages" : GitHub Pages上で単独ページとして直接開く前提．
 *                     ページ同士は兄弟ディレクトリ（src/pages/<key>/index.html）なので，
 *                     "../<key>/index.html" 形式のルート相対でないパスで自己完結する．
 *                     target="_top" は付与しない（iframeに入っていないため不要）．
 *   "cms"          : ArtisCMS3の埋め込みHTML（iframe）内で表示される前提．
 *                     大学ドメインの絶対パス（cmsPath）を使い，iframeを飛び出すために
 *                     target="_top" を付与する．
 *
 * 現在このリポジトリのsrc/pages/ 配下の各ページは "github-pages" モードで書かれている
 * （デバッグをGitHub Pages上で直接行う方針のため）。CMSへ埋め込む段階になったら，
 * `node scripts/set-link-mode.js cms` を実行してこの前提に一括で切り替えられる。
 * 逆に `node scripts/set-link-mode.js github-pages` で今の状態に戻せる。
 */
export const LINK_MODES = ["github-pages", "cms"];

/**
 * 内部リンク1件分（トップページのセクションアンカーを含む）の定義．
 * key       : リンク先のPAGES上のkey
 * hash      : ページ内アンカーへのリンクの場合のみ指定（例: "faculty"）
 */
export const INTERNAL_LINKS = [
  ...PAGES.map((p) => ({ key: p.key })),
];

/**
 * 内部リンク1件について，指定したモードでのhref・target属性を算出する関数．
 * 引数:
 *   link (object): { key, hash? } の形（INTERNAL_LINKSの要素，またはそれと同じ形のオブジェクト）．
 *   mode (string): "github-pages" または "cms"．
 * 戻り値:
 *   { href: string, target: string | null }
 */
export function resolveInternalLink(link, mode) {
  const page = PAGES.find((p) => p.key === link.key);
  if (!page) {
    throw new Error(`未知のページkeyです: ${link.key}`);
  }
  const hashSuffix = link.hash ? `#${link.hash}` : "";

  if (mode === "cms") {
    return { href: `${page.cmsPath}${hashSuffix}`, target: "_top" };
  }
  if (mode === "github-pages") {
    return { href: `../${page.key}/index.html${hashSuffix}`, target: null };
  }
  throw new Error(`未知のLINK_MODEです: ${mode}（"github-pages" または "cms" を指定してください）`);
}
