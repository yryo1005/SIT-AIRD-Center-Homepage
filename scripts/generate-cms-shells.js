/**
 * site.config.js（単一の情報源）から，cms-shells/*.html を生成するスクリプト．
 * ベースURL・ページ一覧を手作業でファイルごとに書き換える必要をなくし，
 * "node scripts/generate-cms-shells.js" の実行だけで全ファイルを最新化できるようにする．
 *
 * 実行方法: node scripts/generate-cms-shells.js
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PAGES, pageUrl } from "../site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../cms-shells");

/**
 * 1ページ分のiframeシェルHTMLを生成する関数．
 * 引数:
 *   page (object): site.config.jsのPAGES配列の要素（key, srcPath, cmsPath, titleを持つ）．
 * 戻り値:
 *   string: cms-shells/{key}.html に書き出すHTML文字列．
 */
function renderShell(page) {
  const url = pageUrl(page);
  const iframeId = `ai-rd-center-iframe-${page.key}`;

  return `<!--
  ${page.title}埋め込み用iframeシェル
  このファイルは scripts/generate-cms-shells.js によって site.config.js から自動生成されています。
  手動で編集せず，site.config.js を修正したうえで "node scripts/generate-cms-shells.js" を再実行してください。

  ArtisCMS3の「埋め込みHTML」欄に、このファイルの中身をそのまま貼り付けてください。
  貼り付け先ページ： ${page.cmsPath}

  このファイルはUTF-8（BOMなし）で保存されています。貼り付け先のCMS編集画面の
  文字コード設定がUTF-8以外の場合、貼り付け後に文字化けする可能性があるため、
  貼り付け後に必ずプレビューで日本語表示を確認してください。
-->
<div class="ai-rd-center-embed">
  <iframe
    id="${iframeId}"
    src="${url}"
    title="${page.title}"
    style="width:100%;border:0;display:block;min-height:600px;"
    loading="lazy"
  ></iframe>
</div>
<script>
(function () {
  var iframe = document.getElementById("${iframeId}");
  if (!iframe) return;
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || data.type !== "ai-rd-center:height") return;
    if (typeof data.height === "number" && data.height > 0) {
      iframe.style.height = data.height + "px";
    }
  });
})();
</script>
`;
}

/**
 * PAGES全件についてcms-shells/{key}.htmlを書き出すエントリポイント関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const page of PAGES) {
    const outPath = resolve(OUT_DIR, `${page.key}.html`);
    writeFileSync(outPath, renderShell(page), "utf8");
    console.log(`生成しました: cms-shells/${page.key}.html -> ${pageUrl(page)}`);
  }
  console.log(`\n合計 ${PAGES.length} 件のcms-shellsを生成しました。`);
}

main();
