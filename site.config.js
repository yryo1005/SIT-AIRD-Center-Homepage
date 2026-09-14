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
    title: "AI R&D Center 基礎研究",
  },
  {
    key: "embedded",
    srcPath: "src/pages/embedded/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/embedded/",
    title: "AI R&D Center 組込AI",
  },
  {
    key: "image",
    srcPath: "src/pages/image/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/image/",
    title: "AI R&D Center 画像処理",
  },
  {
    key: "nlp",
    srcPath: "src/pages/nlp/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/nlp/",
    title: "AI R&D Center NLP",
  },
  {
    key: "reinforcement",
    srcPath: "src/pages/reinforcement/index.html",
    cmsPath: "/faculties/research-center/ai_rd_center/reinforcement/",
    title: "AI R&D Center 強化学習",
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
