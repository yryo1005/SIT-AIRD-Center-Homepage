# AI R&D Center Webサイト（Vite + GitHub Pages + ArtisCMS3 iframe埋め込み）

湘南工科大学 情報学部 AI R&D Centerの紹介ページのソースです。本体（HTML/CSS/JS）はGitHub Pagesでホストし、大学のCMS（ArtisCMS3）側の各ページには、そのGitHub Pagesの該当ページを表示する`iframe`だけを貼り付けます。以降は`main`ブランチへのpushだけでサイト全体が更新されます。

デザインは白背景＋青アクセントのライトテーマで、見出しにFraunces（セリフ体）、本文にInter（サンセリフ）、日付・ラベル・数値にIBM Plex Mono（等幅）を使用しています。現在は**GitHub Pages上で単独ページとして直接デバッグする運用**を前提にしており（`site.config.js`の`LINK_MODES`を参照）、ArtisCMS3のiframeへの実際の貼り付け作業は次フェーズで行います。

## ニュースを追加・編集する方法（HTML/JavaScriptの知識がなくてもできます）

ニュースの内容は`src/pages/news/index.html`に直接書かれているのではなく、**`src/data/news/`フォルダの中にある，ニュース1件＝1つのJSONファイル**として保存されています。新しいニュースを追加したいときは，このフォルダに新しいファイルを1つ追加するだけで済みます（既存のファイルを編集する必要はありません）。ページの見た目（デザイン）とニュースの中身（データ）が分かれているため，ファイルを追加・編集するだけで，ニュース一覧ページ（一覧・クリック時のポップアップ）とトップページの写真スライダーの両方に自動で反映されます。

### 1. ファイルの場所と1件あたりの構成

`src/data/news/`フォルダの中に，`2026-06-16-gakuryoku-yushu.json`のような名前のファイルが1つのニュースに対応しています。ファイル名は日付が分かればどんな名前でも構いません（他のファイルと重複しない名前にしてください）。

1件のファイルの中身は，次の4項目だけを持つシンプルな形です。

```json
{
  "date": "2026-06-16",
  "title": "AI Centerのメンバー5人が学力優秀賞に選ばれました",
  "body": "2026年5月27日の学生表彰式にて、AI R&D Center所属のメンバー5名が「学力優秀賞」を受賞しました。日頃の学業と研究活動の両立が評価されての受賞です。",
  "images": [
    { "src": "news/S__41484329.jpg", "alt": "学力優秀賞の受賞式の様子" }
  ]
}
```

複数の発表がある場合は，`body`の中で`\n`（改行）を使って発表ごとに行を分けます。ポップアップ表示では，行ごとに別の段落として表示されます。

```json
{
  "date": "2026-03-14",
  "title": "AI Centerのメンバー2人が2026年電子情報通信学会総合大会に参加しました",
  "body": "2026年電子情報通信学会総合大会にて、AI R&D Centerのメンバー2名が研究発表をおこないました。\n・土屋琴夢ら「適応的慣性項を用いた3次正則化ニュートン法に関する研究」\n・山富龍ら「ニューラルネットワークによる大喜利の面白さ判定」",
  "images": [
    { "src": "news/S__26222595_0.jpg", "alt": "発表の様子1" },
    { "src": "news/S__26222596_0.jpg", "alt": "発表の様子2" }
  ]
}
```

各項目の意味は次のとおりです。

| 項目名 | 内容 | 必須 |
| :--- | :--- | :--- |
| `date` | 日付。必ず`"2026-06-16"`のように`"西暦-月-日"`（2桁ずつ）の形で書く | 必須 |
| `title` | ニュースの見出し | 必須 |
| `body` | ニュースの本文。発表名・発表者名・学会名などをできるだけ具体的に書く。複数の発表がある場合は`\n`で行を分ける | 必須 |
| `images` | 画像の配列。`src`（`src/assets/images/news/`からの相対パス）と`alt`（画像の説明文）を持つオブジェクトを，画像の枚数だけ並べる。画像が無い場合は空配列`[]`にする | 必須（無ければ`[]`） |

**新しいニュースのファイルをどこに追加しても、日付が新しい順に自動で並び替えて表示されます。**

画像を追加したい場合は，画像ファイル（jpg/jpeg/png等）を`src/assets/images/news/`フォルダにコピーしてから，`images`配列にファイル名を含む相対パス（例：`"news/2026autumn_opencampus.jpg"`）を追加してください。1件のニュースに複数枚の画像がある場合は，ニュース詳細のポップアップ内で矢印ボタンによる画像スライド（カルーセル）として表示されます。サイト全体の画像は，著作権・肖像権への配慮のため，このリポジトリ内に保存したものだけを使う方針にしています（外部サイトの画像URLを直接指定する運用はしていません）。

### 2. 1件追加する具体例（コピペで使えます）

例えば「2026年10月1日に、メンバーがオープンキャンパスでAIデモを展示した」というニュースを追加したい場合，`src/data/news/2026-10-01-open-campus.json`のような新しいファイルを作成し，以下の内容を貼り付けます。

```json
{
  "date": "2026-10-01",
  "title": "AI Centerのメンバーがオープンキャンパスでデモ展示をおこないました",
  "body": "来場した高校生にAIを使ったデモを紹介しました。",
  "images": []
}
```

保存後は，`{`と`}`の対応，`"`の付け忘れがないかを確認してください。不安な場合は，[jsonlint.com](https://jsonlint.com/)のようなJSON検証サイトに貼り付けて，エラーが出ないか確認すると安全です。

### 3. 保存して公開する

ファイルを保存し、`git add`・`git commit`・`git push`（またはGitHubのWeb画面上で直接コミット）すると、`main`ブランチへのpushをきっかけに`.github/workflows/deploy.yml`のGitHub Actionsが自動的に動き、数分でGitHub Pages上のサイトに反映されます。ArtisCMS3側の設定やHTML/JavaScriptのコードは一切触る必要はありません。

### 4. 動作の仕組み（参考）

`src/shared/script.js`が`import.meta.glob`で`src/data/news/`以下の全JSONファイルを読み込み、ニュース一覧ページの全件一覧（クリックすると本文・画像をポップアップ表示）と、トップページ・ニュースページの写真スライダーの両方を、ページ読み込み時にJavaScriptで自動描画しています。件数表示（「全21件」の21の部分）も、読み込んだファイルの件数から自動的に計算されるため、手で書き換える必要はありません。

## 配信アーキテクチャ

```
ローカルで src/ を編集
   ↓ git push
GitHub Actions が自動でビルド → GitHub Pagesへ自動デプロイ
   ↓
ArtisCMS3側の各ページ（最初の1回だけ設定）は、対応するGitHub Pagesの
URLを表示するだけのiframeシェル（cms-shells/配下）を持っている
   ↓
以降はpushするだけで、CMS側は一切触らずに全ページが更新される
```

- CMSのiframeに埋め込んだ状態では、ページ内リンクはすべて`target="_top"`付きのルート相対パス（大学ドメインの絶対パス）であり、クリックするとiframeを飛び出してCMS側の実URLへ遷移します。この形は`node scripts/set-link-mode.js cms`で生成します（詳細は「内部リンクのモード切り替え」を参照）。
- `src/shared/script.js`が`ResizeObserver`で本文の高さを検知し、`window.parent.postMessage({ type: "ai-rd-center:height", height }, "*")`で親ウィンドウへ通知します。`cms-shells/`側のスクリプトがこれを受信し、iframeの高さを自動調整します。
- iframeの中身は検索エンジンに正しく評価されない可能性があります。ArtisCMS3側の通常の編集エリアにも1〜2文程度の実テキストを直接入力しておくことを推奨します（**これは運用者が手動で行う作業であり、本リポジトリの実装対象ではありません**）。

## フォルダ構成

```
project/
├── src/
│   ├── shared/
│   │   ├── style.css     ← 全ページ共通スタイル（白＋青のライトテーマ）
│   │   └── script.js     ← 共通スクリプト（ナビ開閉・進捗バー・ニュース描画・タブ・アコーディオン・iframe高さ通知）
│   ├── data/
│   │   └── news/          ← ニュースのデータ（1件＝1つのJSONファイル。HTML/JSの知識なしで編集可能。後述）
│   ├── assets/images/    ← ガイダンス資料等から抽出した教員写真・施設写真
│   └── pages/
│       ├── top/index.html
│       ├── news/index.html
│       ├── facility/index.html
│       ├── basic-research/index.html
│       ├── embedded/index.html
│       ├── image/index.html
│       ├── nlp/index.html
├── cms-shells/            ← ArtisCMS3の「埋め込みHTML」欄に貼るページごとの短いiframeシェル
│   ├── top.html
│   ├── news.html
│   ├── facility.html
│   ├── basic-research.html
│   ├── embedded.html
│   ├── image.html
│   ├── nlp.html
├── scripts/
│   ├── generate-cms-shells.js   ← site.config.jsからcms-shells/*.htmlを生成
│   ├── verify-cms-shells.js     ← cms-shells/README.mdとsite.config.jsの整合性・公開URLの疎通を検証
│   └── set-link-mode.js         ← 内部リンクをgithub-pages/cmsモード間で一括切り替え
├── site.config.js         ← GitHub PagesのベースURL・ページ一覧の単一情報源（後述）
├── index.html             ← ローカル確認専用の開発用インデックス（CMS/本番公開対象ではない）
├── .github/workflows/deploy.yml   ← pushでビルドしGitHub Pagesへ自動デプロイ
├── package.json
├── vite.config.js
└── README.md
```

各`src/pages/*/index.html`は、`<meta charset="UTF-8">`を`<head>`の先頭に持つ完全なHTMLドキュメントです。全ソースファイル（.html/.css/.js/.md）はBOMなしUTF-8で保存されています。

## ベースURLの単一管理（site.config.js）

GitHub PagesのベースURL（リポジトリ名を含むパス）は、`vite.config.js`の`base`設定・`cms-shells/*.html`のiframe `src`・README.md内の公開URLの例という3箇所で必ず一致していなければなりません。これを個々のファイルへ手作業で書き込むと、どれか1箇所だけ更新して食い違う事故が起きるため、`site.config.js`を唯一の情報源とし、他はすべてそこから導出します。

- `vite.config.js`は`site.config.js`の`BASE_PATH`・`PAGES`を直接importし、`base`とビルドエントリ（`rollupOptions.input`）を構築します。
- `cms-shells/*.html`は`site.config.js`から次のコマンドで生成します。手動で編集しないでください。

```bash
npm run generate:cms-shells
```

- 生成物とREADME記載URLがsite.config.jsと食い違っていないか、以下のコマンドで検証できます（ネットワークアクセスなし）。

```bash
npm run verify:cms-shells
```

- 加えて、GitHub Pages上の公開URLが実際にHTTP 200を返すかも検証する場合は次を使用します（ネットワークアクセスあり）。

```bash
npm run verify:cms-shells:live
```

`site.config.js`の`PAGES`にページを追加・変更した場合は、`npm run generate:cms-shells`を再実行してから`npm run verify:cms-shells:live`で最終確認してください。

## 内部リンクのモード切り替え（github-pages ⇔ cms）

ヘッダー・フッターのナビゲーションなど、サイト内の各ページを相互にリンクする`<a>`タグは、`data-link="<ページkey>"`（ページ内アンカーの場合はあわせて`data-hash="<アンカー名>"`）という属性を持っています。この属性が、リンクの「意味」を表す唯一の情報源です。実際の`href`・`target`属性の値は、`node scripts/set-link-mode.js <mode>`を実行することで、`data-link`/`data-hash`から機械的に再計算されます。

```bash
# GitHub Pages上で単独ページとして直接開く前提（現在のデフォルト）
# ページ同士は "../<key>/index.html" という相対パスで結ばれ、target="_top" は付与しない
node scripts/set-link-mode.js github-pages

# ArtisCMS3のiframe埋め込みを前提にする
# 大学ドメインの絶対パス（cmsPath）＋ target="_top" に一括変換する
node scripts/set-link-mode.js cms
```

現在このリポジトリの`src/pages/*/index.html`は、デバッグをGitHub Pages上で直接行う方針（order_004・order_005）にもとづき`github-pages`モードで書かれています。ArtisCMS3への実際の埋め込み作業を行う段階になったら、`node scripts/set-link-mode.js cms`を実行するだけで、8ページ全ての内部リンクを一括でCMS向けの絶対パス＋`target="_top"`に切り替えられます。教員プロフィール・公式お問い合わせページなど`data-link`を持たない外部リンクは、どちらのモードでも書き換えの対象外です（常に`target="_top"`のまま）。

## ローカルでの動作確認方法

### セットアップ

```bash
npm install
```

### 開発サーバーでのプレビュー

```bash
npm run dev
```

起動後、ターミナルに表示されるURL（既定では`http://localhost:5173/`）にアクセスすると、開発用インデックスページから各ページへ移動できます。個別ページに直接アクセスする場合は以下のURLを使用してください。

- `http://localhost:5173/src/pages/top/index.html`
- `http://localhost:5173/src/pages/news/index.html`
- `http://localhost:5173/src/pages/facility/index.html`
- `http://localhost:5173/src/pages/basic-research/index.html`
- `http://localhost:5173/src/pages/embedded/index.html`
- `http://localhost:5173/src/pages/image/index.html`
- `http://localhost:5173/src/pages/nlp/index.html`

現在の内部リンクは`github-pages`モード（相対パス、`target="_top"`なし）になっているため、開発サーバー上でもヘッダー・フッターのナビゲーションをクリックしてそのままページ間を移動できます。CMSへの埋め込みを想定した動作を確認したい場合は、`node scripts/set-link-mode.js cms`を実行してから同様に確認してください（確認後は`node scripts/set-link-mode.js github-pages`で戻せます）。

### 本番ビルド

```bash
npm run build
```

`dist/`配下に、GitHub Pages公開用の静的ファイル一式が出力されます（`base`は`/SIT-AIRD-Center-Homepage/`に設定されるため、CSS/JSのパスはリポジトリ名を含むサブパスになります）。

### 本番ビルドのプレビュー

```bash
npm run preview
```

`vite build`と同じ`base`設定でローカルにサーバーが立ち上がり、GitHub Pagesに近い状態で最終確認ができます。起動後に表示されるURL（既定では`http://localhost:4173/SIT-AIRD-Center-Homepage/`）配下の各ページにアクセスして確認してください。

## GitHub Pagesの公開URL

このリポジトリ（`https://github.com/yryo1005/SIT-AIRD-Center-Homepage`）をGitHub Pagesのソースとして設定し、`main`ブランチへのpushで`.github/workflows/deploy.yml`が自動的にビルド・デプロイを行います。公開後のURLは次のとおりです（`npm run build`の出力構成から一意に決まります）。

- トップ：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/top/index.html`
- ニュース：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/news/index.html`
- 施設：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/facility/index.html`
- 基礎研究：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/basic-research/index.html`
- 組込AI：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/embedded/index.html`
- 画像処理：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/image/index.html`
- NLP：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/nlp/index.html`

GitHub Pagesを初めて有効化する場合は、リポジトリの Settings → Pages で Source を「GitHub Actions」に設定してください（このリポジトリでは`peaceiris`系のgh-pagesブランチ運用ではなく、`actions/deploy-pages`による直接デプロイを使用しています）。

## cms-shellsの使い方

`cms-shells/`配下の各ファイルは、対応するArtisCMS3ページの「埋め込みHTML」欄にそのまま貼り付けるためのコードです。ファイル名とCMS側ページの対応は次のとおりです。

| cms-shellsファイル | 貼り付け先CMSページ（想定パス） |
| :--- | :--- |
| `cms-shells/top.html` | `/faculties/research-center/ai_rd_center/` |
| `cms-shells/news.html` | `/faculties/research-center/ai_rd_center/news/` |
| `cms-shells/facility.html` | `/faculties/research-center/ai_rd_center/facility/` |
| `cms-shells/basic-research.html` | `/faculties/research-center/ai_rd_center/basick_reserch/` |
| `cms-shells/embedded.html` | `/faculties/research-center/ai_rd_center/embedded/` |
| `cms-shells/image.html` | `/faculties/research-center/ai_rd_center/image/` |
| `cms-shells/nlp.html` | `/faculties/research-center/ai_rd_center/nlp/` |

各ファイルはUTF-8（BOMなし）で保存されています。**CMS編集画面側の文字コード設定がUTF-8以外の場合、貼り付け後に文字化けする可能性があるため、貼り付け後は必ずプレビューで日本語表示を確認してください。** iframeの`src`はGitHub PagesのURLを直接指定しているため、この設定は最初の1回だけ行えば、以降はGitHubにpushするだけで表示内容が更新されます。

なお、iframeの中身は検索エンジンに正しく評価されない可能性があります。CMS側の通常の編集エリア（iframeの外）にも、ページ内容を要約した1〜2文程度の実テキストを直接入力しておくことを推奨します。これは運用者が手動で行う作業であり、本リポジトリのコードでは対応していません。

## ローカルフォルダ名とArtisCMS3側のページURLの対応表（運用者が手動で記入）

| ローカルフォルダ名 | GitHub Pages URL | ArtisCMS3側の公開URL |
| :--- | :--- | :--- |
| `src/pages/top/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/top/index.html` | （未記入） |
| `src/pages/news/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/news/index.html` | （未記入） |
| `src/pages/facility/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/facility/index.html` | （未記入） |
| `src/pages/basic-research/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/basic-research/index.html` | （未記入） |
| `src/pages/embedded/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/embedded/index.html` | （未記入） |
| `src/pages/image/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/image/index.html` | （未記入） |
| `src/pages/nlp/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/nlp/index.html` | （未記入） |

## 文字コードに関する注意事項

- すべてのHTMLファイルで、`<head>`の最初の子要素として`<meta charset="UTF-8">`を宣言しています。
- すべてのソースファイル（.html/.css/.js/.md）はBOMなしUTF-8で保存されています。
- `npm run build`によるViteのビルド出力で、日本語テキストが壊れていないことをブラウザ表示で確認済みです（本README作成時点のビルドで確認）。
- `cms-shells/`配下のiframeシェルコードもUTF-8で記述されています。ただし、ArtisCMS3側の編集画面自体の文字コード設定がUTF-8以外の場合、貼り付け時に文字化けする可能性があります。貼り付け後は必ずCMS側のプレビューで日本語表示を確認してください。

## デザイン・使用している技術

- 配色は白背景＋青アクセントのライトテーマです。見出しにFraunces（セリフ体）、本文にInter（サンセリフ）、日付・ラベル・数値にIBM Plex Mono（等幅）を使用し、各ページの`<head>`でGoogle Fontsから読み込んでいます（`fonts.googleapis.com`・`fonts.gstatic.com`への外部リクエストが発生します）。
- ビルドツール：Vite（`devDependencies`の`vite`のみ。GSAP等のアニメーションライブラリは使用せず、素のCSS（`@keyframes`）とJavaScript（`ResizeObserver`、イベントリスナー）でヒーローのSVGネットワーク描画アニメーション・タブ切り替え等を実装しています）
- `prefers-reduced-motion: reduce`が有効な環境では、ヒーローのアニメーション・ニューストリッカーの複製アニメーション・スムーススクロールを無効化しています。

## その他の技術要件

- ブラウザのlocalStorage/sessionStorageは使用していません。
- 実際に送信可能な問い合わせフォームは実装していません（公式サイトのお問い合わせページへのリンクのみ）。
- 画像には適切なalt属性を設定しています。画像は公式サイト（`https://www.shonan-it.ac.jp/`）に実在するものを絶対URLで参照しています（次フェーズでGitHub Releaseを使った外部ホスティングへの切り替えを予定）。
- 全`<img>`タグに`referrerpolicy="no-referrer"`を付与しています。公式サイト側でReferer（参照元）に基づくホットリンク対策が行われた場合でも、別オリジン（GitHub Pages）からの画像読み込みがRefererチェックで拒否されないようにするための予防的な対応です。

## 今回のスコープ外（次フェーズ以降で対応）

- PDF/PPTXなどのアップロードファイルからの情報・画像抽出
- GitHub Releaseを使った画像の外部ホスティング（現時点では画像は引き続き公式サイトのURLをそのまま参照する）
