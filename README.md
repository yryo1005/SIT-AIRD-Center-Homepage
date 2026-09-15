# AI R&D Center Webサイト（Vite + GitHub Pages + ArtisCMS3 iframe埋め込み）

湘南工科大学 情報学部 AI R&D Centerの紹介ページのソースです。本体（HTML/CSS/JS）はGitHub Pagesでホストし、大学のCMS（ArtisCMS3）側の各ページには、そのGitHub Pagesの該当ページを表示する`iframe`だけを貼り付けます。以降は`main`ブランチへのpushだけでサイト全体が更新されます。

デザインは白背景＋青アクセントのライトテーマで、見出しにFraunces（セリフ体）、本文にInter（サンセリフ）、日付・ラベル・数値にIBM Plex Mono（等幅）を使用しています。現在は**GitHub Pages上で単独ページとして直接デバッグする運用**を前提にしており（`site.config.js`の`LINK_MODES`を参照）、ArtisCMS3のiframeへの実際の貼り付け作業は次フェーズで行います。

## ニュースを追加・編集する方法（HTML/JavaScriptの知識がなくてもできます）

ニュースの内容は`src/pages/news/index.html`に直接書かれているのではなく、**`src/data/news/`フォルダの中にある，ニュース1件＝1つのJSONファイル**として保存されています。新しいニュースを追加したいときは，このフォルダに新しいファイルを1つ追加するだけで済みます（既存のファイルを編集する必要はありません）。ページの見た目（デザイン）とニュースの中身（データ）が分かれているため，ファイルを追加・編集するだけで，ニュース一覧ページ（一覧・クリック時のポップアップ）とトップページの写真スライダーの両方に自動で反映されます。

### 1. ファイルの場所と1件あたりの構成

`src/data/news/`フォルダの中に，`2026-06-16-gakuryoku-yushu.json`のような名前のファイルが1つのニュースに対応しています。ファイル名は日付が分かればどんな名前でも構いません（他のファイルと重複しない名前にしてください）。

1件のファイルの中身は，次の項目を持つ形です（公式サイトのニュース記事と同様に，開催日・参加人数・文献情報を明記します）。

```json
{
  "date": "2026-06-16",
  "eventDate": "2026年5月27日",
  "title": "AI Centerのメンバー5人が学力優秀賞に選ばれました",
  "participants": 5,
  "body": "2026年5月27日の学生表彰式にて、AI R&D Center所属のメンバー5名が「学力優秀賞」を受賞しました。日頃の学業と研究活動の両立が評価されての受賞です。",
  "references": [],
  "images": [
    { "src": "news/S__41484329.jpg", "alt": "学力優秀賞の受賞式の様子" }
  ]
}
```

学会発表等で文献情報がある場合は，`references`に発表1件ごとの書誌情報（著者名，タイトル，学会名，発表番号，月・年）を文字列として並べます。ポップアップ表示では，番号付きリストとして表示されます。

```json
{
  "date": "2026-03-14",
  "eventDate": "2026年3月9日・10日・11日・12日・13日",
  "title": "AI Centerのメンバー2人が2026年電子情報通信学会総合大会に参加しました",
  "participants": 2,
  "body": "2026年電子情報通信学会総合大会にて、AI R&D Centerのメンバー2名が研究発表をおこないました。",
  "references": [
    "土屋琴夢，山富龍，マハブービシェヘラザード，二宮洋，「適応的慣性項を用いた3次正則化ニュートン法に関する研究」，2026年電子情報通信学会総合大会，N-1-01，March 2026．",
    "山富龍，マハブービシェヘラザード，二宮洋，「ニューラルネットワークによる大喜利の面白さ判定」，2026年電子情報通信学会総合大会，N-1-02，March 2026．"
  ],
  "images": [
    { "src": "news/S__26222595_0.jpg", "alt": "発表の様子1" },
    { "src": "news/S__26222596_0.jpg", "alt": "発表の様子2" }
  ]
}
```

各項目の意味は次のとおりです。

| 項目名 | 内容 | 必須 |
| :--- | :--- | :--- |
| `date` | 掲載日。必ず`"2026-06-16"`のように`"西暦-月-日"`（2桁ずつ）の形で書く | 必須 |
| `eventDate` | 開催日（学会・研究会が実際に開催された日）。「2026年3月9日・10日」のように書く。不明な場合は`null` | 任意（無ければ`null`） |
| `title` | ニュースの見出し | 必須 |
| `participants` | 参加人数（数値）。受賞等で人数のみの場合もそのまま記入 | 任意（無ければ省略可） |
| `body` | ニュースの概要（1〜2文程度）。発表ごとの詳細は`references`に書く | 必須 |
| `references` | 文献情報の配列。発表1件につき1つの文字列（著者名，タイトル，学会名，発表番号，月・年）。無い場合は空配列`[]` | 必須（無ければ`[]`） |
| `images` | 画像の配列。`src`（`src/assets/images/news/`からの相対パス）と`alt`（画像の説明文）を持つオブジェクトを，画像の枚数だけ並べる。画像が無い場合は空配列`[]`にする | 必須（無ければ`[]`） |

月の表記は，"March"・"August"のように省略しない形（Mar.やAug.ではなく）で統一しています。

**新しいニュースのファイルをどこに追加しても、日付が新しい順に自動で並び替えて表示されます。**

画像を追加したい場合は，画像ファイル（jpg/jpeg/png等）を`src/assets/images/news/`フォルダにコピーしてから，`images`配列にファイル名を含む相対パス（例：`"news/2026autumn_opencampus.jpg"`）を追加してください。1件のニュースに複数枚の画像がある場合，ニュース詳細のポップアップ内では矢印ボタンによる画像スライド（カルーセル）として，トップページ・ニュースページの写真帯では数秒おきに自動で切り替わる形で表示されます。サイト全体の画像は，著作権・肖像権への配慮のため，このリポジトリ内に保存したものだけを使う方針にしています（外部サイトの画像URLを直接指定する運用はしていません）。

### 2. 1件追加する具体例（コピペで使えます）

例えば「2026年10月1日に、メンバーがオープンキャンパスでAIデモを展示した」というニュースを追加したい場合，`src/data/news/2026-10-01-open-campus.json`のような新しいファイルを作成し，以下の内容を貼り付けます。

```json
{
  "date": "2026-10-01",
  "eventDate": "2026年10月1日",
  "title": "AI Centerのメンバーがオープンキャンパスでデモ展示をおこないました",
  "participants": 3,
  "body": "来場した高校生にAIを使ったデモを紹介しました。",
  "references": [],
  "images": []
}
```

保存後は，`{`と`}`の対応，`"`の付け忘れがないかを確認してください。不安な場合は，[jsonlint.com](https://jsonlint.com/)のようなJSON検証サイトに貼り付けて，エラーが出ないか確認すると安全です。

### 3. 保存して公開する

ファイルを保存し、`git add`・`git commit`・`git push`（またはGitHubのWeb画面上で直接コミット）すると、`main`ブランチへのpushをきっかけに`.github/workflows/deploy.yml`のGitHub Actionsが自動的に動き、数分でGitHub Pages上のサイトに反映されます。ArtisCMS3側の設定やHTML/JavaScriptのコードは一切触る必要はありません。

### 4. 動作の仕組み（参考）

`src/shared/script.js`が`import.meta.glob`で`src/data/news/`以下の全JSONファイルを読み込み、ニュース一覧ページの全件一覧（クリックすると本文・画像をポップアップ表示）と、トップページ・ニュースページの写真スライダーの両方を、ページ読み込み時にJavaScriptで自動描画しています。件数表示（「全21件」の21の部分）も、読み込んだファイルの件数から自動的に計算されるため、手で書き換える必要はありません。

## 研究内容を追加・編集する方法

研究内容ページ（`src/pages/basic-research/index.html`。表示上の見出しは「研究内容」）に並ぶ研究テーマも，ニュースと同じ「1件＝1つのJSONファイル」の仕組みです。組込AI・画像処理・NLP・基礎理論など，あらゆる分野の研究テーマをこの1箇所に集約しています。

### 1. ファイルの場所と構成

`src/data/research/`フォルダの中に，研究テーマ1件につき1つのJSONファイルを置きます。ファイル名は自由です（他のファイルと重複しなければ構いません）。

中身は次の3項目だけを持つシンプルな形です。

```json
{
  "title": "大喜利生成AI",
  "body": "「笑いは日常生活で重要な要素です．この笑いをAIで提供できないか」という発想から開始した研究です．画像に対する大喜利を生成するAIシステムを開発しています．",
  "image": { "src": "research/oogiri-generation-ai.jpg", "alt": "大喜利生成AIの出力をディスプレイで確認している様子" }
}
```

| 項目名 | 内容 | 必須 |
| :--- | :--- | :--- |
| `title` | 研究テーマの見出し | 必須 |
| `body` | 研究内容の説明文。複数段落にしたい場合は`\n`で行を分ける | 必須 |
| `image` | 画像。`src`（`src/assets/images/research/`からの相対パス）と`alt`（説明文）を持つオブジェクト。画像が無い場合は`null` | 必須（無ければ`null`） |

画像を追加したい場合は，画像ファイルを`src/assets/images/research/`フォルダにコピーしてから，`image`にファイル名を含む相対パスを指定してください。

### 2. 保存して公開する

ファイルを保存し，`git add`・`git commit`・`git push`すると，数分後にGitHub Pages上の研究内容ページに反映されます。並び順はファイル名の並び順（アルファベット順）になるため，特定の順序で表示したい場合はファイル名の先頭に`01-`のような連番を付けてください。

## 学生の声を追加・編集する方法

研究内容ページの「学生の声」セクション（後半の2件）と，在学生向けページ（`src/pages/join/`）の「先輩の声」セクションは，`src/data/students/`以下の同じデータを共通で参照しています。

### 1. ファイルの場所と構成

`src/data/students/`フォルダの中に，学生1名につき1つのJSONファイルを置きます。表示順はファイル名の並び順になるため，`01-`のような連番を先頭に付けることを推奨します。

```json
{
  "name": "井上 來彌",
  "meta": "情報学部人工知能専攻2年（神奈川県立大磯高等学校出身）",
  "researchTitle": "AIのハルシネーションを減らす手法の研究",
  "researchSummary": "AIがもっともらしい嘘をついてしまう「ハルシネーション」という現象を減らすための研究に取り組んでいます．2年生にして学会発表にも挑戦しています．",
  "quote": "大学というと先生との距離が遠いイメージがあるかもしれませんが，湘南工科大学は先生や先輩との距離がとても近く，気さくに質問や相談ができるのがすごく良いところです．",
  "image": { "src": "voices/inoue-kurumi.jpg", "alt": "井上來彌さんの写真" }
}
```

| 項目名 | 内容 | 必須 |
| :--- | :--- | :--- |
| `name` | 氏名 | 必須 |
| `meta` | 学年・出身校等の補足情報。**本人から確認が取れた情報，または元資料（学内ガイダンス資料等）に明記されている情報のみを記載してください。憶測で経歴を追加しないこと。** | 任意（無ければ`""`） |
| `researchTitle` | 研究テーマの見出し | 任意（無ければ`""`） |
| `researchSummary` | 研究内容の説明文 | 任意（無ければ`""`） |
| `quote` | 本人のコメント（「」は自動で付与されるため，`quote`自体には含めない） | 任意（無ければ省略可） |
| `image` | 画像。`src`（`src/assets/images/voices/`からの相対パス）と`alt`を持つオブジェクト | 任意（無ければ`null`） |

**新しい「学生の声」を追加する場合も，本人の了承を得たうえで，実際に確認できた情報のみを記載してください。掲載を試作・確認目的で仮に作ることはしないでください。**

### 2. 保存して公開する

ファイルを保存し，`git add`・`git commit`・`git push`すると，数分後に研究内容ページ・在学生向けページの両方に反映されます。

## 学会行脚マップに都道府県ごとの写真を追加する方法

学会行脚マップ（`src/pages/conference-map/`）は、AI R&D Centerのメンバーが学会発表等で訪れた都道府県を地図上に示し、クリックするとその都道府県の写真をポップアップ表示するページです。

**重要な前提**：このサイトはサーバーを持たない静的サイト（GitHub Pages）です。そのため、Webページを見ている人がブラウザから直接写真を送信してその場で公開する、という仕組み（一般的な意味での「アップロード」）は持てません。かわりに、ニュース画像と同じ「リポジトリに画像ファイルを追加してpushする」という方法で、写真を追加・公開します。テキストエディタでのJSON編集すら不要で、**画像ファイルを正しいフォルダに置くだけ**で反映されます。

### 手順

1. `src/assets/images/conference-map/`の下に、都道府県ごとのフォルダがあります（例：`hiroshima/`）。まだ写真がない都道府県の場合は、このフォルダ自体が無いので、都道府県キーの名前でフォルダを新しく作成してください。都道府県キーの一覧は`src/data/prefectures.js`に定義されています（例：`hokkaido`・`tokyo`・`kanagawa`・`osaka`・`hiroshima`・`fukuoka`・`okinawa`等，英語のローマ字表記）。
2. そのフォルダの中に，写真ファイル（jpg/jpeg/png等）をコピーします。1つの都道府県に複数枚の写真があっても構いません（ポップアップ内で矢印送りのカルーセルとして表示されます）。ファイル名は`YYYY-MM-001.jpg`のように「訪れた年月＋3桁の連番」にしておくと，ファイル名の並び順がそのまま時系列順になり，後から見返したときに分かりやすくなります（例：2026年3月の写真なら`2026-03-001.jpg`，`2026-03-002.jpg`…）。
3. ファイルを保存し、`git add`・`git commit`・`git push`すると、数分後にGitHub Pages上のマップに反映されます。

JSONファイルの追記やコードの変更は一切不要です。地図上のマーカーは，対応するフォルダに画像が1枚でもあれば自動的に色付き（クリック可能）になり，無い都道府県は淡い色のマーカーのまま「まだ写真が登録されていません」という案内が表示されます。

## 施設ページの部屋写真を追加・更新する方法

施設ページ（`src/pages/facility/`）の各部屋の写真も，学会行脚マップと同じ「フォルダに画像を追加するだけ」の仕組みです。

1. `src/assets/images/facility/`の下に，部屋ごとのフォルダがあります（`entrance`・`large-meeting-room`・`small-meeting-room`・`exhibition-room`・`yogibo-zone`。定義は`src/data/facility-rooms.js`）。
2. そのフォルダに写真ファイルを追加するだけで反映されます。1つの部屋に複数枚の写真がある場合は，ページ上で数秒おきに自動的にスライド切り替わって表示されます（画像を追加した順に，ファイル名の並び順で切り替わります）。左右の矢印ボタンで手動切り替えもでき，写真をクリック／タップするとその部屋の全ての写真を一覧するポップアップが開きます。
3. ファイルを保存し、`git add`・`git commit`・`git push`すると，数分後にGitHub Pages上に反映されます。

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
│   │   ├── news/            ← ニュースのデータ（1件＝1つのJSONファイル。HTML/JSの知識なしで編集可能。後述）
│   │   ├── research/        ← 研究内容のデータ（1件＝1つのJSONファイル。後述）
│   │   ├── students/        ← 学生の声のデータ（1件＝1つのJSONファイル。研究内容ページ・在学生の方へページの両方から参照。後述）
│   │   ├── prefectures.js   ← 学会行脚マップの47都道府県マーカー定義（位置・キー・名前）
│   │   └── facility-rooms.js ← 施設ページの部屋定義（キー・名前・説明文）
│   ├── assets/images/
│   │   └── conference-map/<都道府県キー>/  ← 学会行脚マップの都道府県別写真（後述）
│   └── pages/
│       ├── top/index.html
│       ├── news/index.html
│       ├── facility/index.html
│       ├── basic-research/index.html  ← 研究内容ページ（旧・基礎研究ページ。全研究テーマを集約）
│       ├── conference-map/index.html
│       ├── join/index.html            ← 在学生（入局希望者）向けページ
│       ├── for-highschool/index.html  ← 高校生・保護者向けページ
├── cms-shells/            ← ArtisCMS3の「埋め込みHTML」欄に貼るページごとの短いiframeシェル
│   ├── top.html
│   ├── news.html
│   ├── facility.html
│   ├── basic-research.html
│   ├── conference-map.html
│   ├── join.html
│   ├── for-highschool.html
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

現在このリポジトリの`src/pages/*/index.html`は、デバッグをGitHub Pages上で直接行う方針（order_004・order_005）にもとづき`github-pages`モードで書かれています。ArtisCMS3への実際の埋め込み作業を行う段階になったら、`node scripts/set-link-mode.js cms`を実行するだけで、7ページ全ての内部リンクを一括でCMS向けの絶対パス＋`target="_top"`に切り替えられます。教員プロフィール・公式お問い合わせページなど`data-link`を持たない外部リンクは、どちらのモードでも書き換えの対象外です（常に`target="_top"`のまま）。

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
- `http://localhost:5173/src/pages/conference-map/index.html`
- `http://localhost:5173/src/pages/join/index.html`
- `http://localhost:5173/src/pages/for-highschool/index.html`

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
- 研究内容：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/basic-research/index.html`
- 学会行脚マップ：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/conference-map/index.html`
- 在学生の方へ：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/join/index.html`
- 高校生の方へ：`https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/for-highschool/index.html`

GitHub Pagesを初めて有効化する場合は、リポジトリの Settings → Pages で Source を「GitHub Actions」に設定してください（このリポジトリでは`peaceiris`系のgh-pagesブランチ運用ではなく、`actions/deploy-pages`による直接デプロイを使用しています）。

## cms-shellsの使い方

`cms-shells/`配下の各ファイルは、対応するArtisCMS3ページの「埋め込みHTML」欄にそのまま貼り付けるためのコードです。ファイル名とCMS側ページの対応は次のとおりです。

| cms-shellsファイル | 貼り付け先CMSページ（想定パス） |
| :--- | :--- |
| `cms-shells/top.html` | `/faculties/research-center/ai_rd_center/` |
| `cms-shells/news.html` | `/faculties/research-center/ai_rd_center/news/` |
| `cms-shells/facility.html` | `/faculties/research-center/ai_rd_center/facility/` |
| `cms-shells/basic-research.html` | `/faculties/research-center/ai_rd_center/basick_reserch/` |
| `cms-shells/conference-map.html` | `/faculties/research-center/ai_rd_center/conference-map/` |
| `cms-shells/join.html` | `/faculties/research-center/ai_rd_center/join/` |
| `cms-shells/for-highschool.html` | `/faculties/research-center/ai_rd_center/for-highschool/` |

各ファイルはUTF-8（BOMなし）で保存されています。**CMS編集画面側の文字コード設定がUTF-8以外の場合、貼り付け後に文字化けする可能性があるため、貼り付け後は必ずプレビューで日本語表示を確認してください。** iframeの`src`はGitHub PagesのURLを直接指定しているため、この設定は最初の1回だけ行えば、以降はGitHubにpushするだけで表示内容が更新されます。

なお、iframeの中身は検索エンジンに正しく評価されない可能性があります。CMS側の通常の編集エリア（iframeの外）にも、ページ内容を要約した1〜2文程度の実テキストを直接入力しておくことを推奨します。これは運用者が手動で行う作業であり、本リポジトリのコードでは対応していません。

## ローカルフォルダ名とArtisCMS3側のページURLの対応表（運用者が手動で記入）

| ローカルフォルダ名 | GitHub Pages URL | ArtisCMS3側の公開URL |
| :--- | :--- | :--- |
| `src/pages/top/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/top/index.html` | （未記入） |
| `src/pages/news/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/news/index.html` | （未記入） |
| `src/pages/facility/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/facility/index.html` | （未記入） |
| `src/pages/basic-research/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/basic-research/index.html` | （未記入） |
| `src/pages/conference-map/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/conference-map/index.html` | （未記入） |
| `src/pages/join/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/join/index.html` | （未記入） |
| `src/pages/for-highschool/` | `https://yryo1005.github.io/SIT-AIRD-Center-Homepage/src/pages/for-highschool/index.html` | （未記入） |

## 文字コードに関する注意事項

- すべてのHTMLファイルで、`<head>`の最初の子要素として`<meta charset="UTF-8">`を宣言しています。
- すべてのソースファイル（.html/.css/.js/.md）はBOMなしUTF-8で保存されています。
- `npm run build`によるViteのビルド出力で、日本語テキストが壊れていないことをブラウザ表示で確認済みです（本README作成時点のビルドで確認）。
- `cms-shells/`配下のiframeシェルコードもUTF-8で記述されています。ただし、ArtisCMS3側の編集画面自体の文字コード設定がUTF-8以外の場合、貼り付け時に文字化けする可能性があります。貼り付け後は必ずCMS側のプレビューで日本語表示を確認してください。

## デザイン・使用している技術

- 配色は白背景＋青アクセントのライトテーマです。見出しにFraunces（セリフ体）、本文にInter（サンセリフ）、日付・ラベル・数値にIBM Plex Mono（等幅）を使用し、各ページの`<head>`でGoogle Fontsから読み込んでいます（`fonts.googleapis.com`・`fonts.gstatic.com`への外部リクエストが発生します）。
- ビルドツール：Vite（`devDependencies`の`vite`のみ）。GSAP等のアニメーションライブラリは使用せず、素のCSS（`@keyframes`・`transition`）とJavaScript（`ResizeObserver`、イベントリスナー）でヒーローのSVGネットワーク描画アニメーション・アコーディオン開閉・ミニカルーセル（複数画像の横スライド切り替え，`buildMiniCarouselHtml()`/`wireMiniCarousel()`）等を実装しています。
- ニュース詳細・学会行脚マップの都道府県写真・施設の部屋写真は，共通のポップアップ（モーダル）部品`openMediaModal()`で表示しており，画像が複数ある場合は矢印ボタン付きの横スライドカルーセルになります。
- `prefers-reduced-motion: reduce`が有効な環境では、ヒーローのアニメーション・各種カルーセルの自動切り替え・スムーススクロールを無効化しています。

## その他の技術要件

- ブラウザのlocalStorage/sessionStorageは使用していません。
- サイト内に送信可能な問い合わせフォームは持っていません。ヘッダー等の「お問い合わせ」導線・専用セクションも設けていません（大学公式サイト側の問い合わせ機能と重複するため，order_010で撤去しました）。
- 画像はすべて`src/assets/images/`配下にリポジトリ内保存しています。ニュース・学会行脚マップ・施設の部屋写真・研究内容など，画像を伴うコンテンツはすべて`import.meta.glob`でビルド時に静的インポートし，ハッシュ付きのビルド後URLへ解決しています。外部サイトの画像URLを直接指定する運用はしていません（当初は公式サイトの画像を絶対URLで参照していましたが，order_009でリポジトリ内保存へ全面的に移行しました）。
- 全`<img>`タグに`referrerpolicy="no-referrer"`を付与しています。これは移行前の名残の予防的措置で，現時点では必須ではありませんが，安全側の設定として維持しています。
- トップページには，大学公式YouTubeチャンネルの紹介動画を`<iframe>`で埋め込んでいます（後述）。
- 本文・リスト等のテキストは`text-align: justify`（均等割り付け）で表示し，句読点は「、」「。」ではなく全角カンマ「，」・全角ピリオド「．」を使用しています（order_013）。新しく文章を追加する場合もこの表記に統一してください。

## トップページのYouTube動画を追加・更新する方法

トップページの「紹介動画」セクション（`src/pages/top/index.html`内の`.video-grid`）には，大学公式YouTubeチャンネルの動画を`<iframe src="https://www.youtube.com/embed/<動画ID>">`という形で直接埋め込んでいます。データファイル化はしておらず，HTMLを直接編集する方式です。

動画を追加・差し替えたい場合は，`.video-card`のブロックをコピーし，`iframe`の`src`とタイトル属性，`figcaption`内の見出し・説明文を書き換えてください。動画IDはYouTubeのURL（`https://www.youtube.com/watch?v=<動画ID>`）の`v=`以降の部分です。動画の説明文は，この作業環境からはYouTube動画の音声・字幕・description欄本文を取得できないため，[oEmbed API](https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<動画ID>&format=json)等で確認できるタイトル情報をもとに，事実に基づく範囲で記載しています。

## 今回のスコープ外（今後の課題）

- 学生の声・卒研一覧のデータファイル化（`students.json`・`theses.json`）：order_007で設計案のみ提示し，未実装（現状は`src/pages/basic-research/index.html`にHTMLとして直接記述）。
- YouTube動画情報のデータファイル化：現状はHTML直接編集方式（上記参照）。件数が増えた場合は，ニュース・研究内容と同様のJSONファイル方式への移行を検討する。
- 学会行脚マップ：広島・福岡・北海道・沖縄の4県のみ写真が登録済み。他の都道府県は，開催地が確認でき次第，フォルダアップロードの仕組みで追加できる。
