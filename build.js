/**
 * build.js
 * pages/配下の各ページを走査し、<link rel="stylesheet">と<script src="...">を
 * 対応するファイルの中身でインライン展開したうえで、dist/に1ページ1ファイルずつ出力する。
 * Node.js標準モジュール（fs, path）のみで動作し、npm installは不要。
 *
 * 実行方法: node build.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const PAGES_DIR = path.join(ROOT_DIR, "pages");
const DIST_DIR = path.join(ROOT_DIR, "dist");

const LINK_STYLESHEET_PATTERN = /<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/g;
const SCRIPT_SRC_PATTERN = /<script\s+src="([^"]+)"><\/script>/g;

/**
 * 指定したページのHTMLディレクトリを起点に、相対パスで参照されているファイルの中身を読み込む関数．
 * 引数:
 *   pageDir (string): pages/配下の対象ページディレクトリの絶対パス．
 *   relativeHref (string): HTML内でhref/srcに指定された相対パス．
 * 戻り値:
 *   string: 参照先ファイルの中身（UTF-8テキスト）．
 */
function readReferencedFile(pageDir, relativeHref) {
  const resolvedPath = path.join(pageDir, relativeHref);
  return fs.readFileSync(resolvedPath, "utf8");
}

/**
 * ページHTML中の<link rel="stylesheet">タグを<style>タグへインライン展開する関数．
 * 引数:
 *   html (string): 展開前のページHTML．
 *   pageDir (string): このページのディレクトリの絶対パス．
 * 戻り値:
 *   string: <style>タグへ置換した後のHTML．
 */
function inlineStylesheets(html, pageDir) {
  return html.replace(LINK_STYLESHEET_PATTERN, (_match, href) => {
    const cssContent = readReferencedFile(pageDir, href);
    return `<style>\n${cssContent}\n</style>`;
  });
}

/**
 * ページHTML中の<script src="...">タグを<script>タグへインライン展開する関数．
 * 引数:
 *   html (string): 展開前のページHTML．
 *   pageDir (string): このページのディレクトリの絶対パス．
 * 戻り値:
 *   string: <script>タグへ置換した後のHTML．
 */
function inlineScripts(html, pageDir) {
  return html.replace(SCRIPT_SRC_PATTERN, (_match, src) => {
    const jsContent = readReferencedFile(pageDir, src);
    return `<script>\n${jsContent}\n</script>`;
  });
}

/**
 * pages/配下の1ページ分をビルドし、dist/へ書き出す関数．
 * 引数:
 *   pageName (string): pages/配下のディレクトリ名（出力ファイル名にも使用）．
 * 戻り値:
 *   なし．
 */
function buildPage(pageName) {
  const pageDir = path.join(PAGES_DIR, pageName);
  const sourcePath = path.join(pageDir, "index.html");
  const rawHtml = fs.readFileSync(sourcePath, "utf8");

  const withStyles = inlineStylesheets(rawHtml, pageDir);
  const withScripts = inlineScripts(withStyles, pageDir);

  const outputPath = path.join(DIST_DIR, `${pageName}.html`);
  fs.writeFileSync(outputPath, withScripts, "utf8");
  console.log(`出力しました: dist/${pageName}.html`);
}

/**
 * pages/配下の全ページをビルドするエントリポイント関数．
 * 引数: なし．
 * 戻り値: なし．
 */
function main() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const pageNames = fs
    .readdirSync(PAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  pageNames.forEach(buildPage);

  console.log(`\n合計 ${pageNames.length} ページをdist/へ出力しました。`);
}

main();
