# AI R&D Center Webサイト（ArtisCMS3埋め込みHTML用）

湘南工科大学 情報学部 AI R&D Centerの紹介ページを、ArtisCMS3の「埋め込みHTML」機能に貼り付けて公開するための静的HTML/CSS/JSプロジェクトです。

## フォルダ構成

```
project/
├── shared/
│   ├── style.css     ← 全ページ共通スタイル
│   └── script.js     ← 全ページ共通スクリプト（ナビ開閉・スクロール進捗バー・ニュースティッカー・タブ・アコーディオン）
├── pages/
│   ├── top/index.html
│   ├── news/index.html
│   ├── facility/index.html
│   ├── basic-research/index.html
│   ├── embedded/index.html
│   ├── image/index.html
│   ├── nlp/index.html
│   └── reinforcement/index.html
├── build.js          ← pages/配下を走査し、shared/の中身を差し込んでdist/に1ページ1ファイルずつ出力
├── package.json
├── README.md
└── dist/
    ├── top.html
    ├── news.html
    ├── facility.html
    ├── basic-research.html
    ├── embedded.html
    ├── image.html
    ├── nlp.html
    └── reinforcement.html
```

各`pages/*/index.html`は、`<html>`や`<head>`を持たないHTMLフラグメントです。ArtisCMS3の「埋め込みHTML」欄に貼り付ける前提のため、ページ全体を構成するタグは含めていません。

## ビルド方法

Node.js標準機能のみで動作するため、`npm install`は不要です。

```bash
node build.js
```

実行すると、`pages/*/index.html`内の`<link rel="stylesheet" href="../../shared/style.css">`と`<script src="../../shared/script.js"></script>`が、それぞれ対応するファイルの中身で`<style>`・`<script>`タグとしてその場にインライン展開され、`dist/`配下に1ページ1ファイルとして出力されます。

出力された各HTMLファイルは、外部CDNやローカルファイルへの依存を一切持たない単一ファイルです。そのままArtisCMS3の「埋め込みHTML」欄に貼り付けて使用できます。

## ローカルでの確認方法

`dist/`配下のファイルはHTMLフラグメント（`<html>`/`<head>`/`<body>`を含まない）のため、ブラウザで直接ダブルクリックして開くのではなく、簡易HTTPサーバーで配信して確認してください（文字コードをUTF-8として正しく配信するため）。

```bash
# dist/ を配信するディレクトリとして起動
cd dist
python3 -m http.server 8000
```

ブラウザで以下のURLにアクセスして確認します。

- `http://localhost:8000/top.html`
- `http://localhost:8000/news.html`
- `http://localhost:8000/facility.html`
- `http://localhost:8000/basic-research.html`
- `http://localhost:8000/embedded.html`
- `http://localhost:8000/image.html`
- `http://localhost:8000/nlp.html`
- `http://localhost:8000/reinforcement.html`

Node.js標準の`http`モジュールで確認する場合は、以下のような簡易スクリプトでも配信できます（`Content-Type: text/html; charset=utf-8`を明示することで文字化けを防げます）。

```js
const http = require("http");
const fs = require("fs");
const path = require("path");
http.createServer((req, res) => {
  const p = path.join("dist", decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  });
}).listen(8000);
```

## ArtisCMS3側ページURLとの対応表（運用者が手動で記入）

| ローカルフォルダ名 / 出力ファイル名 | ArtisCMS3側の公開URL |
| :--- | :--- |
| `pages/top/` → `dist/top.html` | （未記入） |
| `pages/news/` → `dist/news.html` | （未記入） |
| `pages/facility/` → `dist/facility.html` | （未記入） |
| `pages/basic-research/` → `dist/basic-research.html` | （未記入） |
| `pages/embedded/` → `dist/embedded.html` | （未記入） |
| `pages/image/` → `dist/image.html` | （未記入） |
| `pages/nlp/` → `dist/nlp.html` | （未記入） |
| `pages/reinforcement/` → `dist/reinforcement.html` | （未記入） |

## 今回のスコープ外（次フェーズ以降で対応）

- PDF/PPTXなどのアップロードファイルからの情報・画像抽出
- GitHubリポジトリ化、GitHub Releaseを使った画像の外部ホスティング
- CSS/JSをjsDelivr等の外部CDNから読み込む方式への切り替え
- 画像のこのプロジェクト内でのホスティング（現在は湘南工科大学公式サイトの画像URLを絶対URLで参照）
