
# AI R&D Center Webサイト再構築プロジェクト 指示書

## 0. これは何か

湘南工科大学 情報学部 の「AI R&D Center」紹介ページを、ArtisCMS3（サーバインストール型CMS）の「埋め込みHTML」機能に貼り付けて公開するための、静的HTML/CSS/JSを作成するプロジェクトです。

現状は公式サイト内に分散している複数のページ（トップ・ニュース・施設・研究分野ごとのページなど）を、内容を維持・拡充しながら1つの見やすいデザインに統合し、かつ**ローカルで管理しやすいソース構成**で作り直します。

**このフェーズでは、アップロードされたファイル（PDF/PPTXなどのガイダンス資料）は使用しません。参照元は下記の公式サイトのみとしてください。**

## 1. 参照元（この範囲だけを情報源にする）

以下のページの内容を読み込み、テキスト・画像URL・リンク構造を正確に把握してください。

- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/ （トップ）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/news/ （ニュース一覧）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/facility/ （施設紹介）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/basick_reserch/ （基礎研究、業績一覧を含む）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/embedded/ （組込）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/image/ （画像処理）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/nlp/ （NLP）
- https://www.shonan-it.ac.jp/faculties/research-center/ai_rd_center/reinforcement/ （強化学習。現時点でほぼ内容がないことは確認済み。空でも良いので存在は反映する）

上記ページ内でリンクされている指導教員の個別プロフィールページも、名前・肩書の裏取りのために参照してよい。

**厳守事項：現状の公式サイトに書かれている情報（数値、人名、日付、研究タイトル、業績一覧など）は一切欠落・改変させないこと。** 文章を要約・言い換えするのは良いが、事実関係を削ってはいけない。「内容を守る」ことを最優先とする。

## 2. サイト構成（情報設計）

以下のページ構成で作成する。カッコ内はArtisCMS3上で想定しているURLパス（公式サイトの現行構造を踏襲する）。

1. トップ (`/faculties/research-center/ai_rd_center/`)
2. ニュース (`/faculties/research-center/ai_rd_center/news/`)
3. 指導教員（トップ内のセクションでよいが、教員ごとの詳細情報を厚めに）
4. 施設 (`/faculties/research-center/ai_rd_center/facility/`)
5. 研究活動：以下5つは既存の構造を踏襲しつつ、それぞれ独立ページとして厚みを持たせる
   - 基礎研究 (`/faculties/research-center/ai_rd_center/basick_reserch/`)
   - 組込 (`/faculties/research-center/ai_rd_center/embedded/`)
   - 画像処理 (`/faculties/research-center/ai_rd_center/image/`)
   - NLP (`/faculties/research-center/ai_rd_center/nlp/`)
   - 強化学習 (`/faculties/research-center/ai_rd_center/reinforcement/`)（情報が薄い旨を正直に明記する「準備中」ページでよい）
6. お問い合わせ（トップ内のセクションでよい。実際に送信できるフォームは作らず、公式のお問い合わせページへ誘導するリンクにする）

すべてのページに共通のヘッダー（ナビゲーション）・フッターを持たせ、相互にリンクさせる。

## 3. コンテンツを厚くする方針（内容を「守りながら」広げる）

単なる要約ではなく、以下の観点で厚みを持たせる。ただし新規に事実を creation（捏造）しないこと。公式サイトに実在する情報の中から掘り起こす・目立たせる、という方針。

- **学生の声**：基礎研究ページに実在する学生のコメント（将棋の棋譜分類研究、SNMF研究、Hutchinson手法の研究など）を独立したセクションとして目立たせる
- **研究活動の深掘り**：各研究テーマについて、既存の説明文に加えて発表者名・年度・学会名など既存情報を整理して見せる
- **業績一覧（基礎研究ページの約40件）**：全件を保持しつつ、量が多いので開閉式（アコーディオン）などで読みやすくする
- **参加案内（新設）**：公式サイトの「学生が主体となって活動している」という記述をもとに、参加を考えている学生向けの案内セクションを設ける。ただし参加方法・条件など公式サイトに書かれていない具体的な手続きは断定的に書かず、「詳細はお問い合わせください」等に留める
- **実績サマリー（新設）**：学会発表件数・受賞歴など、業績一覧から集計できる数値をハイライトとして見せる

## 4. デザイン方針

以下のトーンを踏襲する。

- ダークテーマ基調（背景は純黒ではなく、やや青みがかったチャコール）
- 見出しにセリフ体（Fraunces等）、本文にサンセリフ（Inter等）、日付・ラベル・数値にモノスペース（IBM Plex Mono等）を使い分ける、知的な研究ラボ・学術誌のような雰囲気
- アクセントカラーは1色を効果的に使う（例：ライム系の差し色）。カラフルにしすぎない
- 学生主体の活動であることが伝わる、親しみと専門性のバランスが取れたトーン
- 汎用テンプレート感のある「ありきたりな配色・構成」は避ける。frontend-designに関するスキルがあれば参照すること
- モーション（スクロール進捗バー、ニュースティッカー、タブ切り替えなど）は控えめに、意味のある箇所にだけ使う

## 5. 技術要件

### フォルダ構成

```
project/
├── shared/
│   ├── style.css     ← 全ページ共通スタイル
│   └── script.js     ← 全ページ共通スクリプト（ナビゲーション等）
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
    └── ...
```

### ビルドスクリプト

- Node.js標準機能のみで動作させる（npm install不要が望ましい）
- 各`pages/*/index.html`内の`<link rel="stylesheet" href="...">`と`<script src="...">`を、対応するファイルの中身でその場にインライン展開し、`dist/`に1ファイルずつ書き出す
- 出力される各HTMLファイルは、そのままArtisCMS3の「埋め込みHTML」欄に貼り付けられる、外部依存のない単一ファイルにすること（このフェーズでは、CSS/JSを外部CDNから読み込む方式は採用しない。安定性を優先する）

### リンク・パスのルール

- ページ間の内部リンクは、ドメイン名を含まない**ルート相対パス**で書く（例：`/faculties/research-center/ai_rd_center/news/`）。相対パス（`../news/`など）は使わない
- 画像は、このフェーズでは公式サイトに実在する画像URLをそのまま絶対URLで参照する（例：`https://www.shonan-it.ac.jp/faculties/media/aicenter001.jpeg`）。独自にアップロードした画像・GitHub経由の画像は、次フェーズ（ガイダンス資料取り込み時）で対応するため、このフェーズでは扱わない

### その他

- ブラウザのlocalStorage/sessionStorageは使用しない
- 実際に送信可能な問い合わせフォームは作らない（公式サイトのお問い合わせページへのリンクに留める）
- アクセシビリティに配慮する（画像には適切なalt属性、コントラスト比の確保など）

## 6. 進め方

1. まず上記の参照元ページをすべて読み込み、取得した情報（見出し・本文・画像URL・リンク先・業績一覧など）を一度整理して提示すること。情報の欠落がないか、こちらで確認できるようにする
2. 確認後、上記のフォルダ構成でソースを作成する
3. `build.js`を実装し、`node build.js`で全ページが`dist/`に正しく出力されることを確認する
4. `README.md`に、ローカルフォルダ名とArtisCMS3側のページURLの対応表（現時点では空欄でよい。運用者が手動で埋める）を用意する

## 7. 今回のスコープ外（次フェーズ以降で対応）

- PDF/PPTXなどのアップロードファイルからの情報・画像抽出
- GitHubリポジトリ化、GitHub Releaseを使った画像の外部ホスティング
- CSS/JSをjsDelivr等の外部CDNから読み込む方式への切り替え

これらは別途指示するので、今回は着手しないこと。

デザインは黒を背景に青を文字等のハイライトにしてください
レポートにはどのようにローカルからそのサイトにアクセスするかを書いておいてください