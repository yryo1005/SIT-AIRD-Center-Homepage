/**
 * src/pages/ 配下の各ページ（index.html）内の内部リンク（data-link属性を持つ<a>タグ）のhref・targetを，
 * 指定したリンクモード（"github-pages" または "cms"）に応じて一括書き換えるスクリプト．
 *
 * 各内部リンクの<a>タグには、あらかじめ data-link="<key>" （ページ内アンカーの場合は
 * data-link="<key>" data-hash="<hash>"）を付与しておく。このスクリプトはdata-link/data-hash
 * だけを頼りにhref・targetを再計算するため、実行するたびに常に正しい状態に揃う
 * （＝data-linkが単一の情報源）。data-linkを持たない外部リンク（教員プロフィール，
 * 公式お問い合わせページ等）は書き換えない。
 *
 * 実行方法:
 *   node scripts/set-link-mode.js github-pages   … GitHub Pages単独表示を前提にする（既定）
 *   node scripts/set-link-mode.js cms            … ArtisCMS3のiframe埋め込みを前提にする
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PAGES, LINK_MODES, resolveInternalLink } from "../site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");

const mode = process.argv[2];
if (!LINK_MODES.includes(mode)) {
  console.error(`引数にリンクモードを指定してください: ${LINK_MODES.join(" または ")}`);
  process.exit(1);
}

/**
 * 1つの<a ...>タグ文字列を受け取り，data-link/data-hash属性から算出したhref・targetで
 * href属性とtarget属性を置き換える関数．data-link属性を持たないタグはそのまま返す．
 * 引数:
 *   tag (string): 正規表現でマッチした<a ...>の開始タグ全体．
 * 戻り値:
 *   string: 書き換え後の開始タグ文字列．
 */
function rewriteTag(tag) {
  const linkMatch = tag.match(/data-link="([^"]+)"/);
  if (!linkMatch) return tag;
  const key = linkMatch[1];
  const hashMatch = tag.match(/data-hash="([^"]+)"/);
  const hash = hashMatch ? hashMatch[1] : undefined;

  const { href, target } = resolveInternalLink({ key, hash }, mode);

  let next = tag.replace(/href="[^"]*"/, `href="${href}"`);
  if (target) {
    if (/target="[^"]*"/.test(next)) {
      next = next.replace(/target="[^"]*"/, `target="${target}"`);
    } else {
      next = next.replace(/^<a /, `<a target="${target}" `);
    }
  } else {
    next = next.replace(/\s+target="[^"]*"/, "");
  }
  return next;
}

/**
 * 1ファイル分のHTML文字列内の全<a ...>開始タグに対してrewriteTagを適用する関数．
 * 引数:
 *   html (string): ページ全体のHTML文字列．
 * 戻り値:
 *   string: 書き換え後のHTML文字列．
 */
function rewriteHtml(html) {
  return html.replace(/<a\s[^>]*>/g, rewriteTag);
}

let changedFiles = 0;
for (const page of PAGES) {
  const filePath = resolve(ROOT_DIR, page.srcPath);
  const original = readFileSync(filePath, "utf8");
  const updated = rewriteHtml(original);
  if (updated !== original) {
    writeFileSync(filePath, updated, "utf8");
    changedFiles += 1;
    console.log(`更新しました: ${page.srcPath}`);
  }
}

console.log(`\nリンクモードを "${mode}" に設定しました（${changedFiles}ファイルを更新）。`);
