/**
 * site.config.js を単一の情報源として，以下を検証するスクリプト．
 *   1. cms-shells/*.html が site.config.js から生成される内容と一致しているか（手作業での書き換え・drift検出）
 *   2. README.md に記載されている公開URLの例が site.config.js の算出結果と一致しているか
 *   3. （--live 指定時）各ページのGitHub Pages公開URLが実際にHTTP 200を返すか
 *
 * 実行方法:
 *   node scripts/verify-cms-shells.js          … 1, 2 のみ検証（ネットワークアクセスなし）
 *   node scripts/verify-cms-shells.js --live    … 1, 2 に加えて 3 も検証
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PAGES, pageUrl } from "../site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");
const CHECK_LIVE = process.argv.includes("--live");

/**
 * scripts/generate-cms-shells.js と同じロジックでシェルHTMLを再現する関数．
 * generate側の実装を直接importすると副作用（ファイル書き込み）が走るため，
 * 検証専用にここで同じ内容を再構築する．
 * 引数:
 *   page (object): site.config.jsのPAGES配列の要素．
 * 戻り値:
 *   string: 期待されるcms-shells/{key}.htmlの内容．
 */
function expectedShell(page) {
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
 * cms-shells/*.html がsite.config.jsの内容と一致しているか検証する関数．
 * 引数: なし．
 * 戻り値:
 *   boolean: すべて一致していればtrue．
 */
function verifyShellFiles() {
  let ok = true;
  for (const page of PAGES) {
    const filePath = resolve(ROOT_DIR, "cms-shells", `${page.key}.html`);
    let actual;
    try {
      actual = readFileSync(filePath, "utf8");
    } catch (err) {
      console.error(`✗ cms-shells/${page.key}.html が存在しません`);
      ok = false;
      continue;
    }
    const expected = expectedShell(page);
    if (actual !== expected) {
      console.error(`✗ cms-shells/${page.key}.html が site.config.js の内容と一致しません（node scripts/generate-cms-shells.js を再実行してください）`);
      ok = false;
    } else {
      console.log(`✓ cms-shells/${page.key}.html は最新です`);
    }
  }
  return ok;
}

/**
 * README.md内に記載された公開URLの例が，site.config.jsの算出結果と一致しているか検証する関数．
 * 引数: なし．
 * 戻り値:
 *   boolean: PAGES全件のURLがREADME.md内に存在すればtrue．
 */
function verifyReadmeUrls() {
  const readme = readFileSync(resolve(ROOT_DIR, "README.md"), "utf8");
  let ok = true;
  for (const page of PAGES) {
    const url = pageUrl(page);
    if (!readme.includes(url)) {
      console.error(`✗ README.md に ${page.key} の公開URL（${url}）が見つかりません`);
      ok = false;
    } else {
      console.log(`✓ README.md に ${page.key} の公開URLが記載されています`);
    }
  }
  return ok;
}

/**
 * 各ページの公開URLへ実際にHTTPリクエストを送り，200が返るか検証する関数．
 * 引数: なし．
 * 戻り値:
 *   Promise<boolean>: 全ページが200を返せばtrue．
 */
async function verifyLiveUrls() {
  let ok = true;
  for (const page of PAGES) {
    const url = pageUrl(page);
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.status === 200) {
        console.log(`✓ ${page.key}: ${res.status} ${url}`);
      } else {
        console.error(`✗ ${page.key}: ${res.status} ${url}`);
        ok = false;
      }
    } catch (err) {
      console.error(`✗ ${page.key}: リクエスト失敗（${err.message}） ${url}`);
      ok = false;
    }
  }
  return ok;
}

/**
 * 検証全体のエントリポイント関数．
 * 引数: なし．
 * 戻り値: なし（検証に失敗した場合はprocess.exit(1)する）．
 */
async function main() {
  console.log("=== cms-shells/*.html の整合性検証 ===");
  const shellsOk = verifyShellFiles();

  console.log("\n=== README.md記載URLの整合性検証 ===");
  const readmeOk = verifyReadmeUrls();

  let liveOk = true;
  if (CHECK_LIVE) {
    console.log("\n=== GitHub Pages公開URLの疎通検証（--live） ===");
    liveOk = await verifyLiveUrls();
  } else {
    console.log("\n（--live を付けて実行すると，GitHub Pages公開URLの疎通確認も行います）");
  }

  if (!shellsOk || !readmeOk || !liveOk) {
    console.error("\n検証に失敗しました。");
    process.exit(1);
  }
  console.log("\nすべての検証に成功しました。");
}

main();
